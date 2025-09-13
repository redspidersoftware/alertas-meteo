"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/Footer";
import type { Session } from "@supabase/supabase-js";
import { getAlertasAemet } from "@/lib/aemet";
import type { AlertaAemet } from "@/lib/aemetTar";

// Import dinámico del mapa sin SSR
const Mapa = dynamic(() => import("@/components/Mapa"), { ssr: false });

interface Comunidad {
  codigo: string;
  nombre: string;
}

const comunidades: Comunidad[] = [
  { codigo: "esp", nombre: "España" },
  { codigo: "61", nombre: "Andalucía" },
  { codigo: "62", nombre: "Aragón" },
  { codigo: "63", nombre: "Asturias, Principado de" },
  { codigo: "64", nombre: "Baleares, Illes" },
  { codigo: "78", nombre: "Ceuta" },
  { codigo: "65", nombre: "Canarias" },
  { codigo: "66", nombre: "Cantabria" },
  { codigo: "67", nombre: "Castilla y León" },
  { codigo: "68", nombre: "Castilla - La Mancha" },
  { codigo: "69", nombre: "Cataluña" },
  { codigo: "77", nombre: "Comunitat Valenciana" },
  { codigo: "70", nombre: "Extremadura" },
  { codigo: "71", nombre: "Galicia" },
  { codigo: "72", nombre: "Madrid, Comunidad de" },
  { codigo: "79", nombre: "Melilla" },
  { codigo: "73", nombre: "Murcia, Región de" },
  { codigo: "74", nombre: "Navarra, Comunidad Foral de" },
  { codigo: "75", nombre: "País Vasco" },
  { codigo: "76", nombre: "Rioja, La" },
];

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [alertas, setAlertas] = useState<AlertaAemet[]>([]);
  const [comunidad, setComunidad] = useState<string>("72"); // Madrid por defecto
  const [loading, setLoading] = useState<boolean>(false);

  // Manejo de sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
      else setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/login");
      else setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // Carga de alertas según comunidad
  useEffect(() => {
    (async () => {
      if (!comunidad) return;
      setLoading(true);
      try {
        const datos = await getAlertasAemet(comunidad);
        console.log("✅ Alertas AEMET:", datos);

        // Log de coordenadas de polígonos
        datos?.forEach((alerta) =>
          alerta.info?.forEach((info) =>
            (Array.isArray(info.area) ? info.area : []).forEach((area) => {
              if (area.polygon)
                console.log("Polígono alerta:", info.event, area.polygon);
            })
          )
        );
        
        setAlertas(datos ?? []);
      } catch (error) {
        console.error("Error cargando alertas de AEMET:", error);
        setAlertas([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [comunidad]);

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
          {typeof window !== "undefined" && <Mapa alertas={alertas} />}
        </section>

        {/* Alertas y selector */}
        <section className="w-1/5 bg-gray-100 p-4 overflow-y-auto border-l">
          <h2 className="text-lg font-semibold mb-2">Últimas alertas</h2>

          {/* Selector de comunidad */}
          <select
            className="mb-4 w-full p-1 border rounded"
            value={comunidad}
            onChange={(e) => setComunidad(e.target.value)}
          >
            {comunidades.map((c) => (
              <option key={c.codigo} value={c.codigo}>
                {c.nombre}
              </option>
            ))}
          </select>

          {loading && <p className="text-sm text-gray-500">Cargando alertas...</p>}

          <ul className="space-y-2">
            {alertas.length === 0 && !loading ? (
              <li className="text-gray-500 text-sm">No hay alertas disponibles</li>
            ) : (
              alertas.map((alerta, aIdx) => (
                <li
                  key={alerta.identifier ?? aIdx}
                  className="text-gray-800 text-sm border rounded p-2"
                >
                  {alerta.info
                    ?.filter((info) => info.language === "es-ES")
                    .map((info, i) => (
                      <div key={i} className="mb-2">
                        <div className="font-semibold">{info.event ?? "Sin evento"}</div>
                        <div className="text-gray-600 text-xs">
                          Nivel:{" "}
                          {Array.isArray(info.parameter)
                            ? info.parameter.find((p) => p.valueName === "AEMET-Meteoalerta nivel")
                                ?.value ?? "N/A"
                            : "N/A"}
                        </div>
                        <div className="text-gray-600 text-xs">
                          Áreas afectadas:{" "}
                          {Array.isArray(info.area)
                            ? info.area.map((area, areaIdx) => (
                                <span key={areaIdx}>{area.areaDesc}; </span>
                              ))
                            : "N/A"}
                        </div>
                        <div className="text-gray-600 text-xs">
                          Más info:{" "}
                          <a
                            href={info.web ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            AEMET
                          </a>
                        </div>
                      </div>
                    ))}
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  );
}
