-- Point 1: lift the audit trail and the notification feed out of app_state.
--
-- Why: on 2026-08-27 the shared-lab-state blob was 1,684 kB after 24 days.
-- notifications (1,787 rows, 541 kB) and auditLog (1,786 rows, 515 kB) were
-- 61.3% of it, growing ~150 rows/day, and every save re-uploaded all of them.
-- Past 1 MB Supabase Realtime stops delivering, so live sync had already been
-- silently dead since roughly 17 August.
--
-- These tables use TEXT ids on purpose. The app's own ids are values like
-- 'u-admin' (1,629 of 1,786 audit rows and all 1,787 notifications are not
-- UUIDs), which public.audit_log / public.notifications cannot hold - those
-- expect Auth UUIDs and foreign-key into tables that are still empty. They
-- stay reserved for the normalised schema (Point 2).
--
-- This script is idempotent. Steps 1 and 2 are additive; nothing is removed
-- from app_state here. Removal happens in the application, by flipping
-- KEEP_ACTIVITY_IN_BLOB to false in lib/lab-store.tsx, and only after step 3
-- reports clean.

-- ---------------------------------------------------------------- 1. tables

create table if not exists public.app_audit_log (
  id           text primary key,
  user_id      text not null,
  action       text not null,
  entity_type  text not null,
  entity_id    text not null,
  description  text,
  created_at   timestamptz not null default now()
);

create index if not exists app_audit_log_created_at_idx on public.app_audit_log (created_at desc);
create index if not exists app_audit_log_entity_idx     on public.app_audit_log (entity_type, entity_id);
create index if not exists app_audit_log_user_idx       on public.app_audit_log (user_id, created_at desc);

create table if not exists public.app_notifications (
  id                text primary key,
  user_id           text not null,
  title             text not null,
  message           text not null,
  related_test_id   text,
  related_report_id text,
  is_read           boolean not null default false,
  created_at        timestamptz not null default now()
);

create index if not exists app_notifications_user_idx on public.app_notifications (user_id, is_read, created_at desc);

alter table public.app_audit_log     enable row level security;
alter table public.app_notifications enable row level security;

-- The audit trail is append-only: select + insert, never update or delete.
-- Inside the blob it was rewritable by any client that saved; it should not be.
drop policy if exists "authenticated audit read"   on public.app_audit_log;
drop policy if exists "authenticated audit insert" on public.app_audit_log;

create policy "authenticated audit read"
  on public.app_audit_log for select to authenticated using (true);
create policy "authenticated audit insert"
  on public.app_audit_log for insert to authenticated with check (true);

-- Notifications need update so they can be marked read. Restricting rows to
-- their own user needs app ids to map to auth.uid(), which is Point 2 work.
drop policy if exists "authenticated notifications read"   on public.app_notifications;
drop policy if exists "authenticated notifications insert" on public.app_notifications;
drop policy if exists "authenticated notifications update" on public.app_notifications;

create policy "authenticated notifications read"
  on public.app_notifications for select to authenticated using (true);
create policy "authenticated notifications insert"
  on public.app_notifications for insert to authenticated with check (true);
create policy "authenticated notifications update"
  on public.app_notifications for update to authenticated using (true) with check (true);

-- ------------------------------------------------------- 2. copy the history

with s as (select state from public.app_state where id = 'shared-lab-state')
insert into public.app_audit_log (id, user_id, action, entity_type, entity_id, description, created_at)
select e->>'id', e->>'userId', e->>'action', e->>'entityType', e->>'entityId', e->>'description',
       coalesce((e->>'createdAt')::timestamptz, now())
from s, jsonb_array_elements(s.state->'auditLog') e
where e->>'id' is not null
on conflict (id) do nothing;

with s as (select state from public.app_state where id = 'shared-lab-state')
insert into public.app_notifications (id, user_id, title, message, related_test_id, related_report_id, is_read, created_at)
select e->>'id', e->>'userId', e->>'title', coalesce(e->>'message',''),
       e->>'relatedTestId', e->>'relatedReportId',
       coalesce((e->>'isRead')::boolean, false),
       coalesce((e->>'createdAt')::timestamptz, now())
from s, jsonb_array_elements(s.state->'notifications') e
where e->>'id' is not null
on conflict (id) do nothing;

-- ------------------------------------------------------------- 3. verify
-- Every number below must be 0 except the counts, which must be equal.
-- Do not remove anything from the blob until this is clean.

with s as (select state from public.app_state where id='shared-lab-state'),
blob_audit as (
  select e->>'id' id, e->>'userId' user_id, e->>'action' action, e->>'entityType' entity_type,
         e->>'entityId' entity_id, coalesce(e->>'description','') description,
         (e->>'createdAt')::timestamptz created_at
  from s, jsonb_array_elements(s.state->'auditLog') e),
blob_notif as (
  select e->>'id' id, e->>'userId' user_id, e->>'title' title, coalesce(e->>'message','') message,
         coalesce((e->>'isRead')::boolean,false) is_read, (e->>'createdAt')::timestamptz created_at
  from s, jsonb_array_elements(s.state->'notifications') e)
select 'audit in blob'  as check, (select count(*) from blob_audit)::text as value
union all select 'audit in table', (select count(*) from public.app_audit_log)::text
union all select 'audit missing from table',
  (select count(*) from blob_audit b left join public.app_audit_log t on t.id=b.id where t.id is null)::text
union all select 'audit differing on a field',
  (select count(*) from blob_audit b join public.app_audit_log t on t.id=b.id
   where t.user_id is distinct from b.user_id or t.action is distinct from b.action
      or t.entity_type is distinct from b.entity_type or t.entity_id is distinct from b.entity_id
      or coalesce(t.description,'') is distinct from b.description
      or t.created_at is distinct from b.created_at)::text
union all select 'notifications in blob', (select count(*) from blob_notif)::text
union all select 'notifications in table', (select count(*) from public.app_notifications)::text
union all select 'notifications missing from table',
  (select count(*) from blob_notif b left join public.app_notifications t on t.id=b.id where t.id is null)::text
union all select 'notifications differing on a field',
  (select count(*) from blob_notif b join public.app_notifications t on t.id=b.id
   where t.user_id is distinct from b.user_id or t.title is distinct from b.title
      or t.message is distinct from b.message or t.is_read is distinct from b.is_read
      or t.created_at is distinct from b.created_at)::text;
