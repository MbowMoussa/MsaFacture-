"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Désolé, un problème est survenu lors du chargement de cette page.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Réessayer
        </button>
        <Link
          href="/dashboard"
          className="btn-secondary text-xs py-2 px-4 flex items-center gap-2 no-underline"
        >
          <Home className="h-3.5 w-3.5 text-slate-500" />
          Retour au Dashboard
        </Link>
      </div>
    </div>
  );
}
