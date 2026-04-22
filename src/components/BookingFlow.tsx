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
        alert('Si è verificato un errore durante la prenotazione. Riprova più tardi.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Errore di connessione. Controlla la tua rete.');
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
                      className={`p-4 rounded-xl border-2 text-left transition-all ${formData.service === s.title ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:border-brand-blue hover:bg-brand-bg/50'}`}
                    >
                      <p className="font-bold text-sm text-brand-text-main">{s.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Consulenza dedicata</p>
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
                  <h3 className="text-lg font-bold mb-2">Quando vuoi venire?</h3>
                  <p className="text-sm text-gray-500 mb-6 italic">Seleziona il giorno e l'ora che preferisci. Siamo aperti tutti i giorni.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Data Appuntamento</label>
                      <input 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-4 bg-brand-bg rounded-xl border-2 border-brand-border focus:border-brand-blue outline-none transition-all font-bold text-brand-text-main"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Ora Appuntamento</label>
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
                    <ChevronLeft size={20} className="mr-1" /> Indietro
                  </button>
                  <button
                    disabled={!formData.date || !formData.time}
                    onClick={nextStep}
                    className="bg-brand-blue text-white px-10 py-4 rounded-xl font-bold disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl transition-all"
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
