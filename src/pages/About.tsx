import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, History, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { key: 'item_0', icon: History },
    { key: 'item_1', icon: ShieldCheck },
    { key: 'item_2', icon: Award },
    { key: 'item_3', icon: Users },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-black text-brand-text-main mb-8 leading-tight">
              {t('about_title')}<br/>
              <span className="text-brand-blue">{t('about_title_accent')}</span>
            </h1>
            <div className="space-y-6 text-lg text-brand-text-muted leading-relaxed">
              <p>{t('about_mission_1')}</p>
              <p>{t('about_mission_2')}</p>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200" 
                alt={t('hero_badge')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-blue/10 mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-2xl shadow-xl border border-brand-border">
               <div className="text-4xl font-black text-brand-blue mb-1">10k+</div>
               <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest leading-none">{t('about_stats_title')}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-brand-bg rounded-3xl border border-brand-border"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-blue mb-6 shadow-sm">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-text-main mb-2">{t(`about_features.${item.key}.title`)}</h3>
              <p className="text-sm text-brand-text-muted leading-relaxed">{t(`about_features.${item.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-brand-blue rounded-[3rem] p-12 md:p-24 text-white text-center relative overflow-hidden">
           <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">{t('about_ethics_title')}</h2>
              <p className="text-xl opacity-80 mb-12 leading-relaxed italic">
                 "{t('about_ethics_quote')}"
              </p>
              <div className="flex items-center justify-center gap-4">
                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">MN</div>
                 <div className="text-left">
                    <div className="font-bold">Mustafa Nasr</div>
                    <div className="text-sm opacity-60">{t('about_founder_role')}</div>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/20 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default About;
