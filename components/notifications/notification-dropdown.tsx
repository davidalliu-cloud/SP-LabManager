"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { fetchNotificationsFor, markAllNotificationsRead, subscribeToNotifications } from "@/lib/activity-log";
import { formatEuropeanDate } from "@/lib/date-format";
import type { Notification } from "@/lib/types";

/** How many to show in the panel. The badge counts every unread one, not just
 *  these - a bell that stops counting at 20 is a bell people stop trusting. */
const VISIBLE = 20;

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const store = useLabStore();
  const { t } = useI18n();
  const userId = store.currentUserId;

  const refresh = useCallback(async () => {
    if (!userId) return;
    const result = await fetchNotificationsFor(userId, VISIBLE);
    setItems(result.items);
    setUnread(result.unread);
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // New alerts arrive without a reload.
  useEffect(() => subscribeToNotifications(userId, () => void refresh()), [userId, refresh]);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next) await refresh();
  }

  async function handleMarkAllRead() {
    setUnread(0);
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
    await markAllNotificationsRead(userId);
    await refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => void handleOpen()}
        className="relative rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-lab-burgundy hover:text-lab-burgundy"
      >
        {t("notifications.alerts")}
        {unread > 0 ? (
          <span className="ml-2 rounded-full bg-lab-red px-2 py-0.5 text-xs font-semibold text-white">{unread}</span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-line bg-white p-2 shadow-lg">
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {t("notifications.alerts")}
            </span>
            {unread > 0 ? (
              <button
                type="button"
                onClick={() => void handleMarkAllRead()}
                className="text-[11px] font-semibold text-lab-burgundy hover:underline"
              >
                {t("notifications.markAllRead")}
              </button>
            ) : null}
          </div>
          <div className="max-h-96 overflow-auto">
            {items.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted">{t("notifications.none")}</div>
            ) : null}
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-md border border-transparent px-3 py-3 hover:bg-[#FAFAFA] ${item.isRead ? "" : "bg-lab-mist/40"}`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold text-ink">{item.title}</div>
                  <div className="shrink-0 text-[10px] text-muted">{formatEuropeanDate(item.createdAt.slice(0, 10))}</div>
                </div>
                <div className="mt-1 text-xs text-muted">{item.message}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
