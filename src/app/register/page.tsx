"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("✅ Registro OK. Revisa tu correo para confirmar.");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 border rounded-md w-80 space-y-4" onSubmit={handleRegister}>
        <h2 className="text-xl font-bold">Registro</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Crear cuenta</button>
        <p className="text-sm mt-2">
          ¿Ya tienes cuenta? <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => router.push("/login")}>Inicia sesión</span>
        </p>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
