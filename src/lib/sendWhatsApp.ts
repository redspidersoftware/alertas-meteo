import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export interface WhatsAppMessage {
  to: string;        // Número destino (ej: "+34611222333")
  message: string;   // Texto del mensaje
  imageUrl?: string; // Opcional
}

/**
 * Envía mensajes de WhatsApp a uno o varios números usando Twilio
 */
export async function sendWhatsAppMessages(messages: WhatsAppMessage[]) {
  const results = [];

  for (const msg of messages) {
    try {
      const response = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${msg.to}`,
        body: msg.message,
        mediaUrl: msg.imageUrl ? [msg.imageUrl] : undefined,
      });

      results.push({ to: msg.to, sid: response.sid, status: "sent" });
    } catch (error: any) {
      results.push({ to: msg.to, error: error.message, status: "failed" });
    }
  }

  return results;
}
