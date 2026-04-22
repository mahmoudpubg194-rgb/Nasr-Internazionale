import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/393668102727"
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-[90] bg-brand-green text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-green/90 transition-all group"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
        Scrivici su WhatsApp
      </span>
      <MessageCircle size={28} className={ "ml-0 group-hover:ml-2 transition-all" } />
    </motion.a>
  );
};

export const Footer = () => {
  return (
    <footer id="contatti" className="bg-brand-blue text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic">
              CAF <span className="text-brand-green">Nasr</span>
            </h2>
            <p className="text-blue-100/70 text-sm leading-relaxed">
              Il tuo punto di riferimento per l'assistenza fiscale e burocratica a Milano. 
              Trasparenza, competenza e supporto multilingue al tuo servizio.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Servizi Rapidi</h4>
            <ul className="space-y-4 text-blue-100/70">
              <li><a href="#" className="hover:text-brand-green">Dichiarazione 730</a></li>
              <li><a href="#" className="hover:text-brand-green">Modello ISEE</a></li>
              <li><a href="#" className="hover:text-brand-green">Permessi di Soggiorno</a></li>
              <li><a href="#" className="hover:text-brand-green">Bonus Famiglia</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Orari di Apertura</h4>
            <ul className="space-y-3 text-blue-100/70 text-sm">
              <li className="flex justify-between font-bold text-brand-green"><span>Lunedì - Domenica</span> <span>10:00 - 22:00</span></li>
              <li className="flex justify-between opacity-70"><span>Sempre Aperti</span> <span>7 giorni su 7</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contattaci</h4>
            <ul className="space-y-4 text-blue-100/70 text-sm">
              <li className="flex items-start">
                <span className="font-bold text-white mr-2">Indirizzo:</span>
                Via Ruggero Leoncavallo, 31, Milano
              </li>
              <li className="flex items-start">
                <span className="font-bold text-white mr-2">Email:</span>
                nasrmustafa213@gmail.com
              </li>
              <li className="flex items-start">
                <span className="font-bold text-white mr-2">Telefoni:</span>
                <div className="flex flex-col">
                  <span>+39 366 810 2727</span>
                  <span>+39 380 472 6065</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-10 text-center text-blue-100/40 text-xs">
          <p>© {new Date().getFullYear()} CAF Nasr Internazionale - Tutti i diritti riservati. P.IVA 01234567890</p>
        </div>
      </div>
    </footer>
  );
};
