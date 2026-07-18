import { login, signup } from "./actions";
import { SubmitButton } from "./submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; tab?: string };
}) {
  const isSignup = searchParams.tab === "signup";

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center min-h-screen mx-auto relative overflow-hidden bg-slate-50/50">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-slate-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="flex flex-col gap-3 mb-8 text-center relative z-10">
        <div className="bg-black text-white h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/10">
          <span className="text-3xl font-black">G</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">G-Facture</h1>
        <p className="text-slate-500">Gérez vos factures en toute simplicité</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 relative z-10">
        
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-full mb-8">
          <Link 
            href="/login?tab=login" 
            scroll={false}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${!isSignup ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Connexion
          </Link>
          <Link 
            href="/login?tab=signup" 
            scroll={false}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${isSignup ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Création de compte
          </Link>
        </div>

        <form action={isSignup ? signup : login} className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
          {isSignup && (
            <div className="space-y-1.5 relative">
              <label className="text-sm font-semibold text-slate-700" htmlFor="name">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                <Input
                  className="bg-white/50 border-slate-200 focus-visible:ring-blue-500 rounded-full pl-11 pr-4 h-11 transition-all"
                  name="name"
                  type="text"
                  placeholder="Amadou Diallo"
                  required={isSignup}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 relative">
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <Input
                className="bg-white/50 border-slate-200 focus-visible:ring-blue-500 rounded-full pl-11 pr-4 h-11 transition-all"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5 mb-2 relative">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                Mot de passe
              </label>
              {!isSignup && (
                <Link href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  Mot de passe oublié ?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <Input
                className="bg-white/50 border-slate-200 focus-visible:ring-blue-500 rounded-full pl-11 pr-4 h-11 transition-all"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {isSignup && (
            <div className="space-y-1.5 mb-2 relative">
              <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                <Input
                  className="bg-white/50 border-slate-200 focus-visible:ring-blue-500 rounded-full pl-11 pr-4 h-11 transition-all"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required={isSignup}
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            {isSignup ? (
              <SubmitButton 
                formAction={signup} 
                className="w-full h-11 rounded-full bg-black text-white hover:opacity-90 active:scale-[0.98] active:bg-white active:text-black active:border active:border-black transition-all shadow-md font-semibold text-base"
              >
                S'inscrire
              </SubmitButton>
            ) : (
              <SubmitButton 
                formAction={login} 
                className="w-full h-11 rounded-full bg-black text-white hover:opacity-90 active:scale-[0.98] active:bg-white active:text-black active:border active:border-black transition-all shadow-md font-semibold text-base"
              >
                Se connecter
              </SubmitButton>
            )}
          </div>

          {searchParams?.message && (
            <div className="mt-4 p-4 bg-blue-50/80 border border-blue-100 text-blue-900 text-center text-sm font-medium rounded-2xl animate-in fade-in zoom-in-95">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
