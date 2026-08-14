// ============================================================
// MsaFacture — Utilitaires de Formatage
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Formate un montant en FCFA
 * Ex: 125000 → "125 000 F CFA"
 */
export function formatCFA(amount: number): string {
  if (isNaN(amount)) return "0 F CFA";
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded) + " F CFA";
}

/**
 * Retourne les parties d'un montant (valeur formatée + symbole F CFA séparé)
 * Ex: 125000 → { value: "125 000", symbol: "F CFA" }
 */
export function formatCFAParts(amount: number): { value: string; symbol: string } {
  if (isNaN(amount)) return { value: "0", symbol: "F CFA" };
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
  return { value: formatted, symbol: "F CFA" };
}

/**
 * Formate un montant compact
 * Ex: 1250000 → "1,25M F CFA"
 */
export function formatCFACompact(amount: number): string {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2).replace(".", ",") + "M F CFA";
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + "K F CFA";
  }
  return formatCFA(amount);
}

/**
 * Parse un montant FCFA formaté vers un nombre
 */
export function parseCFA(value: string): number {
  return parseFloat(value.replace(/\s/g, "").replace("F CFA", "").replace("FCFA", "").replace(",", ".")) || 0;
}

/**
 * Formate une date en jour/mois/année (DD/MM/YYYY)
 * Ex: "2024-01-15" → "15/01/2024"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formate une date littérale (ex: "15 janv. 2024")
 */
export function formatDateFriendly(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formate une date complète
 * Ex: "2024-01-15" → "15 janvier 2024"
 */
export function formatDateFull(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Cn (classnames merge) avec tailwind-merge et clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Retourne une date ISO (YYYY-MM-DD) depuis aujourd'hui + N jours
 */
export function addDays(days: number, from?: Date): string {
  const date = from ? new Date(from) : new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

/**
 * Aujourd'hui en ISO (YYYY-MM-DD)
 */
export function today(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Vérifie si une date est dépassée
 */
export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

/**
 * Nombre de jours jusqu'à la date d'échéance (négatif si dépassée)
 */
export function daysUntilDue(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Génère un numéro de facture
 * Ex: FAC-2024-001
 */
export function generateInvoiceNumber(prefix: string = "FAC", count: number = 1): string {
  const year = new Date().getFullYear();
  const num = count.toString().padStart(3, "0");
  return `${prefix}-${year}-${num}`;
}

/**
 * Calcule les totaux d'une facture
 */
export function calculateInvoiceTotals(
  items: { quantity: number; unitPrice: number }[],
  tvaRate: number = 18
): { subtotal: number; tvaAmount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tvaAmount = (subtotal * tvaRate) / 100;
  const total = subtotal + tvaAmount;
  return {
    subtotal: Math.round(subtotal),
    tvaAmount: Math.round(tvaAmount),
    total: Math.round(total),
  };
}


/**
 * Tronque un texte à N caractères
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Initiales d'un nom
 * Ex: "Moussa Diallo" → "MD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

/**
 * Couleur d'avatar basée sur le nom (déterministe)
 */
const AVATAR_COLORS = [
  "bg-primary-100 text-primary-700",
  "bg-success-100 text-success-700",
  "bg-warning-100 text-warning-700",
  "bg-danger-100 text-danger-700",
  "bg-purple-100 text-purple-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
