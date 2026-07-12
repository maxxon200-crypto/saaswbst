-- ===========================================================================
-- Metrica — initial schema, RLS, and access functions.
--
-- RLS is ON for every table. Users only ever reach rows belonging to a studio
-- they are a member of. The public client-approval view (/share/[token]) reads
-- through a SECURITY DEFINER function scoped to a single project — RLS is never
-- disabled to serve it.
-- ===========================================================================

create extension if not exists pgcrypto;

-- --- enums -----------------------------------------------------------------
create type member_role     as enum ('owner', 'member');
create type project_status  as enum ('active', 'archived');
create type product_source  as enum ('url', 'pdf', 'manual', 'seed');
create type price_type       as enum ('trade', 'retail');
create type item_status     as enum ('pending', 'approved', 'rejected');
create type extraction_mode as enum ('url', 'file');
create type plan_tier        as enum ('trial', 'solo', 'studio', 'studio_plus');

-- --- tables ----------------------------------------------------------------
create table studios (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  logo_path              text,
  address                text,
  vat_number             text,
  default_currency       text not null default 'EUR',
  default_markup         numeric(6, 2) not null default 0,
  plan                   plan_tier not null default 'trial',
  stripe_customer_id     text,
  stripe_subscription_id text,
  trial_ends_at          timestamptz default (now() + interval '14 days'),
  created_at             timestamptz not null default now()
);

