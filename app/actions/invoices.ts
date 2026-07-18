"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type InvoiceItemData = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceData = {
  id: string;
  date: string;
  due_date: string;
  status: string;
  client_id: string;
  items: InvoiceItemData[];
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
};

export async function getInvoices(): Promise<InvoiceData[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("invoices").select("*, invoice_items(*)").order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((d: any) => ({
    id: d.id,
    date: d.date,
    due_date: d.due_date,
    status: d.status,
    client_id: d.client_id,
    items: d.invoice_items.map((item: any) => ({
      id: item.id.toString(),
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price)
    })),
    discount: Number(d.discount),
    subtotal: Number(d.subtotal),
    tax: Number(d.tax),
    total: Number(d.total),
  }));
}

export async function getInvoice(id: string): Promise<InvoiceData | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("invoices").select("*, invoice_items(*)").eq("id", id).single();
  if (error) {
    require("fs").writeFileSync("get_invoice_error.log", JSON.stringify({ id, error }, null, 2));
  }
  if (error || !data) return null;

  return {
    id: data.id,
    date: data.date,
    due_date: data.due_date,
    status: data.status,
    client_id: data.client_id,
    items: data.invoice_items.map((item: any) => ({
      id: item.id.toString(),
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price)
    })),
    discount: Number(data.discount),
    subtotal: Number(data.subtotal),
    tax: Number(data.tax),
    total: Number(data.total),
  };
}

export async function addInvoice(invoice: Omit<InvoiceData, "subtotal" | "tax" | "total">) {
  const supabase = createClient();

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.18; // 18% TVA
  const total = subtotal + tax - invoice.discount;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: invData, error: invError } = await supabase.from("invoices").insert({
    user_id: user.id,
    id: invoice.id,
    date: invoice.date,
    due_date: invoice.due_date,
    status: invoice.status,
    client_id: invoice.client_id,
    discount: invoice.discount,
    subtotal,
    tax,
    total
  }).select().single();

  if (invError || !invData) return { success: false, error: invError?.message };

  if (invoice.items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      invoice.items.map(item => ({
        user_id: user.id,
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }))
    );

    if (itemsError) return { success: false, error: itemsError.message };
  }

  revalidatePath("/factures");
  revalidatePath("/");

  return { success: true };
}

export async function updateInvoice(originalId: string, invoice: Omit<InvoiceData, "subtotal" | "tax" | "total">) {
  const supabase = createClient();

  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax - invoice.discount;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error: invError } = await supabase.from("invoices").update({
    id: invoice.id,
    date: invoice.date,
    due_date: invoice.due_date,
    status: invoice.status,
    client_id: invoice.client_id,
    discount: invoice.discount,
    subtotal,
    tax,
    total
  }).eq("id", originalId);

  if (invError) return { success: false, error: invError.message };

  // For simplicity, delete old items and insert new ones
  await supabase.from("invoice_items").delete().eq("invoice_id", invoice.id);

  if (invoice.items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      invoice.items.map(item => ({
        user_id: user.id,
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }))
    );
    if (itemsError) return { success: false, error: itemsError.message };
  }

  revalidatePath("/factures");
  revalidatePath("/");

  return { success: true };
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/factures");
  revalidatePath("/");
  
  return { success: true };
}

export async function deleteInvoice(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/factures");
  revalidatePath("/");

  return { success: true };
}
