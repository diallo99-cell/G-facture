"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "Comment créer une nouvelle facture ?",
    a: "Allez dans l'onglet 'Créer une facture' depuis le menu principal. Remplissez les informations du client, les dates, et ajoutez vos articles. Cliquez ensuite sur Envoyer ou Sauvegarder comme brouillon."
  },
  {
    q: "Puis-je modifier une facture déjà envoyée ?",
    a: "Oui, vous pouvez modifier une facture en statut 'brouillon' ou 'envoyée'. Cliquez sur les 3 points à côté de la facture dans la liste, puis sélectionnez 'Modifier'."
  },
  {
    q: "Comment gérer mes clients ?",
    a: "L'onglet 'Clients' vous permet d'ajouter, de modifier ou de supprimer les coordonnées de vos clients. Vous pouvez les sélectionner facilement lors de la création d'une facture."
  },
  {
    q: "Comment changer la couleur du logo ou des boutons ?",
    a: "Le design a été mis à jour vers un thème minimaliste Noir et Blanc. Ce style s'applique automatiquement à tous les éléments pour un rendu professionnel."
  }
];

export default function AidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Centre d'aide</h1>
          <p className="text-sm text-slate-500">Trouvez des réponses rapides à vos questions fréquentes.</p>
        </div>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg">Foire aux questions (FAQ)</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 divide-y divide-slate-100">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer group"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                  >
                    <h3 className="font-medium text-slate-900 group-hover:text-black transition-colors">{faq.q}</h3>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                  {isOpen && (
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed animate-in slide-in-from-top-1 fade-in-50 duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
