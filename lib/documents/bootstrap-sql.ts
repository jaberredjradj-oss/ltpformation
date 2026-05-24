export const ENTITY_DOCUMENTS_BOOTSTRAP_SQL = `
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
`.trim();
