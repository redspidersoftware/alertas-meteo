"use client";

import Mapa from "@/components/Mapa";

export default function Home() {
  // Datos ficticios de alertas
  const alertas = [
    { id: 1, ciudad: "Madrid", nivel: "⚠️ Naranja", detalle: "Tormentas intensas" },
    { id: 2, ciudad: "Valencia", nivel: "🟡 Amarillo", detalle: "Lluvias moderadas" },
    { id: 3, ciudad: "Sevilla", nivel: "🔴 Rojo", detalle: "Ola de calor extremo" },
    { id: 4, ciudad: "Barcelona", nivel: "⚠️ Naranja", detalle: "Vientos fuertes" },
    { id: 5, ciudad: "Bilbao", nivel: "🟡 Amarillo", detalle: "Granizo leve" },
    { id: 6, ciudad: "Málaga", nivel: "⚠️ Naranja", detalle: "Precipitaciones intensas" },
  ];

  return (
    <main className="flex flex-col h-screen">
      {/* Encabezado */}
      <header className="bg-blue-600 text-white text-center p-4 text-xl font-bold shadow-md">
        🌦️ Alertas Meteorológicas en España
      </header>

      {/* Contenido principal en 80% mapa / 20% alertas */}
      <div className="flex flex-row flex-grow">
        {/* Mapa (80% ancho) */}
        <section className="w-4/5">
          <Mapa />
        </section>

        {/* Panel de últimas alertas (20% ancho) */}
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
    </main>
  );
}
