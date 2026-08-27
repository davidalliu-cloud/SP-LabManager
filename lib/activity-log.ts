"use client";

import { createSupabaseBrowserClient } from "./supabase/client";
import type { AuditLog, Notification } from "./types";

/**
 * The audit trail and the notification feed, kept in their own tables instead
 * of inside the app_state blob.
 *
 * Between them they were 61% of that blob and grew by ~150 rows a day, so every
 * save re-uploaded thousands of records that had not changed - and once the
 * blob passed 1 MB, Realtime stopped delivering anything at all.
 *
 * Ids here are text, not uuid: the app's own ids are values like "u-admin",
 * which the (still empty) public.audit_log and public.notifications tables
 * cannot hold. Those are reserved for the normalised schema.
 */

const AUDIT_TABLE = "app_audit_log";
const NOTIFICATION_TABLE = "app_notifications";

/** Rows per insert. A backlog flush can be thousands of rows; one request that
 *  size is slow and fails as a unit. */
const CHUNK_SIZE = 400;

function chunk<T>(rows: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) out.push(rows.slice(i, i + CHUNK_SIZE));
  return out;
}

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type AuditRow = {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description: string | null;
  created_at: string;
};

type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  related_test_id: string | null;
  related_report_id: string | null;
  is_read: boolean;
  created_at: string;
};

function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    relatedTestId: row.related_test_id ?? undefined,
    relatedReportId: row.related_report_id ?? undefined,
    isRead: row.is_read,
    createdAt: row.created_at
  };
}

/** Append audit entries. Ignores anything already stored, so a retry after a
 *  failed flush cannot duplicate the trail. */
export async function pushAuditEntries(entries: AuditLog[]): Promise<boolean> {
  if (!hasSupabaseConfig() || entries.length === 0) return true;
  const rows: AuditRow[] = entries.map((entry) => ({
    id: entry.id,
    user_id: entry.userId,
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId,
    description: entry.description ?? null,
    created_at: entry.createdAt
  }));
  const supabase = createSupabaseBrowserClient();
  for (const batch of chunk(rows)) {
    const { error } = await supabase.from(AUDIT_TABLE).upsert(batch, { onConflict: "id", ignoreDuplicates: true });
    if (error) {
      console.warn("Could not write the audit trail.", error.message);
      return false;
    }
  }
  return true;
}

export async function pushNotifications(items: Notification[]): Promise<boolean> {
  if (!hasSupabaseConfig() || items.length === 0) return true;
  const rows: NotificationRow[] = items.map((item) => ({
    id: item.id,
    user_id: item.userId,
    title: item.title,
    message: item.message,
    related_test_id: item.relatedTestId ?? null,
    related_report_id: item.relatedReportId ?? null,
    is_read: item.isRead,
    created_at: item.createdAt
  }));
  const supabase = createSupabaseBrowserClient();
  for (const batch of chunk(rows)) {
    const { error } = await supabase.from(NOTIFICATION_TABLE).upsert(batch, { onConflict: "id", ignoreDuplicates: true });
    if (error) {
      console.warn("Could not write notifications.", error.message);
      return false;
    }
  }
  return true;
}

/** The newest notifications for one user, plus how many of theirs are unread.
 *  The count is a separate exact count so the badge is not capped by `limit`. */
export async function fetchNotificationsFor(
  userId: string,
  limit = 20
): Promise<{ items: Notification[]; unread: number }> {
  if (!hasSupabaseConfig() || !userId) return { items: [], unread: 0 };
  const supabase = createSupabaseBrowserClient();

  const [list, unreadCount] = await Promise.all([
    supabase
      .from(NOTIFICATION_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from(NOTIFICATION_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)
  ]);

  if (list.error) {
    console.warn("Could not load notifications.", list.error.message);
    return { items: [], unread: 0 };
  }
  return {
    items: ((list.data ?? []) as NotificationRow[]).map(toNotification),
    unread: unreadCount.count ?? 0
  };
}

/** Mark every one of this user's notifications read. */
export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  if (!hasSupabaseConfig() || !userId) return true;
  const { error } = await createSupabaseBrowserClient()
    .from(NOTIFICATION_TABLE)
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) {
    console.warn("Could not mark notifications as read.", error.message);
    return false;
  }
  return true;
}

/** Live inserts for one user, so a new alert appears without a reload.
 *  Returns an unsubscribe function. */
export function subscribeToNotifications(userId: string, onInsert: () => void): () => void {
  if (!hasSupabaseConfig() || !userId) return () => undefined;
  const supabase = createSupabaseBrowserClient();
  const channel = supabase
    .channel(`app_notifications_${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: NOTIFICATION_TABLE, filter: `user_id=eq.${userId}` },
      () => onInsert()
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
