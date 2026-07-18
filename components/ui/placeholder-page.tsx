import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { HardHat, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PlaceholderPage({ title, description }: { title: string, description?: string }) {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="h-24 w-24 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-slate-100/50">
          <HardHat className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          {description || "Cette section est actuellement en cours de construction. Elle sera disponible très prochainement !"}
        </p>
        <Link href="/">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 transition-all hover:scale-105 duration-300 shadow-md">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
