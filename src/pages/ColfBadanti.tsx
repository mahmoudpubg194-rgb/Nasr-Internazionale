import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, FileCheck, Calculator, Users, Clock, CreditCard, Shield } from 'lucide-react';

const ColfBadanti = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Calculator,
      title: 'Buste Paga Automatiche',
      desc: 'Generazione mensile delle buste paga conforme al CCNL Lavoro Domestico.'
    },
    {
      icon: Calendar,
      title: 'Calcolo Contributi INPS',
      desc: 'Calcolo preciso dei MAV trimestrali e gestione scadenze pagamenti.'
    },
    {
      icon: FileCheck,
      title: 'Certificazione Unica (CU)',
      desc: 'Emissione automatica della CU annuale per il lavoratore.'
    },
    {
      icon: Clock,
      title: 'Gestione Ferie e TFR',
      desc: 'Monitoraggio maturazione ferie, permessi e accantonamento TFR.'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-blue-900/5 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          
          <div className="max-w-3xl relative z-10">
            <span className="bg-blue-100 text-brand-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Lavoro Domestico
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mt-6 mb-8 leading-tight">
              Gestione <span className="text-brand-blue">Colf & Badanti</span> completamente digitale.
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Dall'assunzione alla busta paga mensile. Gestiamo noi tutta la burocrazia del tuo collaboratore domestico, così tu puoi dedicarti a quello che conta di più.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/10">
                Inizia Ora
                <Calculator className="w-5 h-5" />
              </button>
              <button className="bg-white border-2 border-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
                Maggiori Info
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-brand-blue transition-colors group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                <f.icon className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Specialized Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-brand-blue rounded-[40px] p-8 md:p-16 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-blue-900/20" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8">Trasparenza totale per datori di lavoro e lavoratori.</h2>
            <div className="space-y-6">
              {[
                { title: 'Prezzi Fissi', desc: 'Nessun costo nascosto. Canone mensile tutto incluso.', icon: CreditCard },
                { title: 'Assistenza Legale', desc: 'Supporto in caso di vertenze o licenziamenti.', icon: Shield },
                { title: 'Area Riservata', desc: 'Ogni documento è sempre disponibile online.', icon: Users },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="opacity-70 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xl">Simulatore Costi</h3>
              <Calculator className="w-6 h-6 opacity-50" />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="opacity-70">Stipendio Netto</span>
                <span className="font-bold">€ 1.250</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="opacity-70">Contributi INPS stimati</span>
                <span className="font-bold">€ 280</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="opacity-70">Rateo TFR/Ferie</span>
                <span className="font-bold">€ 145</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">Costo Totale Datore</span>
                <span className="text-2xl font-black text-blue-400">€ 1.675</span>
              </div>
            </div>
            <button className="w-full bg-white text-brand-blue py-4 rounded-2xl font-bold mt-10 hover:bg-gray-100 transition-colors text-center block">
              Calcola il tuo caso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColfBadanti;
