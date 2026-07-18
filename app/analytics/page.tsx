import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { TrendingUp, Users, FileText } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytique</h1>
          <p className="text-sm text-slate-500">Vue d'ensemble de vos performances financières.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500">Chiffre d'Affaires</h3>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"><TrendingUp className="h-4 w-4 text-black" /></div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(45000000)}</div>
              <p className="text-xs text-green-600 font-medium mt-1">+12.5% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500">Clients Actifs</h3>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"><Users className="h-4 w-4 text-black" /></div>
              </div>
              <div className="text-2xl font-bold text-slate-900">24</div>
              <p className="text-xs text-slate-500 font-medium mt-1">+3 nouveaux ce mois</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500">Factures Payées</h3>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"><FileText className="h-4 w-4 text-black" /></div>
              </div>
              <div className="text-2xl font-bold text-slate-900">85%</div>
              <p className="text-xs text-red-500 font-medium mt-1">15% en retard</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-slate-200 mt-4">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg">Évolution des revenus (simulée)</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="relative h-[250px] w-full">
              {/* SVG Area Chart */}
              <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <path d="M0,50 L700,50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M0,100 L700,100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M0,150 L700,150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Area Path */}
                <path 
                  d="M0,200 L0,120 C50,120 70,80 116,80 C162,80 180,110 233,110 C286,110 300,40 350,40 C400,40 430,100 466,100 C502,100 550,50 583,50 C616,50 650,20 700,20 L700,200 Z" 
                  fill="url(#chart-gradient)" 
                />
                
                {/* Line Path */}
                <path 
                  d="M0,120 C50,120 70,80 116,80 C162,80 180,110 233,110 C286,110 300,40 350,40 C400,40 430,100 466,100 C502,100 550,50 583,50 C616,50 650,20 700,20" 
                  fill="none" 
                  stroke="#000000" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                
                {/* Data Points */}
                <circle cx="116" cy="80" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <circle cx="233" cy="110" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <circle cx="350" cy="40" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <circle cx="466" cy="100" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <circle cx="583" cy="50" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <circle cx="700" cy="20" r="6" fill="#000000" stroke="#ffffff" strokeWidth="3" className="shadow-lg" />
              </svg>
            </div>
            <div className="flex justify-between px-2 mt-4 text-xs font-medium text-slate-400">
              <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
