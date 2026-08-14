"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Calendar,
  Save,
  User,
  Hash,
} from "lucide-react";
import { MOCK_INVOICES, MOCK_CLIENTS } from "@/lib/mock-data";
import { formatCFA } from "@/lib/utils";
import { InvoiceItem } from "@/types";

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;

  const invoice = MOCK_INVOICES.find((i) => i.id === invoiceId) || MOCK_INVOICES[0];

  const [clientId, setClientId] = useState(invoice.clientId);
  const [invoiceNumber, setInvoiceNumber] = useState(invoice.invoiceNumber);
  const [issueDate, setIssueDate] = useState(invoice.issueDate);
  const [dueDate, setDueDate] = useState(invoice.dueDate);
  const [notes, setNotes] = useState(invoice.notes || "");
  const [items, setItems] = useState<InvoiceItem[]>(invoice.items || []);

  const tvaRate = invoice.tvaRate || 18;

  const subtotal = items.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0);
  const tvaAmount = (subtotal * tvaRate) / 100;
  const total = subtotal + tvaAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        invoiceId: invoice.id,
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
        position: items.length + 1,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          const q = field === "quantity" ? Number(value) : item.quantity;
          const p = field === "unitPrice" ? Number(value) : item.unitPrice;
          updated.total = q * p;
        }
        return updated;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/factures/${invoice.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/factures/${invoice.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 no-underline mb-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour à la facture
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Modifier la facture {invoice.invoiceNumber}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/factures/${invoice.id}`} className="btn-secondary no-underline">
            Annuler
          </Link>
          <button onClick={handleSubmit} className="btn-primary">
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
                Informations Générales
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">
                    <User className="h-3.5 w-3.5 inline mr-1" />
                    Client
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="input"
                  >
                    {MOCK_CLIENTS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    <Hash className="h-3.5 w-3.5 inline mr-1" />
                    Numéro de facture
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="input font-mono"
                  />
                </div>

                <div>
                  <label className="label">
                    <Calendar className="h-3.5 w-3.5 inline mr-1" />
                    Date d&apos;émission
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    <Calendar className="h-3.5 w-3.5 inline mr-1" />
                    Date d&apos;échéance
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-semibold text-gray-900">Articles / Services</h2>
                <button type="button" onClick={handleAddItem} className="btn-secondary btn-sm gap-1.5">
                  <Plus className="h-4 w-4" />
                  Ajouter une ligne
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center bg-gray-50/50 p-3 rounded-lg border border-gray-200/60">
                    <div className="col-span-12 sm:col-span-6">
                      <label className="text-xs text-gray-500 mb-1 block">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Description du produit ou service"
                        className="input bg-white text-sm"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="text-xs text-gray-500 mb-1 block">Qté</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                        className="input bg-white text-sm"
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <label className="text-xs text-gray-500 mb-1 block">Prix unitaire (FCFA)</label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                        className="input bg-white text-sm"
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-1 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-2 text-gray-400 hover:text-danger-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Récapitulatif FCFA</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total H.T.</span>
                  <span className="font-semibold text-gray-900">{formatCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>TVA (18%)</span>
                  <span className="font-semibold text-gray-900">{formatCFA(tvaAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                  <span>Total T.T.C</span>
                  <span className="text-primary-600">{formatCFA(total)}</span>
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-3">
              <label className="label">Notes / Mention particulière</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Merci pour votre confiance. En cas de retard..."
                className="input"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
