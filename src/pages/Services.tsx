import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SERVICE_CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services: React.FC<{ onOpenBooking?: () => void }> = ({ onOpenBooking }) => {
  const { t } = useTranslation();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategoryId(expandedCategoryId === id ? null : id);
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = (Icons as any)[category.iconName] || Icons.HelpCircle;
            const isExpanded = expandedCategoryId === category.id;
            
            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleCategory(category.id)}
                className={`bg-white rounded-3xl p-10 shadow-sm border border-brand-border flex flex-col h-full hover:shadow-xl transition-all group cursor-pointer ${isExpanded ? 'ring-2 ring-brand-blue border-transparent' : ''}`}
              >
                <motion.div layout className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center mb-8 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <Icon className="w-8 h-8" />
                </motion.div>
                
                <motion.h3 layout className="text-2xl font-bold text-brand-text-main mb-4 tracking-tight flex items-center gap-3">
                  <Icon className="w-6 h-6 text-brand-blue/70 shrink-0" />
                  {category.title}
                </motion.h3>
                
                <motion.p layout className="text-sm text-brand-text-muted mb-8 leading-relaxed">
                  {category.description}
                </motion.p>

                <motion.div 
                  layout
                  className="overflow-hidden"
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : '0px', opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="space-y-4 mb-10 pt-4">
                    {category.items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex flex-col gap-2 p-4 bg-brand-bg rounded-xl border border-brand-border/50 group/item hover:border-brand-blue/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                </motion.div>

                <motion.div layout className="pt-8 border-t border-brand-border mt-auto flex flex-col gap-4">
                   <div className="text-center text-brand-blue/60 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                     {isExpanded ? (
                       <>Chiudi <Icons.ChevronUp size={14} /></>
                     ) : (
                       <>Scopri i servizi <Icons.ChevronDown size={14} /></>
                     )}
                   </div>
                   {isExpanded && (
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         onOpenBooking?.();
                       }}
                       className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-brand-blue-light transition-all flex items-center justify-center"
                     >
                        Prenota Appuntamento
                     </button>
                   )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
