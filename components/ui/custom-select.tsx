"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

export interface SelectOption {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomSelect({ options, value, onChange, placeholder = "Sélectionner" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`flex min-h-[40px] w-full items-center justify-between rounded-full border bg-white px-4 py-2 text-sm cursor-pointer transition-all
          ${isOpen ? 'border-black ring-4 ring-slate-100' : 'border-slate-200 hover:border-black'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.icon}
              <span className="text-slate-900 font-medium">{selectedOption.name}</span>
            </div>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-black" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[300px] overflow-y-auto p-1.5">
          {options.length === 0 ? (
            <div className="p-3 text-center text-sm text-slate-500">Aucune option</div>
          ) : (
            options.map(option => {
              const isSelected = value === option.id;
              return (
                <div
                  key={option.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-full cursor-pointer transition-colors text-sm mb-1 last:mb-0
                    ${isSelected ? 'bg-slate-50 text-black' : 'text-slate-700 hover:bg-slate-50'}
                  `}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className={isSelected ? "font-medium" : ""}>{option.name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-black" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
