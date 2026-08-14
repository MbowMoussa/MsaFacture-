"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, Zap, Sparkles, CreditCard, Smartphone, ChevronLeft } from "lucide-react";
import { formatCFA } from "@/lib/utils";

const PLANS = [
  {
    name: "Gratuit",
    price: 0,
    period: "pour toujours",
    description: "Parfait pour lancer son activité et tester la facturation",
    features: [
      "Jusqu'à 5 factures par mois",
      "Gestion jusqu'à 3 clients",
      "Calcul automatique de la TVA 18%",
      "Export PDF des factures",
      "Support par email",
    ],
    popular: false,
    buttonText: "Plan Actuel",
    disabled: true,
  },
  {
    name: "Pro",
    price: 9900,
    period: "par mois",
    description: "Conçu pour les entrepreneurs et PME en forte croissance",
    features: [
      "Factures illimitées",
      "Gestion clients illimitée",
      "Personnalisation du logo & couleurs",
      "Relances automatiques des impayés",
      "Export CSV & Rapports comptables",
      "Paiement Mobile Money (Wave, Orange)",
      "Support prioritaire WhatsApp 7j/7",
    ],
    popular: true,
    buttonText: "Passer au Plan Pro",
    disabled: false,
  },
  {
    name: "Entreprise",
    price: 24900,
    period: "par mois",
    description: "Pour les cabinets, équipes et grands comptes multi-utilisateurs",
    features: [
      "Tout le plan Pro inclus",
      "Multi-utilisateurs (jusqu'à 10 comptes)",
      "Multi-devises (FCFA, EUR, USD)",
      "API d'intégration sur-mesure",
      "Modèles de facture personnalisés",
      "Accompagnement comptable dédié",
    ],
    popular: false,
    buttonText: "Contacter le support",
    disabled: false,
  },
];

export default function SubscriptionPage() {
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange" | "card">("wave");

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/parametres"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 no-underline mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour aux paramètres
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Abonnement & Formules SaaS</h1>
            <p className="text-sm text-gray-500">Choisissez l&apos;offre adaptée au volume de votre entreprise</p>
          </div>
        </div>
      </div>

      {/* Usage Banner */}
      <div className="card p-6 bg-gradient-to-r from-primary-900 to-indigo-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/30 text-primary-200 border border-primary-400/20">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            Compte d&apos;essai gratuit
          </span>
          <h3 className="text-lg font-bold">Consommation du mois</h3>
          <p className="text-xs text-gray-300">
            Vous avez généré <strong className="text-white">3 / 5 factures</strong> autorisées sur votre plan gratuit ce mois-ci.
          </p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="w-full md:w-48 bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/20">
            <div className="bg-primary-400 h-full rounded-full w-[60%]" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap">60% utilisé</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`card p-6 flex flex-col justify-between relative transition-all duration-200 ${
              plan.popular ? "border-2 border-primary-500 shadow-xl ring-4 ring-primary-500/10" : ""
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Recommandé
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1 min-h-[32px]">{plan.description}</p>
              </div>

              <div className="border-y border-gray-100 py-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">
                    {plan.price === 0 ? "Gratuit" : formatCFA(plan.price)}
                  </span>
                  {plan.price > 0 && <span className="text-xs text-gray-500">/{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-600">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                disabled={plan.disabled}
                className={`w-full ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                } ${plan.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary-600" />
          Moyens de paiement acceptés en Afrique de l&apos;Ouest
        </h3>
        <p className="text-xs text-gray-500">
          Réglez en toute sécurité via Mobile Money (Wave, Orange Money) ou carte bancaire locale/internationale.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("wave")}
            className={`p-4 rounded-xl border flex items-center gap-3 text-left transition cursor-pointer ${
              paymentMethod === "wave"
                ? "border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Smartphone className="h-6 w-6 text-sky-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Wave Mobile Money</p>
              <p className="text-xs text-gray-500">Sénégal & Côte d&apos;Ivoire</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("orange")}
            className={`p-4 rounded-xl border flex items-center gap-3 text-left transition cursor-pointer ${
              paymentMethod === "orange"
                ? "border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Smartphone className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Orange Money</p>
              <p className="text-xs text-gray-500">UEMOA / XOF</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`p-4 rounded-xl border flex items-center gap-3 text-left transition cursor-pointer ${
              paymentMethod === "card"
                ? "border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <CreditCard className="h-6 w-6 text-indigo-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Carte VISA / Mastercard</p>
              <p className="text-xs text-gray-500">Paiement sécurisé SSL</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
