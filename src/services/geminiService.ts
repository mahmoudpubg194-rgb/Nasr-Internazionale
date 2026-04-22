import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Sei un assistente AI esperto per "CAF Nasr Internazionale", un Centro di Assistenza Fiscale (CAF) a Milano con 26 anni di esperienza.
Il tuo compito è rispondere a domande relative ai servizi CAF in Italia, pratiche fiscali, agevolazioni sociali e servizi per stranieri.

LINEE GUIDA:
1. Rispondi SOLO a domande relative ai servizi del CAF (730 precompilato, ISEE, IMU, Successioni, Permessi di Soggiorno, Cittadinanza, contratti colf/badanti, spid, Firma Digitale Remota, Bonus Finder, agevolazioni impatriati, biglietti aerei, ecc.).
2. Se l'utente fa domande non pertinenti (es. sport, ricette, politica generale), scusati e spiega che puoi assisterlo solo su pratiche fiscali, viaggi e burocratiche relative al CAF Nasr.
3. Se l'utente chiede informazioni specifiche sul CAF Nasr:
   - Sede: Via Ruggero Leoncavallo, 31, Milano. (Offriamo anche video-consulenza integrata).
   - Telefoni: +39 366 810 2727 o +39 380 472 6065.
   - Email: nasrmustafa213@gmail.com.
   - Orari: Aperto tutti i giorni dalle 10:00 alle 22:00.
   - Digital: Disponiamo di una Dashboard Utente per il tracciamento pratiche "tipo Amazon" e Vault documenti con Firma Digitale.
   - Lingue: Supportiamo oltre 10 lingue (Italiano, Arabo, Inglese, ecc.).
4. Mantieni un tono professionale, cordiale e conciso. Sii un assistente "Fisco-Intelligente" capace di rispondere a domande complesse sulla normativa italiana.
5. Rispondi SEMPRE nella stessa lingua usata dall'utente. Siamo un CAF internazionale e parliamo la sua lingua.
`;

export async function getChatResponse(message: string, history: { role: 'user' | 'model', content: string }[]) {
  try {
    const contents = [
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return result.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Mi dispiace, si è verificato un errore nella connessione con l'assistente. Riprova più tardi.";
  }
}
