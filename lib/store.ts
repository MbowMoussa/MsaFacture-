import { Invoice, Client, Company } from "@/types";
import { MOCK_INVOICES, MOCK_CLIENTS, MOCK_COMPANY } from "@/lib/mock-data";

const STORAGE_KEYS = {
  INVOICES: "msafacture_invoices",
  CLIENTS: "msafacture_clients",
  COMPANY: "msafacture_company",
};

export function getStoredInvoices(): Invoice[] {
  if (typeof window === "undefined") return MOCK_INVOICES;
  const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(MOCK_INVOICES));
    return MOCK_INVOICES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_INVOICES;
  }
}

export function saveStoredInvoices(invoices: Invoice[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }
}

export function getStoredClients(): Client[] {
  if (typeof window === "undefined") return MOCK_CLIENTS;
  const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(MOCK_CLIENTS));
    return MOCK_CLIENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_CLIENTS;
  }
}

export function saveStoredClients(clients: Client[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }
}

export function getStoredCompany(): Company {
  if (typeof window === "undefined") return MOCK_COMPANY;
  const stored = localStorage.getItem(STORAGE_KEYS.COMPANY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(MOCK_COMPANY));
    return MOCK_COMPANY;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_COMPANY;
  }
}

export function saveStoredCompany(company: Company): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
  }
}
