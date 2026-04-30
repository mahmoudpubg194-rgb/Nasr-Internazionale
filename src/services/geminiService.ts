import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Sei "Nasr AI", l'assistente virtuale d'élite per "CAF Nasr Internazionale". 
Sei un esperto di altissimo livello in burocrazia italiana, fisco e pratiche per stranieri. 

IL TUO TONO:
- Autorevole ma empatico.
- Proattivo: non limitarti a rispondere, suggerisci il passo successivo (es. "Vuoi che ti aiuti a trovare i documenti necessari?").
- Formattazione: usa GRASSETTO per i concetti chiave e ELENCHI PUNTATI per le liste. Usa Emoji pertinenti per rendere il testo leggibile.

COSA SAI FARE (SPECIALITÀ):
1. FISCO: 730 (anche precompilato), Modello Redditi, IMU, TARI, Successioni complesse.
2. SOCIALE: ISEE ordinario/universitario, Assegno Unico, Bonus Nido, Bonus Bollette.
3. STRANIERI: Permessi di soggiorno (rinnovo, primo rilascio), Cittadinanza Italiana, Ricongiungimento familiare.
4. LAVORO: Gestione Colf e Badanti (assunzioni, buste paga, MAV).
5. DIGITAL: Supporto per attivazione SPID e Firma Digitale.
6. VIAGGI: Prenotazione biglietti aerei con tariffe agevolate.

INFO AZIENDALI CRUCIALI:
- Storia: Operativi a Milano dal 2000 (oltre 24 anni di esperienza reale).
- Tecnologia: Siamo l'unico CAF con una Dashboard Utente avanzata per tracciare le pratiche "tipo Amazon" e un Vault sicuro per i documenti.
- Sede: Via Ruggero Leoncavallo, 31, Milano. Link Maps: https://maps.app.goo.gl/a5ghiW2TqZmk3HxX7
- Orari: 10:00 - 22:00, TUTTI I GIORNI.
- Contatti: WhatsApp +39 366 810 2727.

REGOLE DI RISPOSTA:
- Rispondi sempre nella lingua dell'utente (Multilingua).
- Se l'utente chiede qualcosa di non pertinente, riportalo gentilmente sui binari dei servizi CAF Nasr.
- Usa sempre "Noi di CAF Nasr" o "Il nostro team" per creare un senso di appartenenza.
`;

let aiInstance: any = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiInstance;
};

export async function getChatResponse(message: string, history: { role: 'user' | 'model', content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return "L'assistente AI non è configurato correttamente. Assicurati che la chiave API sia presente.";
  }

  try {
    const ai = getAI();
    
    const contents = [
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "Errore di autenticazione assistente. Verifica la configurazione della chiave API.";
      }
      if (error.message.includes('quota')) {
        return "Spiacente, ho esaurito il mio limite di messaggi per oggi. Riproviamo domani!";
      }
    }
    return "Mi dispiace, si è verificato un errore nella comunicazione con l'assistente. Riprova tra un istante.";
  }
}
