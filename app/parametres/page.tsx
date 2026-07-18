"use client";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Upload, CheckCircle2 } from "lucide-react";
import { getSettings, updateSettings, SettingsData } from "@/app/actions/settings";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const sidebarTabs = [
  { id: "profil", label: "Profil de l'entreprise" },
  { id: "region", label: "Région et devises" },
  { id: "modele", label: "Modèles de facturation" },
  { id: "equipe", label: "Équipe et accès" }
];

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("profil");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState<SettingsData>({
    nomLegal: "", rc: "", ninea: "", adresse: "", email: "", telephone: "", devise: "GNF", tva: 18
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      if (data) setFormData(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const res = await updateSettings(formData);
    if (res.success) {
      setShowSuccessDialog(true);
    } else {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
          <p className="text-sm text-slate-500">Configurez votre environnement de facturation.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Menu */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === "profil" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-lg">Identité de l'entreprise</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Nom légal</label>
                      <Input value={formData.nomLegal} onChange={(e) => handleChange("nomLegal", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">Registre du Commerce (RC)</label>
                        <Input value={formData.rc} onChange={(e) => handleChange("rc", e.target.value)} placeholder="GN.TCC.2023.B.1234" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">NIF / NINEA</label>
                        <Input value={formData.ninea} onChange={(e) => handleChange("ninea", e.target.value)} placeholder="123456789" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-lg">Adresse du siège social</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Adresse complète</label>
                      <Input value={formData.adresse} onChange={(e) => handleChange("adresse", e.target.value)} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-lg">Coordonnées de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">Adresse Email</label>
                        <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">Numéro de téléphone</label>
                        <Input type="tel" value={formData.telephone} onChange={(e) => handleChange("telephone", e.target.value)} />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" /> Enregistrer le profil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "region" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-lg">Région et devises</CardTitle>
                    <CardDescription>Définissez votre devise par défaut et vos taux de taxes.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Devise Principale</label>
                      <Select value={formData.devise} onValueChange={(val) => handleChange("devise", val || "GNF")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GNF">Franc Guinéen (FG)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="USD">Dollar US ($)</SelectItem>
                          <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">Taux de TVA par défaut (%)</label>
                      <Input type="number" value={formData.tva} onChange={(e) => handleChange("tva", Number(e.target.value) || 0)} />
                    </div>
                    <div className="pt-2">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" /> Mettre à jour
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "modele" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-lg">Modèles de facturation</CardTitle>
                    <CardDescription>Personnalisez le visuel de vos factures.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <Upload className="h-5 w-5 text-slate-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">Ajouter un modèle PDF personnalisé</h3>
                      <p className="text-sm text-slate-500 max-w-sm mb-4">
                        Glissez-déposez un fichier PDF ici, ou cliquez pour parcourir. Ce fichier servira de fond de page pour vos factures.
                      </p>
                      <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-full">
                        Parcourir les fichiers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "equipe" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-lg">Équipe et accès</CardTitle>
                    <CardDescription>Gérez les membres de votre équipe et leurs permissions.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-slate-500 font-medium mb-3">Seul l'administrateur (vous) a accès pour le moment.</p>
                      <Button variant="outline" className="rounded-full">Inviter un membre</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Paramètres enregistrés !</h3>
              <p className="text-sm text-slate-500">
                Vos modifications ont été enregistrées avec succès.
              </p>
            </div>
            <div className="bg-slate-50 p-4 flex justify-center border-t border-slate-100">
              <Button 
                className="rounded-lg bg-black text-white hover:bg-slate-800"
                onClick={() => setShowSuccessDialog(false)}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
