"use server";

import { createClient } from "@/utils/supabase/server";

export type ClientData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  total_billed: number;
  unpaid: number;
};

export async function getClients(): Promise<ClientData[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  
  return data.map(d => ({
    id: d.id,
    name: d.name,
    email: d.email,
    phone: d.phone,
    address: d.address,
    avatar: d.avatar,
    total_billed: Number(d.total_billed),
    unpaid: Number(d.unpaid),
  }));
}

export async function addClient(client: Omit<ClientData, "id" | "total_billed" | "unpaid">) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase.from("clients").insert({
    user_id: user.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    avatar: client.avatar,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateClient(id: string, client: Partial<ClientData>) {
  const supabase = createClient();
  const { error } = await supabase.from("clients").update({
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    avatar: client.avatar,
  }).eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteClient(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
