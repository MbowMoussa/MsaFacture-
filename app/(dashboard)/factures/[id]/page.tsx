"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  Clock,
  Printer,
  Trash2,
  RefreshCw,
  Loader2,
  X,
  CreditCard,
} from "lucide-react";
import { formatCFA, formatDate, formatDateFull, daysUntilDue, cn } from "@/lib/utils";
import InvoiceStatusBadge from "@/components/shared/InvoiceStatusBadge";
import type { Invoice, InvoiceStatus, PaymentMethod } from "@/types";
import { PAYMENT_METHOD_LABELS } from "@/types";
import { getCompany } from "@/lib/services/company";
import { getInvoiceById, updateInvoiceStatus, addInvoicePayment, deleteInvoice } from "@/lib/services/invoices";
import { Company } from "@/types";
import { printInvoice, exportInvoicePDF } from "@/lib/exportUtils";

export default function FactureDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modale de paiement
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("orange_money");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const loadInvoice = useCallback(async () => {
    try {
      setIsLoading(true);
      const comp = await getCompany();
      setCompany(comp);
      const data = await getInvoiceById(params.id);
      if (data) {
        setInvoice(data);
        setPaymentAmount(data.total - (data.payments || []).reduce((s, p) => s + p.amount, 0));
      }
    } catch (err) {
      console.error("Erreur chargement facture:", err);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-gray-800">Facture non trouvée</h2>
        <p className="text-sm text-gray-500 mt-1">La facture demandée n&apos;existe pas ou a été supprimée.</p>
        <Link href="/factures" className="btn-primary mt-4 inline-flex no-underline text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl">
          Retour aux factures
        </Link>
      </div>
    );
  }

  const days = daysUntilDue(invoice.dueDate);

  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.invoiceNumber} ?`)) {
      try {
        await deleteInvoice(invoice.id);
        router.push("/factures");
      } catch (err) {
        console.error("Erreur suppression:", err);
      }
    }
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    try {
      await updateInvoiceStatus(invoice.id, newStatus);
      await loadInvoice();
    } catch (err) {
      console.error("Erreur changement statut:", err);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingPayment(true);
      await addInvoicePayment(invoice.id, {
        amount: Number(paymentAmount),
        paidAt: new Date().toISOString().split("T")[0],
        method: paymentMethod,
        reference: paymentRef,
        notes: paymentNotes,
      });
      setIsPaymentModalOpen(false);
      setPaymentRef("");
      setPaymentNotes("");
      await loadInvoice();
    } catch (err) {
      console.error("Erreur enregistrement paiement:", err);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/factures" className="btn-icon" aria-label="Retour">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title font-mono">{invoice.invoiceNumber}</h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="page-subtitle">
              {invoice.client?.name || "Client inconnu"} · Émise le {formatDate(invoice.issueDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700">
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Statut :</span>
            <select
              value={invoice.status}
              onChange={(e) => handleStatusChange(e.target.value as InvoiceStatus)}
              className="bg-transparent border-none text-xs font-bold text-indigo-600 focus:ring-0 cursor-pointer pr-1"
            >
              <option value="brouillon">Brouillon</option>
              <option value="envoyee">Envoyée</option>
              <option value="payee">Payée</option>
              <option value="en_retard">En retard</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>

          <button onClick={() => printInvoice(invoice, company || undefined)} className="btn-secondary text-xs py-1.5 px-3 h-8 gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            Imprimer
          </button>
          <button onClick={() => exportInvoicePDF(invoice, company || undefined)} className="btn-secondary text-xs py-1.5 px-3 h-8 gap-1.5">
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
          <button
            onClick={handleDelete}
            className="btn-secondary text-xs py-1.5 px-3 h-8 gap-1.5 text-rose-600 hover:bg-rose-50 border-rose-200"
            title="Supprimer la facture"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {invoice.status === "en_retard" && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-semibold">
              Cette facture est en retard de {Math.abs(days)} jours.
            </span>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="btn-sm bg-rose-600 text-white hover:bg-rose-700 text-xs px-3 py-1.5 rounded-lg font-semibold"
          >
            Enregistrer le paiement
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Facture Preview — 2/3 */}
        <div className="card lg:col-span-2 p-8 space-y-6">
          {/* Invoice Header */}
          <div className="flex items-start justify-between pb-6 border-b border-gray-100">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-base mb-3">
                {company?.name?.charAt(0) || "M"}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{company?.name || "Votre entreprise"}</h2>
              <p className="text-xs text-gray-500 mt-1">{company?.address}</p>
              <p className="text-xs text-gray-500">{company?.city ? `${company.city}, ` : ""}{company?.country || "Sénégal"}</p>
              <p className="text-xs text-gray-500">{company?.phone} · {company?.email}</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-gray-300 tracking-tight">FACTURE</h1>
              <p className="text-xl font-bold text-gray-900 mt-1 font-mono">{invoice.invoiceNumber}</p>
              <div className="mt-2 flex justify-end">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
          </div>

          {/* Dates + Client */}
          <div className="grid grid-cols-2 gap-8 py-2">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Facturé à</p>
              <h3 className="font-bold text-gray-900 text-base">{invoice.client?.name || "Client inconnu"}</h3>
              {invoice.client?.address && <p className="text-xs text-gray-600">{invoice.client.address}</p>}
              {invoice.client?.city && <p className="text-xs text-gray-600">{invoice.client.city}, {invoice.client.country}</p>}
              {invoice.client?.email && <p className="text-xs text-gray-600">{invoice.client.email}</p>}
              {invoice.client?.phone && <p className="text-xs text-gray-600">{invoice.client.phone}</p>}
            </div>
            <div className="text-right space-y-2">
              <div>
                <p className="text-xs text-gray-400 font-semibold">Date d&apos;émission</p>
                <p className="text-xs font-bold text-gray-800">{formatDateFull(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold">Date d&apos;échéance</p>
                <p className={cn(
                  "text-xs font-bold",
                  invoice.status === "en_retard" ? "text-rose-600" : "text-gray-800"
                )}>
                  {formatDateFull(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-8">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Qté</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Prix unit.</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-xs text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3 text-xs text-gray-900 font-semibold">{item.description}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 text-right font-mono">{formatCFA(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-900 text-right font-mono">{formatCFA(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-gray-100">
            <div className="ml-auto max-w-xs space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Sous-total HT</span>
                <span className="font-semibold text-gray-800 font-mono">{formatCFA(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TVA ({invoice.tvaRate}%)</span>
                <span className="font-semibold text-gray-800 font-mono">{formatCFA(invoice.tvaAmount)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-extrabold text-gray-900 text-sm">Total TTC FCFA</span>
                <span className="font-black text-xl text-indigo-600 font-mono">{formatCFA(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(invoice.notes || invoice.paymentTerms) && (
            <div className="border-t border-gray-100 pt-4 space-y-3 text-xs">
              {invoice.notes && (
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}
              {invoice.paymentTerms && (
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider mb-1">Conditions de paiement</p>
                  <p className="text-gray-600">{invoice.paymentTerms}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Action Paiement */}
          <div className="card p-4 space-y-3">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Paiement</h2>
            {invoice.status === "payee" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-xs font-bold text-emerald-800">Facture intégralement réglée</p>
              </div>
            ) : (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <CreditCard className="h-4 w-4" />
                Enregistrer un paiement
              </button>
            )}
          </div>

          {/* Details & Historique */}
          <div className="card p-4 space-y-3">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Paiements enregistrés</h2>
            {(!invoice.payments || invoice.payments.length === 0) ? (
              <p className="text-xs text-gray-400 text-center py-2">Aucun paiement enregistré</p>
            ) : (
              <div className="space-y-2">
                {invoice.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{PAYMENT_METHOD_LABELS[p.method] || p.method}</p>
                      <p className="text-[10px] text-gray-400">{formatDate(p.paidAt)} {p.reference ? `· ${p.reference}` : ""}</p>
                    </div>
                    <span className="font-bold text-emerald-700 font-mono">
                      +{formatCFA(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modale d'enregistrement de paiement */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Enregistrer un paiement</h2>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Montant (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={invoice.total}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="input font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Moyen de paiement *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="select"
                >
                  <option value="orange_money">Orange Money</option>
                  <option value="wave">Wave</option>
                  <option value="mtn_momo">MTN MoMo</option>
                  <option value="especes">Espèces</option>
                  <option value="virement">Virement bancaire</option>
                  <option value="cheque">Chèque</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Référence / N° transaction</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="Ex: TX-9847293"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes complémentaires…"
                  className="input resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold rounded-xl"
                >
                  {isSubmittingPayment ? "Enregistrement..." : "Valider le paiement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
