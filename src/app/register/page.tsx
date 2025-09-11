"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signUp(email, password);
    if (error) setMessage("❌ " + error.message);
    else setMessage("✅ Usuario registrado, revisa tu correo para confirmar.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h1 className="text-xl font-bold">Registro</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Registrar
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
