"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="bg-slate-50 flex items-center justify-center min-h-screen font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center max-w-md">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Erreur système</h2>
          <p className="text-sm text-slate-500 mb-6">
            Une erreur inattendue est survenue dans l&apos;application.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
