import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { SERVICES } from '../constants';

export const BookingFlow = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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

  const times = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
  const dates = [
    { label: 'Oggi', value: '2026-04-22' },
    { label: 'Domani', value: '2026-04-23' },
    { label: 'Venerdì 24', value: '2026-04-24' },
    { label: 'Sabato 25', value: '2026-04-25' },
    { label: 'Lunedì 27', value: '2026-04-27' },
  ];

  const handleFinish = () => {
    // In a real app, send to API
    nextStep();
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
              <h2 className="text-xl font-black text-brand-blue">Prenota Appuntamento</h2>
              <p className="text-sm text-gray-500">Step {step} di 4</p>
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
                <h3 className="text-lg font-bold mb-4">Quale servizio ti serve?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setFormData({ ...formData, service: s.title }); nextStep(); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${formData.service === s.title ? 'border-brand-green bg-green-50' : 'border-gray-100 hover:border-brand-blue hover:bg-brand-accent'}`}
                    >
                      <p className="font-bold">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.price || 'Consulenza dedicata'}</p>
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
                <div>
                  <h3 className="text-lg font-bold mb-4">Scegli la data</h3>
                  <div className="flex flex-wrap gap-2">
                    {dates.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setFormData({ ...formData, date: d.label })}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${formData.date === d.label ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.date && (
                  <div>
                    <h3 className="text-lg font-bold mb-4">Scegli l'orario</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {times.map(t => (
                        <button
                          key={t}
                          onClick={() => setFormData({ ...formData, time: t })}
                          className={`p-2 rounded-lg border-2 text-center font-medium transition-all ${formData.time === t ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="flex items-center text-gray-500 font-bold">
                    <ChevronLeft size={20} className="mr-1" /> Indietro
                  </button>
                  <button
                    disabled={!formData.date || !formData.time}
                    onClick={nextStep}
                    className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center"
                  >
                    Continua <ChevronRight size={20} className="ml-1" />
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
                className="space-y-4"
              >
                <h3 className="text-lg font-bold mb-4">I tuoi dati</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome e Cognome"
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-brand-blue outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Cellulare"
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-brand-blue outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email (opzionale)"
                    className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-brand-blue outline-none"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="flex items-center text-gray-500 font-bold">
                    <ChevronLeft size={20} className="mr-1" /> Indietro
                  </button>
                  <button
                    disabled={!formData.name || !formData.phone}
                    onClick={handleFinish}
                    className="bg-brand-green text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Conferma Prenotazione
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
                <h2 className="text-3xl font-black text-brand-blue">Appuntamento Confermato!</h2>
                <div className="bg-brand-accent p-6 rounded-2xl inline-block text-left w-full max-w-sm">
                   <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Dettagli</p>
                   <p className="font-bold text-gray-800">{formData.service}</p>
                   <p className="text-gray-600">{formData.date} alle ore {formData.time}</p>
                   <p className="text-xs text-gray-400 mt-4">Riceverai un promemoria su WhatsApp 2 ore prima dell'appuntamento.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold shadow-lg"
                >
                  Chiudi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
