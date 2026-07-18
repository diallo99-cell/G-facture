"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { useRouter } from "next/navigation";

const devisList = [
  { id: "DEV-2026-001", client: "Startup Studio", date: "2026-02-01", total: 12000000, status: "Accepté" },
  { id: "DEV-2026-002", client: "Entreprise Locale", date: "2026-02-05", total: 4500000, status: "En attente" },
  { id: "DEV-2026-003", client: "Boutique en ligne", date: "2026-02-10", total: 8000000, status: "En attente" },
];

export default function DevisPage() {
  const router = useRouter();
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Devis</h1>
            <p className="text-sm text-slate-500">Gérez vos propositions commerciales.</p>
          </div>
          <Button onClick={() => router.push('/devis/creer')}>
            <Plus className="h-4 w-4 mr-2" /> Créer un devis
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Numéro</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Montant (FG)</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devisList.map((devis, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{devis.id}</td>
                  <td className="px-4 py-3 text-slate-700">{devis.client}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(devis.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${devis.status === "Accepté" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {devis.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-black">{formatCurrency(devis.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-black">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
