import React from "react";
import Link from "next/link";
import { ReceiptText } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-3 no-underline group mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
            <ReceiptText className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Msa<span className="text-indigo-400">Facture</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {children}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} MsaFacture. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
