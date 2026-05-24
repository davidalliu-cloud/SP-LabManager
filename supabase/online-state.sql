create table if not exists public.app_state (
  id text primary key default 'shared-lab-state',
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "public shared state read" on public.app_state;
drop policy if exists "public shared state insert" on public.app_state;
drop policy if exists "public shared state update" on public.app_state;
drop policy if exists "authenticated shared state read" on public.app_state;
drop policy if exists "authenticated shared state insert" on public.app_state;
drop policy if exists "authenticated shared state update" on public.app_state;

create policy "authenticated shared state read"
on public.app_state
for select
to authenticated
using (id = 'shared-lab-state');

create policy "authenticated shared state insert"
on public.app_state
for insert
to authenticated
with check (id = 'shared-lab-state');

create policy "authenticated shared state update"
on public.app_state
for update
to authenticated
using (id = 'shared-lab-state')
with check (id = 'shared-lab-state');
