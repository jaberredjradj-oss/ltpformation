-- LT Protect Formation — Phase 2 schema (Supabase / PostgreSQL)

create table if not exists planning_sessions (
  id text primary key,
  formation_slug text,
  formation_title text not null,
  session_type text not null,
  category text not null,
  category_label text not null,
  start_date date not null,
  end_date date not null,
  exam_date date,
  schedule_label text not null default '9h00 - 17h00',
  location text not null,
  notes jsonb not null default '[]'::jsonb,
  cpf_eligible boolean not null default false,
  certification_code text,
  status text not null default 'open'
    check (status in ('open', 'limited', 'full', 'cancelled')),
  seats_total integer,
  seats_taken integer,
  visible boolean not null default true,
  year integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists devis_requests (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_first_name text not null,
  contact_last_name text not null,
  email text not null,
  phone text not null,
  formation_slug text not null,
  formation_title text not null,
  session_id text references planning_sessions(id) on delete set null,
  session_snapshot jsonb,
  participant_count integer not null default 1,
  employee_count integer,
  on_site_training text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'processed', 'archived')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists preinscriptions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  formation_slug text not null,
  formation_title text not null,
  session_id text not null references planning_sessions(id) on delete restrict,
  session_snapshot jsonb,
  cpf_financing text,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'validated', 'refused', 'archived')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'unread'
    check (status in ('unread', 'answered', 'archived')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notification_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'skipped')),
  created_at timestamptz not null default now()
);

create index if not exists idx_planning_sessions_start_date on planning_sessions(start_date);
create index if not exists idx_planning_sessions_visible on planning_sessions(visible);
create index if not exists idx_devis_requests_status on devis_requests(status);
create index if not exists idx_preinscriptions_status on preinscriptions(status);
create index if not exists idx_contact_messages_status on contact_messages(status);

-- Phase 3: admin access control (linked to Supabase Auth users)
create table if not exists admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin'
    check (role in ('admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_members_active on admin_members(active);

-- Entity documents (metadata only — files in Supabase Storage / local .data/uploads)
create table if not exists entity_documents (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('preinscription', 'devis', 'message')),
  entity_id text not null,
  file_name text not null,
  document_kind text not null default 'other'
    check (document_kind in (
      'identity', 'medical_certificate', 'first_aid', 'cv',
      'cpf_proof', 'residence_permit', 'other', 'admin'
    )),
  storage_path text not null unique,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0),
  uploaded_by text not null default 'candidate'
    check (uploaded_by in ('candidate', 'admin')),
  uploaded_at timestamptz not null default now()
);

create index if not exists idx_entity_documents_entity on entity_documents(entity_type, entity_id);
create index if not exists idx_entity_documents_uploaded_at on entity_documents(uploaded_at desc);

-- Smart Announcement Banner (public site communication — isolated module)
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
