"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { deleteInvoice } from "@/app/actions/invoices";

export function ActionMenu({ invoiceId }: { invoiceId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDeleteClick = () => {
    setIsOpen(false);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    await deleteInvoice(invoiceId);
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative flex justify-end" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-slate-400 hover:text-slate-900 transition-colors rounded-lg" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 animate-in zoom-in-95 duration-200 py-1.5 overflow-hidden">
            <button 
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              onClick={() => { setIsOpen(false); router.push(`/factures/${invoiceId}`); }}
            >
              <Eye className="h-4 w-4 text-slate-400" /> Voir les détails
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              onClick={() => { setIsOpen(false); router.push(`/factures/${invoiceId}/modifier`); }}
            >
              <Edit className="h-4 w-4 text-slate-400" /> Modifier
            </button>
            <div className="h-px bg-slate-100 my-1 mx-2" />
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 text-red-400" /> Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={cancelDelete}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Supprimer la facture ?</h3>
              <p className="text-sm text-slate-500">
                Êtes-vous sûr de vouloir supprimer la facture <strong className="text-slate-900">{invoiceId}</strong> ? Cette action est irréversible.
              </p>
            </div>
            <div className="bg-slate-50 p-4 flex gap-3 justify-center border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={cancelDelete} 
                className="rounded-lg bg-white"
              >
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 text-white hover:bg-red-700 border border-red-600"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
