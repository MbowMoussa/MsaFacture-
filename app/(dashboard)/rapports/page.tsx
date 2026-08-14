"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, TrendingUp, ReceiptText, Users, Clock, Loader2 } from "lucide-react";
import { formatCFA } from "@/lib/utils";
import type { DashboardStats, Client } from "@/types";
import { getCompany } from "@/lib/services/company";
import { getDashboardStats } from "@/lib/services/analytics";
import { getClients } from "@/lib/services/clients";

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

export default function RapportsPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const company = await getCompany();
        if (company) {
          const [statsData, clientsData] = await Promise.all([
            getDashboardStats(company.id),
            getClients(company.id),
          ]);
          setStats(statsData || defaultStats);
          setClients(clientsData || []);
        } else {
          setStats(defaultStats);
        }
      } catch (err) {
        console.error("Erreur chargement rapports:", err);
        setStats(defaultStats);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const pieData = [
    { name: "Payées",    value: stats.payee,     color: "#10b981" },
    { name: "Envoyées",  value: stats.envoyee,   color: "#f59e0b" },
    { name: "En retard", value: stats.enRetard,  color: "#f43f5e" },
    { name: "Brouillon", value: stats.brouillon, color: "#94a3b8" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Rapports & Analytics</h1>
          <p className="page-subtitle">Analyse globale de vos revenus et créances</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary text-sm gap-2">
          <Download className="h-4 w-4" />
          Imprimer rapport
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Chiffre d'affaires", value: formatCFA(stats.totalAmount), icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Encaissé", value: formatCFA(stats.totalPaid), icon: ReceiptText, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "En attente", value: formatCFA(stats.totalPending), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Clients actifs", value: clients.length.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Bar Chart — 2/3 */}
        <div className="card lg:col-span-2 p-5 space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Revenus par mois (FCFA)</h2>
            <p className="text-xs text-gray-500">Comparaison facturé vs encaissé</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.monthlyRevenue} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f2f4f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#98a2b3" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#98a2b3" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`}
                width={40}
              />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: "10px", fontSize: "12px" }}
                formatter={(value) => [formatCFA(Number(value || 0)), "Montant"]}
              />
              <Bar dataKey="facture" name="Facturé" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paye" name="Payé" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — 1/3 */}
        <div className="card p-5 flex flex-col items-center justify-between">
          <div className="w-full border-b border-gray-100 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Répartition par statut</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value ?? 0} facture(s)`, "Total"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 w-full mt-2">
            {pieData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-gray-600">{name}</span>
                </span>
                <span className="font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top clients par CA */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Top clients par chiffre d&apos;affaires</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Pays</th>
                <th className="text-center">Factures</th>
                <th className="text-right">Total facturé</th>
                <th className="text-right">Encaissé</th>
                <th className="text-right">Taux recouvrement</th>
              </tr>
            </thead>
            <tbody>
              {clients
                .sort((a, b) => (b.totalInvoiced ?? 0) - (a.totalInvoiced ?? 0))
                .map((client, idx) => {
                  const rate = client.totalInvoiced ? Math.round(((client.totalPaid ?? 0) / client.totalInvoiced) * 100) : 0;
                  return (
                    <tr key={client.id}>
                      <td className="text-gray-400 font-medium">{idx + 1}</td>
                      <td className="font-semibold text-gray-800">{client.name}</td>
                      <td className="text-gray-500">{client.country || "Sénégal"}</td>
                      <td className="text-center text-gray-700">{client.invoiceCount ?? 0}</td>
                      <td className="text-right font-semibold text-gray-900 font-mono">{formatCFA(client.totalInvoiced ?? 0)}</td>
                      <td className="text-right font-semibold text-emerald-600 font-mono">{formatCFA(client.totalPaid ?? 0)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rate}%` }} />
                          </div>
                          <span className={`text-xs font-semibold ${rate >= 80 ? "text-emerald-700" : rate >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                            {rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
