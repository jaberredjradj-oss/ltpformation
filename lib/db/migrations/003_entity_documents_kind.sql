-- Migration 003: document_kind on entity_documents
alter table entity_documents
  add column if not exists document_kind text not null default 'other'
  check (document_kind in (
    'identity', 'medical_certificate', 'first_aid', 'cv',
    'cpf_proof', 'residence_permit', 'other', 'admin'
  ));
