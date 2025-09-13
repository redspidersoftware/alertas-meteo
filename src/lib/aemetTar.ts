// src/lib/aemetTar.ts
import * as tar from "tar-stream";
import { XMLParser } from "fast-xml-parser";
import { Readable } from "stream";

export interface EventCode {
  valueName?: string;
  value?: string;
}

export interface Area {
  areaDesc?: string;
  polygon?: string[];
  geocode?: { valueName?: string; value?: string }[];
}

export interface Info {
  language?: string;
  category?: string;
  event?: string;
  responseType?: string;
  urgency?: string;
  severity?: string;
  certainty?: string;
  eventCode?: EventCode[];
  effective?: string;
  onset?: string;
  expires?: string;
  senderName?: string;
  headline?: string;
  web?: string;
  contact?: string;
  parameter?: EventCode[];
  area?: Area[];
}

export interface AlertaAemet {
  identifier?: string;
  sender?: string;
  sent?: string;
  status?: string;
  msgType?: string;
  scope?: string;
  info?: Info[];
}

/**
 * Extrae los XML contenidos en un buffer tar.gz y los convierte en objetos AlertaAemet
 */
export async function extractXmlFromTar(buffer: Buffer): Promise<AlertaAemet[]> {
  return new Promise((resolve, reject) => {
    const alerts: AlertaAemet[] = [];
    const extract = tar.extract();
    const parser = new XMLParser({ ignoreAttributes: false, ignoreDeclaration: true });

    extract.on("entry", (header: { name: string }, stream: Readable, next: () => void) => {
      let xmlData = "";
      stream.on("data", (chunk) => (xmlData += chunk.toString()));
      stream.on("end", () => {
        try {
          const json = parser.parse(xmlData) as { alert?: AlertaAemet };
          if (json?.alert) alerts.push(json.alert);
        } catch (err) {
          console.error("Error parseando XML:", err);
        }
        next();
      });
      stream.resume();
    });

    extract.on("finish", () => resolve(alerts));
    extract.on("error", (err: Error) => reject(err));

    extract.end(buffer);
  });
}
