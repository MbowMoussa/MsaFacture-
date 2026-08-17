"use client";

import { useState } from "react";
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
  Menu,
  X,
  PlayCircle,
  ChevronDown,
  Users,
  Zap,
} from "lucide-react";
import { formatCFA } from "@/lib/utils";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "La TVA 18% est-elle calculée automatiquement ?",
      a: "Absolument. MsaFacture applique le taux de TVA standard de 18% en vigueur en Afrique de l'Ouest (UEMOA) et calcule automatiquement les totaux Hors Taxe (HT) et Toutes Taxes Comprises (TTC) sur chaque facture.",
    },
    {
      q: "Puis-je exporter mes factures en PDF ou CSV ?",
      a: "Oui, en un seul clic vous pouvez télécharger vos factures au format PDF officiel pour impression ou envoi par WhatsApp/Email, ainsi qu'exporter l'historique financier en CSV pour votre comptable.",
    },
    {
      q: "Comment fonctionne la réception via Mobile Money (Wave, Orange Money) ?",
      a: "Vous pouvez ajouter directement vos coordonnées et numéros de réception Wave, Orange Money et MTN MoMo sur les factures générées. Vos clients n'ont plus qu'à effectuer le virement ou scanner vos informations.",
    },
    {
      q: "Mes données d'entreprise et financières sont-elles sécurisées ?",
      a: "Tout à fait. Toutes vos factures, données clients et montants sont chiffrés et hébergés sur des serveurs sécurisés Supabase avec isolation stricte par entreprise.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Custom Styles for Mesh Background & Glassmorphism */}
      <style jsx global>{`
        .mesh-bg {
          background-image: 
            radial-gradient(at 0% 0%, rgba(70, 72, 212, 0.12) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(78, 222, 163, 0.12) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(107, 56, 212, 0.12) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(192, 193, 255, 0.25) 0px, transparent 50%);
          background-color: #faf8ff;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0px 20px 40px -15px rgba(70, 72, 212, 0.08);
        }
        .magnetic-btn {
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease;
        }
        .magnetic-btn:hover {
          transform: translateY(-2px) scale(1.02);
        }
      `}</style>

      {/* ============================================================ */}
      {/* 1. NAVBAR                                                   */}
      {/* ============================================================ */}
      <nav
        id="navbar"
        className="fixed top-0 w-full z-50 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-indigo-100/60 shadow-xs transition-all duration-300"
      >
        <div className="flex justify-between items-center h-20 px-4 sm:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="text-xl font-extrabold text-indigo-600 flex items-center gap-2.5 no-underline group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ReceiptText className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Msa<span className="text-indigo-600">Facture</span>
              </span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase mt-1">
                Facturation SaaS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <a
              href="#features"
              className="text-slate-600 hover:text-indigo-600 transition-colors no-underline"
            >
              Fonctionnalités
            </a>
            <a
              href="#tarifs"
              className="text-slate-600 hover:text-indigo-600 transition-colors no-underline"
            >
              Tarifs FCFA
            </a>
            <a
              href="#testimonials"
              className="text-slate-600 hover:text-indigo-600 transition-colors no-underline"
            >
              Témoignages
            </a>
            <a
              href="#faq"
              className="text-slate-600 hover:text-indigo-600 transition-colors no-underline"
            >
              FAQ
            </a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-700 hover:text-indigo-600 font-bold text-sm px-4 py-2.5 rounded-full transition-colors no-underline"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm py-2.5 px-6 rounded-full magnetic-btn shadow-md shadow-indigo-500/20 no-underline inline-flex items-center gap-2"
            >
              <span>Créer un compte</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Collapsible Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 px-6 py-6 space-y-4 shadow-xl">
            <div className="flex flex-col gap-3 font-semibold text-base">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100 no-underline flex items-center justify-between"
              >
                <span>Fonctionnalités</span>
                <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
              </a>
              <a
                href="#tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100 no-underline flex items-center justify-between"
              >
                <span>Tarifs FCFA</span>
                <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100 no-underline flex items-center justify-between"
              >
                <span>Témoignages</span>
                <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100 no-underline flex items-center justify-between"
              >
                <span>FAQ</span>
                <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-slate-100 text-slate-800 font-bold text-sm py-3 rounded-xl no-underline"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm py-3 rounded-xl shadow-md no-underline"
              >
                Créer mon compte gratuit
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/* 2. HERO SECTION                                              */}
      {/* ============================================================ */}
      <main className="mesh-bg pt-28 sm:pt-36 pb-20 min-h-screen flex flex-col items-center">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center text-center py-8 sm:py-12">
          {/* Pulsing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-indigo-200/80 shadow-xs mb-6 sm:mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Lancement Officiel — Facturation SaaS
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 max-w-4xl mb-6 leading-tight tracking-tight">
            Faites-vous payer{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
              Immédiatement
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed font-normal">
            MsaFacture est la solution de facturation simple, conforme et moderne conçue spécifiquement pour les entrepreneurs et PME d&apos;Afrique de l&apos;Ouest.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto px-4">
            <Link
              href="/register"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base py-4 px-8 rounded-full magnetic-btn shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2.5 w-full sm:w-auto no-underline"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-slate-800 border-2 border-indigo-100 font-bold text-base py-4 px-8 rounded-full magnetic-btn hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5 w-full sm:w-auto shadow-xs no-underline"
            >
              <PlayCircle className="h-5 w-5 text-indigo-600" />
              <span>Voir la démo</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-semibold mb-12">
            <span className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Devise officielle FCFA (XOF)
            </span>
            <span className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Conforme TVA 18%
            </span>
            <span className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Wave &amp; Orange Money inclus
            </span>
          </div>

          {/* Hero Interactive Dashboard Mockup Card */}
          <div className="w-full max-w-4xl relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 opacity-40 blur-2xl rounded-[3rem] -z-10"></div>
            <div className="glass-card rounded-3xl p-5 sm:p-8 text-left border border-white/80 shadow-2xl">
              <div className="flex flex-col gap-6">
                {/* Dashboard Top Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/70 pb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/30">
                      M
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Mbow &amp; Co Digital</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <span>Dakar, Sénégal</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">Paiements actifs</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Chiffre d&apos;affaires</span>
                    <span className="text-xl sm:text-2xl font-black text-indigo-600 font-mono">
                      {formatCFA(450000)}
                    </span>
                  </div>
                </div>

                {/* Live Invoice Preview list */}
                <div className="flex flex-col gap-3">
                  {/* Row 1 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-white border border-slate-200/70 hover:border-indigo-300 transition-all shadow-xs gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Facture #FAC-2026-0042</div>
                        <div className="text-xs text-slate-500">Client: TechCorp SARL (Dakar)</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        Payée (Wave)
                      </span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">
                        {formatCFA(120000)}
                      </span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-white border border-slate-200/70 hover:border-indigo-300 transition-all shadow-xs gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Facture #FAC-2026-0043</div>
                        <div className="text-xs text-slate-500">Client: Boutique Nafi (Abidjan)</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        En attente
                      </span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">
                        {formatCFA(45000)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. FEATURES SECTION                                          */}
        {/* ============================================================ */}
        <section id="features" className="w-full py-20 bg-white border-y border-slate-200/80 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 text-indigo-600" />
                Spécifiquement conçu pour vous
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Tout pour gérer et encaisser vos factures sans tracas
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Gagnez un temps précieux sur la gestion administrative de votre entreprise avec des outils adaptés au marché ouest-africain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#faf8ff] border border-indigo-100/80 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Création Express en FCFA</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Générez vos devis et factures en moins de 2 minutes. Numérotation automatique, calcul dynamique de la TVA à 18% et arrondis exacts en F CFA.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#faf8ff] border border-indigo-100/80 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Prêt pour Mobile Money</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Faites-vous payer par Wave, Orange Money, MTN MoMo ou virement. Vos instructions de règlement sont intégrées directement sur chaque document.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#faf8ff] border border-indigo-100/80 p-8 rounded-3xl space-y-4 hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Suivi &amp; Rapports Financiers</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Visualisez en un coup d&apos;œil vos factures payées, en attente et en retard. Exportez vos données en CSV pour une comptabilité sans erreur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. PRICING SECTION                                           */}
        {/* ============================================================ */}
        <section id="tarifs" className="w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Des tarifs simples et transparents en FCFA
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Aucun frais caché, aucun engagement. Choisissez l&apos;offre adaptée à votre activité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Gratuit */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition-all">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Démarrage</span>
                <h3 className="text-2xl font-bold text-slate-900">Gratuit</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">0 F CFA</span>
                  <span className="text-xs text-slate-500">/ mois</span>
                </div>
                <p className="text-xs text-slate-600">Parfait pour tester ou facturer vos premiers clients.</p>
                <div className="border-t border-slate-100 pt-4">
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Jusqu&apos;à 5 factures / mois</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Jusqu&apos;à 3 clients enregistrés</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Export PDF officiel &amp; Impression</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/register"
                className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl no-underline block transition-colors text-sm"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Tier 2: Pro (Featured) */}
            <div className="bg-gradient-to-b from-indigo-50/70 via-white to-white border-2 border-indigo-600 p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                Offre Recommandée
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Pour Indépendants &amp; PME</span>
                <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-600 font-mono">{formatCFA(9900)}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ mois</span>
                </div>
                <p className="text-xs text-slate-600">Pour développer votre activité en toute sérénité.</p>
                <div className="border-t border-indigo-100 pt-4">
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-bold">Factures illimitées</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-bold">Clients illimités</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Coordonnées Wave &amp; Orange Money sur PDF</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Export CSV &amp; Rapports détaillés</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/register"
                className="w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-4 rounded-2xl no-underline block shadow-lg shadow-indigo-500/20 text-sm"
              >
                Essayer l&apos;offre Pro
              </Link>
            </div>

            {/* Tier 3: Entreprise */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition-all">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entreprises &amp; Équipes</span>
                <h3 className="text-2xl font-bold text-slate-900">Entreprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">{formatCFA(24900)}</span>
                  <span className="text-xs text-slate-500">/ mois</span>
                </div>
                <p className="text-xs text-slate-600">Idéal pour les structures nécessitant plusieurs accès.</p>
                <div className="border-t border-slate-100 pt-4">
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Toutes les fonctionnalités Pro</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Gestion multi-utilisateurs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Support prioritaire par WhatsApp</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/register"
                className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl no-underline block transition-colors text-sm"
              >
                Choisir Entreprise
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. TESTIMONIALS SECTION                                     */}
        {/* ============================================================ */}
        <section id="testimonials" className="w-full py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                Témoignages Clients
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Approuvé par les entrepreneurs d&apos;Afrique de l&apos;Ouest
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-[#faf8ff] p-6 sm:p-8 rounded-3xl border border-indigo-100 space-y-4 shadow-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Avant MsaFacture, mes relances prenaient des jours. Maintenant, j&apos;envoie une facture en FCFA en 1 minute par WhatsApp avec mes détails Wave. C&apos;est parfait !&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                    MS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Mamadou S.</div>
                    <div className="text-xs text-slate-500">Fondateur Agence Web, Dakar</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-[#faf8ff] p-6 sm:p-8 rounded-3xl border border-indigo-100 space-y-4 shadow-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Le calcul automatique de la TVA à 18% et le suivi des factures impayées ont sauvé la gestion de notre trésorerie. Très simple et efficace.&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center">
                    AK
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Aminata K.</div>
                    <div className="text-xs text-slate-500">Directrice Commerciale, Abidjan</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-[#faf8ff] p-6 sm:p-8 rounded-3xl border border-indigo-100 space-y-4 shadow-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Exportation des PDF d&apos;une propreté exemplaire. Mes clients institutionnels n&apos;ont plus aucune objection lors du paiement.&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                    OD
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Ousmane D.</div>
                    <div className="text-xs text-slate-500">Consultant IT, Saint-Louis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. FAQ SECTION                                               */}
        {/* ============================================================ */}
        <section id="faq" className="w-full py-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
              Réponses à vos questions
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Foire Aux Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-indigo-600 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. BOTTOM CALL TO ACTION BANNER                             */}
        {/* ============================================================ */}
        <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto my-12">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <h2 className="text-2xl sm:text-4xl font-black max-w-2xl mx-auto leading-tight">
              Prêt à simplifier vos factures et accélérer vos paiements ?
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto font-normal">
              Rejoignez les entrepreneurs d&apos;Afrique de l&apos;Ouest qui gèrent leur activité avec MsaFacture.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/register"
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-base py-4 px-8 rounded-full magnetic-btn shadow-lg w-full sm:w-auto no-underline"
              >
                Créer un compte gratuitement
              </Link>
              <Link
                href="/login"
                className="bg-indigo-800/60 hover:bg-indigo-800 text-white font-bold text-base py-4 px-8 rounded-full border border-indigo-400/40 w-full sm:w-auto no-underline"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* 8. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-lg font-bold text-indigo-600 flex items-center gap-2 no-underline">
              <ReceiptText className="h-6 w-6 text-indigo-600" />
              <span className="text-slate-900 font-extrabold text-xl">
                Msa<span className="text-indigo-600">Facture</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              La solution SaaS de facturation moderne pour les entrepreneurs, freelances et PME d&apos;Afrique de l&apos;Ouest.
            </p>
            <p className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} MsaFacture. Tous droits réservés.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Produit</h4>
            <a href="#features" className="text-slate-600 hover:text-indigo-600 no-underline">Fonctionnalités</a>
            <a href="#tarifs" className="text-slate-600 hover:text-indigo-600 no-underline">Tarifs FCFA</a>
            <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 no-underline">Tableau de bord</Link>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Compte</h4>
            <Link href="/login" className="text-slate-600 hover:text-indigo-600 no-underline">Se connecter</Link>
            <Link href="/register" className="text-slate-600 hover:text-indigo-600 no-underline">Créer un compte</Link>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Support &amp; Légal</h4>
            <a href="#faq" className="text-slate-600 hover:text-indigo-600 no-underline">FAQ &amp; Aide</a>
            <span className="text-slate-500">Devise : FCFA (XOF)</span>
            <span className="text-slate-500">TVA par défaut : 18%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
