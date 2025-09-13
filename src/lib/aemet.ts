// src/lib/aemet.ts
import type { AlertaAemet } from "@/lib/aemetTar";

export async function getAlertasAemet(area: string = "mad"): Promise<AlertaAemet[]> {
  try {
    const resp = await fetch(`/api/alertas?area=${area}`);
    if (!resp.ok) throw new Error(`Error ${resp.status}`);

    const data: AlertaAemet[] = await resp.json();
    return data;
  } catch (err) {
    console.error("❌ Error getAlertasAemet:", err);
    return [];
  }
}
