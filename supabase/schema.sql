-- Run this in the Supabase SQL Editor for the customer-journey-map project

create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  card_id     text not null,
  stage_id    text not null,
  lane        text not null,
  author      text not null,
  text        text not null,
  resolved    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index on comments (card_id);

create table if not exists card_edits (
  id          uuid primary key default gen_random_uuid(),
  card_id     text not null unique,
  stage_id    text not null,
  lane        text not null,
  edits       jsonb not null default '{}',
  edited_by   text not null,
  updated_at  timestamptz not null default now()
);

create index on card_edits (card_id);

create table if not exists custom_cards (
  id          text primary key default gen_random_uuid()::text,
  stage_id    text not null,
  lane        text not null,
  label       text not null,
  notes       text,
  author      text not null,
  severity    text default 'medium',
  status      text,
  company     text,
  aov         text,
  created_at  timestamptz not null default now()
);

-- Enable row-level security (open read/write for now — tighten per your auth needs)
alter table comments    enable row level security;
alter table card_edits  enable row level security;
alter table custom_cards enable row level security;

create policy "allow all" on comments     for all using (true) with check (true);
create policy "allow all" on card_edits   for all using (true) with check (true);
create policy "allow all" on custom_cards for all using (true) with check (true);

-- Enable real-time
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table card_edits;
alter publication supabase_realtime add table custom_cards;
