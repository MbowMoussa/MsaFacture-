"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Plus,
  LogOut,
  Building2,
  X,
  Sparkles,
} from "lucide-react";
import { cn, getInitials, getAvatarColor } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { createClient } from "@/lib/supabase/client";
import { getCompany } from "@/lib/services/company";
import { Company } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { label: "Factures",   href: "/factures",   icon: FileText },
  { label: "Clients",    href: "/clients",    icon: Users },
  { label: "Rapports",   href: "/rapports",   icon: BarChart3 },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileOpen, closeMobile, isCollapsed, toggleCollapsed } = useSidebar();

  const [company, setCompany] = useState<Company | null>(null);
  const [userName, setUserName] = useState("Utilisateur");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Moussa Mbow");
        setUserEmail(user.email || "");
      }
      try {
        const comp = await getCompany();
        setCompany(comp);
      } catch (err) {
        console.error("Erreur chargement entreprise sidebar:", err);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      {/* ============================================================ */}
      {/* 1. MOBILE DRAWER OVERLAY (lg:hidden)                        */}
      {/* ============================================================ */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Sliding Content */}
          <div className="relative flex flex-col w-[285px] max-w-[85vw] bg-white h-full shadow-2xl z-10 animate-slide-in-left border-r border-gray-200">
            {/* Header / Close */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link
                href="/dashboard"
                onClick={closeMobile}
                className="flex items-center gap-2.5 no-underline"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-sm text-white">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 leading-none">MsaFacture</span>
                  <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase mt-0.5">Facturation SaaS</span>
                </div>
              </Link>
              <button
                onClick={closeMobile}
                className="btn-icon h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Action CTA */}
            <div className="p-2.5">
              <Link
                href="/factures/nouvelle"
                onClick={closeMobile}
                className="btn-primary w-full justify-center no-underline text-white shadow-2xs gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nouvelle facture</span>
              </Link>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              <p className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Menu principal
              </p>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all no-underline",
                      active
                        ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("h-4.5 w-4.5 flex-shrink-0", active ? "text-indigo-600" : "text-gray-400")} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Pro Badge */}
            <div className="mx-3 my-2 p-3 bg-gradient-to-br from-indigo-50 to-purple-50/60 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-1 text-indigo-700 font-semibold text-xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Plan Business FCFA</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Factures illimitées & gestion multi-clients.</p>
              <Link href="/parametres" onClick={closeMobile} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Gérer mes paramètres →
              </Link>
            </div>

            {/* Footer Profile */}
            <div className="border-t border-gray-200 p-3 space-y-1 bg-gray-25">
              <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 bg-white border border-gray-200/80 shadow-xs">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{company?.name || "Mon Entreprise"}</p>
                  <p className="text-[10px] text-gray-500 truncate">{company?.city ? `${company.city}, ` : ""}{company?.country || "Sénégal"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors">
                <div className={cn(
                  "flex flex-shrink-0 items-center justify-center rounded-full text-xs font-bold h-8 w-8 shadow-xs",
                  getAvatarColor(userName)
                )}>
                  {getInitials(userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{userName}</p>
                  <p className="text-[11px] text-gray-500 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-icon h-7 w-7 p-0 text-gray-400 hover:text-rose-600"
                  title="Déconnexion"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. DESKTOP SIDEBAR (lg:flex)                                 */}
      {/* ============================================================ */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-white border-r border-slate-200/90 transition-all duration-300 shadow-xs",
          isCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Header / Logo */}
        <div className={cn(
          "flex items-center border-b border-gray-100 px-4 h-[64px]",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2.5 no-underline group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-sm text-white group-hover:scale-105 transition-transform">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 tracking-tight leading-none">MsaFacture</span>
                <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase mt-0.5">SaaS Facturation</span>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-sm text-white">
              <Receipt className="h-5 w-5" />
            </Link>
          )}

          <button
            onClick={toggleCollapsed}
            className={cn(
              "btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg",
              isCollapsed && "absolute -right-3 top-5 z-20 bg-white border border-gray-200 rounded-full shadow-md h-6 w-6 p-0 flex items-center justify-center text-gray-600"
            )}
            title={isCollapsed ? "Développer la navigation" : "Réduire la navigation"}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* CTA Button */}
        <div className={cn("p-2.5", isCollapsed && "px-2")}>
          <Link
            href="/factures/nouvelle"
            className={cn(
              "btn-primary w-full justify-center no-underline text-white shadow-2xs transition-transform active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 flex items-center",
              isCollapsed ? "px-0 w-8 h-8 mx-auto flex rounded-lg" : "flex gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold"
            )}
            title={isCollapsed ? "Nouvelle facture" : undefined}
          >
            <Plus className="h-3.5 w-3.5 flex-shrink-0" />
            {!isCollapsed && <span>Nouvelle facture</span>}
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Navigation
            </p>
          )}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline group",
                  active
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "flex-shrink-0 transition-colors",
                  isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5",
                  active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                {!isCollapsed && <span className="flex-1">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Company */}
        <div className="border-t border-gray-100 p-3 space-y-1 bg-gray-25/50">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 bg-white border border-gray-200/80 shadow-2xs mb-1">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
                <Building2 className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{company?.name || "Mon Entreprise"}</p>
                <p className="text-[10px] text-gray-500 truncate">{company?.city ? `${company.city}, ` : ""}{company?.country || "Sénégal"}</p>
              </div>
            </div>
          )}

          <div className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors",
            isCollapsed && "justify-center px-2"
          )}>
            <div className={cn(
              "flex flex-shrink-0 items-center justify-center rounded-full text-xs font-bold h-8 w-8 shadow-2xs",
              getAvatarColor(userName)
            )}>
              {getInitials(userName)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="btn-icon h-7 w-7 p-0 text-gray-400 hover:text-rose-600 rounded-lg"
                title="Déconnexion"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
