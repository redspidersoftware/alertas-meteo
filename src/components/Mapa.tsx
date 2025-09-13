"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import type { AlertaAemet } from "@/lib/aemetTar";

interface MapaProps {
  alertas?: AlertaAemet[];
}

interface IconDefaultWithGetUrl extends L.Icon.Default {
  _getIconUrl?: () => string;
}

export default function Mapa({ alertas }: MapaProps) {
  useEffect(() => {
    const defaultIcon = L.Icon.Default.prototype as IconDefaultWithGetUrl;
    delete defaultIcon._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Convierte un string de coordenadas AEMET a array de [lat, lon]
  const parsePolygon = (polygon?: string | string[]): [number, number][] => {
    if (!polygon) return [];
    // Si viene como array de strings, unir todo en un solo string
    const raw =
      typeof polygon === "string" ? polygon : (polygon as string[]).join(" ");
    const nums = raw
      .trim()
      .split(/\s+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));

    const coords: [number, number][] = [];
    for (let i = 0; i < nums.length - 1; i += 2) {
      coords.push([nums[i], nums[i + 1]]);
    }
    return coords;
  };

  // Centro aproximado de un polígono
  const getPolygonCenter = (coords: [number, number][]) => {
    if (coords.length === 0) return [40.4168, -3.7038];
    const lat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const lon = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
    return [lat, lon] as [number, number];
  };

  return (
    <MapContainer
      center={[40.4168, -3.7038]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
{alertas?.map((alerta, aIdx) =>
  alerta.info
    ?.filter((info) => info.language === "es-ES")
    .map((info, i) =>
      info.area?.map((area, areaIdx) => {
        if (!area.polygon) return null;
        const positions = parsePolygon(area.polygon);
        if (positions.length < 3) return null;

        console.log("Alerta:", info.event, "Polígono:", positions);

        const center = getPolygonCenter(positions) as [number, number];

        return (
          <>
            <Polygon
              key={`polygon-${aIdx}-${i}-${areaIdx}`}
              positions={positions}
              pathOptions={{ color: "orange", fillColor: "orange", fillOpacity: 1 }}
            />
            <Marker key={`marker-${aIdx}-${i}-${areaIdx}`} position={center}>
              <Popup>
                🚨 {info.event ?? "Alerta"} - Nivel:{" "}
                {Array.isArray(info.parameter)
                  ? info.parameter.find(
                      (p) => p.valueName === "AEMET-Meteoalerta nivel"
                    )?.value ?? "N/A"
                  : "N/A"}
              </Popup>
            </Marker>
          </>
        );
      })
    )
)}


    </MapContainer>
  );
}
