-- Migration 006 — Admin-managed formations (overlay on static catalog)
--
-- Phase 1: data layer only. This table is OPTIONAL at runtime:
-- if it is missing or empty, the application falls back to the static
-- formation catalog (lib/formations/data/*). It never replaces the static
-- formations; rows here OVERRIDE an existing slug or ADD a new formation.
--
-- Safe to run multiple times (idempotent).

create table if not exists formations (
  slug text primary key,
  title text not null,
  short_title text not null default '',
  category text not null,
  category_label text not null default '',
  type text not null default 'initial',
  type_label text not null default '',
  level text,
  duration_hours integer not null default 0,
  duration_label text not null default '',
  price jsonb,
  cpf_eligible boolean not null default false,
  cpf_note text,
  certification_code text,
  certifications jsonb not null default '[]'::jsonb,
  summary text not null default '',
  image_key text not null default 'incendie',
  cover_image_url text,
  pdf_filename text not null default '',
  pdf_url text not null default '',
  pdf_available boolean not null default false,
  content_status text not null default 'published'
    check (content_status in ('stub', 'published')),
  public_concerned jsonb not null default '[]'::jsonb,
  prerequisites jsonb not null default '[]'::jsonb,
  presentation text not null default '',
  objectives jsonb not null default '[]'::jsonb,
  programme jsonb not null default '{"modules":[]}'::jsonb,
  registration jsonb not null default '[]'::jsonb,
  evaluation jsonb not null default '[]'::jsonb,
  pedagogical_team jsonb not null default '[]'::jsonb,
  pedagogical_means jsonb not null default '[]'::jsonb,
  follow_up jsonb not null default '[]'::jsonb,
  career_outcomes jsonb not null default '[]'::jsonb,
  accessibility text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  source text not null default 'admin'
    check (source in ('admin', 'static-override')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_formations_active on formations(active);
create index if not exists idx_formations_category on formations(category);
create index if not exists idx_formations_sort_order on formations(sort_order);
