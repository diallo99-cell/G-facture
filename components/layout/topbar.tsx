"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Search, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./sidebar";
import { getUserProfile } from "@/app/login/actions";

export function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Utilisateur");
  const [userInitials, setUserInitials] = useState("U");

  useEffect(() => {
    async function loadUser() {
      const profile = await getUserProfile();
      if (profile && profile.name) {
        setUserName(profile.name);
        const initials = profile.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
        setUserInitials(initials);
      } else if (profile && profile.email) {
        setUserName(profile.email.split("@")[0]);
        setUserInitials(profile.email.substring(0, 2).toUpperCase());
      }
    }
    loadUser();
  }, []);

  return (
    <>
      <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="group relative w-full sm:max-w-xs focus-within:sm:max-w-md transition-all duration-300 ease-in-out hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 transition-colors duration-300 group-focus-within:text-slate-900" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full bg-slate-100 border border-transparent pl-9 rounded-lg transition-all duration-300 ease-in-out focus-visible:bg-white focus-visible:border-slate-300 focus-visible:ring-4 focus-visible:ring-slate-100 focus-visible:shadow-sm"
            />
            <div className="absolute right-2.5 top-1.5 flex items-center gap-1 transition-opacity duration-300 group-focus-within:opacity-0">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-slate-500">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Button variant="ghost" size="icon" className="relative text-slate-500 hidden sm:flex">
            <Mail className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-medium text-white flex items-center justify-center">
              10
            </span>
          </Button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
              <AvatarFallback className="bg-slate-900 text-white font-medium text-xs">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-slate-700 leading-none mb-1">{userName}</p>
              <p className="text-xs text-slate-500 leading-none">G-Facture Pro</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative w-64 max-w-[80%] bg-white h-full flex flex-col animate-in slide-in-from-left duration-300 shadow-xl">
            <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
