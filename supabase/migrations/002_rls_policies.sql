-- ============================================================
-- MsaFacture — Politiques Row Level Security (RLS Multi-Tenant)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Lecture/Ecriture uniquement sur son propre profil
CREATE POLICY "Utilisateurs accedent a leur profil" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- 2. Companies: Acces uniquement a son entreprise
CREATE POLICY "Acces entreprise utilisateur" ON public.companies
  FOR ALL USING (auth.uid() = user_id);

-- 3. Clients: Acces via l'entreprise du profil authentifie
CREATE POLICY "Acces clients entreprise" ON public.clients
  FOR ALL USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );

-- 4. Invoices: Acces via l'entreprise du profil authentifie
CREATE POLICY "Acces factures entreprise" ON public.invoices
  FOR ALL USING (
    company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  );

-- 5. Invoice Items: Acces via les factures de l'entreprise
CREATE POLICY "Acces lignes de facture" ON public.invoice_items
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE company_id IN (
        SELECT id FROM public.companies WHERE user_id = auth.uid()
      )
    )
  );

-- 6. Payments: Acces via les factures de l'entreprise
CREATE POLICY "Acces paiements" ON public.payments
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE company_id IN (
        SELECT id FROM public.companies WHERE user_id = auth.uid()
      )
    )
  );
