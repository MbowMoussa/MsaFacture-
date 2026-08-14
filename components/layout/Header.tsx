"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, ChevronRight, Home, Menu, Sparkles, LogOut } from "lucide-react";
import { getInitials, getAvatarColor } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { createClient } from "@/lib/supabase/client";

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard:  "Dashboard",
  factures:   "Factures",
  nouvelle:   "Nouvelle facture",
  modifier:   "Modifier",
  clients:    "Clients",
  nouveau:    "Nouveau client",
  rapports:   "Rapports",
  parametres: "Paramètres",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const { toggleMobile } = useSidebar();

  const [userName, setUserName] = useState("Utilisateur");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Moussa Mbow");
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="page-header gap-3 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 h-[58px] flex items-center justify-between shadow-xs">
      {/* Left: Mobile Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobile}
          className="btn-icon lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Ouvrir le menu mobile"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb Navigation (Next.js Link SPA) */}
        <nav className="flex items-center gap-1.5 flex-1 min-w-0" aria-label="Fil d'Ariane">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1.5 no-underline"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>

          {segments.length === 0 ? (
            <span className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-900">Dashboard</span>
            </span>
          ) : (
            segments.map((segment, index) => {
              const label = BREADCRUMB_LABELS[segment] ?? segment;
              const isLast = index === segments.length - 1;
              const href = "/" + segments.slice(0, index + 1).join("/");

              return (
                <span key={segment} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                  {isLast ? (
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[160px] sm:max-w-[240px]">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-xs text-slate-500 hover:text-slate-800 transition-colors truncate max-w-[100px] sm:max-w-[150px] no-underline font-medium"
                    >
                      {label}
                    </Link>
                  )}
                </span>
              );
            })
          )}
        </nav>
      </div>

      {/* Right: Quick Search + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Search Bar Input (Desktop) */}
        <div className="relative hidden md:block w-44 xl:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Upgrade Plan Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-[11px] font-semibold">
          <Sparkles className="h-3 w-3 text-amber-600" />
          <span>Pro FCFA</span>
        </div>

        {/* Notifications */}
        <button
          className="btn-icon relative p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse-soft" />
        </button>

        {/* User Avatar & Name & Logout */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200/80">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-2 ring-indigo-500/20 ${getAvatarColor(userName)}`}
            aria-label="Mon compte"
          >
            {getInitials(userName)}
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-slate-800">
            {userName}
          </span>
          <button
            onClick={handleLogout}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
