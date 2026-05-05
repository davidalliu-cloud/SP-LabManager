create extension if not exists "pgcrypto";

create type user_role as enum (
  'Admin / Managing Director',
  'Chief of Lab',
  'Quality Manager',
  'Operations Manager',
  'Document Controller',
  'Technician'
);

create type sample_status as enum ('Registered', 'Pending Testing', 'In Progress', 'Partially Tested', 'Completed', 'Delayed');
create type test_status as enum ('Pending', 'Scheduled', 'In Progress', 'Completed', 'Delayed', 'Report Drafted', 'Pending Approval', 'Approved', 'Rejected', 'Issued');
create type report_status as enum ('Draft', 'Report Drafted', 'Pending Approval', 'Approved', 'Rejected', 'Issued');
create type priority_level as enum ('Normal', 'High', 'Urgent');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role user_role not null default 'Technician',
  position text,
  phone text,
  work_areas text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  client_code text not null unique,
  client_name text not null,
  contact_person text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  project_name text not null,
  location text,
  description text,
  created_at timestamptz not null default now()
);

create table public.samples (
  id uuid primary key default gen_random_uuid(),
  sample_code text not null unique,
  client_id uuid not null references public.clients(id),
  project_id uuid not null references public.projects(id),
  sample_type text not null,
  sample_description text not null,
  quantity integer not null check (quantity > 0),
  date_received date not null,
  time_received time not null,
  collection_method text not null check (collection_method in ('Delivered by client', 'Collected by lab technician')),
  delivered_by text,
  collected_by text,
  requested_test_type text not null,
  standard text not null,
  required_test_date date not null,
  report_due_date date not null,
  status sample_status not null default 'Registered',
  notes text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table public.tests (
  id uuid primary key default gen_random_uuid(),
  test_code text not null unique,
  sample_id uuid not null references public.samples(id) on delete cascade,
  client_id uuid not null references public.clients(id),
  project_id uuid not null references public.projects(id),
  test_type text not null,
  standard text not null,
  assigned_technician uuid references public.users(id),
  cube_count integer not null default 1 check (cube_count > 0),
  scheduled_age_days integer not null default 28 check (scheduled_age_days > 0),
  required_test_date date not null,
  due_date date not null,
  status test_status not null default 'Pending',
  priority priority_level not null default 'Normal',
  completed_at timestamptz,
  completed_by uuid references public.users(id),
  notes text,
  created_at timestamptz not null default now()
);

create table public.concrete_compressive_tests (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null unique references public.tests(id) on delete cascade,
  test_start_date date,
  test_end_date date,
  temperature text,
  humidity text,
  testing_location text,
  casting_date date not null,
  test_date date not null,
  age_days integer not null,
  cube_length numeric(10,2) not null,
  cube_width numeric(10,2) not null,
  cube_height numeric(10,2) not null,
  weight numeric(10,3) not null,
  maximum_load_kn numeric(12,3) not null,
  loaded_area_mm2 numeric(12,3) not null,
  compressive_strength_mpa numeric(12,3) not null,
  failure_type text,
  machine_used text,
  technician_name text,
  notes text,
  specimens_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.steel_tensile_tests (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null unique references public.tests(id) on delete cascade,
  diameter_mm numeric(10,2),
  cross_sectional_area_mm2 numeric(12,3),
  length_mm numeric(12,3),
  weight_g numeric(12,3),
  yield_load_kn numeric(12,3),
  ultimate_load_kn numeric(12,3),
  yield_strength_mpa numeric(12,3),
  tensile_strength_mpa numeric(12,3),
  elongation_percent numeric(8,3),
  bend_test_result text,
  machine_used text,
  technician_name text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.aggregate_gradation_tests (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null unique references public.tests(id) on delete cascade,
  sample_weight_g numeric(12,3),
  sieve_data_json jsonb not null default '[]'::jsonb,
  technician_name text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  report_number text not null unique,
  test_id uuid not null references public.tests(id) on delete cascade,
  sample_id uuid not null references public.samples(id),
  client_id uuid not null references public.clients(id),
  project_id uuid not null references public.projects(id),
  specimen_codes jsonb not null default '[]'::jsonb,
  report_sequence integer not null default 1,
  total_reports integer not null default 1,
  report_status report_status not null default 'Report Drafted',
  drafted_by uuid references public.users(id),
  checked_by uuid references public.users(id),
  approved_by uuid references public.users(id),
  approved_at timestamptz,
  rejected_by uuid references public.users(id),
  rejection_comments text,
  issued_by uuid references public.users(id),
  issued_at timestamptz,
  client_email text,
  pdf_url text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  related_test_id uuid references public.tests(id) on delete cascade,
  related_report_id uuid references public.reports(id) on delete cascade,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  description text,
  created_at timestamptz not null default now()
);

create sequence if not exists public.sample_code_seq start with 1;
create sequence if not exists public.report_number_seq start with 1;
create sequence if not exists public.test_code_seq start with 1;
create sequence if not exists public.client_code_seq start with 1;

create or replace function public.next_client_code()
returns text
language sql
as $$
  select 'CL-' || lpad(nextval('public.client_code_seq')::text, 3, '0');
$$;

create or replace function public.assign_client_code()
returns trigger
language plpgsql
as $$
begin
  if new.client_code is null or new.client_code = '' then
    new.client_code := public.next_client_code();
  end if;

  return new;
end;
$$;

create trigger assign_client_code_before_insert
before insert on public.clients
for each row execute function public.assign_client_code();

create or replace function public.next_sample_code(received_on date default current_date)
returns text
language plpgsql
as $$
declare
  code_prefix text;
  next_number integer;
begin
  code_prefix := to_char(received_on, 'YYYY-MM');

  select count(*) + 1
  into next_number
  from public.samples
  where sample_code like code_prefix || '-%';

  return code_prefix || '-' || lpad(next_number::text, 3, '0');
end;
$$;

create or replace function public.assign_sample_code()
returns trigger
language plpgsql
as $$
begin
  if new.sample_code is null or new.sample_code = '' then
    new.sample_code := public.next_sample_code(new.date_received);
  end if;

  return new;
end;
$$;

create trigger assign_sample_code_before_insert
before insert on public.samples
for each row execute function public.assign_sample_code();

create or replace function public.next_report_number()
returns text
language sql
as $$
  select 'LAB-R-' || extract(year from now())::int || '-' || lpad(nextval('public.report_number_seq')::text, 4, '0');
$$;

create or replace function public.next_test_code()
returns text
language sql
as $$
  select 'TEST-' || extract(year from now())::int || '-' || lpad(nextval('public.test_code_seq')::text, 4, '0');
$$;

create index samples_client_id_idx on public.samples(client_id);
create index samples_project_id_idx on public.samples(project_id);
create index tests_status_idx on public.tests(status);
create index tests_required_test_date_idx on public.tests(required_test_date);
create index reports_status_idx on public.reports(report_status);
create index reports_test_id_idx on public.reports(test_id);
create index notifications_user_unread_idx on public.notifications(user_id, is_read);

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.samples enable row level security;
alter table public.tests enable row level security;
alter table public.concrete_compressive_tests enable row level security;
alter table public.steel_tensile_tests enable row level security;
alter table public.aggregate_gradation_tests enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.current_user_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.users where id = auth.uid();
$$;

create policy "authenticated read users" on public.users for select to authenticated using (true);
create policy "admins manage users" on public.users for all to authenticated using (public.current_user_role() = 'Admin / Managing Director') with check (public.current_user_role() = 'Admin / Managing Director');

create policy "staff read clients" on public.clients for select to authenticated using (true);
create policy "ops admins manage clients" on public.clients for all to authenticated using (public.current_user_role() in ('Admin / Managing Director', 'Operations Manager')) with check (public.current_user_role() in ('Admin / Managing Director', 'Operations Manager'));

create policy "staff read projects" on public.projects for select to authenticated using (true);
create policy "ops admins manage projects" on public.projects for all to authenticated using (public.current_user_role() in ('Admin / Managing Director', 'Operations Manager')) with check (public.current_user_role() in ('Admin / Managing Director', 'Operations Manager'));

create policy "staff read samples" on public.samples for select to authenticated using (true);
create policy "ops admins create samples" on public.samples for insert to authenticated with check (public.current_user_role() in ('Admin / Managing Director', 'Operations Manager'));
create policy "ops admins update samples" on public.samples for update to authenticated using (public.current_user_role() in ('Admin / Managing Director', 'Operations Manager', 'Quality Manager')) with check (true);

create policy "staff read tests" on public.tests for select to authenticated using (true);
create policy "ops admins manage tests" on public.tests for all to authenticated using (public.current_user_role() in ('Admin / Managing Director', 'Operations Manager', 'Chief of Lab')) with check (true);
create policy "technician update assigned tests" on public.tests for update to authenticated using (assigned_technician = auth.uid()) with check (assigned_technician = auth.uid());

create policy "staff read concrete tests" on public.concrete_compressive_tests for select to authenticated using (true);
create policy "technicians enter concrete tests" on public.concrete_compressive_tests for all to authenticated using (public.current_user_role() in ('Admin / Managing Director', 'Technician')) with check (true);

create policy "staff read reports" on public.reports for select to authenticated using (true);
create policy "document controller manages drafts" on public.reports for all to authenticated using (public.current_user_role() in ('Admin / Managing Director', 'Document Controller', 'Chief of Lab')) with check (true);

create policy "own notifications" on public.notifications for select to authenticated using (user_id = auth.uid() or public.current_user_role() = 'Admin / Managing Director');
create policy "staff insert notifications" on public.notifications for insert to authenticated with check (true);
create policy "own notification update" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "audit visible to managers" on public.audit_log for select to authenticated using (public.current_user_role() in ('Admin / Managing Director', 'Chief of Lab', 'Quality Manager'));
create policy "staff insert audit" on public.audit_log for insert to authenticated with check (true);
