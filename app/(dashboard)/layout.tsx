"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { cn } from "@/lib/utils";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 h-full min-w-0 overflow-hidden transition-all duration-300 ml-0",
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
