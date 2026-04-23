import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-blue">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
          </div>

          <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-blue" />
                1. Trattamento dei Dati Sensibili
              </h2>
              <p>
                CAF Nasr, in conformità al GDPR (Regolamento UE 2016/679), tratta i dati personali e sensibili (fiscali, sanitari e familiari) esclusivamente per l'erogazione dei servizi richiesti. Utilizziamo crittografia end-to-end per proteggere i tuoi documenti caricati nell'area riservata.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-blue" />
                2. Finalità del Trattamento
              </h2>
              <p>
                I dati vengono raccolti per:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Elaborazione di dichiarazioni fiscali (730, ISEE, RED).</li>
                <li>Gestione di pratiche previdenziali e assistenziali.</li>
                <li>Comunicazioni relative allo stato delle pratiche tramite email o WhatsApp.</li>
                <li>Adempimento di obblighi di legge e controlli dell'Agenzia delle Entrate.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-blue" />
                3. Conservazione e Sicurezza
              </h2>
              <p>
                I documenti caricati nel Vault sono conservati per il tempo strettamente necessario all'elaborazione e per i periodi previsti dalla normativa fiscale italiana (solitamente 10 anni). Non cediamo i tuoi dati a terze parti per finalità marketing.
              </p>
            </section>

            <section className="bg-brand-bg p-6 rounded-2xl border border-brand-border/50">
              <h3 className="font-bold text-brand-blue mb-2">Titolare del Trattamento</h3>
              <p className="text-sm">
                CAF Nasr Internazionale<br/>
                Via Ruggero Leoncavallo, 31, 20131 Milano (MI)<br/>
                P.IVA: 01234567890<br/>
                Email: nasrmustafa213@gmail.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
