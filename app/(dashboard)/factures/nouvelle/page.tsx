"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronLeft,
  Save,
  Send,
  Eye,
  Calculator,
  User,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";
import { formatCFA, today, addDays } from "@/lib/utils";
import type { Client, Company, InvoiceItemDraft, InvoiceStatus } from "@/types";
import { getCompany } from "@/lib/services/company";
import { getClients } from "@/lib/services/clients";
import { createInvoice } from "@/lib/services/invoices";

function createItem(): InvoiceItemDraft {
  return {
    id: Math.random().toString(36).slice(2),
    description: "",
    quantity: 1,
    unitPrice: 0,
    total: 0,
    position: 0,
  };
}

export default function NouvelleFacturePage() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [clientId, setClientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("AUTO");
  const [issueDate, setIssueDate] = useState(today());
  const [dueDate, setDueDate] = useState(addDays(30));
  const [tvaRate, setTvaRate] = useState(18);
  const [items, setItems] = useState<InvoiceItemDraft[]>([createItem()]);
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [activeTab, setActiveTab] = useState<"formulaire" | "apercu">("formulaire");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const comp = await getCompany();
        if (comp) {
          setCompany(comp);
          setTvaRate(comp.tvaRate ?? 18);
          setPaymentTerms(comp.paymentTerms || "");
          const clientData = await getClients(comp.id);
          setClients(clientData);
        }
      } catch (err) {
        console.error("Erreur chargement formulaire facture:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const selectedClient = clients.find((c) => c.id === clientId);

  // Calculs
  const subtotal = Math.round(items.reduce((sum, it) => sum + Number(it.quantity) * Number(it.unitPrice), 0));
  const tvaAmount = Math.round((subtotal * tvaRate) / 100);
  const total = subtotal + tvaAmount;

  const handleSave = async (status: InvoiceStatus) => {
    if (!company) return;
    if (!clientId) {
      alert("Veuillez sélectionner un client.");
      return;
    }
    if (items.length === 0 || !items.some(i => i.description.trim() !== "")) {
      alert("Veuillez saisir au moins une ligne de prestation.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createInvoice(company.id, {
        clientId,
        invoiceNumber,
        issueDate,
        dueDate,
        tvaRate,
        items,
        notes,
        paymentTerms,
      });

      console.log("Statut d'enregistrement:", status);
      router.push("/factures");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création de la facture.";
      console.error("Erreur enregistrement facture:", err);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItem = useCallback(
    (id: string, field: keyof InvoiceItemDraft, value: string | number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, [field]: value };
          updated.total = Math.round(Number(updated.quantity) * Number(updated.unitPrice));
          return updated;
        })
      );
    },
    []
  );

  const addItem = () => {
    setItems((prev) => [...prev, { ...createItem(), position: prev.length }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/factures" className="btn-icon" aria-label="Retour">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="page-title">Nouvelle facture</h1>
          <p className="page-subtitle">Remplissez les informations ci-dessous</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === "formulaire" ? "apercu" : "formulaire")}
            className="btn-secondary text-sm"
          >
            <Eye className="h-4 w-4" />
            {activeTab === "formulaire" ? "Aperçu" : "Formulaire"}
          </button>
          <button
            onClick={() => handleSave("brouillon")}
            disabled={isSubmitting}
            className="btn-secondary text-sm"
          >
            <Save className="h-4 w-4" />
            Brouillon
          </button>
          <button
            onClick={() => handleSave("envoyee")}
            disabled={isSubmitting}
            className="btn-primary text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Enregistrement..." : "Créer la facture"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Main Form — 2/3 */}
        <div className="space-y-5 xl:col-span-2">

          {/* Informations générales */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <FileText className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Informations générales</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group sm:col-span-2">
                <label htmlFor="client" className="label label-required">Client</label>
                <select
                  id="client"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="select"
                >
                  <option value="">Sélectionner un client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {selectedClient && (
                  <div className="mt-2 rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2 text-sm text-indigo-900">
                    <p className="font-semibold">{selectedClient.name}</p>
                    <p className="text-indigo-600 text-xs">{selectedClient.address ? `${selectedClient.address}, ` : ""}{selectedClient.city} · {selectedClient.email || selectedClient.phone}</p>
                  </div>
                )}
                <p className="form-hint mt-1 text-xs text-gray-400">
                  Client introuvable ?{" "}
                  <Link href="/clients" className="text-indigo-600 font-medium">
                    Ajouter un client dans l&apos;annuaire
                  </Link>
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="invoice-number" className="label label-required">N° Facture</label>
                <input
                  id="invoice-number"
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Généré automatiquement (AUTO)"
                  className="input font-mono"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tva-rate" className="label">Taux TVA (%)</label>
                <input
                  id="tva-rate"
                  type="number"
                  min={0}
                  max={100}
                  value={tvaRate}
                  onChange={(e) => setTvaRate(Number(e.target.value))}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="issue-date" className="label label-required">
                  <Calendar className="h-3.5 w-3.5 inline mr-1" />
                  Date d&apos;émission
                </label>
                <input
                  id="issue-date"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="due-date" className="label label-required">
                  <Calendar className="h-3.5 w-3.5 inline mr-1" />
                  Date d&apos;échéance
                </label>
                <input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input"
                  min={issueDate}
                />
              </div>
            </div>
          </div>

          {/* Lignes de facture */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Lignes de facture</h2>
              <span className="text-xs font-semibold text-gray-400">{items.length} ligne(s)</span>
            </div>
            <div className="space-y-3">
              {/* Headers */}
              <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-1 border-b border-gray-100">
                <div className="col-span-1" />
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Qté</div>
                <div className="col-span-2 text-right">Prix unit. (FCFA)</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Lines */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 items-center rounded-xl border border-gray-200/80 bg-gray-50/50 px-2 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 flex items-center justify-center text-gray-300">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Description du service ou produit…"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="input text-sm"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                      className="input text-sm text-center"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="input text-sm text-right"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2">
                    <span className="font-semibold text-gray-900 text-sm font-mono text-right">
                      {formatCFA(item.quantity * item.unitPrice)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-1 text-gray-300 hover:text-rose-600 disabled:opacity-20 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
              >
                <Plus className="h-4 w-4" />
                Ajouter une ligne
              </button>
            </div>
          </div>

          {/* Notes & Conditions */}
          <div className="card p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Notes & Conditions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group">
                <label htmlFor="notes" className="label">Notes explicatives</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Note visible au bas de la facture…"
                  className="input resize-none"
                />
              </div>
              <div className="form-group">
                <label htmlFor="payment-terms" className="label">Conditions de paiement</label>
                <textarea
                  id="payment-terms"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  rows={3}
                  placeholder="Paiement par Wave, Orange Money ou Virement bancaire…"
                  className="input resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Résumé */}
        <div className="space-y-5">

          {/* Entreprise */}
          <div className="card p-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 pb-2 border-b border-gray-100">
              <User className="h-4 w-4" />
              <h2 className="text-sm font-semibold text-gray-900">Émetteur (Votre entreprise)</h2>
            </div>
            <p className="text-sm font-bold text-gray-900">{company?.name || "Votre entreprise"}</p>
            <p className="text-xs text-gray-500">{company?.address || "Adresse non configurée"}</p>
            <p className="text-xs text-gray-500">{company?.city ? `${company.city}, ` : ""}{company?.country || "Sénégal"}</p>
            <p className="text-xs text-gray-500">{company?.phone} · {company?.email}</p>
            <Link href="/parametres" className="text-xs text-indigo-600 font-semibold hover:underline block pt-1">
              Modifier mes paramètres →
            </Link>
          </div>

          {/* Récapitulatif */}
          <div className="card p-5 sticky top-[80px] space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 pb-2 border-b border-gray-100">
              <Calculator className="h-4 w-4" />
              <h2 className="text-sm font-semibold text-gray-900">Récapitulatif Financier</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sous-total HT</span>
                <span className="font-medium text-gray-900 font-mono">{formatCFA(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TVA ({tvaRate}%)</span>
                <span className="font-medium text-gray-900 font-mono">{formatCFA(tvaAmount)}</span>
              </div>
              <div className="border-t border-gray-100 my-2 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Net FCFA</span>
                <span className="font-extrabold text-xl text-indigo-600 font-mono">{formatCFA(total)}</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSave("envoyee")}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Enregistrement..." : "Créer la facture"}
              </button>
              <button
                onClick={() => handleSave("brouillon")}
                disabled={isSubmitting}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Sauvegarder en brouillon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
