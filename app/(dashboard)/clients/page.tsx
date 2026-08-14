"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  ReceiptText,
  TrendingUp,
  LayoutGrid,
  List,
  Loader2,
  X,
} from "lucide-react";
import { formatCFA, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { getCompany } from "@/lib/services/company";
import { getClients, createClient } from "@/lib/services/clients";
import { Client, Company } from "@/types";

export default function ClientsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  // State pour la modale d'ajout rapide
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Sénégal",
    notes: "",
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const comp = await getCompany();
      if (comp) {
        setCompany(comp);
        const data = await getClients(comp.id);
        setClients(data);
      }
    } catch (err) {
      console.error("Erreur chargement des clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    try {
      setIsSubmitting(true);
      await createClient(company.id, newClient);
      setIsModalOpen(false);
      setNewClient({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "Sénégal",
        notes: "",
      });
      await loadData();
    } catch (err) {
      console.error("Erreur création client:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = useMemo(() =>
    clients.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
    ),
    [clients, search]
  );

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
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">{clients.length} clients enregistrés</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau client</span>
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total clients",
            value: clients.length.toString(),
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Total facturé",
            value: formatCFA(clients.reduce((s, c) => s + (c.totalInvoiced ?? 0), 0)),
            icon: ReceiptText,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Total encaissé",
            value: formatCFA(clients.reduce((s, c) => s + (c.totalPaid ?? 0), 0)),
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "En attente",
            value: formatCFA(clients.reduce((s, c) => s + (c.totalPending ?? 0), 0)),
            icon: ReceiptText,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">{label}</p>
              <p className="text-base font-bold text-gray-900 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="search-clients"
            type="text"
            placeholder="Rechercher un client par nom, email, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-2 transition-colors",
              view === "grid" ? "bg-indigo-50 text-indigo-600" : "bg-white text-gray-400 hover:bg-gray-50"
            )}
            aria-label="Vue grille"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-2 transition-colors border-l border-gray-200",
              view === "list" ? "bg-indigo-50 text-indigo-600" : "bg-white text-gray-400 hover:bg-gray-50"
            )}
            aria-label="Vue liste"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="card p-5 block no-underline hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-base font-bold ${getAvatarColor(client.name)}`}>
                  {getInitials(client.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    {client.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{client.country || "Sénégal"}</p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {client.invoiceCount ?? 0} fact.
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.city && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    <span>{client.city}, {client.country || "Sénégal"}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Facturé</p>
                  <p className="text-sm font-semibold text-gray-900 font-mono">{formatCFA(client.totalInvoiced ?? 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">En attente</p>
                  <p className={`text-sm font-semibold font-mono ${(client.totalPending ?? 0) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {formatCFA(client.totalPending ?? 0)}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* Add Client Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="card p-5 border-dashed hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center min-h-[180px] w-full cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400 group-hover:bg-indigo-100">
              <Plus className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Ajouter un client</p>
          </button>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Ville</th>
                  <th className="text-center">Factures</th>
                  <th className="text-right">Total facturé</th>
                  <th className="text-right">En attente</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <Link href={`/clients/${client.id}`} className="no-underline group">
                        <span className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {client.name}
                        </span>
                      </Link>
                    </td>
                    <td>
                      <p className="text-sm text-gray-600">{client.email || "—"}</p>
                      <p className="text-xs text-gray-400">{client.phone || "—"}</p>
                    </td>
                    <td className="text-gray-500 text-sm">{client.city ? `${client.city}, ` : ""}{client.country || "Sénégal"}</td>
                    <td className="text-center text-sm font-medium text-gray-700">{client.invoiceCount ?? 0}</td>
                    <td className="text-right font-semibold text-gray-900 font-mono text-sm">{formatCFA(client.totalInvoiced ?? 0)}</td>
                    <td className={`text-right font-semibold font-mono text-sm ${(client.totalPending ?? 0) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                      {formatCFA(client.totalPending ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="empty-state card p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700">Aucun client trouvé</h3>
          <p className="mt-1 text-sm text-gray-400">
            {search ? `Aucun résultat pour "${search}"` : "Commencez par ajouter votre premier client."}
          </p>
        </div>
      )}

      {/* Modal d'ajout de client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Nouveau client</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nom du client / Entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Ex: Teranga Tech Consulting"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contact@client.sn"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+221 77 000 00 00"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={newClient.city}
                    onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                    placeholder="Dakar"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Pays</label>
                  <input
                    type="text"
                    value={newClient.country}
                    onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                    placeholder="Sénégal"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Avenue Cheikh Anta Diop"
                  className="input"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold rounded-xl"
                >
                  {isSubmitting ? "Enregistrement..." : "Créer le client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
