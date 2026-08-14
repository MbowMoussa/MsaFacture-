"use client";

import { useState, useEffect } from "react";
import { Client } from "@/types";
import { getStoredClients, saveStoredClients } from "@/lib/store";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setClients(getStoredClients());
    setIsLoading(false);
  }, []);

  const addClient = (newClient: Client) => {
    const updated = [newClient, ...clients];
    setClients(updated);
    saveStoredClients(updated);
  };

  const updateClient = (id: string, updatedFields: Partial<Client>) => {
    const updated = clients.map((c) =>
      c.id === id ? { ...c, ...updatedFields, updatedAt: new Date().toISOString() } : c
    );
    setClients(updated);
    saveStoredClients(updated);
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    saveStoredClients(updated);
  };

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
  };
}
