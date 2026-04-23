import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, FileText, CheckCircle, Clock, TrendingUp, ShieldCheck, 
  Download, PenTool, Upload, CreditCard, Calendar, UserCheck, AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDocFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#1e3a8a', '#3b82f6', '#93c5fd', '#bfdbfe'];

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loginWithGoogle } = useAuth();
  const [ practices, setPractices ] = useState<any[]>([]);
  const [ documents, setDocuments ] = useState<any[]>([]);
  const [ uploadLoading, setUploadLoading ] = useState(false);
  const [ connectionError, setConnectionError ] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, '_test_connection_', 'init'));
      } catch (error: any) {
        if (error.message?.includes('Insufficient permissions')) {
          // This is expected if the test doc doesn't exist or isn't readable, 
          // but we check if it's a critical connection error
          console.log("Connection test (expected permission notice):", error.message);
        } else if (error.message?.includes('the client is offline')) {
          setConnectionError("Sei offline. Controlla la tua connessione.");
        }
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    if (user) {
      // Listen to practices
      const qPractices = query(collection(db, 'practices'), where('userId', '==', user.uid));
      const unsubPractices = onSnapshot(qPractices, 
        (snapshot) => {
          setPractices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        },
        (error) => {
          console.error("Practices listener error:", error);
        }
      );

      // Listen to documents
      const qDocs = query(collection(db, 'documents'), where('userId', '==', user.uid));
      const unsubDocs = onSnapshot(qDocs, 
        (snapshot) => {
          setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        },
        (error) => {
          console.error("Documents listener error:", error);
        }
      );

      return () => {
        unsubPractices();
        unsubDocs();
      };
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user) return;
    setUploadLoading(true);
    // Simulation: In a real app we'd use Firebase Storage
    setTimeout(async () => {
      await addDoc(collection(db, 'documents'), {
        userId: user.uid,
        name: e.target.files![0].name,
        url: '#',
        isSigned: false,
        createdAt: serverTimestamp()
      });
      setUploadLoading(false);
    }, 1500);
  };

  const taxData = [
    { name: 'IRPEF', value: 4500 },
    { name: 'Addizionali', value: 800 },
    { name: 'IMU', value: 1200 },
    { name: 'TARI', value: 300 },
  ];

  const comparisonData = [
    { year: '2023', paid: 6500, recovered: 1200 },
    { year: '2024', paid: 6800, recovered: 1500 },
  ];

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-gray-50">
        <ShieldCheck className="w-16 h-16 text-brand-blue mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Area Riservata</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">Accedi per gestire le tue pratiche, caricare documenti e pagare i servizi.</p>
        <button 
          onClick={loginWithGoogle}
          className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors"
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-brand-blue" />
              Il tuo Portale Fiscale
            </h1>
            <p className="text-gray-600 mt-2">Benvenuto, {user.displayName || user.email}</p>
            {connectionError && (
              <div className="mt-2 text-red-500 text-sm font-bold flex items-center gap-2">
                <AlertTriangle size={16} />
                {connectionError}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-100 transition-all flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-green" />
              SPID / CIE Connesso
            </button>
            <button className="bg-brand-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-brand-blue/30 transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Nuovo Appuntamento
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Tracker */}
          <section className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-white">
            <div className="flex items-center justify-between mb-8 cursor-help hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-blue" />
                Le tue Pratiche (Amazon Style)
              </h2>
              <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded-md">Real-Time</span>
            </div>
            <div className="space-y-12">
              {practices.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                     <AlertTriangle className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium tracking-tight">Nessuna pratica attiva. <br/>Inizia prenotando un appuntamento.</p>
                </div>
              ) : (
                practices.map((practice) => (
                  <div key={practice.id} className="relative group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-lg">{practice.type.replace('_', ' ').toUpperCase()}</span>
                        <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">ID: {practice.id.slice(0, 12)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-400 block mb-1">DATA ORDINE</span>
                        <span className="text-sm font-bold text-gray-900">23 APR 2026</span>
                      </div>
                    </div>
                    <div className="flex items-center w-full px-4">
                      {['received', 'processing', 'review', 'sent', 'completed'].map((s, idx) => {
                        const statusOrder = ['received', 'processing', 'review', 'sent', 'completed'];
                        const currentIdx = statusOrder.indexOf(practice.status);
                        const isPast = idx < currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={s} className="flex-1 flex flex-col items-center relative">
                            {idx !== 0 && (
                              <div className={`absolute right-1/2 top-4 w-full h-[2px] -translate-y-1/2 transition-all duration-1000 ${isPast || isCurrent ? 'bg-brand-blue' : 'bg-gray-100'}`} />
                            )}
                            <div className={`w-10 h-10 rounded-xl z-10 flex items-center justify-center transition-all duration-500 ${
                              isPast ? 'bg-brand-blue text-white shadow-lg shadow-blue-200' : 
                              isCurrent ? 'bg-brand-blue text-white ring-4 ring-blue-50 shadow-xl shadow-blue-200 scale-110' : 
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {isPast ? <CheckCircle className="w-6 h-6" /> : <span className="text-sm font-black">{idx + 1}</span>}
                            </div>
                            <span className={`text-[10px] mt-4 font-black uppercase tracking-widest text-center max-w-[60px] leading-tight transition-colors ${isCurrent ? 'text-brand-blue' : 'text-gray-300'}`}>
                              {s === 'received' ? 'Ricevuto' : s === 'processing' ? 'In Lavoro' : s === 'review' ? 'Revisione' : s === 'sent' ? 'Inviato' : 'Finito'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* User Vault & Tools */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-white">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-blue" />
                  Vault Documenti
                </div>
                <label className="cursor-pointer bg-brand-bg text-brand-blue p-2 rounded-lg hover:bg-blue-50 transition-all">
                  <Upload size={18} />
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </h2>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {uploadLoading && (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-brand-blue">Upload in corso...</span>
                  </div>
                )}

                {documents.length === 0 && !uploadLoading ? (
                  <div className="py-12 text-center text-gray-400 text-sm italic">
                    Nessun documento caricato.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="group bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-brand-blue/30 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <FileText className="w-5 h-5 text-brand-blue" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-xs truncate max-w-[120px]">{doc.name}</h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">PDF • 1.2 MB</span>
                          </div>
                        </div>
                        {doc.isSigned ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <PenTool className="w-4 h-4 text-amber-500 cursor-pointer hover:scale-110 transition-all" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-white text-gray-600 h-8 rounded-lg text-[10px] font-bold border border-gray-200 hover:bg-gray-100 transition-all">
                          Scarica
                        </button>
                        {!doc.isSigned && (
                          <button className="flex-1 bg-brand-blue text-white h-8 rounded-lg text-[10px] font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">
                            Firma Ora
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="bg-brand-blue rounded-3xl p-8 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={120} />
              </div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Dati e Identità
              </h2>
              <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">Il tuo account è verificato tramite <strong>SPID Livello 2</strong>. I tuoi dati sono protetti da crittografia militare.</p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs py-2 border-b border-white/10">
                  <span className="opacity-60 uppercase font-bold tracking-widest">Stato</span>
                  <span className="font-black text-green-400 uppercase">Verificato</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/10">
                  <span className="opacity-60 uppercase font-bold tracking-widest">Documento</span>
                  <span className="font-bold">CI • **** **72</span>
                </div>
              </div>
            </section>
          </div>

          <section className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-white">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-blue" />
              Impronta Fiscale 2026
            </h2>
            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taxData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                    {taxData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {taxData.map((t, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-gray-600 font-medium">{t.name}</span>
                  </div>
                  <span className="font-black text-gray-900">€{t.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
