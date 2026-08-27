# Phase 1 — normalising the app_state blob

Applied 2026-08-27. The DDL and copy statements are in the Supabase migration
history as `phase_1_core_tables`, `phase_1_relax_sample_code_uniqueness`,
`phase_1_samples_created_by` and `phase_1_tests_concreting_date`.

**The application still reads the blob.** These tables are populated and
verified but nothing is wired to them yet, so this step carries no risk to the
running lab. Wiring the app up is the next increment.

## Tables

`app_users`, `app_clients`, `app_projects`, `app_samples`, `app_tests`,
`app_reports`, `app_test_results` — alongside `app_audit_log` and
`app_notifications` from Point 1. RLS is enabled with **no policies**, so only
the service role can reach them until the app needs them.

## Three decisions, and why the data forced them

**Text ids, not uuid.** `samples`, `tests` and `reports` are 100% uuid-shaped,
but 87 of 129 clients, 82 of 124 projects and 6 of 9 users use stable text keys
like `u-admin` and `client-kl-005`. Re-keying those means rewriting every
foreign key across 459 records plus the entire audit trail, with no benefit.

**Text + CHECK for statuses, not enums.** `supabase/schema.sql` is stale
*because* its enums were baked in: it still says `'Pending Testing'` and
`'Completed'` while the app moved to `'Accepted'`, `'Tested'`, `'In Reporting'`,
`'Delivered'`. A check constraint protects the same values and can be altered.

**One `app_test_results` table, not 28.** The app carries 28 result arrays.
Only 7 hold any data and 6 of those have ≤ 4 rows; `concreteTests` alone has
102. Each is an opaque per-test document, so it is stored as `kind` + `payload`
jsonb. The migration walks every `%Tests` key in the blob, so a result type
nobody remembered is still carried over.

Every table has an `extra` jsonb column that catches fields the schema has not
named. Nothing is silently dropped. It found two real ones — see below.

## What migrated

| Entity | In blob | Migrated | Held back |
|---|---:|---:|---:|
| users | 9 | 9 | 0 |
| clients | 129 | 129 | 0 |
| projects | 124 | 124 | 0 |
| samples | 82 | 82 | 0 |
| tests | 196 | 194 | **2** |
| reports | 181 | 180 | **1** |
| test results | 113 | 112 | **1** |

Verified field by field, not just counted: 0 mismatches on samples, tests,
reports and result payloads.

## Data problems the blob was hiding

These are the reason a schema is worth having. None are caused by the
migration; all of them already existed and nothing could detect them.

### 1. An approved report with no sample

Sample `7bad1649…` no longer exists, but three records still point at it:

| Record | Code | Status |
|---|---|---|
| test | `TEST-2026-0001` | Report Approved |
| test | `TEST-2026-0002` | Pending |
| report | `LAB-R-2026-0017` | **Approved** |

An approved report with no sample behind it is an accreditation problem, not a
tidiness one. These four rows (including one concrete result document) are the
"held back" column above — they remain in the blob and were not migrated,
because a foreign key cannot accept them and deleting them is not a migration's
decision to make.

### 2. Two different samples share one code

`2026-08-035` exists twice, registered 64 seconds apart on 2026-08-19, same
date received and sample type — a double registration. Both carry real work:

| Sample id | Tests | Reports |
|---|---:|---:|
| `6dd43048…` | 4 | 2 |
| `06092c21…` | 2 | 1 |

Any report citing "2026-08-035" is ambiguous about which sample it describes.
`app_samples.sample_code` is therefore indexed but **not unique** yet. Once the
duplicate is resolved:

```sql
drop index public.app_samples_code_idx;
create unique index app_samples_code_idx on public.app_samples (sample_code);
```

`test_code` has 3 duplicate groups and is likewise non-unique. `report_number`,
`client_code` and user emails are clean and are enforced unique.

### 3. Fields the schema had not named

The `extra` catch-all surfaced two that deserved real columns, now promoted:

- `samples.createdBy` → `app_samples.created_by`
- `tests.concretingDate` → `app_tests.concreting_date` (183 rows). The casting
  date a cube's age is measured from — 28-day strength results are meaningless
  without it, and it was sitting unnamed.

Nothing else was unmapped: `extra` is now empty on every row.

## Next

1. Data-access layer returning the shapes the components already consume.
2. RLS policies per role, using `app_users.auth_user_id` mapped by email.
3. Migrate `/tech` first — narrowest query, biggest win.
4. Dual-write, run in parallel, then stop reading the blob.

---

## Increment 2 — auth mapping, RLS, and the live mirror (2026-08-27)

Migrations: `phase_1_auth_mapping_and_rls`, `phase_1_table_policies`,
`phase_1_fix_technician_role_check`, `phase_1_relax_reference_data_reads`,
`phase_1_blob_to_tables_sync`.

**The app still reads the blob.** Nothing user-facing changed.

### Auth mapping

All 9 app users matched a Supabase Auth account by email; `app_users.auth_user_id`
is populated. `current_app_user()`, `is_active_staff()`, `is_technician()` and
`can_view_client_identity()` are SECURITY DEFINER helpers so policies can
resolve the caller without granting everyone read on `app_users`.

### RLS, mirroring lib/permissions.ts

`is_technician()` initially checked `role = 'Technician'` alone. That inverted
the rule in production: **Astrit Prethi is a `Chief Technician` carrying 192 of
194 tests** and was treated as unrestricted, while the three users whose role is
literally `Technician` hold zero tests between them. `permissions.ts` warns about
this in a comment. Fixed to `role in ('Technician','Chief Technician')`.

Verified by impersonating real accounts:

| Who | tests | samples | clients | reports |
|---|---:|---:|---:|---:|
| Chief Technician (192 assigned) | **192** | 80 | 129 | 182 |
| Admin | 194 | 82 | — | — |
| Quality Manager | 194 | 82 | — | — |
| Anonymous | 0 | 0 | — | — |

Clients, projects and reports stay readable by all active staff **on purpose**:
the registers show client *code* to everyone and only the *name* is privileged,
and RLS cannot hide a single column. Column-level restriction needs a view, and
tightening the Reports register is a policy decision for the lab. Keeping them
open means no screen loses data when pages migrate.

No DELETE policy exists on any table. Deleting a sample is what orphaned
`TEST-2026-0001/0002` and `LAB-R-2026-0017`.

### The mirror

`sync_app_state_to_tables()` runs on every `app_state` update and upserts the
whole blob into the tables. The blob stays the source of truth while pages move
across one at a time, so a migrated page can never show data frozen at
migration time — and no store mutation had to be rewritten to dual-write.

**Upsert only, never delete.** A sync that removed rows because one client's
stale state omitted them is precisely how 2026-08-003 lost its sample.

Cost: ~117 ms per save at current volume. It re-upserts everything each time, so
it scales linearly with total rows — a bridge, not a destination. It retires
when the last page stops reading the blob.

It immediately proved itself: reports 180 → 182 and results 112 → 118, real work
created since the first migration, mirrored automatically.

### Standing gap

tests 194/196 and reports 182/183 — the orphans of `2026-08-003`, still held
back by the foreign keys and awaiting a decision.

### Next

Data-access layer, then migrate `/tech` first. Note before migrating desktop
pages: RLS will limit a Chief Technician to their assigned tests (192 of 194),
which is stricter than today's desktop behaviour and needs a nod first.
