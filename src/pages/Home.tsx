import React from 'react';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/Services';
import { ForeignerSection } from '../components/TrustAndForeigner';

import { Testimonials } from '../components/Testimonials';

interface HomeProps {
  onOpenBooking: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenBooking }) => {
  return (
    <main>
      <Hero onOpenBooking={onOpenBooking} />
      
      <section className="py-12 bg-white border-y border-brand-border">
         <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                  <span className="font-bold text-brand-text-main">Aperti: Tutti i giorni dalle 10:00 alle 22:00</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                  <span className="font-bold text-brand-text-main">📞 Chiamaci: +39 366 810 2727 / +39 380 472 6065</span>
               </div>
            </div>
         </div>
      </section>

      <ServicesSection />
      
      <ForeignerSection />

      <Testimonials />
      
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12 text-center">
           <h2 className="text-3xl md:text-5xl font-black text-brand-text-main mb-6">Pronto a gestire le tue pratiche?</h2>
           <p className="text-lg text-brand-text-muted mb-10 max-w-2xl mx-auto">
              Prenota un appuntamento oggi stesso e dimentica lo stress della burocrazia. 
              Siamo qui per aiutarti.
           </p>
           <button onClick={onOpenBooking} className="bg-brand-blue text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-blue-light transition-all shadow-xl">
              Richiedi Consulenza Gratuita
           </button>
        </div>
      </section>

      <section className="py-20 bg-brand-bg">
        <div className="container mx-auto px-4 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black text-brand-text-main mb-12 text-center uppercase tracking-tight">Domande Frequenti (FAQ)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border/50">
                <h4 className="font-bold text-brand-blue mb-3">Chi può usufruire dei servizi del CAF?</h4>
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  Tutti i cittadini, residenti e stranieri, che necessitano di assistenza fiscale, previdenziale o burocratica per gestire le proprie pratiche.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border/50">
                <h4 className="font-bold text-brand-blue mb-3">Come posso prenotare un appuntamento?</h4>
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  Puoi prenotare direttamente online cliccando sul tasto "Richiedi Consulenza" o chiamandoci telefonicamente durante l'orario di apertura.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border/50">
                <h4 className="font-bold text-brand-blue mb-3">Quali documenti servono per il 730?</h4>
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  Solitamente la Certificazione Unica (CU), scontrini fiscali per spese mediche, interessi passivi mutuo e giustificativi di oneri detraibili.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
