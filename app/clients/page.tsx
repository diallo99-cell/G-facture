"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreVertical, Edit2, Trash2, X } from "lucide-react";
import { ClientData, getClients, addClient, updateClient, deleteClient } from "@/app/actions/clients";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClients = async () => {
    setIsLoading(true);
    const data = await getClients();
    setClients(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingClient(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setIsClientModalOpen(true);
  };

  const openEditModal = (client: ClientData) => {
    setEditingClient(client);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setIsClientModalOpen(true);
  };

  const openDeleteModal = (client: ClientData) => {
    setEditingClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) return; // Simple validation

    if (editingClient) {
      await updateClient(editingClient.id, {
        name,
        email,
        phone,
        address
      });
    } else {
      await addClient({
        name,
        email,
        phone,
        address,
        avatar: "",
      });
    }
    
    await loadClients();
    setIsClientModalOpen(false);
  };

  const handleDelete = async () => {
    if (editingClient) {
      await deleteClient(editingClient.id);
      await loadClients();
    }
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Clients</h1>
          <p className="text-sm text-slate-500">Gérez votre répertoire de clients.</p>
        </div>
        <Button 
          className="w-full md:w-auto"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un client
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Rechercher par nom ou email..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {filteredClients.length} client(s)
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th scope="col" className="p-4 w-4"><Checkbox /></th>
                <th scope="col" className="px-4 py-3 font-medium">Nom / Email</th>
                <th scope="col" className="px-4 py-3 font-medium">Téléphone</th>
                <th scope="col" className="px-4 py-3 font-medium">Adresse</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? filteredClients.map((client) => (
                <tr key={client.id} className="border-b last:border-0 hover:bg-slate-50/80 transition-colors">
                  <td className="p-4"><Checkbox /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarFallback className="font-medium text-slate-700 bg-slate-100">
                          {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900 leading-none mb-1">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{client.phone}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]">{client.address}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100" onClick={() => openEditModal(client)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => openDeleteModal(client)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Modal Form (Add/Edit) */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:justify-end md:p-0">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300" onClick={() => setIsClientModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full md:h-screen md:max-h-screen md:rounded-l-2xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden rounded-xl md:rounded-none m-4 md:m-0">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingClient ? "Modifier le client" : "Ajouter un client"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsClientModalOpen(false)} className="text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Nom complet *</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Entreprise S.A." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Adresse Email *</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ex: contact@entreprise.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Numéro de téléphone</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: +224 6XX XX XX XX" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Adresse postale</label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Kaloum, Conakry" />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setIsClientModalOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>
                {editingClient ? "Enregistrer" : "Créer le client"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {isDeleteDialogOpen && editingClient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Supprimer le client ?</h3>
            <p className="text-sm text-slate-500 mb-6">Êtes-vous sûr de vouloir supprimer définitivement <strong>{editingClient.name}</strong> ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Oui, supprimer</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
