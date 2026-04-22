import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar, Globe, Languages, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export const Navigation = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const languages = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
    setIsLangOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('nav_home'), href: '/' },
    { name: t('nav_services'), href: '/servizi' },
    { name: t('nav_bonus_finder', 'Bonus Finder'), href: '/bonus-finder' },
    { name: t('nav_about'), href: '/chi-siamo' },
    { name: t('nav_contact'), href: '/contatti' },
  ];

  const isLight = !scrolled && location.pathname === '/';

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
    setIsOpen(false);
  };

  const currentLang = (i18n.language || 'it').split('-')[0];

  const toggleLanguage = () => {
    setIsLangOpen(!isLangOpen);
    if (isOpen) setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isLangOpen) setIsLangOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] h-[88px] flex items-center transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-brand-border shadow-md h-[72px]' : 'bg-transparent h-[88px]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl transition-all duration-300 ${!isLight ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue shadow-lg'}`}>N</div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${!isLight ? 'text-brand-blue' : 'text-white'}`}>
                NASR <span className={`font-light uppercase text-xs tracking-[0.2em] ml-1 ${!isLight ? 'text-brand-text-muted opacity-50' : 'text-white/50'}`}>Internazionale</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-bold uppercase tracking-widest transition-all relative group/link ${
                    location.pathname === link.href 
                      ? (!isLight ? 'text-brand-blue' : 'text-white') 
                      : (!isLight ? 'text-brand-text-muted hover:text-brand-blue' : 'text-white/70 hover:text-white')
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-current transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6 border-l border-brand-border/20 pl-6">
               {/* Language Switcher */}
               <div className="relative">
                  <button 
                    onClick={toggleLanguage}
                    className={`flex items-center gap-2 p-2 rounded-xl transition-all ${!isLight ? 'text-brand-blue hover:bg-brand-accent' : 'text-white hover:bg-white/10'}`}
                  >
                    <Languages size={20} />
                    <span className="text-xs font-black uppercase">{currentLang.toUpperCase()}</span>
                  </button>
                  
                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-brand-border py-2 overflow-hidden flex flex-col"
                      >
                        <div className="max-h-[60vh] overflow-y-auto py-1">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => changeLanguage(lang.code)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-brand-bg transition-colors ${currentLang === lang.code ? 'text-brand-blue bg-brand-accent' : 'text-gray-600'}`}
                            >
                              <span className="text-xl">{lang.flag}</span>
                              <span>{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <button
                 onClick={onOpenBooking}
                 className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${!isLight ? 'bg-brand-blue text-white hover:bg-brand-blue-light' : 'bg-white text-brand-blue hover:bg-gray-100'}`}
               >
                 {t('nav_book')}
               </button>

               {user ? (
                 <div className="flex items-center gap-2 group relative">
                   <Link 
                     to="/dashboard"
                     className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden ${!isLight ? 'border-brand-blue' : 'border-white'}`}
                   >
                     {user.photoURL ? (
                       <img src={user.photoURL} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                     ) : (
                       <User size={20} className={!isLight ? 'text-brand-blue' : 'text-white'} />
                     )}
                   </Link>
                   <div className="absolute -bottom-12 right-0 hidden group-hover:flex flex-col gap-1 w-40 bg-white shadow-2xl rounded-xl border border-gray-100 p-1 z-[100]">
                     <Link 
                       to="/dashboard"
                       className="flex items-center gap-2 text-brand-blue p-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors"
                     >
                       <LayoutDashboard size={14} />
                       Dashboard
                     </Link>
                     <button 
                       onClick={handleLogout}
                       className="flex items-center gap-2 text-red-600 p-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors w-full text-left"
                     >
                       <LogOut size={14} />
                       Logout
                     </button>
                   </div>
                 </div>
               ) : (
                 <button 
                   onClick={handleLogin}
                   className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${!isLight ? 'border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white' : 'border-white text-white hover:bg-white hover:text-brand-blue'}`}
                 >
                   <User size={18} />
                   Login
                 </button>
               )}
            </div>
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden flex items-center space-x-4">
             <button
              onClick={toggleLanguage}
              className={`p-2 relative ${!isLight ? 'text-brand-blue' : 'text-white'}`}
             >
                <Globe size={24} />
             </button>
             <button
              onClick={onOpenBooking}
              className="bg-brand-green p-2.5 rounded-full text-white shadow-lg"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMenu}
              className={`${!isLight ? 'text-brand-blue' : 'text-white'}`}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Language Overlay */}
      <AnimatePresence>
        {isLangOpen && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[70] bg-white p-6 flex flex-col"
          >
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-brand-blue uppercase tracking-widest">{t('select_language', 'Select Language')}</h3>
                <button onClick={() => setIsLangOpen(false)} className="p-2 bg-brand-bg rounded-xl text-brand-blue">
                   <X size={24} />
                </button>
             </div>
             <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 pb-10">
                   {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${currentLang === lang.code ? 'border-brand-blue bg-brand-accent text-brand-blue' : 'border-brand-bg bg-brand-bg text-gray-500'}`}
                      >
                         <span className="text-4xl mb-2">{lang.flag}</span>
                         <span className="font-bold text-sm tracking-tight">{lang.name}</span>
                      </button>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden fixed inset-0 z-[55] bg-brand-blue text-white flex flex-col pt-32 pb-10 px-8"
          >
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-3xl font-black italic tracking-tighter transition-all ${location.pathname === link.href ? 'text-brand-green pl-4' : 'text-white opacity-60'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-auto space-y-6 pt-12 border-t border-white/10">
               {user && (
                 <Link 
                   to="/dashboard"
                   className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl"
                   onClick={() => setIsOpen(false)}
                 >
                   <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                      {user.photoURL ? <img src={user.photoURL} alt="User" /> : <User size={24} />}
                   </div>
                   <div>
                     <div className="font-bold">{user.displayName || 'Utente'}</div>
                     <div className="text-xs opacity-50">Vai alla Dashboard</div>
                   </div>
                 </Link>
               )}

               <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest opacity-50">{t('footer_always_open', 'Sempre raggiungibili')}</span>
                  <span className="text-2xl font-bold text-white">+39 366 810 2727</span>
               </div>
               
               {!user ? (
                 <button 
                   onClick={handleLogin}
                   className="w-full bg-white text-brand-blue py-5 rounded-2xl font-black text-xl flex justify-center items-center shadow-2xl"
                 >
                   <User className="w-6 h-6 mr-3" />
                   Area Riservata
                 </button>
               ) : (
                 <button 
                   onClick={handleLogout}
                   className="w-full bg-red-500/20 text-red-100 border border-red-500/30 py-5 rounded-2xl font-black text-xl flex justify-center items-center"
                 >
                   <LogOut className="w-6 h-6 mr-3" />
                   Logout
                 </button>
               )}

               <button onClick={onOpenBooking} className="w-full bg-brand-green text-white py-5 rounded-2xl font-black text-xl flex justify-center items-center shadow-2xl">
                  <Calendar className="w-6 h-6 mr-3" />
                  {t('nav_book')}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
