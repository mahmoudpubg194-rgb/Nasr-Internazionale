import React from 'react';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/Services';
import { ForeignerSection } from '../components/TrustAndForeigner';

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
      
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12 text-center">
           <h2 className="text-3xl md:text-5xl font-black text-brand-text-main mb-6">Pronto a gestire le tue pratiche?</h2>
           <p className="text-lg text-brand-text-muted mb-10 max-w-2xl mx-auto">
              Prenota un appuntamento oggi stesso e dimentica lo stress della burocrazia. 
              Siamo qui per aiutarti.
           </p>
           <button onClick={onOpenBooking} className="bg-brand-blue text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-blue-light transition-all shadow-xl">
              Prenota Ora (Gratis)
           </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
