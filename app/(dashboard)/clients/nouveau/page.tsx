"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, User, Mail, Phone, MapPin, Globe, MessageSquare } from "lucide-react";

const PAYS_AFRIQUE = [
  "Sénégal", "Côte d'Ivoire", "Cameroun", "Mali", "Burkina Faso",
  "Niger", "Guinée", "Bénin", "Togo", "Mauritanie", "Gabon",
  "Congo", "RDC", "Madagascar", "Ghana", "Nigeria", "Autre",
];

export default function NouveauClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Sénégal",
    notes: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Veuillez saisir au moins le nom du client.");
      return;
    }
    alert(`Le client "${form.name}" a été créé avec succès !`);
    router.push("/clients");
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/clients" className="btn-icon">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Nouveau client</h1>
          <p className="page-subtitle">Ajoutez un nouveau client à votre répertoire</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-header flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Informations du client</h2>
        </div>
        <div className="card-body grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nom */}
          <div className="form-group sm:col-span-2">
            <label htmlFor="client-name" className="label label-required">Nom / Raison sociale</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="client-name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input pl-9"
                placeholder="Ex: Amadou Bâ ou TechBuild Cameroun"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="client-email" className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="client-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input pl-9"
                placeholder="client@exemple.com"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="form-group">
            <label htmlFor="client-phone" className="label">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="client-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="input pl-9"
                placeholder="+221 77 123 45 67"
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="form-group sm:col-span-2">
            <label htmlFor="client-address" className="label">Adresse</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="client-address"
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="input pl-9"
                placeholder="Rue, quartier, numéro…"
              />
            </div>
          </div>

          {/* Ville */}
          <div className="form-group">
            <label htmlFor="client-city" className="label">Ville</label>
            <input
              id="client-city"
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="input"
              placeholder="Dakar, Abidjan, Douala…"
            />
          </div>

          {/* Pays */}
          <div className="form-group">
            <label htmlFor="client-country" className="label">Pays</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                id="client-country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="select pl-9"
              >
                {PAYS_AFRIQUE.map((pays) => (
                  <option key={pays} value={pays}>{pays}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group sm:col-span-2">
            <label htmlFor="client-notes" className="label">Notes internes</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                id="client-notes"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="input pl-9 resize-none"
                placeholder="Informations supplémentaires, conditions particulières…"
              />
            </div>
          </div>
        </div>

        <div className="card-footer flex items-center justify-end gap-3">
          <Link href="/clients" className="btn-secondary no-underline text-sm">
            Annuler
          </Link>
          <button type="submit" className="btn-primary text-sm">
            <Save className="h-4 w-4" />
            Enregistrer le client
          </button>
        </div>
      </form>
    </div>
  );
}
