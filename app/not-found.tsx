import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
        <FileQuestion className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page introuvable (404)</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/dashboard"
        className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 no-underline"
      >
        <Home className="h-4 w-4" />
        Retourner au Dashboard
      </Link>
    </div>
  );
}
