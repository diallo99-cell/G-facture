"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  Box,
  Layers,
  CircleDollarSign,
  TrendingUp,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUserProfile, logout } from "@/app/login/actions";
import { useEffect, useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Factures", href: "/factures", icon: FileText, badge: "0", id: "factures" },
  { name: "Clients", href: "/clients", icon: Users },
];

const toolsItems = [
  { name: "Articles", href: "/articles", icon: Box },
  { name: "Intégration", href: "/integration", icon: Layers },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Devis", href: "/devis", icon: FileText },
  { name: "Ventes", href: "/ventes", icon: CircleDollarSign },
];

const settingsItems = [
  { name: "Paramètres", href: "/parametres", icon: Settings },
  { name: "Sécurité", href: "/securite", icon: Shield },
  { name: "Aide", href: "/aide", icon: HelpCircle },
  { name: "Déconnexion", href: "#", icon: LogOut, className: "text-red-500" },
];

export function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Utilisateur");
  const [userEmail, setUserEmail] = useState("utilisateur@gfacture.com");
  const [userInitials, setUserInitials] = useState("U");

  const [invoiceCount, setInvoiceCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadUser() {
      const profile = await getUserProfile();
      if (profile) {
        if (profile.name) {
          setUserName(profile.name);
          setUserInitials(profile.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase());
        } else if (profile.email) {
          setUserName(profile.email.split("@")[0]);
          setUserInitials(profile.email.substring(0, 2).toUpperCase());
        }
        if (profile.email) setUserEmail(profile.email);
      }
    }
    async function loadInvoices() {
      const { getInvoices } = await import("@/app/actions/invoices");
      const invs = await getInvoices();
      setInvoiceCount(invs.length);
    }
    loadUser();
    loadInvoices();
  }, [pathname]);

  const isCurrent = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const NavItem = ({ item }: { item: any }) => {
    const active = isCurrent(item.href);
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
          active
            ? "bg-black text-white"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
          item.className
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-400")} />
          {item.name}
        </div>
        {item.id === "factures" && invoiceCount !== null && (
          <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
            {invoiceCount}
          </span>
        )}
      </Link>
    );
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Logo */}
      <div className="h-16 flex shrink-0 items-center justify-between px-6 border-b">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="bg-black rounded-lg p-1.5 flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">G</span>
          </div>
          <span className="text-slate-900">G-Facture</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden -mr-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Menu
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Outils
          </p>
          <div className="space-y-1">
            {toolsItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Paramètres & Confidentialité
          </p>
          <div className="space-y-1">
            {settingsItems.map((item) => (
              item.name === "Déconnexion" ? (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    item.className
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-red-400" />
                    {item.name}
                  </div>
                </button>
              ) : (
                <NavItem key={item.name} item={item} />
              )
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="shrink-0 p-4 border-t bg-slate-50/50">
        <div className="flex items-center gap-3 hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer" onClick={handleLogout} title="Se déconnecter">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">{userName}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
          <LogOut className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white h-screen flex-col hidden md:flex sticky top-0">
      <SidebarContent />
    </aside>
  );
}
