// src/app/api/alertas/route.ts
import { NextResponse } from "next/server";
import * as zlib from "zlib";
import { extractXmlFromTar, AlertaAemet } from "@/lib/aemetTar";

function isGzip(buffer: Buffer) {
  return buffer[0] === 0x1f && buffer[1] === 0x8b;
}

export async function GET(req: Request) {
  try {
    const apiKey = process.env.AEMET_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "❌ Falta AEMET_API_KEY" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const area = searchParams.get("area") ?? "72";

    // 1️⃣ Pedir URL de datos
    const resp = await fetch(
      `https://opendata.aemet.es/opendata/api/avisos_cap/ultimoelaborado/area/${area}`,
      { headers: { api_key: apiKey } }
    );

    if (!resp.ok) {
      return NextResponse.json({ error: `❌ Error inicial: ${resp.statusText}` }, { status: resp.status });
    }

    const meta = await resp.json();
    console.log("✅ Resultado inicial de AEMET:", meta);

    // 2️⃣ Descargar el tar.gz o tar
    const respDatos = await fetch(meta.datos);
    if (!respDatos.ok) {
      return NextResponse.json({ error: `❌ Error descargando datos: ${respDatos.statusText}` }, { status: respDatos.status });
    }

    const buffer = Buffer.from(await respDatos.arrayBuffer());

    // 3️⃣ Descomprimir solo si es gzip
    const decompressedBuffer = isGzip(buffer) ? zlib.gunzipSync(buffer) : buffer;

    // 4️⃣ Extraer XMLs y parsear
    const alerts: AlertaAemet[] = await extractXmlFromTar(decompressedBuffer);

    return NextResponse.json(alerts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en GET /api/alertas:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
