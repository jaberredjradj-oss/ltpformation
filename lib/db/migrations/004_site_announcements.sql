-- Migration 004 — Smart Announcement Banner
-- Isolated module. Safe to run on existing databases.
-- If this table is absent, the public site simply shows no announcement.

create table if not exists site_announcements (
  id uuid primary key default gen_random_uuid(),
  enabled boolean not null default false,
  title text not null default '',
  description text not null default '',
  cta_text text not null default '',
  cta_url text not null default '',
  animation_type text not null default 'glow-sweep'
    check (animation_type in ('shooting-star', 'glow-sweep', 'particles', 'rocket', 'none')),
  display_delay integer not null default 4000 check (display_delay >= 0),
  display_duration integer not null default 0 check (display_duration >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_site_announcements_updated_at on site_announcements(updated_at desc);
