// ============================================================
// MsaFacture — Types Globaux TypeScript
// ============================================================

// --- Statuts de Facture ---
export type InvoiceStatus =
  | "brouillon"
  | "envoyee"
  | "payee"
  | "en_retard"
  | "annulee";

// --- Méthodes de Paiement ---
export type PaymentMethod =
  | "especes"
  | "virement"
  | "cheque"
  | "wave"
  | "orange_money"
  | "mtn_momo"
  | "autre";

// --- Entreprise ---
export interface Company {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  logoUrl?: string;
  taxNumber?: string;   // RCCM / Numéro fiscal
  tvaRate: number;      // 18 par défaut
  currency: string;     // FCFA par défaut
  paymentTerms?: string;
  bankDetails?: string;
  legalMentions?: string;
  invoicePrefix?: string; // FAC par défaut
  createdAt: string;
}

// --- Client ---
export interface Client {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Computed (from invoices)
  totalInvoiced?: number;
  totalPaid?: number;
  totalPending?: number;
  invoiceCount?: number;
}

// --- Ligne de Facture ---
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;       // quantity * unitPrice
  position: number;
}

// Ligne en cours de création (sans invoiceId)
export interface InvoiceItemDraft {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  position: number;
}

// --- Paiement ---
export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paidAt: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  createdAt: string;
}

// --- Facture ---
export interface Invoice {
  id: string;
  companyId: string;
  clientId: string;
  client?: Client;
  invoiceNumber: string;  // Ex: FAC-2024-001
  status: InvoiceStatus;
  issueDate: string;      // ISO date string
  dueDate: string;        // ISO date string
  subtotal: number;
  tvaRate: number;
  tvaAmount: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  sentAt?: string;
  paidAt?: string;
  items: InvoiceItem[];
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalInvoices: number;
  totalAmount: number;      // Montant total facturé
  totalPaid: number;        // Montant payé
  totalPending: number;     // Montant en attente
  totalOverdue: number;     // Montant en retard
  // Breakdown par statut
  brouillon: number;
  envoyee: number;
  payee: number;
  enRetard: number;
  annulee: number;
  // Évolution mensuelle (pour graphique)
  monthlyRevenue: MonthlyData[];
}

export interface MonthlyData {
  month: string;  // "Jan", "Fév", etc.
  facture: number;
  paye: number;
}

// --- Filtres pour liste factures ---
export interface InvoiceFilters {
  search: string;
  status: InvoiceStatus | "tous";
  clientId: string | "tous";
  dateFrom?: string;
  dateTo?: string;
  sortBy: "invoiceNumber" | "issueDate" | "dueDate" | "total" | "client";
  sortOrder: "asc" | "desc";
  page: number;
  perPage: 10 | 25 | 50;
}

// --- Filtres pour liste clients ---
export interface ClientFilters {
  search: string;
  sortBy: "name" | "createdAt" | "totalInvoiced";
  sortOrder: "asc" | "desc";
  page: number;
  perPage: 10 | 25 | 50;
}

// --- Données formulaire facture ---
export interface InvoiceFormData {
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItemDraft[];
  tvaRate: number;
  notes: string;
  paymentTerms: string;
}

// --- Données formulaire client ---
export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes: string;
}

// --- Utilisateur ---
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

// --- Pagination ---
export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// --- API Response ---
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  error?: string;
}

// --- Labels des statuts (pour affichage) ---
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: "Brouillon",
  envoyee:   "Envoyée",
  payee:     "Payée",
  en_retard: "En retard",
  annulee:   "Annulée",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  especes:      "Espèces",
  virement:     "Virement bancaire",
  cheque:       "Chèque",
  wave:         "Wave",
  orange_money: "Orange Money",
  mtn_momo:     "MTN MoMo",
  autre:        "Autre",
};
