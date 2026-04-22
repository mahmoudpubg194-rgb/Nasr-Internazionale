import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, CheckCircle, Clock, TrendingUp, ShieldCheck, Download, PenTool } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const COLORS = ['#1e3a8a', '#3b82f6', '#93c5fd', '#bfdbfe'];

const Dashboard = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [practices, setPractices] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Listen to practices
        const qPractices = query(collection(db, 'practices'), where('userId', '==', u.uid));
        const unsubPractices = onSnapshot(qPractices, (snapshot) => {
          setPractices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Listen to documents
        const qDocs = query(collection(db, 'documents'), where('userId', '==', u.uid));
        const unsubDocs = onSnapshot(qDocs, (snapshot) => {
          setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
          unsubPractices();
          unsubDocs();
        };
      }
    });
    return () => unsubscribeAuth();
  }, []);

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard_login_required')}</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{t('dashboard_login_desc')}</p>
        <button 
          onClick={() => {/* Standard login trigger */}}
          className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors"
        >
          {t('nav_book')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-brand-blue" />
            {t('dashboard_title')}
          </h1>
          <p className="text-gray-600 mt-2">{t('dashboard_welcome', { name: user.displayName || user.email })}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Tracker (Amazon Style) */}
          <section className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-blue" />
              {t('tracker_title')}
            </h2>
            <div className="space-y-8">
              {practices.length === 0 ? (
                <div className="py-12 text-center text-gray-500 italic">
                  {t('tracker_no_practices')}
                </div>
              ) : (
                practices.map((practice) => (
                  <div key={practice.id} className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-brand-blue uppercase text-sm tracking-widest">{practice.type}</span>
                      <span className="text-xs text-gray-400">ID: {practice.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center w-full">
                      {['received', 'processing', 'review', 'sent', 'completed'].map((s, idx) => {
                        const statusOrder = ['received', 'processing', 'review', 'sent', 'completed'];
                        const currentIdx = statusOrder.indexOf(practice.status);
                        const isPast = idx < currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={s} className="flex-1 flex flex-col items-center relative">
                            {idx !== 0 && (
                              <div className={`absolute right-1/2 top-4 w-full h-1 -translate-y-1/2 ${isPast || isCurrent ? 'bg-brand-blue' : 'bg-gray-200'}`} />
                            )}
                            <div className={`w-8 h-8 rounded-full z-10 flex items-center justify-center ${
                              isPast ? 'bg-brand-blue text-white' : 
                              isCurrent ? 'bg-brand-blue text-white ring-4 ring-blue-100' : 
                              'bg-gray-200 text-gray-400'
                            }`}>
                              {isPast ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                            </div>
                            <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${isCurrent ? 'text-brand-blue' : 'text-gray-400'}`}>
                              {t(`status_${s}`)}
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

          {/* Impronta Fiscale (Charts) */}
          <section className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-blue" />
              {t('footprint_title')}
            </h2>
            <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taxData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="paid" fill="#1e3a8a" name={t('tax_paid')} />
                  <Bar dataKey="recovered" fill="#3b82f6" name={t('tax_recovered')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Document Vault & Signature */}
          <section className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-blue" />
              {t('vault_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {documents.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  {t('vault_empty')}
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <FileText className="w-5 h-5 text-brand-blue" />
                        </div>
                        {doc.isSigned ? (
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                            {t('signed')}
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                            {t('pending')}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm truncate">{doc.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <button className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                        <Download className="w-4 h-4" />
                        {t('download')}
                      </button>
                      {!doc.isSigned && (
                        <button className="flex-1 bg-brand-blue text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                          <PenTool className="w-4 h-4" />
                          {t('sign_now')}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
