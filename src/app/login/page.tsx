"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push("/");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 border rounded-md w-80 space-y-4" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold">Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Iniciar sesión</button>
        <p className="text-sm mt-2">
          ¿No tienes cuenta? <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => router.push("/register")}>Regístrate</span>
        </p>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
