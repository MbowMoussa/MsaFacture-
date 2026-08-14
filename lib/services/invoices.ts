import { createClient } from "@/lib/supabase/client";
import { Invoice, InvoiceFormData, InvoiceStatus, Payment, PaymentMethod } from "@/types";

export async function getInvoices(companyId: string): Promise<Invoice[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      client:clients(*),
      items:invoice_items(*),
      payments:payments(*)
    `)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement des factures:", error);
    throw new Error(error.message);
  }

  return (data || []).map((row) => mapInvoiceFromDb(row));
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      client:clients(*),
      items:invoice_items(*),
      payments:payments(*)
    `)
    .eq("id", invoiceId)
    .single();

  if (error || !data) return null;

  return mapInvoiceFromDb(data);
}

export async function createInvoice(companyId: string, formData: InvoiceFormData): Promise<Invoice> {
  const supabase = createClient();

  // 1. Génération du numéro de facture auto via la fonction SQL
  let invoiceNumber = formData.invoiceNumber;
  if (!invoiceNumber || invoiceNumber === "AUTO") {
    const { data: numData, error: numError } = await supabase.rpc("generate_next_invoice_number", {
      target_company_id: companyId,
    });
    if (!numError && numData) {
      invoiceNumber = numData;
    } else {
      const year = new Date().getFullYear();
      invoiceNumber = `FAC-${year}-${Math.floor(100 + Math.random() * 900)}`;
    }
  }

  // 2. Calcul des montants
  const items = formData.items || [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
  const tvaRate = Number(formData.tvaRate ?? 18);
  const tvaAmount = Math.round((subtotal * tvaRate) / 100);
  const total = Math.round(subtotal + tvaAmount);

  // 3. Insertion de la facture
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      company_id: companyId,
      client_id: formData.clientId,
      invoice_number: invoiceNumber,
      status: "brouillon" as InvoiceStatus,
      issue_date: formData.issueDate,
      due_date: formData.dueDate,
      subtotal: Math.round(subtotal),
      tva_rate: tvaRate,
      tva_amount: tvaAmount,
      total: total,
      notes: formData.notes || null,
      payment_terms: formData.paymentTerms || null,
    })
    .select("*")
    .single();

  if (invoiceError || !invoiceData) {
    console.error("Erreur création facture:", invoiceError);
    throw new Error(invoiceError?.message || "Erreur création facture");
  }

  // 4. Insertion des lignes d'articles
  if (items.length > 0) {
    const itemsToInsert = items.map((item, index) => ({
      invoice_id: invoiceData.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: Math.round(item.quantity * item.unitPrice),
      position: index + 1,
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Erreur insertion articles:", itemsError);
    }
  }

  const createdInvoice = await getInvoiceById(invoiceData.id);
  return createdInvoice!;
}

export async function updateInvoice(invoiceId: string, formData: Partial<InvoiceFormData>): Promise<Invoice> {
  const supabase = createClient();

  const existing = await getInvoiceById(invoiceId);
  if (!existing) throw new Error("Facture non trouvée");

  // 1. Calcul des montants si articles fournis
  let subtotal = existing.subtotal;
  const tvaRate = formData.tvaRate !== undefined ? Number(formData.tvaRate) : existing.tvaRate;
  let tvaAmount = existing.tvaAmount;
  let total = existing.total;

  if (formData.items) {
    subtotal = formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    tvaAmount = Math.round((subtotal * tvaRate) / 100);
    total = Math.round(subtotal + tvaAmount);
  }

  // 2. Mise à jour de la facture
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      client_id: formData.clientId ?? existing.clientId,
      issue_date: formData.issueDate ?? existing.issueDate,
      due_date: formData.dueDate ?? existing.dueDate,
      subtotal: Math.round(subtotal),
      tva_rate: tvaRate,
      tva_amount: tvaAmount,
      total: total,
      notes: formData.notes ?? existing.notes,
      payment_terms: formData.paymentTerms ?? existing.paymentTerms,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId);

  if (updateError) {
    console.error("Erreur mise à jour facture:", updateError);
    throw new Error(updateError.message);
  }

  // 3. Mise à jour des articles si fournis
  if (formData.items) {
    // Suppression des anciens articles
    await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);

    // Insertion des nouveaux articles
    const itemsToInsert = formData.items.map((item, index) => ({
      invoice_id: invoiceId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: Math.round(item.quantity * item.unitPrice),
      position: index + 1,
    }));

    await supabase.from("invoice_items").insert(itemsToInsert);
  }

  const updated = await getInvoiceById(invoiceId);
  return updated!;
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): Promise<void> {
  const supabase = createClient();
  const dbPayload: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "envoyee") {
    dbPayload.sent_at = new Date().toISOString();
  } else if (status === "payee") {
    dbPayload.paid_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("invoices")
    .update(dbPayload)
    .eq("id", invoiceId);

  if (error) {
    console.error("Erreur mise à jour statut facture:", error);
    throw new Error(error.message);
  }
}

