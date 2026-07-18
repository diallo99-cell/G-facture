"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomSelect } from "@/components/ui/custom-select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, Plus, Mail, Download, Save, Send } from "lucide-react";
import { Client } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { useRouter } from "next/navigation";
import { getInvoice, InvoiceData, updateInvoice } from "@/app/actions/invoices";
import { getClients, ClientData } from "@/app/actions/clients";
import { getSettings, SettingsData } from "@/app/actions/settings";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function ModifierInvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [clientId, setClientId] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("FAC-2026-008");
  const [dateIssue, setDateIssue] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("brouillon");
  const [errors, setErrors] = useState<{client?: boolean, dueDate?: boolean, dateIssue?: boolean}>({});
  
  const [items, setItems] = useState([
    { id: "1", description: "", quantity: 1, unitPrice: 0 }
  ]);
  
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [clients, setClients] = useState<ClientData[]>([]);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const decodedId = decodeURIComponent(params.id).trim();
      const [inv, cls, setts] = await Promise.all([getInvoice(decodedId), getClients(), getSettings()]);
      
      setClients(cls);
      setSettings(setts);
      if (inv) {
        setInvoiceNumber(inv.id);
        setClientId(inv.client_id);
        setDateIssue(inv.date);
        setDueDate(inv.due_date);
        setStatus(inv.status);
        setHasDiscount(inv.discount > 0);
        setDiscountAmount(inv.discount);
        if (inv.items && inv.items.length > 0) {
          setItems(inv.items.map(i => ({
            id: i.id,
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice
          })));
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [params.id]);

  const selectedClient = clients.find(c => c.id === clientId);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * ((settings?.tva || 0) / 100);
  const total = subtotal + tax - (hasDiscount ? discountAmount : 0);

  const handleUpdate = async () => {
    const newErrors = {
      client: !clientId,
      dateIssue: !dateIssue,
      dueDate: !dueDate
    };
    
    setErrors(newErrors);
    
    if (newErrors.client || newErrors.dateIssue || newErrors.dueDate) {
      return;
    }
    
    const decodedId = decodeURIComponent(params.id).trim();
    const res = await updateInvoice(decodedId, {
      id: invoiceNumber,
      client_id: clientId,
      date: dateIssue,
      due_date: dueDate,
      status: status,
      items: items.map(i => ({ id: i.id, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
      discount: hasDiscount ? discountAmount : 0
    });
    
    if (res && res.success === false) {
      alert("Erreur lors de la modification de la facture : " + res.error);
      return;
    }
    
    router.push('/factures');
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <AppLayout>
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full xl:w-1/2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Modifier la facture</h1>
              <p className="text-sm text-slate-500">Modifiez les informations de cette facture.</p>
            </div>
            {/* Mobile preview toggle could go here, but for now we rely on responsive stacking */}
          </div>

          <Card className="shadow-sm border-slate-200 z-50 relative">
            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
              <CardTitle className="text-base font-semibold">Informations de la facture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Facturé par *</label>
                  <Input value={settings?.nomLegal || ""} disabled className="bg-slate-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">Facturé à *</label>
                  <CustomSelect 
                    placeholder="Sélectionner un client"
                    value={clientId}
                    onChange={(val) => { setClientId(val); setErrors(prev => ({...prev, client: false})); }}
                    options={clients.map(client => ({
                      id: client.id,
                      name: client.name,
                      icon: (
                        <Avatar className="h-6 w-6 mr-1">
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )
                    }))}
                  />
                  {errors.client && <p className="text-xs text-red-500 mt-1">Veuillez sélectionner un client.</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 z-20">
                  <label className="text-xs font-medium text-slate-500">Date d'émission *</label>
                  <CustomDatePicker value={dateIssue} onChange={(val) => { setDateIssue(val); setErrors(prev => ({...prev, dateIssue: false})); }} />
                  {errors.dateIssue && <p className="text-xs text-red-500 mt-1">La date d'émission est requise.</p>}
                </div>
                <div className="space-y-1.5 z-10">
                  <label className="text-xs font-medium text-slate-500">Date d'échéance *</label>
                  <CustomDatePicker value={dueDate} onChange={(val) => { setDueDate(val); setErrors(prev => ({...prev, dueDate: false})); }} />
                  {errors.dueDate && <p className="text-xs text-red-500 mt-1">La date d'échéance est requise.</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Numéro de facture</label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 z-10 relative">
            <CardHeader className="pb-3 border-b border-slate-100 mb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Lignes de la facture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 border border-slate-200 rounded-lg relative bg-slate-50/50">
                  <div className="absolute right-2 top-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Description</label>
                      <Input 
                        placeholder="Description du service ou produit" 
                        value={item.description} 
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} 
                        className="bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">Quantité</label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)} 
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">Prix unitaire (FG)</label>
                        <Input 
                          type="number" 
                          value={item.unitPrice} 
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', parseInt(e.target.value) || 0)} 
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-medium text-slate-500">Total (HT)</label>
                        <div className="h-8 flex items-center px-3 bg-slate-100 rounded-lg border border-slate-200 text-sm font-medium">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="secondary" 
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black transition-all hover:-translate-y-0.5 active:scale-[0.98] rounded-lg" 
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une ligne
              </Button>

              <div className="pt-4 flex items-center gap-2">
                <Checkbox id="discount" checked={hasDiscount} onCheckedChange={(c) => setHasDiscount(c as boolean)} />
                <label htmlFor="discount" className="text-sm font-medium text-slate-700 cursor-pointer">Ajouter une remise</label>
              </div>
              
              {hasDiscount && (
                <div className="space-y-1.5 w-1/2">
                  <label className="text-xs font-medium text-slate-500">Montant de la remise (FG)</label>
                  <Input 
                    type="number" 
                    value={discountAmount} 
                    onChange={(e) => setDiscountAmount(parseInt(e.target.value) || 0)} 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="w-full xl:w-1/2 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-2">
            <h2 className="text-sm font-semibold text-slate-800 ml-2">Aperçu</h2>
            <div className="flex gap-2 items-center">
              <select 
                className="h-8 bg-white border border-slate-300 rounded-full text-sm px-3 py-1 outline-none focus:ring-2 focus:ring-slate-100 transition-all text-slate-700"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="brouillon">Brouillon</option>
                <option value="envoyée">Envoyée</option>
                <option value="payée">Payée</option>
              </select>
              <Button onClick={handleUpdate} size="sm" className="rounded-full bg-black text-white hover:bg-slate-800 transition-colors active:bg-white active:text-black active:border-black border border-transparent">
                <Send className="h-4 w-4 mr-2" /> Mettre à jour
              </Button>
            </div>
          </div>

          <div className="bg-slate-200/50 p-4 sm:p-8 rounded-xl flex items-center justify-center overflow-x-auto">
            {/* The A4 Paper */}
            <div className="bg-white w-full max-w-[800px] min-h-[1000px] rounded shadow-xl p-8 sm:p-12 text-slate-800 relative">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">FACTURE</h1>
                  <p className="text-slate-500 text-sm font-medium">{invoiceNumber}</p>
                </div>
                <div className="bg-black rounded-xl h-16 w-16 flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl font-black leading-none">G</span>
                </div>
              </div>

              {/* Addresses */}
              <div className="flex justify-between mb-8 text-sm">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 mb-2">Facturé par :</p>
                  <p className="font-semibold text-slate-800">{settings?.nomLegal}</p>
                  <p className="text-slate-500">{settings?.email}</p>
                  <p className="text-slate-500">{settings?.adresse}</p>
                  {settings?.ninea && <p className="text-slate-500 mt-2">NIF: {settings?.ninea}</p>}
                </div>
                <div className="space-y-1 text-right sm:text-left">
                  <p className="font-bold text-slate-900 mb-2">Facturé à :</p>
                  {selectedClient ? (
                    <>
                      <p className="font-semibold text-slate-800">{selectedClient.name}</p>
                      <p className="text-slate-500">{selectedClient.email}</p>
                      <p className="text-slate-500">{selectedClient.address}</p>
                    </>
                  ) : (
                    <p className="text-slate-400 italic">Sélectionnez un client</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="flex gap-12 mb-12 text-sm border-y border-slate-100 py-4">
                <div>
                  <p className="font-bold text-slate-900 mb-1">Date d'émission</p>
                  <p className="text-slate-600">{dateIssue ? formatDate(dateIssue) : "-"}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">Date d'échéance</p>
                  <p className="text-slate-600">{dueDate ? formatDate(dueDate) : "-"}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full text-sm">
                  <thead className="border-b-2 border-slate-900 text-slate-900 font-bold">
                    <tr>
                      <th className="py-3 text-left w-1/2">Description</th>
                      <th className="py-3 text-center">Qté</th>
                      <th className="py-3 text-right">TVA</th>
                      <th className="py-3 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-4 font-medium text-slate-800">{item.description || <span className="text-slate-300 italic">Article sans nom</span>}</td>
                        <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-4 text-right text-slate-600">18%</td>
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
                    <span className="font-medium text-slate-800">{formatCurrency(subtotal)}</span>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between text-red-600">
                      <span>Remise</span>
                      <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 pb-3 border-b border-slate-200">
                    <span>TVA (18%)</span>
                    <span className="font-medium text-slate-800">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 pt-1">
                    <span>Total TTC</span>
                    <span className="text-black">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-12 left-12 right-12 text-xs text-slate-500 border-t border-slate-200 pt-8">
                <p className="mb-1"><strong>Note :</strong> Tout paiement en retard entraînera des pénalités selon la loi en vigueur.</p>
                <div className="flex justify-between items-end mt-6">
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Méthode de paiement</p>
                    <p>Virement Bancaire - Ecobank</p>
                    <p>Compte : 1234567890123</p>
                  </div>
                  <div className="text-center">
                    <p className="font-signature text-2xl text-slate-800 mb-1">Amadou D.</p>
                    <p className="font-medium">Signature</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </AppLayout>
  );
}
