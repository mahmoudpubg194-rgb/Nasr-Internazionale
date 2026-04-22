import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Search, CheckCircle, Info, ArrowRight, User, Users, Home, Wallet, 
  MapPin, Baby, Brain, ShieldAlert, Mail, Download, History, Euro,
  Building, Lightbulb, GraduationCap, HeartPulse
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface UserData {
  familySize: number;
  minors: number;
  disabled: boolean;
  elderly: boolean;
  incomeType: 'ral' | 'isee';
  incomeValue: number;
  region: string;
  interests: string[];
  email?: string;
}

const REGIONS = [
  'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 
  'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 
  'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 
  'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
];

const INTEREST_OPTIONS = [
  { id: 'rent', label: 'Affitto', icon: Home },
  { id: 'bills', label: 'Bollette', icon: Lightbulb },
  { id: 'nursery', label: 'Asilo Nido', icon: Baby },
  { id: 'renovation', label: 'Ristrutturazioni', icon: Building },
  { id: 'health', label: 'Spese Mediche', icon: HeartPulse },
  { id: 'study', label: 'Studio/Università', icon: GraduationCap },
  { id: 'pets', label: 'Animali Domestici', icon: HeartPulse },
  { id: 'mobility', label: 'Mobilità/Trasporti', icon: Euro },
];

