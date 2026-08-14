import { createClient } from "@/lib/supabase/client";
import { Company } from "@/types";

export async function getCompany(): Promise<Company | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    // 1. S'assurer que le profil existe dans public.profiles (nécessaire pour la clé étrangère de companies)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilisateur",
          email: user.email || "",
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.warn("Avertissement upsert profile:", profileError.message);
    }

    // 2. Récupérer l'entreprise associée
    const { data: companies, error: fetchError } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .limit(1);

    if (!fetchError && companies && companies.length > 0) {
      return mapCompanyFromDb(companies[0]);
    }

    // 3. Si aucune entreprise n'existe, en créer une par défaut
    const { data: newCompany, error: createError } = await supabase
      .from("companies")
      .insert({
        user_id: user.id,
        name: user.user_metadata?.company_name || "Mon Entreprise",
        email: user.email,
        currency: "FCFA",
        tva_rate: 18,
        invoice_prefix: "FAC",
        country: "Sénégal",
      })
      .select("*")
      .single();

    if (createError || !newCompany) {
      console.error("Erreur création entreprise automatique:", createError);
      return null;
    }

    return mapCompanyFromDb(newCompany);
  } catch (err) {
    console.error("Erreur inattendue dans getCompany:", err);
    return null;
  }
}

export async function updateCompany(companyId: string, updates: Partial<Company>): Promise<Company | null> {
  const supabase = createClient();

  const dbPayload: Record<string, string | number | null | undefined> = {};
  if (updates.name !== undefined) dbPayload.name = updates.name;
  if (updates.email !== undefined) dbPayload.email = updates.email;
  if (updates.phone !== undefined) dbPayload.phone = updates.phone;
  if (updates.address !== undefined) dbPayload.address = updates.address;
  if (updates.city !== undefined) dbPayload.city = updates.city;
  if (updates.country !== undefined) dbPayload.country = updates.country;
  if (updates.logoUrl !== undefined) dbPayload.logo_url = updates.logoUrl;
  if (updates.taxNumber !== undefined) dbPayload.tax_number = updates.taxNumber;
  if (updates.tvaRate !== undefined) dbPayload.tva_rate = updates.tvaRate;
  if (updates.currency !== undefined) dbPayload.currency = updates.currency;
  if (updates.invoicePrefix !== undefined) dbPayload.invoice_prefix = updates.invoicePrefix;
  if (updates.paymentTerms !== undefined) dbPayload.payment_terms = updates.paymentTerms;
  if (updates.bankDetails !== undefined) dbPayload.bank_details = updates.bankDetails;
  if (updates.legalMentions !== undefined) dbPayload.legal_mentions = updates.legalMentions;

  const { data, error } = await supabase
    .from("companies")
    .update(dbPayload)
    .eq("id", companyId)
    .select("*")
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    throw new Error(error.message);
  }

  return mapCompanyFromDb(data);
}

export async function uploadCompanyLogo(file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("company-logos")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Erreur upload logo:", uploadError);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("company-logos").getPublicUrl(filePath);
  return data.publicUrl;
}

function mapCompanyFromDb(row: Record<string, unknown>): Company {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    address: (row.address as string) || "",
    city: (row.city as string) || "",
    country: (row.country as string) || "Sénégal",
    phone: (row.phone as string) || "",
    email: (row.email as string) || "",
    logoUrl: (row.logo_url as string) || "",
    taxNumber: (row.tax_number as string) || "",
    tvaRate: Number((row.tva_rate as number) ?? 18),
    currency: (row.currency as string) || "FCFA",
    invoicePrefix: (row.invoice_prefix as string) || "FAC",
    paymentTerms: (row.payment_terms as string) || "",
    bankDetails: (row.bank_details as string) || "",
    legalMentions: (row.legal_mentions as string) || "",
    createdAt: row.created_at as string,
  };
}
