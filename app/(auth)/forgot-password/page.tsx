"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white text-center">Mot de passe oublié</h1>
        <p className="text-sm text-gray-300 text-center mt-1">
          Saisissez votre adresse email pour recevoir un lien de réinitialisation
        </p>
      </div>

      {submitted ? (
        <div className="bg-success-500/10 border border-success-500/30 rounded-xl p-4 text-center space-y-2">
          <CheckCircle2 className="h-8 w-8 text-success-400 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Email envoyé !</h3>
          <p className="text-xs text-gray-300">
            Si un compte existe pour <span className="text-white font-medium">{email}</span>, vous recevrez un lien dans quelques instants.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@entreprise.sn"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 rounded-xl text-sm transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 cursor-pointer"
          >
            Envoyer le lien
          </button>
        </form>
      )}

      <p className="text-center text-xs text-gray-300 pt-2">
        <Link href="/login" className="inline-flex items-center gap-1 text-primary-400 hover:underline no-underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
