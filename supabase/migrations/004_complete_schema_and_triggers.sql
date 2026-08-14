-- ============================================================
-- MsaFacture — Migration 004: Champs Entreprise & Trigger Auth
-- ============================================================

-- 1. Ajout des champs manquants sur la table companies
ALTER TABLE public.companies 
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Sénégal',
  ADD COLUMN IF NOT EXISTS payment_terms TEXT,
  ADD COLUMN IF NOT EXISTS bank_details TEXT,
  ADD COLUMN IF NOT EXISTS legal_mentions TEXT;

-- 2. Fonction de gestion d'un nouvel utilisateur inscrit (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
BEGIN
  -- Création du profil
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

  -- Création de l'entreprise par défaut
  INSERT INTO public.companies (
    user_id,
    name,
    email,
    phone,
    currency,
    tva_rate,
    invoice_prefix,
    country
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Mon Entreprise'),
    NEW.email,
    '',
    'FCFA',
    18.00,
    'FAC',
    'Sénégal'
  )
  RETURNING id INTO new_company_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Création du Bucket de stockage pour les logos (si extension storage installée)
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques de stockage pour les logos d'entreprise
CREATE POLICY "Logos publics en lecture" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Logos modifiables par utilisateur authentifié" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'company-logos' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Logos supprimables par utilisateur authentifié" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'company-logos' AND auth.role() = 'authenticated'
  );
