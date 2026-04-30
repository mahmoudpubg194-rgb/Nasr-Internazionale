import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { 
  X, Calendar, Clock, User, Phone, Mail, 
  CheckCircle2, ChevronRight, ChevronLeft, 
  Search, Tag, Plus 
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants';
import { useTranslation } from 'react-i18next';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export const BookingFlow = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    countryCode: '+39'
  });

  const COUNTRY_CODES = [
    { code: '+39', name: 'Italia', flag: '🇮🇹' },
    { code: '+212', name: 'Marocco', flag: '🇲🇦' },
    { code: '+20', name: 'Egitto', flag: '🇪🇬' },
    { code: '+213', name: 'Algeria', flag: '🇩🇿' },
    { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+86', name: 'Cina', flag: '🇨🇳' },
    { code: '+33', name: 'Francia', flag: '🇫🇷' },
    { code: '+49', name: 'Germania', flag: '🇩🇪' },
    { code: '+44', name: 'Regno Unito', flag: '🇬🇧' },
    { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
    { code: '+34', name: 'Spagna', flag: '🇪🇸' },
    { code: '+40', name: 'Romania', flag: '🇷🇴' },
    { code: '+355', name: 'Albania', flag: '🇦🇱' },
    { code: '+380', name: 'Ucraina', flag: '🇺🇦' },
    { code: '+244', name: 'Angola', flag: '🇦🇴' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+221', name: 'Senegal', flag: '🇸🇳' },
  ];

  if (!isOpen) return null;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = async () => {
    try {
      const fullPhone = `${formData.countryCode} ${formData.phone}`;
      const submissionData = {
        ...formData,
        phone: fullPhone
      };

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      // Save to Firestore for the user if logged in
      if (user) {
        try {
          await addDoc(collection(db, 'bookings'), {
            ...submissionData,
            userId: user.uid,
            status: 'confirmed',
            createdAt: serverTimestamp()
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, 'bookings');
        }
      }

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

  const allItems = SERVICE_CATEGORIES.flatMap(cat => 
    cat.items.map(item => ({ 
      ...item, 
      category: cat.title,
      iconName: cat.iconName
    }))
  );

  const isServiceAvailable = (item: any, start: string, end: string) => {
    if (!item.availableFrom || !item.availableTo) return true;
    if (!start && !end) return true;

    const parseMMDD = (mmdd: string) => {
      const [m, d] = mmdd.split('-').map(Number);
      return m * 100 + d;
    };

    const getMonthDay = (dateStr: string) => {
      const d = new Date(dateStr);
      return (d.getMonth() + 1) * 100 + d.getDate();
    };

    const s = parseMMDD(item.availableFrom);
    const e = parseMMDD(item.availableTo);

    // Filter range (default to full year if only one is provided)
    const userS = start ? getMonthDay(start) : 0;
    const userE = end ? getMonthDay(end) : 1231;

    // Standard range (e.g., 04-01 to 09-30)
    if (s <= e) {
      return (userS >= s && userS <= e) || (userE >= s && userE <= e) || (userS <= s && userE >= e);
    } else {
      // Loop-over range (e.g., 10-01 to 03-31)
      return (userS >= s || userS <= e) || (userE >= s || userE <= e) || (userS <= s && userE >= e);
    }
  };
  
  const filteredItems = allItems.filter(item => {
    const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = isServiceAvailable(item, filterStartDate, filterEndDate);
    
    return matchesSearch && matchesDate;
  });

  const shouldShowResults = searchQuery || filterStartDate || filterEndDate;

  const handleSearchTrigger = () => {
    if (!searchQuery.trim()) {
      setSearchError(t('search_empty_error', 'Inserisci un termine di ricerca per iniziare.'));
      return;
    }
    setSearchError(null);
    setSelectedCategoryId(null);
  };
  
  const handleServiceSelect = (serviceName: string) => {
    setFormData({ ...formData, service: serviceName });
    nextStep();
  };

  const currentCategory = SERVICE_CATEGORIES.find(c => c.id === selectedCategoryId);

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
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-brand-blue p-8 flex justify-between items-center text-white relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-2xl font-black">{t('book_title')}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${step === 4 ? 'bg-brand-green' : 'bg-white/20'}`}>
                  {step === 4 ? 'Completato' : `Step ${step}/3`}
                </span>
                <p className="text-blue-100/60 text-xs font-bold uppercase tracking-tight">Prenotazione Online</p>
              </div>
           </div>
           <button onClick={onClose} className="relative z-10 p-3 hover:bg-white/10 rounded-2xl transition-all shadow-inner border border-white/10">
              <X size={24} />
           </button>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-brand-blue">{t('book_service_q')}</h3>
                    <div className="relative w-full md:w-80 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Cerca servizio o categoria..." 
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (searchError) setSearchError(null);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
                        className={`w-full pl-12 pr-28 py-3.5 bg-brand-bg border-2 focus:bg-white outline-none rounded-[1.25rem] text-sm font-bold transition-all shadow-inner ${searchError ? 'border-red-500' : 'border-transparent focus:border-brand-blue/30'}`}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {searchQuery && (
                          <button 
                            onClick={() => {
                              setSearchQuery('');
                              setSearchError(null);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-brand-blue transition-all"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button 
                          onClick={handleSearchTrigger}
                          className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue/90 transition-all"
                        >
                          {t('search_btn', 'Cerca')}
                        </button>
                      </div>
                      {searchError && (
                        <p className="absolute top-full left-4 mt-1 text-[10px] font-bold text-red-500 italic">
                          {searchError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-brand-bg/50 p-6 rounded-[2rem] border border-brand-border/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2 text-brand-blue/60 shrink-0">
                      <Calendar size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('filter_by_date', 'Filtra per date:')}</span>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => {
                          setFilterStartDate(e.target.value);
                          if (e.target.value) setSelectedCategoryId(null);
                        }}
                        className="flex-grow p-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:border-brand-blue outline-none transition-all"
                      />
                      <span className="text-gray-300 text-xs font-bold">al</span>
                      <input 
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => {
                          setFilterEndDate(e.target.value);
                          if (e.target.value) setSelectedCategoryId(null);
                        }}
                        className="flex-grow p-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:border-brand-blue outline-none transition-all"
                      />
                      {(filterStartDate || filterEndDate) && (
                        <button 
                          onClick={() => {
                            setFilterStartDate('');
                            setFilterEndDate('');
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Resetta date"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {shouldShowResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {filterStartDate || filterEndDate ? 'Servizi disponibili in questo periodo' : 'Risultati Ricerca'} ({filteredItems.length})
                      </p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setFilterStartDate('');
                          setFilterEndDate('');
                        }} 
                        className="text-[10px] font-bold text-brand-blue hover:underline uppercase tracking-widest"
                      >
                        Resetta tutto
                      </button>
                    </div>
                    {filteredItems.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {filteredItems.map(item => {
                          const Icon = (Icons as any)[item.iconName] || Tag;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleServiceSelect(item.name)}
                              className="p-5 bg-white border-2 border-gray-100 hover:border-brand-blue hover:shadow-lg hover:-translate-y-0.5 rounded-2xl text-left transition-all group flex justify-between items-center"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all">
                                  <Icon size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-brand-text-main group-hover:text-brand-blue">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">In: {item.category}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-brand-blue">€{item.price}</span>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-brand-bg rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">Nessun servizio trovato.</p>
                      </div>
                    )}
                  </div>
                ) : selectedCategoryId ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedCategoryId(null)}
                        className="p-2 hover:bg-brand-bg rounded-xl text-brand-blue transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <h4 className="font-black text-brand-blue flex items-center gap-2">
                        {currentCategory?.title}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {currentCategory?.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleServiceSelect(item.name)}
                          className="p-5 bg-white border-2 border-gray-100 hover:border-brand-blue hover:bg-blue-50 rounded-2xl text-left transition-all flex justify-between items-center group"
                        >
                          <div>
                            <p className="font-black text-brand-blue mb-1">{item.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded font-black">€{item.price}</span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tempo stimato: 20 min</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all">
                            <Plus size={18} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SERVICE_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className="p-6 bg-brand-bg/50 border-2 border-transparent hover:border-brand-blue hover:bg-white hover:shadow-xl hover:-translate-y-1 rounded-3xl text-left transition-all group"
                      >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue mb-4 shadow-sm group-hover:bg-brand-blue group-hover:text-white transition-all">
                          <Tag size={24} />
                        </div>
                        <p className="font-black text-brand-blue leading-tight mb-1">{cat.title}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{cat.items.length} {cat.items.length === 1 ? 'Servizio' : 'Servizi'}</p>
                      </button>
                    ))}
                  </div>
                )}
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
                  <div className="flex gap-2">
                    <div className="w-28 shrink-0 relative group">
                      <select 
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="w-full h-full pl-3 pr-8 pt-6 pb-2 rounded-xl border-2 border-gray-100 bg-brand-bg hover:border-gray-200 outline-none transition-all font-bold text-brand-text-main focus:border-brand-blue appearance-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 pointer-events-none group-focus-within:text-brand-blue transition-colors">
                        Pref.
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <Icons.ChevronDown size={14} />
                      </div>
                    </div>

                    <div className="relative group flex-grow">
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
