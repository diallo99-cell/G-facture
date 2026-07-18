"use server";

import { createClient } from "@/utils/supabase/server";

export type QuoteItemData = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type QuoteData = {
  id: string;
  date: string;
  due_date: string;
  status: string;
  client_id: string;
  items: QuoteItemData[];
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
};

export async function getQuotes(): Promise<QuoteData[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("quotes").select("*, quote_items(*)").order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((d: any) => ({
    id: d.id,
    date: d.date,
    due_date: d.due_date,
    status: d.status,
    client_id: d.client_id,
    items: d.quote_items.map((item: any) => ({
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

export async function addQuote(quote: Omit<QuoteData, "subtotal" | "tax" | "total">) {
  const supabase = createClient();

  // Calculate totals
  const subtotal = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.18; // 18% TVA, can be changed based on settings
  const total = subtotal + tax - quote.discount;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: qData, error: qError } = await supabase.from("quotes").insert({
    user_id: user.id,
    id: quote.id,
    date: quote.date,
    due_date: quote.due_date,
    status: quote.status,
    client_id: quote.client_id,
    discount: quote.discount,
    subtotal,
    tax,
    total
  }).select().single();

  if (qError || !qData) return { success: false, error: qError?.message };

  if (quote.items.length > 0) {
    const { error: itemsError } = await supabase.from("quote_items").insert(
      quote.items.map(item => ({
        user_id: user.id,
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }))
    );

    if (itemsError) return { success: false, error: itemsError.message };
  }

  return { success: true };
}

export async function updateQuoteStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase.from("quotes").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteQuote(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("quotes").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
