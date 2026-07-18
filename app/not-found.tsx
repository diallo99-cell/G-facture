import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { FileX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="h-24 w-24 bg-slate-100 text-black rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-slate-50">
          <FileX className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-3">Erreur 404</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          La page que vous recherchez semble introuvable. Elle a peut-être été déplacée ou supprimée.
        </p>
        <Link href="/">
          <Button className="rounded-full px-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
