"use client";

import { useState, useEffect } from "react";
import { Invoice } from "@/types";
import { getStoredInvoices, saveStoredInvoices } from "@/lib/store";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setInvoices(getStoredInvoices());
    setIsLoading(false);
  }, []);

  const addInvoice = (newInvoice: Invoice) => {
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    saveStoredInvoices(updated);
  };

  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, ...updatedFields, updatedAt: new Date().toISOString() } : inv
    );
    setInvoices(updated);
    saveStoredInvoices(updated);
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    setInvoices(updated);
    saveStoredInvoices(updated);
  };

  return {
    invoices,
    isLoading,
    addInvoice,
    updateInvoice,
    deleteInvoice,
  };
}
