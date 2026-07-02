-- Migration 007: corbeille admin (suppression logique + délai de grâce 7 jours)
-- Modèle PAR ENREGISTREMENT : chaque pré-inscription, devis ou message peut
-- être placé individuellement en corbeille, restauré, ou supprimé
-- définitivement. Les documents rattachés (entity_documents) suivent le sort
-- de leur entité SI cette table existe.
--
-- DÉFENSIF : chaque table est vérifiée via to_regclass() avant d'être touchée.
-- La migration ne suppose l'existence d'AUCUNE table — elle s'adapte au schéma
-- réellement présent (entity_documents, par ex., est optionnelle : sans elle,
-- les documents sont gérés côté application par le manifest du bucket).
--
-- Les trois opérations sont des fonctions Postgres atomiques (chaque appel =
-- UNE transaction), réservées au serveur (service role).

-- 1) Colonnes + index de corbeille sur les tables présentes uniquement.
do $$
begin
  if to_regclass('public.preinscriptions') is not null then
    alter table preinscriptions
      add column if not exists deleted_at timestamptz,
      add column if not exists delete_expires_at timestamptz;
    create index if not exists idx_preinscriptions_deleted_at
      on preinscriptions(deleted_at) where deleted_at is not null;
  end if;

  if to_regclass('public.devis_requests') is not null then
    alter table devis_requests
      add column if not exists deleted_at timestamptz,
      add column if not exists delete_expires_at timestamptz;
    create index if not exists idx_devis_requests_deleted_at
      on devis_requests(deleted_at) where deleted_at is not null;
  end if;

  if to_regclass('public.contact_messages') is not null then
    alter table contact_messages
      add column if not exists deleted_at timestamptz,
      add column if not exists delete_expires_at timestamptz;
    create index if not exists idx_contact_messages_deleted_at
      on contact_messages(deleted_at) where deleted_at is not null;
  end if;

  if to_regclass('public.entity_documents') is not null then
    alter table entity_documents
      add column if not exists deleted_at timestamptz,
      add column if not exists delete_expires_at timestamptz;
    create index if not exists idx_entity_documents_deleted_at
      on entity_documents(deleted_at) where deleted_at is not null;
  end if;
end $$;

-- 2) Suppression logique d'un enregistrement + ses documents rattachés.
create or replace function trash_soft_delete_entity(p_entity_type text, p_entity_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_expires timestamptz := now() + interval '7 days';
begin
  if p_entity_type not in ('preinscription', 'devis', 'message') then
    raise exception 'Type d''entité inconnu: %', p_entity_type;
  end if;

  if p_entity_type = 'preinscription' and to_regclass('public.preinscriptions') is not null then
    update preinscriptions
       set deleted_at = v_now, delete_expires_at = v_expires, updated_at = v_now
     where id::text = p_entity_id and deleted_at is null;
  elsif p_entity_type = 'devis' and to_regclass('public.devis_requests') is not null then
    update devis_requests
       set deleted_at = v_now, delete_expires_at = v_expires, updated_at = v_now
     where id::text = p_entity_id and deleted_at is null;
  elsif p_entity_type = 'message' and to_regclass('public.contact_messages') is not null then
    update contact_messages
       set deleted_at = v_now, delete_expires_at = v_expires, updated_at = v_now
     where id::text = p_entity_id and deleted_at is null;
  end if;

  if to_regclass('public.entity_documents') is not null then
    update entity_documents
       set deleted_at = v_now, delete_expires_at = v_expires
     where entity_type = p_entity_type and entity_id = p_entity_id and deleted_at is null;
  end if;
end;
$$;

-- 3) Restauration : annule la suppression logique sur l'enregistrement + ses documents.
create or replace function trash_restore_entity(p_entity_type text, p_entity_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
begin
  if p_entity_type not in ('preinscription', 'devis', 'message') then
    raise exception 'Type d''entité inconnu: %', p_entity_type;
  end if;

  if p_entity_type = 'preinscription' and to_regclass('public.preinscriptions') is not null then
    update preinscriptions
       set deleted_at = null, delete_expires_at = null, updated_at = v_now
     where id::text = p_entity_id and deleted_at is not null;
  elsif p_entity_type = 'devis' and to_regclass('public.devis_requests') is not null then
    update devis_requests
       set deleted_at = null, delete_expires_at = null, updated_at = v_now
     where id::text = p_entity_id and deleted_at is not null;
  elsif p_entity_type = 'message' and to_regclass('public.contact_messages') is not null then
    update contact_messages
       set deleted_at = null, delete_expires_at = null, updated_at = v_now
     where id::text = p_entity_id and deleted_at is not null;
  end if;

  if to_regclass('public.entity_documents') is not null then
    update entity_documents
       set deleted_at = null, delete_expires_at = null
     where entity_type = p_entity_type and entity_id = p_entity_id and deleted_at is not null;
  end if;
end;
$$;

-- 4) Suppression définitive : ne touche QUE les enregistrements déjà en corbeille.
-- Supprime les documents rattachés (aucun orphelin) si la table existe, et
-- retourne leurs storage_path pour que l'application nettoie le bucket.
create or replace function trash_purge_entity(p_entity_type text, p_entity_id text)
returns setof text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer := 0;
begin
  if p_entity_type not in ('preinscription', 'devis', 'message') then
    raise exception 'Type d''entité inconnu: %', p_entity_type;
  end if;

  if p_entity_type = 'preinscription' and to_regclass('public.preinscriptions') is not null then
    delete from preinscriptions where id::text = p_entity_id and deleted_at is not null;
    get diagnostics v_deleted = row_count;
  elsif p_entity_type = 'devis' and to_regclass('public.devis_requests') is not null then
    delete from devis_requests where id::text = p_entity_id and deleted_at is not null;
    get diagnostics v_deleted = row_count;
  elsif p_entity_type = 'message' and to_regclass('public.contact_messages') is not null then
    delete from contact_messages where id::text = p_entity_id and deleted_at is not null;
    get diagnostics v_deleted = row_count;
  end if;

  -- L'enregistrement n'était pas en corbeille (ou table absente) : on ne purge
  -- pas ses documents.
  if v_deleted > 0 and to_regclass('public.entity_documents') is not null then
    return query
      with purged as (
        delete from entity_documents d
         where d.entity_type = p_entity_type and d.entity_id = p_entity_id
         returning d.storage_path
      )
      select purged.storage_path from purged;
  end if;

  return;
end;
$$;

-- 5) Fonctions réservées au serveur (service role) — jamais exposées au client.
revoke execute on function trash_soft_delete_entity(text, text) from public, anon, authenticated;
revoke execute on function trash_restore_entity(text, text) from public, anon, authenticated;
revoke execute on function trash_purge_entity(text, text) from public, anon, authenticated;
