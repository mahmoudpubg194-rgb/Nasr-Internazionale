import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Globe, PlaneLanding, Building2, Landmark, Briefcase, FileText, ArrowRight } from 'lucide-react';

const Expatriates = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: PlaneLanding,
      title: 'Lavoratori Impatriati',
      desc: 'Agevolazioni fiscali (riduzione base imponibile fino al 90%) per chi rientra in Italia dopo un periodo all\'estero.',
      tag: 'Bonus Rientro'
    },
    {
      icon: Globe,
      title: 'Redditi Esteri / AIRE',
      desc: 'Assistenza per cittadini residenti all\'estero con redditi in Italia o obblighi dichiarativi verso l\'Agenzia delle Entrate.',
      tag: 'Gestione AIRE'
    },
    {
      icon: Building2,
      title: 'Investimenti Immobiliari',
      desc: 'Tassazione specifica per immobili posseduti in Italia da non residenti (IMU, cedolare secca).',
      tag: 'Focus Real Estate'
    },
    {
      icon: Landmark,
      title: 'Monitoraggio Quadro RW',
      desc: 'Dichiarazione di conti correnti, cripto-attività e immobili detenuti fuori dall\'Italia.',
      tag: 'Compliance Internazionale'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-brand-blue" />
            <span className="font-bold text-brand-blue uppercase tracking-widest text-sm">International Tax Desk</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight max-w-4xl">
            Soluzioni fiscali per chi vive nel <span className="text-brand-blue">mondo</span>.
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            Sia che tu stia rientrando in Italia o che risieda già all'estero, gestiamo la tua fiscalità internazionale garantendo il massimo risparmio fiscale e la piena conformità normativa.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5 group hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-blue transition-colors">
                  <s.icon className="w-8 h-8 text-brand-blue group-hover:text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-tighter text-blue-400 bg-blue-50 px-4 py-2 rounded-full">
                  {s.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{s.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {s.desc}
              </p>
              <button className="flex items-center gap-2 font-bold text-brand-blue hover:gap-4 transition-all">
                Scopri di più
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="bg-brand-blue rounded-[50px] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          
          <div className="max-w-xl relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Richiedi una consulenza internazionale dedicata.</h2>
            <p className="text-lg opacity-80 mb-8">Analizziamo la tua posizione per identificare i benefici per impatriati o risolvere pendenze fiscali estere.</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
                <Briefcase className="w-4 h-4" />
                Consulenza Skype/Zoom
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
                <FileText className="w-4 h-4" />
                Analisi Documentale
              </div>
            </div>
          </div>

          <button className="relative z-10 bg-white text-brand-blue px-10 py-6 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-900/20">
            Prenota Video-Chiamata
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expatriates;
