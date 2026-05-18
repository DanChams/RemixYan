-- ============================================================
-- Schéma Supabase — Portfolio Projet Conception
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Table projects
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null,
  status      text not null default 'En cours',
  description text not null default '',
  image_url   text not null default '',
  three_d_url text,
  pdf_url     text,
  client      text not null default '',
  date        text not null default '',
  role        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. Sécurité par lignes (RLS)
alter table public.projects enable row level security;

-- Lecture publique (visiteurs du portfolio)
create policy "Lecture publique"
  on public.projects for select
  using (true);

-- Écriture réservée aux utilisateurs connectés (admin)
create policy "Insertion admin"
  on public.projects for insert
  with check (auth.role() = 'authenticated');

create policy "Modification admin"
  on public.projects for update
  using (auth.role() = 'authenticated');

create policy "Suppression admin"
  on public.projects for delete
  using (auth.role() = 'authenticated');

-- 3. Realtime : activer les changements en temps réel
alter publication supabase_realtime add table public.projects;

-- 4. (Optionnel) Données initiales de démonstration
insert into public.projects (title, category, status, description, image_url, pdf_url, client, date, role)
values
  (
    'Morockin Liner',
    'Maquillage',
    'Terminé',
    'Conception graphique du packaging et rendus 3D photoréalistes pour la marque Yan+One.',
    'https://VOTRE_BUCKET.supabase.co/storage/v1/object/public/images/liner_product.png',
    'https://indd.adobe.com/view/placeholder-link',
    'Yan+One',
    '2024',
    'Lead Designer'
  ),
  (
    'Essence de Luxe',
    'Parfum',
    'Revu',
    'Une identité visuelle premium pour un parfum exclusif, mettant l''accent sur le minimalisme et la pureté.',
    'https://VOTRE_BUCKET.supabase.co/storage/v1/object/public/images/perfume_bottle.png',
    null,
    'Boutique Fragrance',
    '2023',
    'Visual Identity'
  );
