"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Mapa from "@/components/Mapa";
import Footer from "@/components/Footer";
import type { Session } from "@supabase/supabase-js";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  // Datos ficticios de alertas
  interface Alerta {
    id: number;
    ciudad: string;
    nivel: string;
    detalle: string;
  }

  const alertas: Alerta[] = [
    { id: 1, ciudad: "Madrid", nivel: "⚠️ Naranja", detalle: "Tormentas intensas" },
    { id: 2, ciudad: "Valencia", nivel: "🟡 Amarillo", detalle: "Lluvias moderadas" },
    { id: 3, ciudad: "Sevilla", nivel: "🔴 Rojo", detalle: "Ola de calor extremo" },
    { id: 4, ciudad: "Barcelona", nivel: "⚠️ Naranja", detalle: "Vientos fuertes" },
    { id: 5, ciudad: "Bilbao", nivel: "🟡 Amarillo", detalle: "Granizo leve" },
    { id: 6, ciudad: "Málaga", nivel: "⚠️ Naranja", detalle: "Precipitaciones intensas" },
  ];

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
      else setSession(data.session);
    });

    // Listener de cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/login");
      else setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (!session) return <p className="p-4">🔒 Redirigiendo al login...</p>;

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white text-center p-4 text-xl font-bold shadow-md flex justify-between items-center">
        <span>🌦️ Alertas Meteorológicas en España</span>
        <div className="flex items-center gap-2">
          <span className="text-sm">Usuario: {session.user.email}</span>
          <button
            className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white text-sm"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex flex-row flex-grow">
        {/* Mapa */}
        <section className="w-4/5">
          <Mapa />
        </section>

        {/* Alertas */}
        <section className="w-1/5 bg-gray-100 p-4 overflow-y-auto border-l">
          <h2 className="text-lg font-semibold mb-2">Últimas alertas</h2>
          <ul className="space-y-2">
            {alertas.map((alerta) => (
              <li
                key={alerta.id}
                className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{alerta.ciudad}</span>
                  <span>{alerta.nivel}</span>
                </div>
                <p className="text-sm text-gray-600">{alerta.detalle}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  );
}
