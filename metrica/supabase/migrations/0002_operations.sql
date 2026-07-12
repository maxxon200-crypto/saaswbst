-- ===========================================================================
-- Metrica v2 — operations pivot.
--
-- Adds the procurement/ops half of the product: purchase orders, order
-- tracking (a richer schedule_items lifecycle), damage & claims, and client
-- invoicing. RLS stays ON for every new table, scoped to the studio via
-- auth_studio_ids() (the same SECURITY DEFINER helper used in 0001).
-- ===========================================================================

-- --- enums -----------------------------------------------------------------
-- The full item lifecycle, from selection to installed. Replaces the old
-- item_status (pending|approved|rejected): 'selected' subsumes 'pending', and
-- approval is now one step in a longer chain.
create type line_status as enum (
  'selected',
  'approved',
  'rejected',
  'ordered',
  'in_production',
  'shipped',
  'delivered',
  'installed'
);

create type po_status      as enum ('draft', 'sent', 'confirmed', 'fulfilled');
create type claim_status   as enum ('open', 'submitted', 'accepted', 'rejected', 'resolved');
create type invoice_status as enum ('draft', 'sent', 'viewed', 'paid', 'overdue');

-- --- purchase orders -------------------------------------------------------
create table purchase_orders (
  id                uuid primary key default gen_random_uuid(),
  studio_id         uuid not null references studios(id) on delete cascade,
  project_id        uuid not null references projects(id) on delete cascade,
  supplier_name     text not null,
  supplier_email    text,
  po_number         text not null,
  status            po_status not null default 'draft',
  sent_at           timestamptz,
  confirmed_at      timestamptz,
  expected_ship_date date,
  total_cost        numeric(12, 2),
  currency          text not null default 'EUR',
  pdf_path          text,
  created_at        timestamptz not null default now(),
  unique (studio_id, po_number)
);
create index purchase_orders_studio_idx  on purchase_orders(studio_id);
create index purchase_orders_project_idx on purchase_orders(project_id);

create table po_items (
  id                uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  schedule_item_id  uuid references schedule_items(id) on delete set null,
  qty               int not null default 1,
  unit_cost         numeric(12, 2),
  line_total        numeric(12, 2)
);
create index po_items_po_idx on po_items(purchase_order_id);

-- --- damage & claims -------------------------------------------------------
create table claims (
  id                uuid primary key default gen_random_uuid(),
  studio_id         uuid not null references studios(id) on delete cascade,
  project_id        uuid not null references projects(id) on delete cascade,
  schedule_item_id  uuid references schedule_items(id) on delete set null,
  purchase_order_id uuid references purchase_orders(id) on delete set null,
  description       text,
  photo_paths       text[] not null default '{}',
  supplier_name     text,
  status            claim_status not null default 'open',
  hours_spent       numeric(8, 2) not null default 0,
  resolution_notes  text,
  created_at        timestamptz not null default now(),
  resolved_at       timestamptz
);
create index claims_studio_idx  on claims(studio_id);
create index claims_project_idx on claims(project_id);
create index claims_item_idx    on claims(schedule_item_id);

-- --- client invoices (Stripe Invoicing — separate from subscription billing) -
create table client_invoices (
  id                uuid primary key default gen_random_uuid(),
  studio_id         uuid not null references studios(id) on delete cascade,
  project_id        uuid not null references projects(id) on delete cascade,
  stripe_invoice_id text,
  amount            numeric(12, 2) not null,
  currency          text not null default 'EUR',
  status            invoice_status not null default 'draft',
  due_date          date,
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);
create index client_invoices_studio_idx  on client_invoices(studio_id);
create index client_invoices_project_idx on client_invoices(project_id);

-- --- extend schedule_items -------------------------------------------------
alter table schedule_items add column supplier_name     text;
alter table schedule_items add column cost              numeric(12, 2);
alter table schedule_items add column markup_pct        numeric(6, 2);
alter table schedule_items add column client_price      numeric(12, 2);
alter table schedule_items add column expected_date     date;
alter table schedule_items add column actual_date       date;
alter table schedule_items add column purchase_order_id uuid references purchase_orders(id) on delete set null;

-- Migrate the status column onto the richer lifecycle enum (pending → selected).
alter table schedule_items alter column status drop default;
alter table schedule_items
  alter column status type line_status
  using (case status::text when 'pending' then 'selected' else status::text end)::line_status;
alter table schedule_items alter column status set default 'selected';

create index schedule_items_status_idx   on schedule_items(status);
create index schedule_items_po_idx       on schedule_items(purchase_order_id);
create index schedule_items_supplier_idx on schedule_items(supplier_name);

-- ===========================================================================
-- The client-approval RPC now takes line_status. Clients may still ONLY move an
-- item to approved/rejected — every other transition is studio-internal. The
-- old item_status-typed function is dropped and replaced.
-- ===========================================================================
drop function if exists set_shared_item_status(text, uuid, item_status, text);

create or replace function set_shared_item_status(
  p_token text, p_item uuid, p_status line_status, p_comment text default null)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  ok boolean;
begin
  -- Guard: the public approval link may only approve or reject.
  if p_status not in ('approved', 'rejected') then
    return false;
  end if;

  select exists (
    select 1
    from schedule_items si
    join projects p on p.id = si.project_id
    where si.id = p_item and p.share_token = p_token and p.share_enabled = true
  ) into ok;
  if not ok then
    return false;
  end if;

  update schedule_items
     set status = p_status,
         client_comment = coalesce(p_comment, client_comment)
   where id = p_item;
  return true;
end;
$$;

grant execute on function set_shared_item_status(text, uuid, line_status, text) to anon, authenticated;

-- item_status is now unreferenced (get_shared_project reads si.status dynamically).
drop type if exists item_status;

-- ===========================================================================
-- Row Level Security — every new table, studio-scoped.
-- ===========================================================================
alter table purchase_orders enable row level security;
alter table po_items        enable row level security;
alter table claims          enable row level security;
alter table client_invoices enable row level security;

create policy purchase_orders_all on purchase_orders for all
  using (studio_id in (select auth_studio_ids()))
  with check (studio_id in (select auth_studio_ids()));

-- po_items: scoped through the parent PO's studio.
create policy po_items_all on po_items for all
  using (exists (select 1 from purchase_orders po
                 where po.id = po_items.purchase_order_id
                   and po.studio_id in (select auth_studio_ids())))
  with check (exists (select 1 from purchase_orders po
                 where po.id = po_items.purchase_order_id
                   and po.studio_id in (select auth_studio_ids())));

create policy claims_all on claims for all
  using (studio_id in (select auth_studio_ids()))
  with check (studio_id in (select auth_studio_ids()));

-- client_invoices: read/insert/update by studio members. The Stripe webhook
-- writes status transitions server-side via the service role (bypasses RLS).
create policy client_invoices_all on client_invoices for all
  using (studio_id in (select auth_studio_ids()))
  with check (studio_id in (select auth_studio_ids()));

-- --- storage: claim photos reuse the private, studio-scoped source-files ----
-- bucket (paths prefixed with the studio id), already covered by the 0001
-- storage policies. No new bucket is required.
