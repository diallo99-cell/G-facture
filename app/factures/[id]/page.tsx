"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Trash2, Download, Printer } from "lucide-react";
import { mockInvoices, calculateInvoiceTotals } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRouter } from "next/navigation";
import { getInvoice, InvoiceData, updateInvoiceStatus, deleteInvoice } from "@/app/actions/invoices";
import { getClients, ClientData } from "@/app/actions/clients";
import { getSettings, SettingsData } from "@/app/actions/settings";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

// Since it's a dynamic route in app dir:
export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const decodedId = decodeURIComponent(params.id).trim();
    const [inv, cls, setts] = await Promise.all([getInvoice(decodedId), getClients(), getSettings()]);
    setInvoice(inv);
    if (inv) {
      setClient(cls.find(c => c.id === inv.client_id) || null);
    }
    setSettings(setts);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [params.id]);
  
  if (isLoading) return <PageSkeleton />;
  if (!invoice) return <AppLayout><div className="p-8">Facture introuvable (ID: {decodeURIComponent(params.id)}).</div></AppLayout>;
  if (!client) return <AppLayout><div className="p-8">Client introuvable pour cette facture.</div></AppLayout>;
  if (!settings) return <AppLayout><div className="p-8">Paramètres introuvables.</div></AppLayout>;

  const currentStatus = invoice.status;
  // Calculate totals
  const subtotal = invoice.subtotal;
  const tax = invoice.tax;
  const total = invoice.total;
  const totals = { subtotal, tax, total };

  const handleDelete = async () => {
    await deleteInvoice(invoice.id);
    setIsDeleteDialogOpen(false);
    router.push('/factures');
  };

  const handleStatusChange = async (val: string | null) => {
    if (!val) return;
    await updateInvoiceStatus(invoice.id, val);
    await loadData();
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-slate-900">{invoice.id}</h1>
                <StatusBadge status={currentStatus} />
              </div>
              <p className="text-sm text-slate-500">Créée le {formatDate(invoice.date)}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Changer statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="envoyée">Envoyée</SelectItem>
                <SelectItem value="payée">Payée</SelectItem>
                <SelectItem value="en retard">En retard</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-[0.95]" onClick={() => router.push(`/factures/${invoice.id}/modifier`)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            
            <Button variant="outline" className="text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-[0.95]" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>

            <Button 
              variant="outline" 
              className="text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Invoice Paper Document */}
        <div className="bg-slate-200/50 p-4 sm:p-8 rounded-xl flex items-center justify-center overflow-x-auto">
          <div className="bg-white w-full max-w-[800px] min-h-[1000px] rounded shadow-xl p-8 sm:p-12 text-slate-800 relative">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">FACTURE</h1>
              <p className="text-slate-500 text-sm font-medium">{invoice.id}</p>
            </div>
            <div className="bg-black rounded-xl h-16 w-16 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-black leading-none">G</span>
            </div>
          </div>

          {/* Addresses */}
          <div className="flex justify-between mb-8 text-sm">
            <div className="space-y-1">
              <p className="font-bold text-slate-900 mb-2">Facturé par :</p>
              <p className="font-semibold text-slate-800">{settings.nomLegal}</p>
              <p className="text-slate-500">{settings.email}</p>
              <p className="text-slate-500">{settings.adresse}</p>
              {settings.ninea && <p className="text-slate-500 mt-2">NIF: {settings.ninea}</p>}
            </div>
            <div className="space-y-1 text-right sm:text-left">
              <p className="font-bold text-slate-900 mb-2">Facturé à :</p>
              <p className="font-semibold text-slate-800">{client.name}</p>
              <p className="text-slate-500">{client.email}</p>
              <p className="text-slate-500">{client.phone}</p>
              <p className="text-slate-500">{client.address}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex gap-12 mb-12 text-sm border-y border-slate-100 py-4">
            <div>
              <p className="font-bold text-slate-900 mb-1">Date d'émission</p>
              <p className="text-slate-600">{formatDate(invoice.date)}</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-1">Date d'échéance</p>
              <p className="text-slate-600">{formatDate(invoice.due_date)}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="border-b-2 border-slate-900 text-slate-900 font-bold">
                <tr>
                  <th className="py-3 text-left w-1/2">Description</th>
                  <th className="py-3 text-center">Qté</th>
                  <th className="py-3 text-right">Prix Unitaire</th>
                  <th className="py-3 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-4 font-medium text-slate-800">{item.description}</td>
                    <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-4 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-4 text-right text-slate-800 font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-full max-w-[300px] space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total HT</span>
                <span className="font-medium text-slate-800">{formatCurrency(totals.subtotal)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Remise</span>
                  <span className="font-medium">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 pb-3 border-b border-slate-200">
                <span>TVA (18%)</span>
                <span className="font-medium text-slate-800">{formatCurrency(totals.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-1">
                <span>Total TTC</span>
                <span className="text-blue-600">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Supprimer la facture ?</h3>
            <p className="text-sm text-slate-500 mb-6">Êtes-vous sûr de vouloir supprimer définitivement la facture <strong>{invoice.id}</strong> ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Oui, supprimer</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
