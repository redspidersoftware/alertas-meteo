import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessages } from "@/lib/sendWhatsApp";

export async function POST(req: NextRequest) {
  try {
    const { recipients, message, imageUrl } = await req.json();
    console.log("Enviando WhatsApp a:", recipients, message, imageUrl);

    const messages = recipients.map((to: string) => ({ to, message, imageUrl }));
    const results = await sendWhatsAppMessages(messages);

    console.log("Resultados Twilio:", results);
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error en API WhatsApp:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
