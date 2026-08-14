import { Invoice, Client, Company } from "@/types";

/**
 * Exporte une liste de factures au format CSV
 */
export function exportInvoicesToCSV(invoices: Invoice[], filename = "factures_msafacture.csv") {
  const headers = [
    "Numero",
    "Client",
    "Email Client",
    "Date Emission",
    "Date Echeance",
    "Statut",
    "Sous-total",
    "TVA (18%)",
    "Total (FCFA)",
  ];

  const rows = invoices.map((inv) => [
    inv.invoiceNumber,
    `"${inv.client?.name || "Client inconnu"}"`,
    `"${inv.client?.email || ""}"`,
    inv.issueDate,
    inv.dueDate,
    inv.status,
    inv.subtotal,
    inv.tvaAmount,
    inv.total,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportInvoicesCSV = exportInvoicesToCSV;

/**
 * Exporte une liste de clients au format CSV
 */
export function exportClientsToCSV(clients: Client[], filename = "clients_msafacture.csv") {
  const headers = ["Nom", "Email", "Telephone", "Adresse", "Ville", "Pays", "Factures", "Total Dû (FCFA)"];

  const rows = clients.map((c) => [
    `"${c.name}"`,
    `"${c.email || ""}"`,
    `"${c.phone || ""}"`,
    `"${c.address || ""}"`,
    `"${c.city || ""}"`,
    `"${c.country || "Sénégal"}"`,
    c.invoiceCount || 0,
    c.totalPending || 0,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportClientsCSV = exportClientsToCSV;

/**
 * Déclenche l'impression browser / sauvegarde PDF pour une facture
 */
export function printInvoice(targetInvoice?: Invoice, targetCompany?: Company) {
  if (typeof window !== "undefined") {
    if (targetInvoice) console.log("Impression facture:", targetInvoice.invoiceNumber, targetCompany?.name);
    window.print();
  }
}

export function exportInvoicePDF(targetInvoice?: Invoice, targetCompany?: Company) {
  if (typeof window !== "undefined") {
    if (targetInvoice) console.log("Export PDF facture:", targetInvoice.invoiceNumber, targetCompany?.name);
    window.print();
  }
}

export function triggerInvoicePrint() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
