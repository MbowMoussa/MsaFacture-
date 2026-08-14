"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Pencil,
  Plus,
  ReceiptText,
  TrendingUp,
  Clock,
  MessageSquare,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { MOCK_CLIENTS, MOCK_INVOICES } from "@/lib/mock-data";
import { formatCFA, formatDate, getInitials, getAvatarColor } from "@/lib/utils";
import InvoiceStatusBadge from "@/components/shared/InvoiceStatusBadge";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const rawClient = MOCK_CLIENTS.find((c) => c.id === params.id);
  if (!rawClient) notFound();

  const [client, setClient] = useState(rawClient);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: rawClient.name,
    email: rawClient.email || "",
    phone: rawClient.phone || "",
    address: rawClient.address || "",
    city: rawClient.city || "",
    country: rawClient.country || "Sénégal",
  });

  const invoices = MOCK_INVOICES.filter((i) => i.clientId === client.id);
  const paidRate = client.totalInvoiced
    ? Math.round(((client.totalPaid ?? 0) / client.totalInvoiced) * 100)
    : 0;

  const handleDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.name}" ?`)) {
      alert(`Le client "${client.name}" a été supprimé.`);
      router.push("/clients");
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setClient((prev) => ({ ...prev, ...editForm }));
    setIsEditing(false);
    alert("Informations du client mises à jour avec succès !");
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/clients" className="btn-icon">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold ${getAvatarColor(client.name)}`}>
              {getInitials(client.name)}
            </div>
            <div>
              <h1 className="page-title">{client.name}</h1>
              <p className="page-subtitle">{client.city}, {client.country}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/factures/nouvelle?clientId=${client.id}`}
            className="btn-secondary text-xs py-1.5 px-3 h-8 no-underline gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvelle facture
          </Link>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary text-xs py-1.5 px-3 h-8 gap-1.5"
            title="Modifier le client"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="btn-secondary text-xs py-1.5 px-3 h-8 gap-1.5 text-rose-600 hover:bg-rose-50 border-rose-200"
            title="Supprimer le client"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Modifier le client</h2>
              <button onClick={() => setIsEditing(false)} className="btn-icon">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="label label-required">Nom / Raison sociale</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Adresse</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Ville</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Pays</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary text-sm">
                  Annuler
                </button>
                <button type="submit" className="btn-primary text-sm gap-1.5">
                  <Save className="h-4 w-4" />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Left — Infos */}
        <div className="space-y-4">
          {/* Coordonnées */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-gray-900">Coordonnées</h2>
            </div>
            <div className="card-body space-y-3">
              {client.email && (
                <a href={`mailto:${client.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 no-underline transition-colors">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gray-300" />
                  {client.email}
                </a>
              )}
              {client.phone && (
                <a href={`tel:${client.phone}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 no-underline transition-colors">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-300" />
                  {client.phone}
                </a>
              )}
              {client.address && (
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-gray-300 mt-0.5" />
                  <span>{client.address}, {client.city}, {client.country}</span>
                </div>
              )}
              {client.notes && (
                <div className="flex items-start gap-2.5 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-300 mt-0.5" />
                  <span className="italic">{client.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats financières */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-gray-900">Résumé financier</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                  <ReceiptText className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total facturé</p>
                  <p className="text-sm font-semibold text-gray-900 font-mono">{formatCFA(client.totalInvoiced ?? 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50">
                  <TrendingUp className="h-4 w-4 text-success-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Encaissé</p>
                  <p className="text-sm font-semibold text-success-700 font-mono">{formatCFA(client.totalPaid ?? 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-50">
                  <Clock className="h-4 w-4 text-warning-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">En attente</p>
                  <p className="text-sm font-semibold text-warning-700 font-mono">{formatCFA(client.totalPending ?? 0)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Taux de recouvrement</span>
                  <span className="font-semibold text-gray-700">{paidRate}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success-500 transition-all duration-500"
                    style={{ width: `${paidRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Membre depuis */}
          <div className="card p-4">
            <p className="text-xs text-gray-400">Client depuis</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(client.createdAt)}</p>
          </div>
        </div>

        {/* Right — Factures */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Factures ({invoices.length})
              </h2>
              <Link
                href={`/factures/nouvelle?clientId=${client.id}`}
                className="btn-sm btn-primary no-underline text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Nouvelle facture
              </Link>
            </div>

            {invoices.length === 0 ? (
              <div className="empty-state">
                <FileText className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">Aucune facture pour ce client</p>
                <Link href={`/factures/nouvelle?clientId=${client.id}`} className="btn-primary text-sm mt-4 no-underline">
                  Créer la première facture
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>N° Facture</th>
                      <th>Date</th>
                      <th>Échéance</th>
                      <th>Statut</th>
                      <th className="text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices
                      .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
                      .map((invoice) => (
                        <tr key={invoice.id}>
                          <td>
                            <Link
                              href={`/factures/${invoice.id}`}
                              className="font-semibold text-gray-900 hover:text-primary-600 no-underline transition-colors"
                            >
                              {invoice.invoiceNumber}
                            </Link>
                          </td>
                          <td className="text-gray-500 text-sm">{formatDate(invoice.issueDate)}</td>
                          <td className="text-gray-500 text-sm">{formatDate(invoice.dueDate)}</td>
                          <td><InvoiceStatusBadge status={invoice.status} size="sm" /></td>
                          <td className="text-right font-semibold text-gray-900 font-mono text-sm">
                            {formatCFA(invoice.total)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
