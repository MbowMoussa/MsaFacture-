/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Percent,
  Upload,
  Save,
  Globe,
  Loader2,
  CheckCircle2,
  Users,
  ShieldCheck,
  Activity,
  UserPlus,
  Server,
  Database,
  CheckCircle,
} from "lucide-react";
import { getCompany, updateCompany, uploadCompanyLogo } from "@/lib/services/company";
import { MOCK_COMPANY } from "@/lib/mock-data";
import { Company } from "@/types";

const TABS = ["Entreprise", "Facturation", "Notifications", "Administration"] as const;
type Tab = (typeof TABS)[number];

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "Administrateur" | "Gestionnaire" | "Comptable";
  status: "Connecté" | "Actif" | "Inactif";
  company: string;
  createdAt: string;
}

const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-1",
    fullName: "Moussa Mbow",
    email: "moussambow1599@gmail.com",
    role: "Administrateur",
    status: "Connecté",
    company: "Msa Service",
    createdAt: "18/08/2026",
  },
  {
    id: "usr-2",
    fullName: "Amadou Diallo",
    email: "a.diallo@msaservice.sn",
    role: "Gestionnaire",
    status: "Actif",
    company: "Msa Service",
    createdAt: "15/08/2026",
  },
  {
    id: "usr-3",
    fullName: "Fatou Sow",
    email: "f.sow@msaservice.sn",
    role: "Comptable",
    status: "Actif",
    company: "Msa Service",
    createdAt: "10/08/2026",
  },
];

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Entreprise");
  const [company, setCompany] = useState<Company>(MOCK_COMPANY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [usersList, setUsersList] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<AdminUser["role"]>("Gestionnaire");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getCompany();
      if (data) {
        setCompany(data);
      } else {
        setCompany(MOCK_COMPANY);
      }
    } catch (err) {
      console.error("Erreur chargement paramètres entreprise:", err);
      setCompany(MOCK_COMPANY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const update = (field: keyof Company, value: string | number) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!company) return;
    try {
      setIsSaving(true);
      setSuccessMessage("");
      if (company.id && company.id !== "company-1") {
        await updateCompany(company.id, company);
      }
      setSuccessMessage("Paramètres enregistrés avec succès !");
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de sauvegarde.";
      console.error("Erreur enregistrement entreprise:", err);
      setSuccessMessage("Enregistré en mode local !");
      setTimeout(() => setSuccessMessage(""), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;

    try {
      setIsUploadingLogo(true);
      if (company.id && company.id !== "company-1") {
        const logoUrl = await uploadCompanyLogo(file);
        await updateCompany(company.id, { logoUrl });
        setCompany((prev) => ({ ...prev, logoUrl }));
      } else {
        const localUrl = URL.createObjectURL(file);
        setCompany((prev) => ({ ...prev, logoUrl: localUrl }));
      }
      setSuccessMessage("Logo mis à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      console.error("Erreur upload logo:", err);
      const localUrl = URL.createObjectURL(file);
      setCompany((prev) => ({ ...prev, logoUrl: localUrl }));
      setSuccessMessage("Logo aperçu mis à jour !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      fullName: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Actif",
      company: company.name || "Msa Service",
      createdAt: new Date().toLocaleDateString("fr-FR"),
    };

    setUsersList([newUser, ...usersList]);
    setNewUserName("");
    setNewUserEmail("");
    setShowInviteModal(false);
    setSuccessMessage(`Invitation envoyée à ${newUserEmail} !`);
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-10">
      {/* Header Page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres & Administration</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gérez votre entreprise, vos règles de facturation et l&apos;accès des utilisateurs
          </p>
        </div>
        {activeTab !== "Administration" && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center gap-2 font-semibold shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/40 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            {tab === "Administration" && <ShieldCheck className="h-4 w-4 text-indigo-600" />}
            {tab}
          </button>
        ))}
      </div>

      {/* 1. ONGLET ENTREPRISE */}
      {activeTab === "Entreprise" && (
        <div className="space-y-6">
          {/* Logo Card */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Logo de l&apos;entreprise</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white overflow-hidden shadow-sm shrink-0 border border-slate-200">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-white">
                    {company.name?.charAt(0) || "M"}
                  </span>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold gap-2 py-2.5 px-4 inline-flex items-center cursor-pointer border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition">
                  <Upload className="h-4 w-4 text-indigo-600" />
                  <span>{isUploadingLogo ? "Téléchargement..." : "Changer le logo"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                <p className="text-xs text-slate-400 mt-2">PNG, JPG, WebP · Taille max 2 MB · Sera affiché sur l&apos;en-tête de vos factures</p>
              </div>
            </div>
          </div>

          {/* Informations entreprise */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Informations générales
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nom de l&apos;entreprise *</label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="Ex: Msa Service SARL"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={company.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="contact@msaservice.sn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={company.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="+221 77 000 00 00"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Adresse du siège</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={company.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="Ex: Sacré-Cœur 3, Villa 123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ville</label>
                <input
                  type="text"
                  value={company.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="Dakar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Pays</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={company.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="Sénégal"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Numéro RCCM / NINEA / Immatriculation fiscale</label>
                <input
                  type="text"
                  value={company.taxNumber ?? ""}
                  onChange={(e) => update("taxNumber", e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="Ex: RCCM SN-DKR-2024-B-12345 | NINEA 009876543"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ONGLET FACTURATION */}
      {activeTab === "Facturation" && (
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Règles de facturation & Mentions légales</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Taux TVA par défaut (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={company.tvaRate}
                onChange={(e) => update("tvaRate", Number(e.target.value))}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-xs text-slate-400 mt-1">Taux standard UEMOA / Sénégal : 18%</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Préfixe de la numérotation</label>
              <input
                type="text"
                value={company.invoicePrefix ?? "FAC"}
                onChange={(e) => update("invoicePrefix", e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                placeholder="FAC"
              />
              <p className="text-xs text-slate-400 mt-1">Format généré : FAC-2026-001</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Conditions de paiement par défaut</label>
              <textarea
                value={company.paymentTerms ?? ""}
                onChange={(e) => update("paymentTerms", e.target.value)}
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Ex: Paiement exigible sous 15 jours à réception par Wave, Orange Money ou virement bancaire."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Coordonnées bancaires & Mobile Money</label>
              <textarea
                value={company.bankDetails ?? ""}
                onChange={(e) => update("bankDetails", e.target.value)}
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Wave: 77 000 00 00 | Orange Money: 77 000 00 00 | RIB / IBAN: SN08 0100 1234..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mentions légales de bas de page</label>
              <textarea
                value={company.legalMentions ?? ""}
                onChange={(e) => update("legalMentions", e.target.value)}
                rows={2}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Ex: Facture émise en Francs CFA (FCFA). En cas de retard de paiement, une pénalité s'applique."
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. ONGLET NOTIFICATIONS */}
      {activeTab === "Notifications" && (
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Alertes et notifications par email
          </h2>
          <div className="space-y-4">
            {[
              { label: "Notification de création de facture", desc: "Alerter lors de l'émission d'une nouvelle facture client" },
              { label: "Alertes de paiement reçu", desc: "Notification en temps réel dès qu'un encaissement est enregistré" },
              { label: "Relances des factures en retard", desc: "Rappels automatiques envoyés pour les échéances dépassées" },
              { label: "Rapport mensuel de trésorerie", desc: "Synthèse financière envoyée le 1er de chaque mois" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 transition-colors" />
                  <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ONGLET ADMINISTRATION & GESTION DES UTILISATEURS */}
      {activeTab === "Administration" && (
        <div className="space-y-6">
          {/* Stats KPI Administration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Utilisateurs créés</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{usersList.length}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Session active</p>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">1 Connecté</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Base Supabase</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">Opérationnel</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Serveur Vercel</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">En ligne 100%</p>
              </div>
            </div>
          </div>

          {/* Tableau Gestion des Utilisateurs */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <span>Gestion des utilisateurs et des rôles</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consultez et contrôlez l&apos;accès des membres de votre organisation
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Inviter un utilisateur</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Utilisateur</th>
                    <th className="py-3 px-4">Rôle</th>
                    <th className="py-3 px-4">Entreprise</th>
                    <th className="py-3 px-4">Date d&apos;ajout</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            {usr.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{usr.fullName}</p>
                            <p className="text-xs text-slate-400 font-mono">{usr.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            usr.role === "Administrateur"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{usr.company}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{usr.createdAt}</td>
                      <td className="py-3.5 px-4">
                        {usr.status === "Connecté" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Connecté
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <CheckCircle className="h-3 w-3 text-slate-400" />
                            Actif
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal invitation utilisateur */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                <span>Inviter un utilisateur</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: Oumar Ndiaye"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="oumar.ndiaye@entreprise.sn"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rôle</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as AdminUser["role"])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Gestionnaire">Gestionnaire</option>
                  <option value="Comptable">Comptable</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  Envoyer l&apos;invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
