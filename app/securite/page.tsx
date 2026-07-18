"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Key, Smartphone, Monitor, History, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    alert("Mot de passe mis à jour avec succès ! (Mode démo)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const sessions = [
    { id: 1, device: "MacBook Pro (Chrome)", location: "Conakry, Guinée", ip: "192.168.1.1", current: true, date: "Aujourd'hui, 10:42" },
    { id: 2, device: "iPhone 14 (Safari)", location: "Conakry, Guinée", ip: "192.168.1.45", current: false, date: "Hier, 15:30" },
    { id: 3, device: "Windows PC (Edge)", location: "Dakar, Sénégal", ip: "41.202.207.1", current: false, date: "Il y a 3 jours" },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Sécurité du compte</h1>
          <p className="text-sm text-slate-500">Gérez vos mots de passe, vos sessions et sécurisez l'accès à vos factures.</p>
        </div>

        {/* Password Section */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Mot de passe</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Modifiez votre mot de passe pour sécuriser votre compte.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Mot de passe actuel</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Nouveau mot de passe</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Confirmer le nouveau mot de passe</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-black text-white hover:bg-slate-800 transition-colors mt-2">
                Mettre à jour le mot de passe
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2FA & Alerts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Authentification à 2 facteurs</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Une couche de sécurité supplémentaire.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Checkbox 
                  id="2fa" 
                  checked={twoFactorEnabled} 
                  onCheckedChange={(c) => setTwoFactorEnabled(c as boolean)} 
                  className="mt-1"
                />
                <div>
                  <label htmlFor="2fa" className="text-sm font-semibold text-slate-900 cursor-pointer">
                    Activer la validation en deux étapes
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Un code vous sera envoyé par SMS à chaque connexion sur un nouvel appareil.
                  </p>
                  {twoFactorEnabled && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                      <CheckCircle2 className="h-4 w-4" />
                      Authentification activée
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Alertes de connexion</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Soyez notifié des connexions suspectes.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Checkbox 
                  id="alerts" 
                  checked={loginAlerts} 
                  onCheckedChange={(c) => setLoginAlerts(c as boolean)} 
                  className="mt-1"
                />
                <div>
                  <label htmlFor="alerts" className="text-sm font-semibold text-slate-900 cursor-pointer">
                    Recevoir des alertes par email
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Nous vous préviendrons si quelqu'un se connecte depuis un appareil ou un navigateur que vous n'avez jamais utilisé.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Devices */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Appareils connectés</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Liste des sessions actives sur votre compte G-Facture.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {session.device.includes("iPhone") ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{session.device}</p>
                        {session.current && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Cet appareil
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-500">
                        <span>{session.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>IP: {session.ip}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{session.date}</span>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 transition-colors shrink-0">
                      Déconnecter
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
