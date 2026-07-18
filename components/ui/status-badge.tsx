"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function StatusBadge({ status, onChange }: { status: string, onChange?: (newStatus: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const getBadge = (s: string) => {
    switch (s.toLowerCase()) {
      case "payée":
        return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>Payée</Badge>;
      case "envoyée":
        return <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>Envoyée</Badge>;
      case "brouillon":
        return <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2"></span>Brouillon</Badge>;
      case "en retard":
        return <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 font-normal"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>En retard</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 font-normal capitalize">{s}</Badge>;
    }
  };

  if (!onChange) {
    return getBadge(status);
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="focus:outline-none flex items-center gap-1 group">
        {getBadge(status)}
        <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-2 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-slate-200 focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1">
            {["brouillon", "envoyée", "payée", "en retard"].map(s => (
              <button 
                key={s}
                className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors capitalize"
                onClick={() => { onChange(s); setIsOpen(false); }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
