-- Saving one change used to mean writing the whole register back.
--
-- The register is one row holding one JSON document, and by November 2026 that
-- document is 4 MB: 722 concrete tests, 1 432 reports, 1 012 tests, 500
-- samples. Every edit — approving a report, typing a result — sent all 4 MB
-- back to Postgres and re-broadcast all 4 MB to every open tab. With three
-- people working at once the writes queued on the same row, the one waiting hit
-- the 8 s statement_timeout that `authenticated` carries, and the
-- compare-and-swap then lost its race. Measured on 2 November: PATCHes of
-- 4 043 251 bytes taking 27 s, 69 s, 91 s, 138 s, 169 s, many answering 500 or
-- 504. That is what "it doesn't save the report when I approve it" was.
--
-- This writes only the rows that actually changed — a few kB instead of 4 MB.
--
-- The caller passes the updated_at it believes it is replacing. The row is
-- locked and checked in the same statement, so the compare-and-swap happens
-- inside the transaction instead of hopefully. NULL back means somebody else
-- saved first and the caller must re-read, merge and try again; otherwise the
-- new updated_at comes back and the caller adopts it as its baseline.
--
-- security invoker (the default, stated by omission) on purpose: the register's
-- own RLS policies decide who may write, exactly as they do for a plain UPDATE.
-- Nothing here is allowed that a direct UPDATE would not be.
create or replace function public.apply_shared_state_delta(
  p_expected_updated_at timestamptz,
  p_upserts jsonb default '{}'::jsonb,
  p_deletes jsonb default '{}'::jsonb
) returns timestamptz
language plpgsql
set search_path = public
as $fn$
declare
  v_state jsonb;
  v_now   timestamptz := clock_timestamp();
  v_key   text;
  v_rows  jsonb;
  v_ids   jsonb;
  v_next  jsonb;
  v_saved timestamptz;
begin
  if p_expected_updated_at is null then
    raise exception 'apply_shared_state_delta needs the updated_at it is replacing';
  end if;

  select state into v_state
    from app_state
   where id = 'shared-lab-state'
     and updated_at = p_expected_updated_at
   for update;

  if not found then
    return null;
  end if;

  for v_key in
    select k from (
      select jsonb_object_keys(p_upserts) as k
      union
      select jsonb_object_keys(p_deletes) as k
    ) s
  loop
    v_rows := coalesce(p_upserts -> v_key, '[]'::jsonb);
    v_ids  := coalesce(p_deletes -> v_key, '[]'::jsonb);

    with existing as (
      select e.item, e.ord
        from jsonb_array_elements(coalesce(v_state -> v_key, '[]'::jsonb)) with ordinality e(item, ord)
    ),
    replacement as (
      select r.item, r.ord
        from jsonb_array_elements(v_rows) with ordinality r(item, ord)
    ),
    gone as (
      select d.value as id from jsonb_array_elements_text(v_ids) d(value)
    ),
    -- A row the register already holds: replaced when the caller sent a new
    -- version of it, dropped when the caller deleted it, kept otherwise — and
    -- always in the place it already occupied, so the order of a register the
    -- interface reads top-down never shuffles because somebody saved.
    kept as (
      select coalesce(replacement.item, existing.item) as item, existing.ord as ord
        from existing
        left join replacement on replacement.item ->> 'id' = existing.item ->> 'id'
       where not exists (select 1 from gone where gone.id = existing.item ->> 'id')
    ),
    added as (
      select replacement.item as item,
             (select coalesce(max(ord), 0) from existing) + replacement.ord as ord
        from replacement
       where not exists (select 1 from existing where existing.item ->> 'id' = replacement.item ->> 'id')
    )
    select coalesce(jsonb_agg(u.item order by u.ord), '[]'::jsonb)
      into v_next
      from (select item, ord from kept union all select item, ord from added) u;

    v_state := jsonb_set(v_state, array[v_key], v_next, true);
  end loop;

  update app_state
     set state = v_state,
         updated_at = v_now
   where id = 'shared-lab-state'
     and updated_at = p_expected_updated_at
  returning updated_at into v_saved;

  return v_saved;
end;
$fn$;

revoke all on function public.apply_shared_state_delta(timestamptz, jsonb, jsonb) from public;
grant execute on function public.apply_shared_state_delta(timestamptz, jsonb, jsonb) to authenticated;

-- The other half of the same problem: realtime published the `state` column,
-- so every save also pushed 4 MB down to every open tab. The replication slot
-- spent 2 November fighting to keep up ("ReplicationSlotBeingUsed", several
-- times a second), which is why clients stopped hearing about each other's
-- saves and so lost the compare-and-swap on the first attempt every time.
--
-- Publish id and updated_at only. The message becomes a ping — "the register
-- moved, go and read it" — and the client fetches once, coalesced, instead of
-- being handed the whole thing uninvited. Postgres 15+ for the column list;
-- `id` is the primary key, so it satisfies the replica identity.
alter publication supabase_realtime drop table public.app_state;
alter publication supabase_realtime add table public.app_state (id, updated_at);
