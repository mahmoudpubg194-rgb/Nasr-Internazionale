import React from 'react';
import { motion } from 'motion/react';
import { SERVICE_CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-brand-bg/30 min-h-screen">
      <div className="container mx-auto px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-brand-text-main mb-6 leading-tight">
            I Nostri Servizi Professionale
          </h1>
          <p className="text-lg text-brand-text-muted leading-relaxed">
            Dalla consulenza fiscale completa alle pratiche per la cittadinanza, 
            copriamo tutte le necessità burocratiche per singoli, famiglie e lavoratori.
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
                  {category.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border/50 group/item hover:border-brand-blue/30 transition-all">
                      <div className="w-2 h-2 rounded-full bg-brand-blue mt-2 flex-shrink-0" />
                      <span className="text-sm font-semibold text-brand-text-main">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-brand-border mt-auto">
                   <button className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-brand-blue-light transition-all flex items-center justify-center">
                      Richiedi Preventivo Gratuito
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
