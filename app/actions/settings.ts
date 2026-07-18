"use server";

import { createClient } from "@/utils/supabase/server";

export type SettingsData = {
  nomLegal: string;
  rc: string;
  ninea: string;
  adresse: string;
  email: string;
  telephone: string;
  devise: string;
  tva: number;
};

export async function getSettings(): Promise<SettingsData | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error || !data) {
    return {
      nomLegal: "",
      rc: "",
      ninea: "",
      adresse: "",
      email: "",
      telephone: "",
      devise: "GNF",
      tva: 18
    };
  }

  return {
    nomLegal: data.nom_legal,
    rc: data.rc,
    ninea: data.ninea,
    adresse: data.adresse,
    email: data.email,
    telephone: data.telephone,
    devise: data.devise,
    tva: Number(data.tva),
  };
}

export async function updateSettings(settings: SettingsData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase.from("settings").upsert({
    user_id: user.id,
    nom_legal: settings.nomLegal,
    rc: settings.rc,
    ninea: settings.ninea,
    adresse: settings.adresse,
    email: settings.email,
    telephone: settings.telephone,
    devise: settings.devise,
    tva: settings.tva,
  }, { onConflict: 'user_id' });

  if (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
