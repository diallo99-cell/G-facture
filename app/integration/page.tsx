import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
  { nom: "Stripe", desc: "Acceptez les paiements par carte bancaire en ligne.", status: "Connecté", img: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { nom: "PayPal", desc: "Permettez à vos clients de payer via leur compte PayPal.", status: "Non connecté", img: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
  { nom: "Slack", desc: "Recevez une notification lorsqu'une facture est payée.", status: "Connecté", img: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
];

export default function IntegrationPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Intégrations</h1>
          <p className="text-sm text-slate-500">Connectez vos applications favorites à G-Facture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((app, idx) => (
            <Card key={idx} className="shadow-sm border-slate-200 overflow-hidden group">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-24 flex items-center justify-start">
                    <img src={app.img} alt={app.nom} className="max-h-8 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${app.status === "Connecté" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {app.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{app.nom}</h3>
                <p className="text-sm text-slate-500 flex-grow mb-6">{app.desc}</p>
                <Button variant={app.status === "Connecté" ? "outline" : "default"} className="w-full">
                  {app.status === "Connecté" ? "Gérer" : "Connecter"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
