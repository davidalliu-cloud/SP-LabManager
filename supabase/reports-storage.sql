insert into storage.buckets (id, name, public)
values ('reports', 'reports', false)
on conflict (id) do nothing;

drop policy if exists "authenticated reports read" on storage.objects;
drop policy if exists "authenticated reports insert" on storage.objects;
drop policy if exists "authenticated reports update" on storage.objects;
drop policy if exists "authenticated reports delete" on storage.objects;

create policy "authenticated reports read"
on storage.objects for select
to authenticated
using (bucket_id = 'reports');

create policy "authenticated reports insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'reports');

create policy "authenticated reports update"
on storage.objects for update
to authenticated
using (bucket_id = 'reports')
with check (bucket_id = 'reports');

create policy "authenticated reports delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'reports');
