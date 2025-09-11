import { supabase } from "./supabaseClient";

// Registrar usuario
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

// Login usuario
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Logout usuario
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
