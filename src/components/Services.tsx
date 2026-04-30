import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants';
import { useTranslation } from 'react-i18next';

interface ServiceCategoryCardProps {
  category: any;
  index: number;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category, index }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = (Icons as any)[category.iconName] || Icons.HelpCircle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-brand-border flex flex-col h-full group border-b-4 border-b-brand-blue"
    >
      <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-brand-blue" />
      </div>
      
      <h3 className="text-xl font-bold text-brand-text-main mb-3 leading-tight tracking-tight flex items-center gap-2">
        <Icon className="w-5 h-5 text-brand-blue/70 shrink-0" />
        {t(`services.${category.id}.title`, category.title) as string}
      </h3>
      
      <p className="text-[13px] text-brand-text-muted mb-6 leading-relaxed">
        {t(`services.${category.id}.desc`, category.description) as string}
      </p>

      <ul className="space-y-3 mb-8 flex-grow">
        {category.items.slice(0, 3).map((item: any, i: number) => (
          <li key={i} className="flex items-start gap-3 text-[13px] text-brand-text-main group/item">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/30 mt-1.5 group-hover/item:bg-brand-blue transition-colors" />
            <span className="leading-tight">{item.name || (t(`services.${category.id}.item_${i}`, item) as string)}</span>
          </li>
        ))}
        {category.items.length > 3 && !isExpanded && (
          <li className="text-[11px] font-bold text-brand-blue/60 italic ml-4">
            + altri {category.items.length - 3} servizi...
          </li>
        )}
      </ul>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-6 space-y-4 border-t border-brand-border/50">
              <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">Dettaglio Servizi e Prezzi:</p>
              {category.items.map((item: any, i: number) => (
                <div key={item.id || i} className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border/30 hover:border-brand-blue/30 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-bold text-brand-text-main">{item.name}</span>
                    <span className="text-brand-blue font-black text-[12px]">
                      {item.price === 0 ? 'Gratis' : `€${item.price}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-text-muted leading-tight">
                    {t(`services.${category.id}.item_${i}`, '') as string}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="pt-6 border-t border-brand-border mt-auto flex items-center justify-between group/link cursor-pointer"
      >
        <span className="text-[11px] font-bold text-brand-blue uppercase tracking-widest group-hover/link:translate-x-1 transition-transform inline-block">
          {isExpanded ? t('close', 'Chiudi') : t('service_request_info')}
        </span>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <Icons.ChevronUp className="w-4 h-4 text-brand-blue group-hover/link:-translate-y-1 transition-transform" />
          ) : (
            <Icons.ChevronRight className="w-4 h-4 text-brand-blue group-hover/link:translate-x-1 transition-transform" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ServicesSection = () => {
  const { t } = useTranslation();

  return (
    <section id="servizi" className="py-24 bg-brand-bg/30">
      <div className="container mx-auto px-4 md:px-12">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-brand-blue text-[10px] font-bold uppercase tracking-wider mb-6 border border-brand-border">
            {t('sections_portfolio') as string}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text-main mb-6 leading-tight">
            {t('sections_portfolio_title') as string}
          </h2>
          <p className="text-lg text-brand-text-muted leading-relaxed">
            {t('sections_portfolio_desc') as string}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_CATEGORIES.map((category, index) => (
            <ServiceCategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
