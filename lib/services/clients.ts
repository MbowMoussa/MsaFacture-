import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Client, ClientFormData } from "@/types";

export async function getClients(companyId: string): Promise<Client[]> {
  const supabase = createSupabaseClient();

  const { data: clientsData, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (clientsError) {
    console.error("Erreur lors de la récupération des clients:", clientsError);
    throw new Error(clientsError.message);
  }

  // Récupération des factures pour calculer les métriques par client
  const { data: invoicesData } = await supabase
    .from("invoices")
    .select("id, client_id, total, status")
    .eq("company_id", companyId);

  // Récupération des paiements pour le calcul du payé
  const invoiceIds = (invoicesData || []).map((i) => i.id);
  const paymentsMap: Record<string, number> = {};

  if (invoiceIds.length > 0) {
    const { data: paymentsData } = await supabase
      .from("payments")
      .select("invoice_id, amount")
      .in("invoice_id", invoiceIds);

    (paymentsData || []).forEach((p) => {
      paymentsMap[p.invoice_id] = (paymentsMap[p.invoice_id] || 0) + Number(p.amount);
    });
  }

  return (clientsData || []).map((c) => {
    const clientInvoices = (invoicesData || []).filter((i) => i.client_id === c.id);
    const invoiceCount = clientInvoices.length;
    
    let totalInvoiced = 0;
    let totalPaid = 0;

    clientInvoices.forEach((inv) => {
      totalInvoiced += Number(inv.total);
      if (inv.status === "payee") {
        totalPaid += Number(inv.total);
      } else {
        totalPaid += paymentsMap[inv.id] || 0;
      }
    });

    const totalPending = Math.max(0, totalInvoiced - totalPaid);

    return {
      id: c.id,
      companyId: c.company_id,
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
      address: c.address || "",
      city: c.city || "",
      country: c.country || "Sénégal",
      notes: c.notes || "",
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      totalInvoiced: Math.round(totalInvoiced),
      totalPaid: Math.round(totalPaid),
      totalPending: Math.round(totalPending),
      invoiceCount,
    };
  });
}

export async function getClientById(clientId: string): Promise<Client | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    companyId: data.company_id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    city: data.city || "",
    country: data.country || "Sénégal",
    notes: data.notes || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createClient(companyId: string, formData: ClientFormData): Promise<Client> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .insert({
      company_id: companyId,
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      city: formData.city || null,
      country: formData.country || "Sénégal",
      notes: formData.notes || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Erreur lors de la création du client:", error);
    throw new Error(error?.message || "Impossible de créer le client");
  }

  return {
    id: data.id,
    companyId: data.company_id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    city: data.city || "",
    country: data.country || "Sénégal",
    notes: data.notes || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    totalInvoiced: 0,
    totalPaid: 0,
    totalPending: 0,
    invoiceCount: 0,
  };
}

export async function updateClient(clientId: string, formData: Partial<ClientFormData>): Promise<Client> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .update({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      city: formData.city || null,
      country: formData.country || "Sénégal",
      notes: formData.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId)
    .select("*")
    .single();

  if (error || !data) {
    console.error("Erreur mise à jour client:", error);
    throw new Error(error?.message || "Erreur mise à jour client");
  }

  return {
    id: data.id,
    companyId: data.company_id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    city: data.city || "",
    country: data.country || "Sénégal",
    notes: data.notes || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteClient(clientId: string): Promise<void> {
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId);

  if (error) {
    console.error("Erreur lors de la suppression du client:", error);
    throw new Error(error.message);
  }
}
