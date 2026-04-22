import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Globe, Languages, FileCheck, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TrustSection = () => {
  return null; // Integrated into Hero trust bar
};

export const ForeignerSection = () => {
  const { t } = useTranslation();

  return (
    <section id="stranieri" className="py-24 hero-gradient relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 text-white">
            <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/5">
              {t('foreigner_section_badge')}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
              {t('foreigner_section_title')}
            </h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              {t('foreigner_section_desc')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-white/90">
              {[
                { title: t('services.stranieri-extra.title'), desc: t('foreigner_feature_languages'), icon: Globe },
                { title: t('foreigner_feature_permits'), desc: t('foreigner_feature_permits_desc'), icon: FileCheck },
                { title: t('foreigner_feature_citizenship'), desc: t('foreigner_feature_citizenship_desc'), icon: Landmark },
                { title: t('foreigner_feature_family'), desc: t('foreigner_feature_family_desc'), icon: Users },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-[12px] opacity-70 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-2xl shadow-2xl relative z-10 border border-brand-border"
              >
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-brand-bg rounded-lg flex items-center justify-center text-brand-blue">
                      <FileCheck size={28} />
                   </div>
                   <h3 className="text-2xl font-bold text-brand-text-main">{t('checklist_title')}</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    t('checklist_item_1', 'Passaporto Originale'),
                    t('checklist_item_2', 'Vecchi Permessi di Soggiorno'),
                    t('checklist_item_3', 'Contratto di Lavoro o Redditi'),
                    t('checklist_item_4', 'Certificato di Residenza'),
                    t('checklist_item_5', 'Marca da Bollo €16,00')
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-brand-bg rounded-lg border border-brand-border">
                      <div className="w-4 h-4 rounded bg-brand-blue/10 flex items-center justify-center mr-3">
                         <div className="w-2 h-2 bg-brand-blue rounded-sm" />
                      </div>
                      <span className="text-sm text-brand-text-main font-semibold">{doc}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-8 bg-brand-blue text-white py-4 rounded-lg font-bold hover:bg-brand-blue-light transition-all shadow-md">
                  {t('checklist_download')}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
