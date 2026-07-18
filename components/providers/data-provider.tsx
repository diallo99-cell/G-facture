"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockInvoices, Invoice, mockClients, Client } from "@/lib/mock-data";

export type Settings = {
  nomLegal: string;
  rc: string;
  ninea: string;
  adresse: string;
  email: string;
  telephone: string;
  devise: string;
  tva: number;
};

const defaultSettings: Settings = {
  nomLegal: "G-Facture SARL",
  rc: "GN.TCC.2023.B.1234",
  ninea: "123456789",
  adresse: "Kaloum, Almamya",
  email: "contact@g-facture.com",
  telephone: "+224 620 00 00 00",
  devise: "GNF",
  tva: 18,
};

type DataContextType = {
  settings: Settings;
  setSettings: (s: Settings) => void;
  invoices: Invoice[];
  addInvoice: (inv: Invoice) => void;
  updateInvoiceStatus: (id: string, newStatus: string) => void;
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Client) => void;
  deleteClient: (id: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [invoices, setInvoicesState] = useState<Invoice[]>(mockInvoices);
  const [clients, setClientsState] = useState<Client[]>(mockClients);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("gfacture_settings");
    if (savedSettings) setSettingsState(JSON.parse(savedSettings));

    const savedInvoices = localStorage.getItem("gfacture_invoices");
    if (savedInvoices) {
      const parsed = JSON.parse(savedInvoices);
      if (parsed.length > 0) {
        setInvoicesState(parsed);
      }
    }

    const savedClients = localStorage.getItem("gfacture_clients");
    if (savedClients) {
      const parsed = JSON.parse(savedClients);
      if (parsed.length > 0) {
        setClientsState(parsed);
      }
    }

    setIsLoaded(true);
  }, []);

  const setSettings = (newSettings: Settings) => {
    setSettingsState(newSettings);
    localStorage.setItem("gfacture_settings", JSON.stringify(newSettings));
  };

  const addInvoice = (inv: Invoice) => {
    const newInvoices = [inv, ...invoices];
    setInvoicesState(newInvoices);
    localStorage.setItem("gfacture_invoices", JSON.stringify(newInvoices));
  };

  const updateInvoiceStatus = (id: string, newStatus: string) => {
    const newInvoices = invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv);
    setInvoicesState(newInvoices);
    localStorage.setItem("gfacture_invoices", JSON.stringify(newInvoices));
  };

  const addClient = (client: Client) => {
    const newClients = [client, ...clients];
    setClientsState(newClients);
    localStorage.setItem("gfacture_clients", JSON.stringify(newClients));
  };

  const updateClient = (id: string, updatedClient: Client) => {
    const newClients = clients.map(c => c.id === id ? updatedClient : c);
    setClientsState(newClients);
    localStorage.setItem("gfacture_clients", JSON.stringify(newClients));
  };

  const deleteClient = (id: string) => {
    const newClients = clients.filter(c => c.id !== id);
    setClientsState(newClients);
    localStorage.setItem("gfacture_clients", JSON.stringify(newClients));
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <DataContext.Provider value={{ settings, setSettings, invoices, addInvoice, updateInvoiceStatus, clients, addClient, updateClient, deleteClient }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}
