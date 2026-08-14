import { getInvoices } from "./invoices";
import { DashboardStats, MonthlyData } from "@/types";

export async function getDashboardStats(companyId: string): Promise<DashboardStats> {
  const invoices = await getInvoices(companyId);
  const now = new Date();

  let totalAmount = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  let brouillon = 0;
  let envoyee = 0;
  let payee = 0;
  let enRetard = 0;
  let annulee = 0;

  // Initialisation des 6 derniers mois pour les graphiques
  const monthsMap: Record<string, { facture: number; paye: number }> = {};
  const monthLabels: string[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    monthsMap[key] = { facture: 0, paye: 0 };
    monthLabels.push(key);
  }

  invoices.forEach((inv) => {
    totalAmount += inv.total;

    // Paiements enregistrés
    const invoicePayments = (inv.payments || []).reduce((sum, p) => sum + p.amount, 0);

    // Calcul du statut réel (retard si échéance dépassée)
    const isOverdue = inv.status !== "payee" && inv.status !== "annulee" && new Date(inv.dueDate) < now;

    if (inv.status === "brouillon") brouillon++;
    else if (inv.status === "payee") payee++;
    else if (inv.status === "annulee") annulee++;
    else if (isOverdue || inv.status === "en_retard") enRetard++;
    else envoyee++;

    if (inv.status === "payee") {
      totalPaid += inv.total;
    } else {
      totalPaid += invoicePayments;
      const pendingForInvoice = Math.max(0, inv.total - invoicePayments);
      totalPending += pendingForInvoice;
      if (isOverdue || inv.status === "en_retard") {
        totalOverdue += pendingForInvoice;
      }
    }

    // Association par mois d'émission
    const issueDate = new Date(inv.issueDate);
    const key = issueDate.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    if (monthsMap[key]) {
      monthsMap[key].facture += inv.total;
      monthsMap[key].paye += inv.status === "payee" ? inv.total : invoicePayments;
    }
  });

  const monthlyRevenue: MonthlyData[] = monthLabels.map((key) => ({
    month: key,
    facture: Math.round(monthsMap[key].facture),
    paye: Math.round(monthsMap[key].paye),
  }));

  return {
    totalInvoices: invoices.length,
    totalAmount: Math.round(totalAmount),
    totalPaid: Math.round(totalPaid),
    totalPending: Math.round(totalPending),
    totalOverdue: Math.round(totalOverdue),
    brouillon,
    envoyee,
    payee,
    enRetard,
    annulee,
    monthlyRevenue,
  };
}