const BonusFinder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    familySize: 1,
    minors: 0,
    disabled: false,
    elderly: false,
    incomeType: 'isee',
    incomeValue: 0,
    region: 'Lombardia',
    interests: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Simple Algorithm based on 2026 Thresholds (Mock logic)
  const results = useMemo(() => {
    const list = [];
    const isee = userData.incomeType === 'isee' ? userData.incomeValue : userData.incomeValue * 0.7; // Rough RAL to ISEE conversion
    
    // 1. Assegno Unico (Family component)
    if (userData.minors > 0) {
      list.push({
        id: 'assegno_unico',
        title: 'Assegno Unico Universale',
        status: 'certain',
        amount: userData.minors * 199,
        recurrence: 'mese',
        desc: 'Sostegno economico per figli a carico.',
        logic: 'Basato sulla presenza di minori.'
      });
    }

    // 2. Bonus Bollette 2026 (Threshold specific)
    if (isee <= 9796 || (userData.familySize >= 4 && isee <= 20000)) {
      list.push({
        id: 'bonus_bollette',
        title: 'Bonus Sociale Bollette',
        status: 'certain',
        amount: 45,
        recurrence: 'mese',
        desc: 'Sconto diretto su luce e gas.',
        logic: `ISEE ${isee}€ sotto la soglia critica 2026.`
      });
    } else if (isee <= 15000) {
      list.push({
        id: 'bonus_bollette_prob',
        title: 'Bonus Bolletta Integrativo',
        status: 'probable',
        amount: 20,
        recurrence: 'mese',
        desc: 'Possibile agevolazione regionale.',
        logic: 'Richiede verifica bando regionale aggiornato.'
      });
    }

    // 3. Bonus Nido
    if (userData.interests.includes('nursery')) {
      let nurseryAmount = 3000;
      if (isee > 25000) nurseryAmount = 2500;
      if (isee > 40000) nurseryAmount = 1500;
      
      list.push({
        id: 'bonus_nido',
        title: 'Bonus Nido',
        status: isee < 40000 ? 'certain' : 'probable',
        amount: nurseryAmount,
        recurrence: 'anno',
        desc: 'Rimborso rette asilo nido.',
        logic: `In base all'ISEE di ${isee}€.`
      });
    }

    // 4. Regional Bonuses & Categories
    switch(userData.region) {
      case 'Friuli-Venezia Giulia':
        if (userData.minors > 0) {
          list.push({
            id: 'fvg_dote_famiglia',
            title: 'Dote Famiglia FVG',
            status: 'certain',
            amount: 500 * userData.minors + (userData.disabled ? 100 : 0),
            recurrence: 'anno',
            desc: 'Contributo per minori con maggiorazione disabilità.',
            logic: 'Esclusivo residenti FVG con figli.'
          });
        }
        list.push({
          id: 'fvg_turesta',
          title: 'Voucher TUReSTA',
          status: 'probable',
          amount: 320,
          recurrence: 'una tantum',
          desc: 'Contributo per vacanze in regione (80-480€).',
          logic: 'Incentivo turismo locale.'
        });
        if (userData.familySize >= 2 && isee < 30000) {
          list.push({
            id: 'fvg_giovani_coppie',
            title: 'Bonus Nascite Giovani Coppie',
            status: 'probable',
            amount: 15000,
            recurrence: 'una tantum',
            desc: 'Fino a 15k per il primo figlio.',
            logic: 'Sostegno natalità coppie residenti.'
          });
        }
        if (userData.interests.includes('renovation') || userData.interests.includes('rent')) {
          list.push({
            id: 'fvg_casa',
            title: 'Contributi Casa FVG',
            status: 'probable',
            amount: 1000,
            recurrence: 'una tantum',
            desc: 'Sostegno spese casa (assicurazioni, manutenzioni).',
            logic: 'Bando edilizia agevolata regionale.'
          });
        }
        break;

      case 'Lombardia':
        if (userData.interests.includes('study')) {
          list.push({
            id: 'lomb_dote_scuola',
            title: 'Dote Scuola Lombardia',
            status: 'probable',
            amount: 500,
            recurrence: 'anno',
            desc: 'Buoni libri e strumenti didattici.',
            logic: 'Esclusivo per studenti residenti.'
          });
        }
        if (userData.interests.includes('mobility')) {
          list.push({
            id: 'lomb_auto_non_inquinanti',
            title: 'Bonus Auto non Inquinanti',
            status: 'probable',
            amount: 2000,
            recurrence: 'una tantum',
            desc: 'Incentivo acquisto veicoli elettrici/ibridi.',
            logic: 'Bando mobilità sostenibile.'
          });
        }
        list.push({
          id: 'lomb_inclusione_lavoro',
          title: 'Inclusione Lavorativa Lombardia',
          status: 'probable',
          amount: 800,
          recurrence: 'una tantum',
          desc: 'Contributi per l\'inserimento nel mercato del lavoro.',
          logic: 'Politiche attive del lavoro regionali.'
        });
        break;

      case 'Veneto':
        if (userData.interests.includes('rent')) {
          list.push({
            id: 'veneto_fondo_affitto',
            title: 'Fondo Regionale Affitto',
            status: 'probable',
            amount: 800,
            recurrence: 'anno',
            desc: 'Sostegno al canone di locazione.',
            logic: 'Fondo sociale regionale Veneto.'
          });
        }
        if (userData.familySize >= 4) {
          list.push({
            id: 'veneto_famiglie_numerose',
            title: 'Bonus Famiglie Numerose',
            status: 'certain',
            amount: 1000,
            recurrence: 'una tantum',
            desc: 'Incentivo per nuclei con 4+ figli.',
            logic: 'Supporto demografico Veneto.'
          });
        }
        if (userData.interests.includes('renovation')) {
          list.push({
            id: 'veneto_biomassa',
            title: 'Incentivo Generatori Calore',
            status: 'probable',
            amount: 1500,
            recurrence: 'una tantum',
            desc: 'Bonus ricambio caldaie biomassa.',
            logic: 'Efficientamento energetico.'
          });
        }
        break;

      case 'Emilia-Romagna':
        if (userData.interests.includes('rent')) {
          list.push({
            id: 'er_affitto',
            title: 'Bonus Affitto ER',
            status: 'probable',
            amount: 1500,
            recurrence: 'una tantum',
            desc: 'Sostegno per canoni di locazione onerosi.',
            logic: 'Fondo regionale affitto Emilia-Romagna.'
          });
        }
        if (userData.interests.includes('mobility')) {
          list.push({
            id: 'er_ebike',
            title: 'Incentivo E-Bike',
            status: 'probable',
            amount: 500,
            recurrence: 'una tantum',
            desc: 'Contributo acquisto bici elettrica.',
            logic: 'Promozione mobilità dolce.'
          });
        }
        if (userData.familySize > 1 && isee < 35000) {
          list.push({
            id: 'er_rientro_lavoro',
            title: 'Sostegno Rientro al Lavoro Madri',
            status: 'probable',
            amount: 1200,
            recurrence: 'una tantum',
            desc: 'Incentivo per madri che riprendono l\'attività.',
            logic: 'Welfare aziendale-regionale.'
          });
        }
        break;

      case 'Lazio':
        if (userData.interests.includes('nursery')) {
          list.push({
            id: 'lazio_voucher_nido',
            title: 'Voucher Nido Lazio',
            status: 'certain',
            amount: 2500,
            recurrence: 'anno',
            desc: 'Integrazione regionale spese asilo.',
            logic: 'Potenziamento servizi prima infanzia.'
          });
        }
        if (userData.interests.includes('study')) {
          list.push({
            id: 'lazio_borse_studio',
            title: 'Borse di Studio Lazio',
            status: 'probable',
            amount: 700,
            recurrence: 'anno',
            desc: 'Contributo libri e sussidi universitari.',
            logic: 'Diritto allo studio regionale.'
          });
          list.push({
            id: 'lazio_libri_scuola',
            title: 'Bonus Libri Scolastici Lazio',
            status: 'certain',
            amount: 200,
            recurrence: 'anno',
            desc: 'Voucher per acquisto testi scolastici.',
            logic: 'Supporto istruzione obbligatoria.'
          });
        }
        break;

      case 'Toscana':
        if (userData.interests.includes('rent')) {
          list.push({
            id: 'toscana_affitto',
            title: 'Contributi Casa Toscana',
            status: 'probable',
            amount: 1000,
            recurrence: 'anno',
            desc: 'Aiuto statale/regionale per l\'affitto.',
            logic: 'Welfare abitativo Toscana.'
          });
        }
        if (userData.familySize >= 1 && (userData.incomeValue < 30000)) {
           list.push({
              id: 'toscana_lavoro_giovani',
              title: 'Incentivo Occupazione Giovanile',
              status: 'probable',
              amount: 2000,
              recurrence: 'una tantum',
              desc: 'Bonus per l\'inserimento lavorativo dei giovani.',
              logic: 'Garanzia Giovani Toscana.'
           });
        }
        if (userData.interests.includes('mobility') && isee < 25000) {
          list.push({
             id: 'toscana_bonus_sport',
             title: 'Bonus Sport Toscana',
             status: 'certain',
             amount: 250,
             recurrence: 'anno',
             desc: 'Contributo attività sportiva minori.',
             logic: 'Promozione salute giovanile.'
          });
        }
        break;

      case 'Marche':
        if (userData.familySize >= 3) {
          list.push({
            id: 'marche_famiglie',
            title: 'Agevolazioni Famiglie Numerose Marche',
            status: 'certain',
            amount: 800,
            recurrence: 'una tantum',
            desc: 'Contributi nucleo familiare con più figli.',
            logic: 'Politiche sociali Regione Marche.'
          });
        }
        if (userData.interests.includes('study')) {
          list.push({
            id: 'marche_assegni_studio',
            title: 'Assegni di Studio Marche',
            status: 'probable',
            amount: 400,
            recurrence: 'anno',
            desc: 'Borse di studio per merito o reddito.',
            logic: 'Fondo istruzione regionale.'
          });
        }
        if (userData.interests.includes('renovation')) {
          list.push({
            id: 'marche_energia',
            title: 'Efficientamento Energetico Marche',
            status: 'probable',
            amount: 2000,
            recurrence: 'una tantum',
            desc: 'Incentivi per riqualificazione energetica abitazioni.',
            logic: 'Bando energia sostenibile.'
          });
        }
        break;

      case 'Puglia':
        if (userData.interests.includes('nursery')) {
          list.push({
            id: 'puglia_nidi_gratis',
            title: 'Puglia Nidi Gratis',
            status: 'certain',
            amount: 1500,
            recurrence: 'anno',
            desc: 'Integrazione totale retta nido.',
            logic: 'Welfare Puglia per famiglie.'
          });
        }
        if (userData.interests.includes('study')) {
          list.push({
             id: 'puglia_libri',
             title: 'Bonus Libri di Testo Puglia',
             status: 'certain',
             amount: 250,
             recurrence: 'anno',
             desc: 'Contributo per acquisto libri scolastici.',
             logic: 'Diritto allo studio Regione Puglia.'
          });
        }
        if (userData.interests.includes('renovation')) {
          list.push({
             id: 'puglia_energia',
             title: 'Efficientamento Energetico Puglia',
             status: 'probable',
             amount: 2500,
             recurrence: 'una tantum',
             desc: 'Incentivi per riqualificazione energetica.',
             logic: 'Bando Red (Reddito di Dignità) o energia.'
          });
        }
        break;
        
      case 'Campania':
        if (userData.interests.includes('mobility')) {
          list.push({
             id: 'campania_trasporti',
             title: 'Trasporto Gratis Studenti',
             status: 'certain',
             amount: 300,
             recurrence: 'anno',
             desc: 'Abbonamento gratuito studenti Campani.',
             logic: 'Diritto al trasporto e studio.'
          });
        }
        if (userData.incomeValue < 40000) {
           list.push({
              id: 'campania_nuove_imprese',
              title: 'Contributi Creazione Imprese Campania',
              status: 'probable',
              amount: 5000,
              recurrence: 'una tantum',
              desc: 'Fondi per avvio start-up e micro-imprese.',
              logic: 'Programma di sostegno autoimprenditorialità.'
           });
        }
        break;
        
      case 'Sicilia':
        if (isee < 15000) {
          list.push({
            id: 'sicilia_carta_famiglia',
            title: 'Carta Famiglia Sicilia',
            status: 'certain',
            amount: 600,
            recurrence: 'una tantum',
            desc: 'Sconti e contributi spesa solidale.',
            logic: 'Sostegno disagio economico.'
          });
          list.push({
            id: 'sicilia_famiglie_disagiate',
            title: 'Contributi Sostegno Famiglie Sicilia',
            status: 'probable',
            amount: 1000,
            recurrence: 'una tantum',
            desc: 'Fondo straordinario per famiglie in difficoltà.',
            logic: 'Interventi socio-assistenziali regionali.'
          });
        }
        break;
    }

    // Generic local/common categories
    if (userData.interests.includes('pets')) {
      list.push({
        id: 'local_pets',
        title: 'Contributo Spese Veterinarie',
        status: 'probable',
        amount: 200,
        recurrence: 'anno',
        desc: 'Rimborso visite e farmaci animali.',
        logic: 'Fondo regionale/comunale PET 2025/26.'
      });
    }

    if (userData.interests.includes('mobility') && userData.elderly) {
      list.push({
        id: 'mobility_silver',
        title: 'Silver Card Trasporti',
        status: 'certain',
        amount: 150,
        recurrence: 'anno',
        desc: 'Abbonamenti ridotti per Over 65.',
        logic: 'Convenzioni enti locali trasporti.'
      });
    }

    // 5. Retroactive check
    if (isee < 15000 && userData.familySize > 2) {
      list.push({
        id: 'retro_bonus',
        title: 'Recupero Bonus 2025',
        status: 'probable',
        amount: 400,
        recurrence: 'una tantum',
        desc: 'Bonus trasporti/spesa non riscattato.',
        logic: 'Analisi retroattiva disponibilità fondi.'
      });
    }

    return list;
  }, [userData]);

  const totalPossibleSavings = results.reduce((acc, curr) => {
    const val = curr.recurrence === 'mese' ? curr.amount * 12 : curr.amount;
    return acc + val;
  }, 0);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInterestToggle = (id: string) => {
    const newInterests = userData.interests.includes(id)
      ? userData.interests.filter(i => i !== id)
      : [...userData.interests, id];
    setUserData({ ...userData, interests: newInterests });
  };

  const handleLeadGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        email: userData.email,
        results: results.map(r => r.id),
        savings: totalPossibleSavings,
        createdAt: serverTimestamp()
      });
      setEmailSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setEmailSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-brand-blue" />
              Il tuo Nucleo Familiare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Componenti Totali</label>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                  <button 
                    onClick={() => setUserData({ ...userData, familySize: Math.max(1, userData.familySize - 1) })}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold"
                  >-</button>
                  <span className="flex-grow text-center font-bold text-xl">{userData.familySize}</span>
                  <button 
                    onClick={() => setUserData({ ...userData, familySize: userData.familySize + 1 })}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold"
                  >+</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Minori a carico</label>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                  <button 
                    onClick={() => setUserData({ ...userData, minors: Math.max(0, userData.minors - 1) })}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold"
                  >-</button>
                  <span className="flex-grow text-center font-bold text-xl">{userData.minors}</span>
                  <button 
                    onClick={() => setUserData({ ...userData, minors: userData.minors + 1 })}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold"
                  >+</button>
                </div>
              </div>
              <button 
                onClick={() => setUserData({ ...userData, disabled: !userData.disabled })}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${userData.disabled ? 'border-brand-blue bg-blue-50' : 'border-gray-100'}`}
              >
                <span className="font-bold">Presenza Disabilità</span>
                {userData.disabled && <CheckCircle className="text-brand-blue w-5 h-5" />}
              </button>
              <button 
                onClick={() => setUserData({ ...userData, elderly: !userData.elderly })}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${userData.elderly ? 'border-brand-blue bg-blue-50' : 'border-gray-100'}`}
              >
                <span className="font-bold">Anziani (Over 65)</span>
                {userData.elderly && <CheckCircle className="text-brand-blue w-5 h-5" />}
              </button>
            </div>
            <button onClick={nextStep} className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              Continua <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Euro className="text-brand-blue" />
              Dati Economici & Località
            </h2>
            <div className="space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-2xl">
                <button 
                  onClick={() => setUserData({ ...userData, incomeType: 'isee' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${userData.incomeType === 'isee' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-400'}`}
                >Ho un ISEE</button>
                <button 
                  onClick={() => setUserData({ ...userData, incomeType: 'ral' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${userData.incomeType === 'ral' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-400'}`}
                >Stima (RAL/Reddito)</button>
              </div>
              <div className="relative">
                <input 
                  type="number"
                  placeholder={userData.incomeType === 'isee' ? 'Valore ISEE (€)' : 'Reddito Annuo (€)'}
                  className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-2xl font-bold text-2xl focus:border-brand-blue outline-none transition-all"
                  value={userData.incomeValue || ''}
                  onChange={(e) => setUserData({ ...userData, incomeValue: Number(e.target.value) })}
                />
                <Euro className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Regione di Residenza
                </label>
                <select 
                  className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold outline-none"
                  value={userData.region}
                  onChange={(e) => setUserData({ ...userData, region: e.target.value })}
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold">Indietro</button>
              <button onClick={nextStep} className="flex-[2] bg-brand-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                Continua <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="text-brand-blue" />
              Cosa stai cercando?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {INTEREST_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = userData.interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleInterestToggle(opt.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${isSelected ? 'border-brand-blue bg-blue-50' : 'border-gray-50 bg-gray-50/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-brand-blue text-white' : 'bg-white text-gray-400'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold">Indietro</button>
              <button 
                onClick={() => setShowResults(true)} 
                className="flex-[2] bg-brand-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
              >
                Scopri i Bonus
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {!showResults ? (
          <div className="max-w-2xl mx-auto">
             <header className="text-center mb-12">
              <span className="bg-blue-100 text-brand-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Aggiornato 2026
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4">
                Bonus Finder <span className="text-brand-blue">Smart</span>
              </h1>
              <p className="text-gray-500">Meno di 60 secondi per identificare le tue agevolazioni fiscali.</p>
            </header>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-900/5">
               <div className="mb-10 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-1.5 w-16 rounded-full transition-all ${i === step ? 'bg-brand-blue' : 'bg-gray-100'}`} />
                ))}
              </div>
              {renderStep()}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <header className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-200">
               <div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900">Roadmap Agevolazioni</h1>
                <p className="text-gray-500 mt-2">Analisi completata con successo per profilo: {userData.region}.</p>
              </div>
              <div className="bg-brand-blue rounded-3xl p-6 text-white text-center md:text-right shadow-xl shadow-blue-900/20">
                <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Risparmio Stimato</div>
                <div className="text-4xl font-black">€ {totalPossibleSavings.toLocaleString()} <span className="text-xl font-normal opacity-60">/anno</span></div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {results.map((res) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={res.id} 
                    className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all"
                  >
                    <div className="flex-shrink-0 relative">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                        res.status === 'certain' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <Euro className="w-10 h-10" />
                      </div>
                      <div className={`absolute -top-2 -right-2 p-1.5 rounded-full border-4 border-white ${
                        res.status === 'certain' ? 'bg-green-500' : 'bg-amber-500'
                      }`}>
                         {res.status === 'certain' ? <CheckCircle className="w-4 h-4 text-white" /> : <ShieldAlert className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                        <h3 className="text-xl font-black text-gray-900">{res.title}</h3>
                        <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-lg ${
                          res.status === 'certain' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {res.status === 'certain' ? 'Certo' : 'Probabile'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{res.desc}</p>
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <div className="text-2xl font-black text-brand-blue">€ {res.amount}</div>
                        <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{res.recurrence}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/contatti', { state: { prefilled: res.title } })}
                      className="bg-gray-100 text-gray-900 px-6 py-4 rounded-2xl font-bold whitespace-nowrap hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2"
                    >
                      Richiedi ora
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <aside className="space-y-6">
                {/* Lead Generation Card */}
                <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-xl shadow-blue-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-12 -translate-y-12" />
                  <Mail className="w-10 h-10 text-brand-blue mb-6 relative" />
                  <h3 className="text-xl font-bold text-gray-900 mb-4 relative">Scarica il Report Completo</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed relative">Ricevi nella tua email il PDF con i dettagli normativi, le scadenze e i documenti necessari per ogni bonus identificato.</p>
                  
                  {!emailSubmitted ? (
                    <form onSubmit={handleLeadGeneration} className="space-y-4 relative">
                      <input 
                        required
                        type="email" 
                        placeholder="La tua email"
                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue"
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      />
                      <button 
                        disabled={emailSubmitting}
                        className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {emailSubmitting ? 'Invio...' : 'Invia Report'}
                        <Download className="w-5 h-5" />
                      </button>
                    </form>
                  ) : (
                    <div className="bg-green-50 text-green-700 p-4 rounded-2xl font-bold text-center flex items-center gap-2 justify-center">
                      <CheckCircle className="w-5 h-5" />
                      Report inviato!
                    </div>
                  )}
                </div>

                <div className="bg-brand-blue p-8 rounded-[40px] text-white">
                  <History className="w-8 h-8 mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-4">Perché il CAF Nasr?</h3>
                  <ul className="space-y-4 text-sm opacity-80">
                    <li className="flex items-start gap-2">
                       <CheckCircle className="w-4 h-4 mt-0.5" />
                       Database aggiornato al 2026
                    </li>
                    <li className="flex items-start gap-2">
                       <CheckCircle className="w-4 h-4 mt-0.5" />
                       Pratiche pre-compilate
                    </li>
                    <li className="flex items-start gap-2">
                       <CheckCircle className="w-4 h-4 mt-0.5" />
                       Supporto multilingue dedicato
                    </li>
                  </ul>
                </div>

                <button 
                   onClick={() => { setShowResults(false); setStep(0); }}
                   className="w-full py-4 border-2 border-gray-200 text-gray-400 rounded-3xl font-bold hover:border-gray-400 transition-colors"
                >
                  Nuova Simulazione
                </button>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusFinder;
