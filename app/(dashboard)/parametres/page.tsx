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
} from "lucide-react";
import { getCompany, updateCompany, uploadCompanyLogo } from "@/lib/services/company";
import { Company } from "@/types";

const TABS = ["Entreprise", "Facturation", "Notifications"] as const;
type Tab = (typeof TABS)[number];

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Entreprise");
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getCompany();
      if (data) setCompany(data);
    } catch (err) {
      console.error("Erreur chargement paramètres entreprise:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const update = (field: keyof Company, value: string | number) => {
    if (!company) return;
    setCompany({ ...company, [field]: value });
  };

  const handleSave = async () => {
    if (!company) return;
    try {
      setIsSaving(true);
      setSuccessMessage("");
      await updateCompany(company.id, company);
      setSuccessMessage("Paramètres enregistrés avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de sauvegarde.";
      console.error("Erreur enregistrement entreprise:", err);
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;

    try {
      setIsUploadingLogo(true);
      const logoUrl = await uploadCompanyLogo(file);
      await updateCompany(company.id, { logoUrl });
      setCompany({ ...company, logoUrl });
      setSuccessMessage("Logo mis à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      console.error("Erreur upload logo:", err);
      alert("Erreur lors de l'envoi du logo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Configurez votre entreprise et vos règles de facturation</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Enregistrement..." : "Enregistrer"}</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Onglet Entreprise */}
      {activeTab === "Entreprise" && (
        <div className="space-y-5">
          {/* Logo */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Logo de l&apos;entreprise</h2>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white overflow-hidden shadow-sm">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-white">
                    {company.name?.charAt(0) || "M"}
                  </span>
                )}
              </div>
              <div>
                <label className="btn-secondary text-xs gap-2 py-2 px-3 inline-flex items-center cursor-pointer border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold">
                  <Upload className="h-4 w-4 text-indigo-600" />
                  <span>{isUploadingLogo ? "Téléchargement..." : "Changer le logo"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, WebP · Max 2 MB · Affiché sur vos factures</p>
              </div>
            </div>
          </div>

          {/* Informations entreprise */}
          <div className="card p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Informations générales
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group sm:col-span-2">
                <label htmlFor="company-name" className="label label-required">Nom de l&apos;entreprise</label>
                <input
                  id="company-name"
                  type="text"
                  value={company.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="company-email" className="label">Email professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="company-email"
                    type="email"
                    value={company.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="input pl-9"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="company-phone" className="label">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="company-phone"
                    type="tel"
                    value={company.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="input pl-9"
                  />
                </div>
              </div>
              <div className="form-group sm:col-span-2">
                <label htmlFor="company-address" className="label">Adresse</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="company-address"
                    type="text"
                    value={company.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="input pl-9"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="company-city" className="label">Ville</label>
                <input
                  id="company-city"
                  type="text"
                  value={company.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="company-country" className="label">Pays</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="company-country"
                    type="text"
                    value={company.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="input pl-9"
                  />
                </div>
              </div>
              <div className="form-group sm:col-span-2">
                <label htmlFor="company-tax" className="label">Numéro RCCM / NINEA / Numéro Fiscal</label>
                <input
                  id="company-tax"
                  type="text"
                  value={company.taxNumber ?? ""}
                  onChange={(e) => update("taxNumber", e.target.value)}
                  className="input font-mono"
                  placeholder="Ex: RCCM SN-DKR-2024-B-12345"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Facturation */}
      {activeTab === "Facturation" && (
        <div className="space-y-5">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Percent className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Paramètres de facturation</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group">
                <label htmlFor="tva-default" className="label">Taux TVA par défaut (%)</label>
                <input
                  id="tva-default"
                  type="number"
                  min={0}
                  max={100}
                  value={company.tvaRate}
                  onChange={(e) => update("tvaRate", Number(e.target.value))}
                  className="input"
                />
                <p className="form-hint text-xs text-gray-400 mt-1">Taux légal en Afrique de l&apos;Ouest : 18%</p>
              </div>
              <div className="form-group">
                <label htmlFor="invoice-prefix" className="label">Préfixe numéro de facture</label>
                <input
                  id="invoice-prefix"
                  type="text"
                  value={company.invoicePrefix ?? "FAC"}
                  onChange={(e) => update("invoicePrefix", e.target.value)}
                  className="input font-mono"
                  placeholder="FAC"
                />
                <p className="form-hint text-xs text-gray-400 mt-1">Ex: FAC → FAC-2024-001</p>
              </div>
              <div className="form-group sm:col-span-2">
                <label htmlFor="payment-terms" className="label">Conditions de paiement par défaut</label>
                <textarea
                  id="payment-terms"
                  value={company.paymentTerms ?? ""}
                  onChange={(e) => update("paymentTerms", e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Ex: Paiement par Orange Money (770000000), Wave ou virement bancaire sous 15 jours."
                />
              </div>
              <div className="form-group sm:col-span-2">
                <label htmlFor="bank-details" className="label">Coordonnées bancaires & Mobile Money</label>
                <textarea
                  id="bank-details"
                  value={company.bankDetails ?? ""}
                  onChange={(e) => update("bankDetails", e.target.value)}
                  rows={3}
                  className="input font-mono resize-none text-sm"
                  placeholder="Wave: 77 000 00 00 | Orange Money: 77 000 00 00 | IBAN Bank..."
                />
              </div>
              <div className="form-group sm:col-span-2">
                <label htmlFor="legal-mentions" className="label">Mentions légales de pied de page</label>
                <textarea
                  id="legal-mentions"
                  value={company.legalMentions ?? ""}
                  onChange={(e) => update("legalMentions", e.target.value)}
                  rows={2}
                  className="input resize-none text-sm"
                  placeholder="Ex: Facture établie conformément à la législation fiscale du Sénégal."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Notifications */}
      {activeTab === "Notifications" && (
        <div className="card p-5 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Préférences de notifications
          </h2>
          <div className="space-y-4">
            {[
              { label: "Facture créée",           desc: "Notifier lors de la création d'une nouvelle facture" },
              { label: "Paiement reçu",            desc: "Alerte lorsqu'un paiement est enregistré" },
              { label: "Facture en retard",        desc: "Rappel automatique pour les factures dépassées" },
              { label: "Rapport mensuel",          desc: "Résumé mensuel de votre activité financière" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors" />
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
