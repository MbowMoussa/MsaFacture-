"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
} from "lucide-react";
import InvoiceStatusBadge from "@/components/shared/InvoiceStatusBadge";
import { formatCFA, formatDate, cn } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types";
import { INVOICE_STATUS_LABELS } from "@/types";
import { getCompany } from "@/lib/services/company";
import { getInvoices, deleteInvoice } from "@/lib/services/invoices";
import { exportInvoicesCSV } from "@/lib/exportUtils";

const STATUTS: (InvoiceStatus | "tous")[] = [
  "tous", "brouillon", "envoyee", "payee", "en_retard", "annulee",
];

const STATUT_LABELS: Record<InvoiceStatus | "tous", string> = {
  tous:       "Tous les statuts",
  ...INVOICE_STATUS_LABELS,
};

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "tous">("tous");
  const [sortCol, setSortCol] = useState<"invoiceNumber" | "issueDate" | "dueDate" | "total">("issueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadData = async () => {
    try {
      setIsLoading(true);
      const company = await getCompany();
      if (company) {
        const data = await getInvoices(company.id);
        setInvoices(data);
      }
    } catch (err) {
      console.error("Erreur chargement des factures:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    try {
      await deleteInvoice(id);
      await loadData();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const filtered = useMemo(() => {
    return invoices
      .filter((inv) => {
        const matchSearch =
          inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          inv.client?.name.toLowerCase().includes(search.toLowerCase()) ||
          inv.client?.email?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "tous" || inv.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortCol === "total") cmp = a.total - b.total;
        else if (sortCol === "issueDate") cmp = a.issueDate.localeCompare(b.issueDate);
        else if (sortCol === "dueDate") cmp = a.dueDate.localeCompare(b.dueDate);
        else cmp = a.invoiceNumber.localeCompare(b.invoiceNumber);
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [invoices, search, statusFilter, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalAmount = filtered.reduce((s, i) => s + i.total, 0);

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: typeof sortCol }) =>
    sortCol === col
      ? sortDir === "asc"
        ? <ChevronUp className="h-3.5 w-3.5 text-indigo-600" />
        : <ChevronDown className="h-3.5 w-3.5 text-indigo-600" />
      : <ChevronDown className="h-3.5 w-3.5 text-gray-300" />;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Factures</h1>
          <p className="page-subtitle">{invoices.length} factures enregistrées</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportInvoicesCSV(filtered)}
            className="btn-secondary gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </button>
          <Link
            href="/factures/nouvelle"
            className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-2 shadow-sm no-underline"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle facture</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="search-factures"
              type="text"
              placeholder="Rechercher une facture ou un client…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input pl-9"
            />
          </div>

          {/* Status Filter */}
          <select
            id="filter-statut"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as InvoiceStatus | "tous"); setPage(1); }}
            className="select w-auto min-w-[160px]"
          >
            {STATUTS.map((s) => (
              <option key={s} value={s}>{STATUT_LABELS[s]}</option>
            ))}
          </select>

          {/* Results Count */}
          {(search || statusFilter !== "tous") && (
            <span className="text-sm text-gray-500">
              {filtered.length} résultat(s)
            </span>
          )}
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex items-center gap-3 flex-wrap">
        {(["payee", "envoyee", "en_retard", "brouillon"] as InvoiceStatus[]).map((s) => {
          const count = invoices.filter(i => i.status === s).length;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s === statusFilter ? "tous" : s); setPage(1); }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all cursor-pointer",
                statusFilter === s
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <span className="font-bold">{count}</span>
              {INVOICE_STATUS_LABELS[s]}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-gray-500 font-medium">
          Total affiché : <span className="text-gray-900 font-semibold">{formatCFA(totalAmount)}</span>
        </span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {paginated.length === 0 ? (
          <div className="empty-state p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">Aucune facture trouvée</h3>
            <p className="mt-1 text-sm text-gray-400 max-w-xs mx-auto">
              {search ? `Aucun résultat pour "${search}"` : "Créez votre première facture pour commencer."}
            </p>
            {!search && (
              <Link href="/factures/nouvelle" className="btn-primary mt-4 inline-flex no-underline text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl">
                <Plus className="h-4 w-4" /> Créer une facture
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <button
                      onClick={() => toggleSort("invoiceNumber")}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      N° Facture <SortIcon col="invoiceNumber" />
                    </button>
                  </th>
                  <th>Client</th>
                  <th>
                    <button
                      onClick={() => toggleSort("issueDate")}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      Émission <SortIcon col="issueDate" />
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => toggleSort("dueDate")}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      Échéance <SortIcon col="dueDate" />
                    </button>
                  </th>
                  <th>Statut</th>
                  <th>
                    <button
                      onClick={() => toggleSort("total")}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors ml-auto"
                    >
                      Montant <SortIcon col="total" />
                    </button>
                  </th>
                  <th className="w-16 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((invoice) => (
                  <tr key={invoice.id} className="group">
                    <td>
                      <Link
                        href={`/factures/${invoice.id}`}
                        className="font-semibold text-gray-900 hover:text-indigo-600 no-underline transition-colors font-mono"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[170px]">
                          {invoice.client?.name || "Client inconnu"}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[170px]">
                          {invoice.client?.email || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{formatDate(invoice.issueDate)}</td>
                    <td className={cn(
                      "text-sm",
                      invoice.status === "en_retard" ? "text-rose-600 font-medium" : "text-gray-500"
                    )}>
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td><InvoiceStatusBadge status={invoice.status} /></td>
                    <td className="text-right font-semibold text-gray-900 font-mono text-sm">
                      {formatCFA(invoice.total)}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link href={`/factures/${invoice.id}`} className="p-1 text-gray-400 hover:text-indigo-600 rounded" title="Voir">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} sur {filtered.length} factures
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-icon h-8 w-8 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold px-2">Page {page} sur {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-icon h-8 w-8 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
