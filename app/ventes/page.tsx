import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

const recentes = [
  { client: "Amadou Diallo", produit: "Hébergement Annuel", date: "Aujourd'hui", montant: 2000000 },
  { client: "Ousmane Sylla", produit: "Maintenance Réseau", date: "Hier", montant: 3500000 },
  { client: "Startup Studio", produit: "Développement Web", date: "Il y a 3 jours", montant: 15000000 },
];

export default function VentesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ventes</h1>
          <p className="text-sm text-slate-500">Suivi détaillé de vos encaissements récents.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Dernières transactions</h2>
            {recentes.map((vente, idx) => (
              <Card key={idx} className="shadow-sm border-slate-200 hover:border-black transition-colors cursor-default">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">{vente.produit}</h3>
                    <p className="text-sm text-slate-500">{vente.client} • {vente.date}</p>
                  </div>
                  <div className="text-lg font-black text-black">
                    +{formatCurrency(vente.montant)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <Card className="bg-black text-white shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Total encaissé ce mois</h3>
                <div className="text-3xl font-black mb-6">{formatCurrency(20500000)}</div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Objectif</span>
                    <span className="font-medium">30 000 000 FG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Progression</span>
                    <span className="font-medium text-green-400">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
