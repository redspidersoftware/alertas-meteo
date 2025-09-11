"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Import dinámico de react-leaflet (solo cliente)
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const Marker = dynamic(
  async () => (await import("react-leaflet")).Marker,
  { ssr: false }
);
const Popup = dynamic(
  async () => (await import("react-leaflet")).Popup,
  { ssr: false }
);

export default function Mapa() {
  useEffect(() => {
    // Importar leaflet solo en cliente
    import("leaflet").then((L) => {
      // Tipado seguro para _getIconUrl
      interface IconDefaultPrototype extends L.Icon.Default {
        _getIconUrl?: () => string;
      }

      delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    });
  }, []);

  return (
    <MapContainer
      center={[40.4168, -3.7038]} // Madrid
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[40.4168, -3.7038]}>
        <Popup>🚨 Alerta en Madrid</Popup>
      </Marker>
    </MapContainer>
  );
}
