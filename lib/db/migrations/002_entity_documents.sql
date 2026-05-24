-- Migration 002: entity_documents table + private storage bucket
-- Apply entity_documents via schema.sql or run the CREATE TABLE block below.
-- Create the storage bucket in Supabase Dashboard (Storage → New bucket):
--   Name: ltp-documents
--   Public: OFF (private — downloads via admin server route only)

-- Optional SQL (Supabase SQL editor) if bucket API is available:
-- insert into storage.buckets (id, name, public)
-- values ('ltp-documents', 'ltp-documents', false)
-- on conflict (id) do nothing;
