import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SERVICE_CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services: React.FC<{ onOpenBooking?: () => void }> = ({ onOpenBooking }) => {
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-24 bg-brand-bg/30 min-h-screen">
      <div className="container mx-auto px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-brand-text-main mb-6 leading-tight">
            {t('services_page_title')}
          </h1>
          <p className="text-lg text-brand-text-muted leading-relaxed">
            {t('services_page_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = (Icons as any)[category.iconName] || Icons.HelpCircle;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-10 shadow-sm border border-brand-border flex flex-col h-full hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center mb-8 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-brand-text-main mb-4 tracking-tight">
                  {category.title}
                </h3>
                
                <p className="text-sm text-brand-text-muted mb-8 leading-relaxed">
                  {category.description}
                </p>

                <div className="space-y-4 flex-grow mb-10">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 p-4 bg-brand-bg rounded-xl border border-brand-border/50 group/item hover:border-brand-blue/30 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-brand-text-main">{item.name}</span>
                        <span className="text-brand-blue font-bold">
                          {item.price === 0 ? 'Gratuito' : `€${item.price}`}
                        </span>
                      </div>
                      <button 
                        onClick={onOpenBooking}
                        className="text-xs font-bold text-brand-blue hover:underline text-left mt-1 flex items-center gap-1"
                      >
                        {item.price === 0 ? 'Prenota Ora' : 'Richiedi Servizio'}
                        <Icons.ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-brand-border mt-auto">
                   <button 
                     onClick={onOpenBooking}
                     className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-brand-blue-light transition-all flex items-center justify-center"
                   >
                      Prenota Appuntamento
                   </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
