import React from 'react';
import { motion } from 'motion/react';
import { Gavel, CreditCard, Clock, CheckCircle } from 'lucide-react';

const Terms = () => {
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
              <Gavel size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Termini e Condizioni</h1>
          </div>

          <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
            <p className="font-medium italic">
              L'utilizzo dei servizi digitali di CAF Nasr implica l'accettazione integrale dei presenti Termini e Condizioni.
            </p>

            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-blue" />
                1. Pagamento e Inizio del Servizio
              </h2>
              <p>
                Il servizio acquistato tramite il portale e-commerce (es. Modello 730, ISEE) si considera attivato solo dopo la ricezione del pagamento integrale tramite gateway sicuro. CAF Nasr inizierà l'analisi della pratica esclusivamente a pagamento avvenuto e dopo il caricamento della documentazione minima richiesta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-blue" />
                2. Tempistiche di Elaborazione
              </h2>
              <p>
                Le tempistiche medie variano da 48 a 72 ore lavorative dal momento del caricamento di TUTTI i documenti necessari. In periodi di alta affluenza fiscale (Giugno-Luglio), le tempistiche potrebbero estendersi fino a 7 giorni lavorativi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-blue" />
                3. Responsabilità dei Dati
              </h2>
              <p>
                Il cliente è l'unico responsabile della veridicità dei dati forniti e dei documenti caricati. CAF Nasr declina ogni responsabilità per sanzioni derivanti da omissioni o documenti mendaci forniti dall'utente.
              </p>
            </section>

            <section className="bg-brand-bg p-8 rounded-2xl border border-brand-border">
              <h3 className="font-black text-brand-blue mb-4 uppercase tracking-widest text-sm">Dati Societari</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="block text-gray-400 font-bold uppercase text-[10px] mb-1">Denominazione</span>
                  <p className="font-bold text-gray-900">CAF Nasr Internazionale</p>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold uppercase text-[10px] mb-1">Sede Sociale</span>
                  <p className="font-bold text-gray-900">Via Ruggero Leoncavallo, 31, Milano</p>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold uppercase text-[10px] mb-1">Partita IVA</span>
                  <p className="font-bold text-gray-900">01234567890</p>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold uppercase text-[10px] mb-1">Iscrizione Albo</span>
                  <p className="font-bold text-gray-900">Iscritto all'Albo Nazionale dei CAF n. 0000</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
