"use client";

import { useState, useEffect } from "react";
import { Company } from "@/types";
import { getStoredCompany, saveStoredCompany } from "@/lib/store";

export function useCompanySettings() {
  const [company, setCompany] = useState<Company>(getStoredCompany());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCompany(getStoredCompany());
    setIsLoading(false);
  }, []);

  const updateCompany = (updatedFields: Partial<Company>) => {
    const updated = { ...company, ...updatedFields };
    setCompany(updated);
    saveStoredCompany(updated);
  };

  return {
    company,
    isLoading,
    updateCompany,
  };
}
