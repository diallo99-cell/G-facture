"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/format";
import { Search, FileText, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ActionMenu } from "@/components/ui/action-menu";
import { getInvoices, InvoiceData } from "@/app/actions/invoices";
import { getClients, ClientData } from "@/app/actions/clients";
import { getUserProfile } from "@/app/login/actions";
import { useEffect, useMemo } from "react";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { PageSkeleton } from "@/components/ui/page-skeleton";


const getStatusBadge = (status: string) => {
  switch (status) {
    case "payée":
      return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>Payée</Badge>;
    case "envoyée":
      return <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>Envoyée</Badge>;
    case "brouillon":
      return <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2"></span>Brouillon</Badge>;
    case "en retard":
      return <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>En retard</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Utilisateur");
  
  // Initialize dates to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const formatDateForPicker = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  const [startDate, setStartDate] = useState(formatDateForPicker(firstDay));
  const [endDate, setEndDate] = useState(formatDateForPicker(lastDay));

  useEffect(() => {
    async function loadData() {
      const [invs, cls] = await Promise.all([getInvoices(), getClients()]);
      setInvoices(invs);
      setClients(cls);
      setIsLoading(false);
    }
    loadData();
    
    // Fetch user name
    async function fetchName() {
      const profile = await getUserProfile();
      if (profile && profile.name) {
        setUserName(profile.name.split(" ")[0]); // Only first name
      } else if (profile && profile.email) {
        setUserName(profile.email.split("@")[0]);
      }
    }
    fetchName();
  }, []);

  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const client = clients.find(c => c.id === inv.client_id);
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = inv.id.toLowerCase().includes(searchLower) || 
                            (client?.name.toLowerCase().includes(searchLower));
                            
      const matchesStatus = statusFilter === "tous" || inv.status === statusFilter;
      
      const invDate = new Date(inv.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // set hours to ignore time
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      const matchesDate = invDate >= start && invDate <= end;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [invoices, clients, searchTerm, statusFilter, startDate, endDate]);

  const stats = useMemo(() => {
    const totalEncaisse = filteredInvoices.filter(inv => inv.status === 'payée').reduce((sum, inv) => sum + (inv.total || 0), 0);
    const facturesEnAttente = filteredInvoices.filter(inv => inv.status === 'envoyée').reduce((sum, inv) => sum + (inv.total || 0), 0);
    const facturesEnRetard = filteredInvoices.filter(inv => inv.status === 'en retard').reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalClients = clients.length;
    
    return [
      { title: "Total encaissé", value: totalEncaisse, icon: CheckCircle2, trend: "" },
      { title: "Factures en attente", value: facturesEnAttente, icon: Clock, trend: "" },
      { title: "Factures en retard", value: facturesEnRetard, icon: FileText, trend: "" },
      { title: "Total de clients", value: totalClients.toString(), icon: FileText, trend: "" },
    ];
  }, [filteredInvoices, clients]);

  const displayedInvoices = showAllInvoices ? filteredInvoices : filteredInvoices.slice(0, 5);

  if (isLoading) return <PageSkeleton />;

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Bonjour, {userName} 👋</h1>
          <p className="text-slate-500">Voici un aperçu de vos factures.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-md p-1 shadow-sm">
            <span className="text-xs text-slate-500 ml-2">Du</span>
            <CustomDatePicker value={startDate} onChange={setStartDate} />
            <span className="text-xs text-slate-500">au</span>
            <CustomDatePicker value={endDate} onChange={setEndDate} />
          </div>
          <Button 
            onClick={() => router.push('/factures/creer')}
          >
            Créer une facture
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {typeof stat.value === "number" ? formatCurrency(stat.value) : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-t-lg border border-b-0 border-slate-200 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-1 relative">
          <label className="text-xs font-medium text-slate-500">Recherche rapide</label>
          <div className="relative group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-black transition-colors" />
            <Input 
              placeholder="Numéro, client..." 
              className="pl-9 transition-all focus:max-w-md" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-slate-500">Statut</label>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "tous")}>
            <SelectTrigger className="w-full sm:w-[140px] bg-white border-slate-200">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous</SelectItem>
              <SelectItem value="payée">Payée</SelectItem>
              <SelectItem value="en retard">En retard</SelectItem>
              <SelectItem value="brouillon">Brouillon</SelectItem>
              <SelectItem value="envoyée">Envoyée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-lg border border-slate-200 overflow-hidden pb-12">
        <div className="overflow-x-auto overflow-y-visible min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b">
              <tr>
                <th scope="col" className="p-4 w-4">
                  <Checkbox />
                </th>
                <th scope="col" className="px-4 py-3 font-medium">Factures</th>
                <th scope="col" className="px-4 py-3 font-medium">Date</th>
                <th scope="col" className="px-4 py-3 font-medium">Statut</th>
                <th scope="col" className="px-4 py-3 font-medium">Nom du client</th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.length > 0 ? (
                displayedInvoices.map((invoice) => {
                  const client = clients.find(c => c.id === invoice.client_id);
                  return (
                    <tr key={invoice.id} className="border-b last:border-0 hover:bg-slate-50/50">
                      <td className="p-4">
                        <Checkbox />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{invoice.id}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(invoice.date)}</td>
                      <td className="px-4 py-3">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{client?.name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 leading-none mb-1">{client?.name || "Client inconnu"}</p>
                            <p className="text-xs text-slate-500">{client?.email || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right relative">
                        <ActionMenu invoiceId={invoice.id} />
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Aucune facture ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex items-center justify-center">
          {filteredInvoices.length > 5 ? (
            <Button 
              variant="outline" 
              className="text-slate-600 transition-colors duration-300 hover:bg-black hover:text-white w-full sm:w-auto px-8"
              onClick={() => router.push('/factures')}
            >
              Voir toutes les factures
            </Button>
          ) : (
            <span className="text-sm text-slate-500">
              {filteredInvoices.length} facture(s)
            </span>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
