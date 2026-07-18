import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const articles = [
  { ref: "DEV-001", nom: "Développement Web Sur Mesure", categorie: "Service", prix: 15000000 },
  { ref: "SEO-002", nom: "Audit SEO Complet", categorie: "Consulting", prix: 3500000 },
  { ref: "DES-003", nom: "Charte Graphique + Logo", categorie: "Design", prix: 2000000 },
  { ref: "HOST-004", nom: "Hébergement Cloud Annuel", categorie: "Infrastructure", prix: 1000000 },
];

export default function ArticlesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Articles & Services</h1>
            <p className="text-sm text-slate-500">Gérez votre catalogue pour facturer plus rapidement.</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Ajouter un article
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Réf.</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3 text-right">Prix Unitaire (FG)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{art.ref}</td>
                  <td className="px-4 py-3 text-slate-700">{art.nom}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{art.categorie}</span></td>
                  <td className="px-4 py-3 text-right font-medium text-black">{formatCurrency(art.prix)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
