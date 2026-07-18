"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export function CustomDatePicker({ value, onChange }: { value: string, onChange: (date: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse initial date or use today
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0)
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${currentYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} className="h-8 w-8" />);
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const mm = String(currentMonth + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const dateStr = `${currentYear}-${mm}-${dd}`;
      
      const isSelected = value === dateStr;
      const isToday = todayStr === dateStr;

      return (
        <button
          key={day}
          type="button"
          onClick={() => handleSelectDate(day)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
            ${isSelected ? 'bg-black text-white font-semibold shadow-md scale-105' : 
              isToday ? 'bg-slate-100 text-black font-semibold border border-slate-200' : 'text-slate-700 hover:bg-slate-50 hover:text-black'}
          `}
        >
          {day}
        </button>
      );
    });

    return [...blanks, ...dayCells];
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`flex h-10 w-full items-center justify-between rounded-full border bg-white px-4 py-2 text-sm text-slate-700 cursor-pointer transition-colors
          ${isOpen ? 'border-slate-300 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="whitespace-nowrap truncate text-ellipsis">
          {value ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(value)) : "Sélectionner une date"}
        </span>
        <CalendarIcon className={`h-4 w-4 transition-colors ${isOpen ? 'text-black' : 'text-slate-400'}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-in zoom-in-95 slide-in-from-top-2 duration-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={handlePrevMonth} type="button">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold text-slate-900">
              {months[currentMonth]} {currentYear}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={handleNextMonth} type="button">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
}
