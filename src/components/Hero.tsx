import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Phone, CheckCircle2, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Hero = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[500px] flex items-center pt-[72px] hero-gradient pb-24 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-3/5 text-white"
          >
            <div className="inline-flex items-center px-3 py-1.5 bg-white/15 rounded-full text-white text-[12px] font-bold uppercase tracking-wider mb-6 border border-white/10 backdrop-blur-sm">
              {t('hero_badge')}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1]">
              {t('hero_title')}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl leading-relaxed">
              {t('hero_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onOpenBooking}
                className="bg-white hover:bg-gray-100 text-brand-blue px-10 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all shadow-xl"
              >
                {t('hero_cta_booking')}
              </button>
              <a
                href="https://wa.me/393668102727"
                target="_blank"
                rel="noreferrer"
                className="bg-brand-green hover:bg-brand-green/90 text-white px-10 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all shadow-lg"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                {t('hero_cta_whatsapp')}
              </a>
            </div>
          </motion.div>

          <div className="lg:w-2/5 hidden lg:flex items-center justify-center">
            <div className="bg-white/10 p-12 rounded-full w-[340px] h-[340px] border border-white/10 flex flex-col items-center justify-center text-center">
               <div className="text-6xl mb-4">🤝</div>
               <p className="text-2xl font-bold text-white leading-tight">{t('sections_trust_title')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar - anchored at bottom of section */}
      <div className="absolute bottom-0 left-4 right-4 md:left-[48px] md:right-[48px]">
        <div className="bg-white rounded-t-2xl h-24 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-around px-8 border-x border-t border-brand-border">
          {[
            { label: t('stats_years'), value: t('stats_years_val') },
            { label: t('stats_clients'), value: '10k+' },
            { label: t('stats_languages'), value: '10' },
            { label: t('stats_speed'), value: '24h' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
               <span className="text-2xl md:text-3xl font-extrabold text-brand-blue">{stat.value}</span>
               <span className="text-[10px] md:text-xs font-bold text-brand-text-muted uppercase tracking-tighter text-center md:text-left leading-tight max-w-[80px]">
                {stat.label}
               </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
