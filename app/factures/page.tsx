"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreVertical, SlidersHorizontal, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionMenu } from "@/components/ui/action-menu";
import { useRouter } from "next/navigation";
import { InvoiceData, getInvoices, updateInvoiceStatus } from "@/app/actions/invoices";
import { ClientData, getClients } from "@/app/actions/clients";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function FacturesListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  const statuses = ["tous", "brouillon", "envoyée", "payée", "en retard"];

  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [invs, cls] = await Promise.all([getInvoices(), getClients()]);
    setInvoices(invs);
    setClients(cls);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await updateInvoiceStatus(id, newStatus);
    await loadData();
  };

  const filteredInvoices = invoices.filter((inv) => {
    const client = clients.find(c => c.id === inv.client_id);
    const matchesSearch = client?.name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tous" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <PageSkeleton />;

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Toutes les factures</h1>
          <p className="text-sm text-slate-500">Gérez vos factures et suivez leurs paiements.</p>
        </div>
        <Button 
          className="w-full md:w-auto"
          onClick={() => router.push('/factures/creer')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer une facture
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {statuses.map(s => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600"}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Chercher une facture, un client..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-visible pb-24 min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th scope="col" className="p-4 w-4"><Checkbox /></th>
                <th scope="col" className="px-4 py-3 font-medium">Facture</th>
                <th scope="col" className="px-4 py-3 font-medium">Client</th>
                <th scope="col" className="px-4 py-3 font-medium">Date d'émission</th>
                <th scope="col" className="px-4 py-3 font-medium">Échéance</th>
                <th scope="col" className="px-4 py-3 font-medium">Statut</th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => {
                const client = clients.find(c => c.id === inv.client_id);
                return (
                  <tr 
                    key={inv.id} 
                    className="border-b last:border-0 hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => router.push(`/factures/${inv.id}`)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {inv.id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{client?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-slate-800">{client?.name || "Client inconnu"}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(inv.due_date)}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={inv.status} onChange={(s) => handleStatusUpdate(inv.id, s)} />
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu invoiceId={inv.id} />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Aucune facture ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
