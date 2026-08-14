-- ============================================================
-- MsaFacture — Fonctions SQL Utilitaires (Stats & Numerotation)
-- ============================================================

-- Fonction d'auto-generation de numero de facture incremental
CREATE OR REPLACE FUNCTION generate_next_invoice_number(target_company_id UUID)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  current_year TEXT;
  next_seq INT;
  new_number TEXT;
BEGIN
  SELECT COALESCE(invoice_prefix, 'FAC') INTO prefix FROM public.companies WHERE id = target_company_id;
  current_year := TO_CHAR(NOW(), 'YYYY');

  SELECT COUNT(*) + 1 INTO next_seq
  FROM public.invoices
  WHERE company_id = target_company_id
  AND invoice_number LIKE (prefix || '-' || current_year || '-%');

  new_number := prefix || '-' || current_year || '-' || LPAD(next_seq::TEXT, 3, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