export async function addInvoicePayment(
  invoiceId: string,
  paymentData: { amount: number; paidAt: string; method: PaymentMethod; reference?: string; notes?: string }
): Promise<Payment> {
  const supabase = createClient();

  // 1. Insertion du paiement
  const { data, error } = await supabase
    .from("payments")
    .insert({
      invoice_id: invoiceId,
      amount: paymentData.amount,
      paid_at: paymentData.paidAt,
      method: paymentData.method,
      reference: paymentData.reference || null,
      notes: paymentData.notes || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Erreur enregistrement paiement:", error);
    throw new Error(error?.message || "Erreur enregistrement paiement");
  }

  // 2. Vérification si la facture est désormais totalement payée
  const invoice = await getInvoiceById(invoiceId);
  if (invoice) {
    const totalPaid = (invoice.payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
    if (totalPaid >= invoice.total) {
      await updateInvoiceStatus(invoiceId, "payee");
    } else if (invoice.status === "brouillon") {
      await updateInvoiceStatus(invoiceId, "envoyee");
    }
  }

  return {
    id: data.id,
    invoiceId: data.invoice_id,
    amount: Number(data.amount),
    paidAt: data.paid_at,
    method: data.method as PaymentMethod,
    reference: data.reference || "",
    notes: data.notes || "",
    createdAt: data.created_at,
  };
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
  if (error) {
    console.error("Erreur suppression facture:", error);
    throw new Error(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInvoiceFromDb(row: Record<string, any>): Invoice {
  const clientObj = row.client;
  const itemsList = row.items || [];
  const paymentsList = row.payments || [];

  return {
    id: row.id as string,
    companyId: row.company_id as string,
    clientId: row.client_id as string,
    client: clientObj
      ? {
          id: clientObj.id,
          companyId: clientObj.company_id,
          name: clientObj.name,
          email: clientObj.email || "",
          phone: clientObj.phone || "",
          address: clientObj.address || "",
          city: clientObj.city || "",
          country: clientObj.country || "Sénégal",
          notes: clientObj.notes || "",
          createdAt: clientObj.created_at,
          updatedAt: clientObj.updated_at,
        }
      : undefined,
    invoiceNumber: row.invoice_number,
    status: row.status as InvoiceStatus,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    subtotal: Math.round(Number(row.subtotal)),
    tvaRate: Number(row.tva_rate),
    tvaAmount: Math.round(Number(row.tva_amount)),
    total: Math.round(Number(row.total)),
    notes: row.notes || "",
    paymentTerms: row.payment_terms || "",
    sentAt: row.sent_at || undefined,
    paidAt: row.paid_at || undefined,
    items: itemsList
      .sort((a: { position?: number }, b: { position?: number }) => (a.position || 0) - (b.position || 0))
      .map((item: { id: string; invoice_id: string; description: string; quantity: number; unit_price: number; total: number; position?: number }) => ({
        id: item.id,
        invoiceId: item.invoice_id,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Math.round(Number(item.unit_price)),
        total: Math.round(Number(item.total)),
        position: item.position || 1,
      })),
    payments: paymentsList.map((p: { id: string; invoice_id: string; amount: number; paid_at: string; method: string; reference?: string; notes?: string; created_at: string }) => ({
      id: p.id,
      invoiceId: p.invoice_id,
      amount: Math.round(Number(p.amount)),
      paidAt: p.paid_at,
      method: p.method as PaymentMethod,
      reference: p.reference || "",
      notes: p.notes || "",
      createdAt: p.created_at,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
