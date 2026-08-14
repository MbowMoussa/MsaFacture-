import Link from "next/link";
import {
  ReceiptText,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { formatCFA } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans">
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION HEADER                                     */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xs text-white group-hover:scale-105 transition-transform">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                Msa<span className="text-indigo-600">Facture</span>
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase mt-0.5">
                Facturation SaaS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs text-slate-600 font-semibold">
            <a href="#features" className="hover:text-indigo-600 no-underline transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="hover:text-indigo-600 no-underline transition-colors">
              Tarifs FCFA
            </a>
            <a href="#faq" className="hover:text-indigo-600 no-underline transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="btn-ghost text-xs px-3.5 py-2 text-slate-700 hover:text-slate-900 no-underline font-semibold"
            >
              Se connecter
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary text-xs px-4 py-2 rounded-xl no-underline gap-1.5 shadow-xs"
            >
              <span>Accéder à l&apos;App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-xs font-semibold text-indigo-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>SaaS de Facturation N°1 en Afrique de l&apos;Ouest</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Facturez en <span className="text-indigo-600">FCFA</span>, recouvrez vos créances <span className="underline decoration-indigo-300">2x plus vite</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            La solution simple et conforme (TVA 18%) pour les entrepreneurs et PME africains. Créez vos factures, relancez vos clients et suivez votre trésorerie en temps réel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="btn-primary text-sm px-6 py-2.5 rounded-xl no-underline w-full sm:w-auto gap-2 shadow-xs"
            >
              <span>Découvrir la Démo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="btn-secondary text-sm px-6 py-2.5 rounded-xl no-underline w-full sm:w-auto bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs"
            >
              Créer mon compte gratuit
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Conforme TVA 18%
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Devise officielle FCFA (XOF)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Sans carte bancaire requise
            </span>
          </div>
        </div>

        {/* Dashboard Preview Banner (Light Theme) */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-2 sm:p-3 shadow-md">
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 p-4 sm:p-6 space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500 font-mono ml-2">msafacture.sn/dashboard</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Aperçu interactif
                </span>
              </div>

              {/* Dashboard Preview Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <p className="text-xs text-slate-500 font-semibold">Chiffre d&apos;affaires ce mois</p>
                  <p className="text-xl font-bold text-slate-900 mt-1 font-mono">{formatCFA(2450000)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <p className="text-xs text-slate-500 font-semibold">Paiements encaissés</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1 font-mono">{formatCFA(1800000)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <p className="text-xs text-slate-500 font-semibold">Factures en attente</p>
                  <p className="text-xl font-bold text-amber-600 mt-1 font-mono">{formatCFA(650000)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURES SECTION                                          */}
      {/* ============================================================ */}
      <section id="features" className="py-16 px-4 sm:px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Tout ce dont vous avez besoin pour vos factures</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Une interface fluide, rapide et optimisée pour la gestion financière des entreprises locales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50/70 border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Création Express en FCFA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Générez des factures avec numérotation automatique, calcul dynamique de la TVA (18%) et totaux instantanés.
              </p>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Prêt pour Mobile Money</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Intégrez vos mentions de paiement Wave et Orange Money directement sur vos factures PDF.
              </p>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Suivi & Rapports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualisez vos revenus mensuels en graphiques clairs et exportez vos données en CSV pour votre comptable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PRICING SECTION                                           */}
      {/* ============================================================ */}
      <section id="tarifs" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Des tarifs simples et transparents</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Payez uniquement ce dont vous avez besoin. Changez ou annulez à tout moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gratuit */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-5 shadow-2xs">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Gratuit</h3>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">0 F CFA</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 5 factures / mois</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3 clients</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Export PDF</li>
            </ul>
            <Link href="/dashboard" className="btn-secondary w-full py-2 rounded-xl text-center no-underline font-semibold block">
              Commencer
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-indigo-50/60 via-white to-white border-2 border-indigo-600 p-6 rounded-2xl space-y-5 relative shadow-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Populaire
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pro</h3>
              <p className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
                9 900 F CFA <span className="text-xs font-normal text-slate-500">/ mois</span>
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Factures illimitées</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Clients illimités</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Relances automatiques</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Export CSV & Rapports</li>
            </ul>
            <Link href="/dashboard" className="btn-primary w-full py-2.5 rounded-xl text-center no-underline font-semibold block shadow-xs">
              Essayer le Pro
            </Link>
          </div>

          {/* Entreprise */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-5 shadow-2xs">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Entreprise</h3>
              <p className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
                24 900 F CFA <span className="text-xs font-normal text-slate-500">/ mois</span>
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Multi-utilisateurs</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Support dédié WhatsApp</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Intégration sur-mesure</li>
            </ul>
            <Link href="/dashboard" className="btn-secondary w-full py-2 rounded-xl text-center no-underline font-semibold block">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FAQ SECTION                                               */}
      {/* ============================================================ */}
      <section id="faq" className="py-16 px-4 sm:px-6 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <span>Foire aux Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tout ce que vous devez savoir pour commencer avec MsaFacture
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900">La TVA 18% est-elle calculée automatiquement ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oui. MsaFacture applique le taux standard de TVA (18%) en Afrique de l&apos;Ouest et génère des totaux Hors Taxe (HT) et Toutes Taxes Comprises (TTC).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900">Puis-je exporter mes factures en PDF ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Absolument. Vous pouvez télécharger des factures PDF prêtes à imprimer ou à envoyer directement par email et WhatsApp à vos clients.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900">Les paiements Mobile Money sont-ils pris en compte ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oui. Vous pouvez indiquer vos coordonnées Wave, Orange Money ou MTN MoMo sur chaque facture pour faciliter les règlements.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900">Mes données sont-elles en sécurité ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toutes vos données sont isolées et chiffrées. Chaque entreprise dispose d&apos;un espace totalement sécurisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="border-t border-slate-200/80 py-8 px-6 text-center text-xs text-slate-500 bg-slate-50">
        <p>&copy; {new Date().getFullYear()} MsaFacture — Solution SaaS de Facturation en Afrique de l&apos;Ouest.</p>
      </footer>
    </div>
  );
}