create table studio_members (
  id         uuid primary key default gen_random_uuid(),
  studio_id  uuid not null references studios(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (studio_id, user_id)
);
create index studio_members_user_idx on studio_members(user_id);

create table projects (
  id            uuid primary key default gen_random_uuid(),
  studio_id     uuid not null references studios(id) on delete cascade,
  name          text not null,
  client_name   text,
  currency      text not null default 'EUR',
  markup        numeric(6, 2) not null default 0,
  status        project_status not null default 'active',
  share_token   text unique,
  share_enabled boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index projects_studio_idx on projects(studio_id);

create table rooms (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name       text not null,
  code       text not null,
  position   int not null default 0,
  created_at timestamptz not null default now()
);
create index rooms_project_idx on rooms(project_id);

create table products (
  id              uuid primary key default gen_random_uuid(),
  studio_id       uuid references studios(id) on delete cascade, -- NULL = global seed library
  name            text not null,
  brand           text,
  collection      text,
  designer        text,
  category        text,
  sku             text,
  width_mm        numeric,
  depth_mm        numeric,
  height_mm       numeric,
  seat_height_mm  numeric,
  diameter_mm     numeric,
  dimensions_raw  text,
  materials       text[] not null default '{}',
  finish          text,
  colour          text,
  price_amount    numeric(12, 2),
  price_currency  text default 'EUR',
  price_type      price_type default 'trade',
  lead_time_weeks int,
  description_en  text,
  description_it  text,
  source_url      text,
  source_type     product_source not null default 'manual',
  image_path      text,
  created_at      timestamptz not null default now()
);
create index products_studio_idx on products(studio_id);
create index products_brand_idx on products(brand);
create index products_category_idx on products(category);

create table schedule_items (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  room_id         uuid not null references rooms(id) on delete cascade,
  product_id      uuid references products(id) on delete set null,
  ref_code        text,
  qty             int not null default 1,
  unit_price      numeric(12, 2),
  markup_override numeric(6, 2),
  notes           text,
  position        int not null default 0,
  status          item_status not null default 'pending',
  client_comment  text,
  created_at      timestamptz not null default now()
);
create index schedule_items_project_idx on schedule_items(project_id);
create index schedule_items_room_idx on schedule_items(room_id);

create table extractions (
  id         uuid primary key default gen_random_uuid(),
  studio_id  uuid not null references studios(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  mode       extraction_mode not null,
  source     text,
  success    boolean not null default false,
  confidence text,
  tokens_in  int,
  tokens_out int,
  created_at timestamptz not null default now()
);
create index extractions_studio_period_idx on extractions(studio_id, created_at);

-- --- updated_at trigger for projects ---------------------------------------
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_touch_updated_at
  before update on projects
  for each row execute function touch_updated_at();

-- ===========================================================================
-- Membership helpers (SECURITY DEFINER so they read studio_members without
-- triggering recursive RLS on it).
-- ===========================================================================
create or replace function auth_studio_ids()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select studio_id from studio_members where user_id = auth.uid()
$$;

create or replace function is_studio_owner(sid uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from studio_members
    where studio_id = sid and user_id = auth.uid() and role = 'owner'
  )
$$;

-- Onboarding: create a studio and make the caller its owner. Returns studio id.
create or replace function create_studio(p_name text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  insert into studios (name) values (coalesce(nullif(trim(p_name), ''), 'My studio'))
  returning id into new_id;
  insert into studio_members (studio_id, user_id, role)
  values (new_id, auth.uid(), 'owner');
  return new_id;
end;
$$;

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table studios         enable row level security;
alter table studio_members  enable row level security;
alter table projects        enable row level security;
alter table rooms           enable row level security;
alter table products        enable row level security;
alter table schedule_items  enable row level security;
alter table extractions     enable row level security;

-- studios: members read; owners update. Insert only via create_studio().
create policy studios_select on studios for select
  using (id in (select auth_studio_ids()));
create policy studios_update on studios for update
  using (is_studio_owner(id)) with check (is_studio_owner(id));

-- studio_members: members read the roster; owners add/remove.
create policy members_select on studio_members for select
  using (studio_id in (select auth_studio_ids()));
create policy members_insert on studio_members for insert
  with check (is_studio_owner(studio_id));
create policy members_delete on studio_members for delete
  using (is_studio_owner(studio_id));

-- projects: any studio member may manage.
create policy projects_all on projects for all
  using (studio_id in (select auth_studio_ids()))
  with check (studio_id in (select auth_studio_ids()));

-- rooms: scoped through the parent project's studio.
create policy rooms_all on rooms for all
  using (exists (select 1 from projects p
                 where p.id = rooms.project_id and p.studio_id in (select auth_studio_ids())))
  with check (exists (select 1 from projects p
                 where p.id = rooms.project_id and p.studio_id in (select auth_studio_ids())));

-- products: global seed (studio_id NULL) is readable by all; studio rows are
-- read/written only within the studio. Seed rows are immutable to users.
create policy products_select on products for select
  using (studio_id is null or studio_id in (select auth_studio_ids()));
create policy products_insert on products for insert
  with check (studio_id in (select auth_studio_ids()));
create policy products_update on products for update
  using (studio_id in (select auth_studio_ids()))
  with check (studio_id in (select auth_studio_ids()));
create policy products_delete on products for delete
  using (studio_id in (select auth_studio_ids()));

-- schedule_items: scoped through the parent project's studio.
create policy schedule_items_all on schedule_items for all
  using (exists (select 1 from projects p
                 where p.id = schedule_items.project_id and p.studio_id in (select auth_studio_ids())))
  with check (exists (select 1 from projects p
                 where p.id = schedule_items.project_id and p.studio_id in (select auth_studio_ids())));

-- extractions: studio-scoped (also written server-side via service role).
create policy extractions_select on extractions for select
  using (studio_id in (select auth_studio_ids()));
create policy extractions_insert on extractions for insert
  with check (studio_id in (select auth_studio_ids()));

-- ===========================================================================
-- Public client-approval access (/share/[token]) — SECURITY DEFINER, scoped to
-- exactly one project by its unguessable token. RLS stays ON everywhere.
-- ===========================================================================
create or replace function get_shared_project(p_token text)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  proj projects;
  result jsonb;
begin
  select * into proj from projects
   where share_token = p_token and share_enabled = true;
  if not found then
    return null;
  end if;

  select jsonb_build_object(
    'project', jsonb_build_object(
      'id', proj.id, 'name', proj.name, 'client_name', proj.client_name, 'currency', proj.currency
    ),
    'studio', (select jsonb_build_object('name', s.name, 'logo_path', s.logo_path)
                 from studios s where s.id = proj.studio_id),
    'rooms', (select coalesce(jsonb_agg(
                jsonb_build_object('id', r.id, 'name', r.name, 'code', r.code, 'position', r.position)
                order by r.position), '[]'::jsonb)
              from rooms r where r.project_id = proj.id),
    'items', (select coalesce(jsonb_agg(
                jsonb_build_object(
                  'id', si.id, 'room_id', si.room_id, 'ref_code', si.ref_code,
                  'qty', si.qty, 'unit_price', si.unit_price, 'status', si.status,
                  'client_comment', si.client_comment, 'position', si.position,
                  'product', (select jsonb_build_object(
                      'name', pr.name, 'brand', pr.brand, 'designer', pr.designer,
                      'collection', pr.collection, 'dimensions_raw', pr.dimensions_raw,
                      'finish', pr.finish, 'image_path', pr.image_path,
                      'width_mm', pr.width_mm, 'depth_mm', pr.depth_mm, 'height_mm', pr.height_mm
                    ) from products pr where pr.id = si.product_id)
                ) order by si.position), '[]'::jsonb)
              from schedule_items si where si.project_id = proj.id)
  ) into result;

  return result;
end;
$$;

-- Client actions on a shared project (no login). Verify the item belongs to the
-- token's still-shared project, then mutate only that item.
create or replace function set_shared_item_status(
  p_token text, p_item uuid, p_status item_status, p_comment text default null)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  ok boolean;
begin
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

-- The public share route uses the anon key with no session, so grant execute.
grant execute on function get_shared_project(text) to anon, authenticated;
grant execute on function set_shared_item_status(text, uuid, item_status, text) to anon, authenticated;
grant execute on function create_studio(text) to authenticated;

-- ===========================================================================
-- Storage buckets (all private). Object paths are prefixed with the studio id,
-- so folder[1] == studio id scopes access. Reads in the app go through
-- server-generated signed URLs; these policies cover direct authenticated use.
-- ===========================================================================
insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', false),
  ('source-files',   'source-files',   false),
  ('studio-logos',   'studio-logos',   false)
on conflict (id) do nothing;

create policy "studio objects: read" on storage.objects for select to authenticated
  using (
    bucket_id in ('product-images', 'source-files', 'studio-logos')
    and (storage.foldername(name))[1] in (select auth_studio_ids()::text)
  );
create policy "studio objects: write" on storage.objects for insert to authenticated
  with check (
    bucket_id in ('product-images', 'source-files', 'studio-logos')
    and (storage.foldername(name))[1] in (select auth_studio_ids()::text)
  );
create policy "studio objects: delete" on storage.objects for delete to authenticated
  using (
    bucket_id in ('product-images', 'source-files', 'studio-logos')
    and (storage.foldername(name))[1] in (select auth_studio_ids()::text)
  );
