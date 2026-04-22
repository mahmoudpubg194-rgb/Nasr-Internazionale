import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    alert('Richiesta inviata con successo! Ti ricontatteremo a breve.');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-brand-text-main mb-6 leading-tight">
            Sei a un passo dal<br/>
            <span className="text-brand-blue">risolvere i tuoi dubbi.</span>
          </h1>
          <p className="text-lg text-brand-text-muted leading-relaxed">
            Siamo a tua completa disposizione. Scegli il metodo che preferisci per contattarci 
            o vieni a trovarci nel nostro ufficio a Milano.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border h-full flex flex-col justify-between">
              <h3 className="text-2xl font-bold text-brand-text-main mb-8">Informazioni di Contatto</h3>
              
              <div className="space-y-6 flex-grow">
                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-brand-border shadow-sm group hover:border-brand-blue transition-all">
                   <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-1">Indirizzo</div>
                      <div className="text-lg font-bold text-brand-text-main leading-tight">Via Ruggero Leoncavallo, 31, 20131 Milano (MI)</div>
                   </div>
                </div>

                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-brand-border shadow-sm group hover:border-brand-blue transition-all">
                   <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone size={24} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-1">Telefoni</div>
                      <div className="text-lg font-bold text-brand-text-main leading-tight">+39 366 810 2727</div>
                      <div className="text-lg font-bold text-brand-text-main leading-tight">+39 380 472 6065</div>
                   </div>
                </div>

                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-brand-border shadow-sm group hover:border-brand-blue transition-all">
                   <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-1">E-mail</div>
                      <div className="text-lg font-bold text-brand-text-main leading-tight">nasrmustafa213@gmail.com</div>
                   </div>
                </div>

                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-brand-border shadow-sm group hover:border-brand-blue transition-all">
                   <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Clock size={24} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-1">Orari di Apertura</div>
                      <div className="text-lg font-bold text-brand-text-main leading-tight">Lun - Dom: 10:00 - 22:00</div>
                      <div className="text-sm text-brand-green font-bold uppercase mt-1">Sempre Aperti</div>
                   </div>
                </div>
              </div>

              <div className="pt-8">
                 <a 
                   href="https://wa.me/393668102727" 
                   target="_blank" 
                   className="flex items-center justify-center w-full py-5 bg-brand-green text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
                 >
                   <MessageCircle className="mr-3" />
                   Chiedi su WhatsApp
                 </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
             className="bg-white p-10 rounded-3xl shadow-xl border border-brand-border"
          >
            <h3 className="text-2xl font-bold text-brand-text-main mb-8">Inviaci un Messaggio</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-brand-text-muted uppercase mb-2">Nome Completo</label>
                    <input 
                      {...register('name', { required: true })}
                      placeholder="Il tuo nome" 
                      className={`w-full px-5 py-4 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-blue outline-none transition-all ${errors.name ? 'border-red-500' : ''}`}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-brand-text-muted uppercase mb-2">Email</label>
                    <input 
                      {...register('email', { required: true })}
                      type="email"
                      placeholder="email@esempio.it" 
                      className={`w-full px-5 py-4 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-blue outline-none transition-all ${errors.email ? 'border-red-500' : ''}`}
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-brand-text-muted uppercase mb-2">Servizio di Interesse</label>
                 <select 
                    {...register('service')}
                    className="w-full px-5 py-4 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-blue outline-none transition-all"
                 >
                    <option value="fiscale">Dichiarazione Redditi (730/Unico)</option>
                    <option value="isee">Calcolo ISEE / Bonus</option>
                    <option value="stranieri">Pratiche per Stranieri</option>
                    <option value="immobiliare">Ufficio Casa / IMU</option>
                    <option value="altro">Altro</option>
                 </select>
              </div>

              <div>
                 <label className="block text-xs font-bold text-brand-text-muted uppercase mb-2">Messaggio</label>
                 <textarea 
                    {...register('message', { required: true })}
                    rows={6}
                    placeholder="Come possiamo aiutarti?" 
                    className={`w-full px-5 py-4 rounded-xl border border-brand-border bg-brand-bg focus:ring-2 focus:ring-brand-blue outline-none transition-all resize-none ${errors.message ? 'border-red-500' : ''}`}
                 />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold text-lg hover:bg-brand-blue-light hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
              >
                Invia Messaggio
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <p className="text-[11px] text-center text-brand-text-muted opacity-60">
                 Inviando il modulo accetti la nostra politica sulla privacy. 
                 Ti risponderemo entro 24 ore lavorative.
              </p>
            </form>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white h-[500px] relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.1033285705357!2d9.2217647!3d45.4878566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c6ef49cd2959%3A0x6b45f1b1c6d1774e!2sVia%20Ruggero%20Leoncavallo%2C%2031%2C%2020131%20Milano%20MI!5e0!3m2!1sit!2sit!4v1713801234567!5m2!1sit!2sit" 
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
