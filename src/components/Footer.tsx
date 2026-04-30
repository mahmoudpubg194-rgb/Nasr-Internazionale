import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WhatsAppButton = () => {
  const { t } = useTranslation();
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
        {t('hero_cta_whatsapp')}
      </span>
      <MessageCircle size={28} className={ "ml-0 group-hover:ml-2 transition-all" } />
    </motion.a>
  );
};

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer id="contatti" className="bg-brand-blue text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic">
              CAF <span className="text-brand-green">Nasr</span>
            </h2>
            <p className="text-blue-100/70 text-sm leading-relaxed">
              {t('sections_trust_desc')}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">{t('nav_services')}</h4>
            <ul className="space-y-4 text-blue-100/70">
              <li><a href="/servizi" className="hover:text-brand-green">{t('services.fiscale.title')}</a></li>
              <li><a href="/servizi" className="hover:text-brand-green">{t('services.agevolazioni.title')}</a></li>
              <li><a href="/privacy" className="hover:text-brand-green">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-brand-green">Termini e Condizioni</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">{t('footer_open')}</h4>
            <ul className="space-y-3 text-blue-100/70 text-sm">
              <li className="flex justify-between font-bold text-brand-green"><span>{t('footer_working_days')}</span></li>
              <li className="flex justify-between opacity-70"><span>{t('footer_always_open')}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">{t('footer_contact')}</h4>
            <ul className="space-y-4 text-blue-100/70 text-sm">
              <li className="flex items-start">
                <span className="font-bold text-white mr-2">{t('contact_address_label')}:</span>
                <a 
                  href="https://maps.app.goo.gl/a5ghiW2TqZmk3HxX7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Via Ruggero Leoncavallo, 31, Milano
                </a>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-white mr-2">{t('contact_email_label')}:</span>
                nasrmustafa213@gmail.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-10 text-center text-blue-100/40 text-xs">
          <p>© {new Date().getFullYear()} CAF Nasr Internazionale - {t('footer_rights')} P.IVA 01234567890</p>
        </div>
      </div>
    </footer>
  );
};
