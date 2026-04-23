import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { SERVICES } from '../constants';
import { useTranslation } from 'react-i18next';

export const BookingFlow = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: ''
  });

  if (!isOpen) return null;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = async () => {
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        nextStep();
      } else {
        alert(t('error_booking', 'Si è verificato un errore durante la prenotazione. Riprova più tardi.'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(t('error_connection', 'Errore di connessione. Controlla la tua rete.'));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-blue/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-brand-accent p-6 flex justify-between items-center border-b border-gray-100">
           <div>
              <h2 className="text-xl font-black text-brand-blue">{t('book_title')}</h2>
              <p className="text-sm text-gray-500">{t('book_step', { step })}</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} className="text-gray-400" />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold mb-4">{t('book_service_q')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setFormData({ ...formData, service: t(`services.${s.id}.title`, s.title) }); nextStep(); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${formData.service === t(`services.${s.id}.title`, s.title) ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:border-brand-blue hover:bg-brand-bg/50'}`}
                    >
                      <p className="font-bold text-sm text-brand-text-main">{t(`services.${s.id}.title`, s.title)}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">{t('service_dedicated_consultation', 'Consulenza dedicata')}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-2">{t('book_date_q')}</h3>
                  <p className="text-sm text-gray-500 mb-6 italic">{t('book_date_info')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">{t('book_date_label')}</label>
                      <input 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-4 bg-brand-bg rounded-xl border-2 border-brand-border focus:border-brand-blue outline-none transition-all font-bold text-brand-text-main"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">{t('book_time_label')}</label>
                      <input 
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full p-4 bg-brand-bg rounded-xl border-2 border-brand-border focus:border-brand-blue outline-none transition-all font-bold text-brand-text-main"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
                  <button onClick={prevStep} className="flex items-center text-gray-400 font-bold hover:text-brand-blue transition-colors">
                    <ChevronLeft size={20} className="mr-1" /> {t('book_back')}
                  </button>
                  <button
                    disabled={!formData.date || !formData.time}
                    onClick={nextStep}
                    className="bg-brand-blue text-white px-10 py-4 rounded-xl font-bold disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('book_next')} <ChevronRight size={20} className="ml-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-black text-brand-blue mb-2">{t('book_data_q')}</h3>
                  <p className="text-sm text-gray-400">{t('book_data_desc', 'Inserisci i tuoi recapiti per essere ricontattato.')}</p>
                </div>

                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors z-10 pointer-events-none">
                      <User size={20} />
                    </div>
                    <input
                      id="booking-name"
                      type="text"
                      placeholder=" "
                      className={`peer w-full pl-12 pr-12 pt-6 pb-2 rounded-xl border-2 outline-none transition-all font-bold text-brand-text-main ${
                        formData.name ? 'border-brand-blue/30 bg-blue-50/20' : 'border-gray-100 bg-brand-bg hover:border-gray-200'
                      } focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5`}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <label 
                      htmlFor="booking-name"
                      className="absolute left-12 top-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all pointer-events-none
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal
                        peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-blue"
                    >
                      {t('book_name_ph')}
                    </label>
                    <AnimatePresence>
                      {formData.name && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-green"
                        >
                          <CheckCircle2 size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Phone Input */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors z-10 pointer-events-none">
                      <Phone size={20} />
                    </div>
                    <input
                      id="booking-phone"
                      type="tel"
                      placeholder=" "
                      className={`peer w-full pl-12 pr-12 pt-6 pb-2 rounded-xl border-2 outline-none transition-all font-bold text-brand-text-main ${
                        formData.phone.length >= 8 ? 'border-brand-blue/30 bg-blue-50/20' : 'border-gray-100 bg-brand-bg hover:border-gray-200'
                      } focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5`}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <label 
                      htmlFor="booking-phone"
                      className="absolute left-12 top-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all pointer-events-none
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal
                        peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-blue"
                    >
                      {t('book_phone_ph')}
                    </label>
                    <AnimatePresence>
                      {formData.phone.length >= 8 && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-green"
                        >
                          <CheckCircle2 size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors z-10 pointer-events-none">
                      <Mail size={20} />
                    </div>
                    <input
                      id="booking-email"
                      type="email"
                      placeholder=" "
                      className={`peer w-full pl-12 pr-12 pt-6 pb-2 rounded-xl border-2 outline-none transition-all font-bold text-brand-text-main ${
                        formData.email && formData.email.includes('@') ? 'border-brand-blue/30 bg-blue-50/20' : 'border-gray-100 bg-brand-bg hover:border-gray-200'
                      } focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5`}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <label 
                      htmlFor="booking-email"
                      className="absolute left-12 top-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all pointer-events-none
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal
                        peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-blue"
                    >
                      {t('book_email_ph')}
                    </label>
                    <AnimatePresence>
                      {formData.email && formData.email.includes('@') && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-green"
                        >
                          <CheckCircle2 size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-gray-100">
                  <button onClick={prevStep} className="flex items-center text-gray-400 font-bold hover:text-brand-blue transition-colors">
                    <ChevronLeft size={20} className="mr-1" /> {t('book_back')}
                  </button>
                  <button
                    disabled={!formData.name || !formData.phone}
                    onClick={handleFinish}
                    className="w-full sm:w-auto bg-brand-blue text-white px-12 py-4 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('book_confirm')}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-brand-blue">{t('book_success')}</h2>
                <div className="bg-brand-accent p-6 rounded-2xl inline-block text-left w-full max-w-sm">
                   <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">{t('book_details')}</p>
                   <p className="font-bold text-gray-800">{formData.service}</p>
                   <p className="text-gray-600">{formData.date} {t('book_at_hour')} {formData.time}</p>
                   <p className="text-xs text-gray-400 mt-4">{t('book_reminder')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold shadow-lg"
                >
                  {t('book_close')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
