"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ReceiptText,
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Printer,
  FileSpreadsheet,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "@/components/shared/StatsCard";
import InvoiceStatusBadge from "@/components/shared/InvoiceStatusBadge";
import { formatCFA, formatDate } from "@/lib/utils";
import type { Invoice, InvoiceStatus, DashboardStats, Client } from "@/types";
import { getCompany } from "@/lib/services/company";
import { getInvoices } from "@/lib/services/invoices";
import { getClients } from "@/lib/services/clients";
import { getDashboardStats } from "@/lib/services/analytics";
import { exportInvoicesCSV } from "@/lib/exportUtils";

const defaultStats: DashboardStats = {
  totalInvoices: 0,
  totalAmount: 0,
  totalPaid: 0,
  totalPending: 0,
  totalOverdue: 0,
  brouillon: 0,
  envoyee: 0,
  payee: 0,
  enRetard: 0,
  annulee: 0,
  monthlyRevenue: [],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "tous">("tous");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const company = await getCompany();
      if (company) {
        const [statsData, invoicesData, clientsData] = await Promise.all([
          getDashboardStats(company.id),
          getInvoices(company.id),
          getClients(company.id),
        ]);
        setStats(statsData || defaultStats);
        setInvoices(invoicesData || []);
        setClients(clientsData || []);
      } else {
        setStats(defaultStats);
      }
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      setStats(defaultStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.client?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.client?.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "tous" ? true : invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const overdueInvoices = useMemo(
    () => invoices.filter((i) => i.status === "en_retard"),
    [invoices]
  );

  const topClients = useMemo(
    () =>
      [...clients]
        .sort((a, b) => (b.totalInvoiced ?? 0) - (a.totalInvoiced ?? 0))
        .slice(0, 4),
    [clients]
  );

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((i) => i.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((i) => i !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/70">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Aperçu financier et suivi des factures en temps réel</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => exportInvoicesCSV(invoices)}
            className="btn-secondary text-xs py-1.5 px-3 h-8"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary text-xs py-1.5 px-3 h-8"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Factures"
          value={stats.totalInvoices}
          icon={ReceiptText}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50/80 border border-indigo-100"
          description={`${stats.envoyee} envoyées en attente`}
        />
        <StatsCard
          title="Montant Facturé"
          value={stats.totalAmount}
          isCurrency
          icon={Wallet}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50/80 border border-indigo-100"
          description="Chiffre d'affaires global"
        />
        <StatsCard
          title="Montant Encaissé"
          value={stats.totalPaid}
          isCurrency
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50/80 border border-emerald-100"
          badgeText="Payé"
          badgeColor="bg-emerald-50 text-emerald-700 border border-emerald-200/60"
        />
        <StatsCard
          title="Solde en Attente"
          value={stats.totalPending}
          isCurrency
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50/80 border border-amber-100"
          description={`Dont ${formatCFA(stats.totalOverdue)} en retard`}
          badgeText="À percevoir"
          badgeColor="bg-amber-50 text-amber-700 border border-amber-200/60"
        />
      </div>

      {/* 3. CHARTS & REVENUE BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Revenue Area Chart — 2/3 */}
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/40">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Revenus mensuels (FCFA)</h2>
              <p className="text-[11px] text-slate-500">Montant facturé vs encaissements réels</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Facturé
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Payé
              </span>
            </div>
          </div>
          <div className="p-3 sm:p-3.5">
            <div className="h-[155px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.monthlyRevenue}
                  margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradFacture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPaye" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#64748b", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000000
                        ? `${(v / 1000000).toFixed(1)}M`
                        : v >= 1000
                        ? `${(v / 1000).toFixed(0)}K`
                        : v
                    }
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "11px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                    formatter={(value) => [formatCFA(Number(value || 0)), "Montant"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="facture"
                    name="Montant Facturé"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#gradFacture)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#4f46e5" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="paye"
                    name="Montant Payé"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#gradPaye)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#059669" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card overflow-hidden flex flex-col justify-between">
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/40">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Répartition des statuts</h2>
            <p className="text-[11px] text-slate-500">Statuts de facturation</p>
          </div>
          <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-center space-y-2">
            {[
              {
                label: "Payées",
                count: stats.payee,
                color: "bg-emerald-500",
                badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
                pct: stats.totalInvoices ? Math.round((stats.payee / stats.totalInvoices) * 100) : 0,
              },
              {
                label: "Envoyées",
                count: stats.envoyee,
                color: "bg-amber-500",
                badgeBg: "bg-amber-50 text-amber-700 border border-amber-200/50",
                pct: stats.totalInvoices ? Math.round((stats.envoyee / stats.totalInvoices) * 100) : 0,
              },
              {
                label: "En retard",
                count: stats.enRetard,
                color: "bg-rose-400",
                badgeBg: "bg-rose-50 text-rose-700 border border-rose-200/50",
                pct: stats.totalInvoices ? Math.round((stats.enRetard / stats.totalInvoices) * 100) : 0,
              },
              {
                label: "Brouillon",
                count: stats.brouillon,
                color: "bg-slate-400",
                badgeBg: "bg-slate-100 text-slate-700 border border-slate-200/50",
                pct: stats.totalInvoices ? Math.round((stats.brouillon / stats.totalInvoices) * 100) : 0,
              },
            ].map(({ label, count, color, badgeBg, pct }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 font-medium">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${badgeBg}`}>
                      {count}
                    </span>
                    <span className="text-slate-800 font-semibold text-[11px] w-7 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ORDERS & RECENT INVOICES TABLE */}
      <div className="card overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-200/70 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                Dernières Factures
              </h2>
              <p className="text-[11px] text-slate-500">Factures récentes en base de données</p>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100/90 rounded-lg max-w-full scrollbar-hide">
              {[
                { id: "tous", label: "Toutes" },
                { id: "payee", label: "Payées" },
                { id: "envoyee", label: "Envoyées" },
                { id: "en_retard", label: "En retard" },
                { id: "brouillon", label: "Brouillon" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as InvoiceStatus | "tous")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher client, numéro..."
                className="input pl-8 py-1 text-xs bg-slate-50 border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-9 text-center py-2 px-3">
                  <input
                    type="checkbox"
                    checked={
                      filteredInvoices.length > 0 &&
                      selectedInvoices.length === filteredInvoices.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2 px-3">Client</th>
                <th className="py-2 px-3">Numéro</th>
                <th className="py-2 px-3">Date d&apos;émission</th>
                <th className="py-2 px-3">Échéance</th>
                <th className="py-2 px-3">Statut</th>
                <th className="py-2 px-3 text-right">Montant Total</th>
                <th className="py-2 px-3 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    <p className="text-xs font-semibold">Aucune facture enregistrée dans Supabase</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.slice(0, 10).map((invoice) => {
                  const isSelected = selectedInvoices.includes(invoice.id);
                  return (
                    <tr
                      key={invoice.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-indigo-50/20" : ""
                      }`}
                    >
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(invoice.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate max-w-[170px]">
                            {invoice.client?.name || "Client inconnu"}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                            {invoice.client?.email || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="py-2 px-3">
                        <Link
                          href={`/factures/${invoice.id}`}
                          className="font-semibold text-slate-800 hover:text-indigo-600 no-underline transition-colors font-mono"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </td>

                      <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                        {formatDate(invoice.issueDate)}
                      </td>

                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                        {formatDate(invoice.dueDate)}
                      </td>

                      <td className="py-2 px-3 whitespace-nowrap">
                        <InvoiceStatusBadge status={invoice.status} size="sm" />
                      </td>

                      <td className="py-2 px-3 text-right font-semibold text-slate-800 font-mono whitespace-nowrap">
                        {formatCFA(invoice.total)}
                      </td>

                      <td className="py-2 px-3 text-center">
                        <Link
                          href={`/factures/${invoice.id}`}
                          className="btn-icon p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 inline-flex items-center justify-center"
                          title="Aperçu"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. TOP CLIENTS & OVERDUE ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <div className="card lg:col-span-2 p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Meilleurs Clients</h2>
              <p className="text-[11px] text-slate-500">Volumes facturés par entreprise client</p>
            </div>
            <Link
              href="/clients"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 no-underline"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Voir tous</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topClients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/70 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all no-underline group bg-white shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {client.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{client.invoiceCount ?? 0} facture(s)</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-800 font-mono">
                    {formatCFA(client.totalInvoiced ?? 0)}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-600">
                    {client.totalInvoiced ? Math.round(((client.totalPaid ?? 0) / client.totalInvoiced) * 100) : 0}% réglé
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {overdueInvoices.length > 0 && (
          <div className="card bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between space-y-2.5 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-rose-900 font-semibold text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                <span>Factures en retard</span>
              </div>
              <p className="text-[11px] text-rose-800/90 leading-normal">
                <strong className="font-semibold text-rose-900">{overdueInvoices.length} facture(s)</strong> dépassée(s) pour un total de{" "}
                <strong className="font-semibold text-rose-950">{formatCFA(stats.totalOverdue)}</strong>.
              </p>
            </div>

            <div className="space-y-1.5 pt-1.5 border-t border-rose-100">
              {overdueInvoices.slice(0, 2).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between text-[11px] p-2 rounded-md bg-white/80 border border-rose-100 shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-800 truncate font-mono">{inv.invoiceNumber}</p>
                    <p className="text-[10px] text-slate-500 truncate">{inv.client?.name}</p>
                  </div>
                  <span className="font-semibold text-rose-700 font-mono text-[11px] whitespace-nowrap">
                    {formatCFA(inv.total)}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/factures"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs py-2 px-3.5 rounded-lg font-semibold text-center block no-underline shadow-2xs transition-colors"
            >
              Relancer les clients →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
