"use server";

import { headers } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?tab=login&message=Erreur d'authentification : ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return redirect("/login?tab=signup&message=Les mots de passe ne correspondent pas");
  }

  const origin = headers().get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return redirect("/login?tab=signup&message=Erreur lors de la création du compte : " + error.message);
  }

  revalidatePath("/", "layout");
  redirect("/login?tab=login&message=Compte créé avec succès ! Vous pouvez maintenant vous connecter (ou vérifiez vos emails si nécessaire).");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ? { name: user.user_metadata?.full_name, email: user.email } : null;
}
