import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants';
import { Service } from '../types';

interface ServiceCategoryCardProps {
  category: any;
  index: number;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category, index }) => {
  const Icon = (Icons as any)[category.iconName] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-brand-border flex flex-col h-full group border-b-4 border-b-brand-blue"
    >
      <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-brand-blue" />
      </div>
      
      <h3 className="text-xl font-bold text-brand-text-main mb-3 leading-tight tracking-tight">
        {category.title}
      </h3>
      
      <p className="text-[13px] text-brand-text-muted mb-6 leading-relaxed">
        {category.description}
      </p>

      <ul className="space-y-3 mb-8 flex-grow">
        {category.items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-[13px] text-brand-text-main group/item">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/30 mt-1.5 group-hover/item:bg-brand-blue transition-colors" />
            <span className="leading-tight">{item}</span>
          </li>
        ))}
      </ul>

      <div className="pt-6 border-t border-brand-border mt-auto flex items-center justify-between group/link cursor-pointer">
        <span className="text-[11px] font-bold text-brand-blue uppercase tracking-widest group-hover/link:translate-x-1 transition-transform inline-block">Richiedi Info</span>
        <Icons.ChevronRight className="w-4 h-4 text-brand-blue group-hover/link:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

export const ServicesSection = () => {
  return (
    <section id="servizi" className="py-24 bg-brand-bg/30">
      <div className="container mx-auto px-4 md:px-12">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-brand-blue text-[10px] font-bold uppercase tracking-wider mb-6 border border-brand-border">
            Il Nostro Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text-main mb-6 leading-tight">
            Servizi completi per ogni<br />esigenza fiscale e burocratica
          </h2>
          <p className="text-lg text-brand-text-muted leading-relaxed">
            Offriamo un'ampia gamma di servizi per privati e lavoratori, con un focus particolare sulla 
            trasparenza e sulla velocità di esecuzione delle pratiche.
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
