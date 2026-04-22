import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Servizi', href: '/servizi' },
    { name: 'Chi Siamo', href: '/chi-siamo' },
    { name: 'Contatti', href: '/contatti' },
  ];

  const isLight = !scrolled && location.pathname === '/';

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
          <div className="hidden md:flex items-center space-x-10">
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
               <div className="flex flex-col items-end">
                 <span className={`text-[10px] font-bold uppercase tracking-tighter opacity-50 ${!isLight ? 'text-brand-text-muted' : 'text-white'}`}>Contatto Rapido</span>
                 <span className={`text-sm font-bold ${!isLight ? 'text-brand-blue' : 'text-white'}`}>+39 366 810 2727</span>
               </div>
               <button
                 onClick={onOpenBooking}
                 className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${!isLight ? 'bg-brand-blue text-white hover:bg-brand-blue-light' : 'bg-white text-brand-blue hover:bg-gray-100'}`}
               >
                 Prenota Online
               </button>
            </div>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button
              onClick={onOpenBooking}
              className="bg-brand-green p-2.5 rounded-full text-white shadow-lg"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${!isLight ? 'text-brand-blue' : 'text-white'}`}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

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
               <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest opacity-50">Sempre raggiungibili</span>
                  <span className="text-2xl font-bold text-white">+39 366 810 2727</span>
               </div>
               <button onClick={onOpenBooking} className="w-full bg-brand-green text-white py-5 rounded-2xl font-black text-xl flex justify-center items-center shadow-2xl">
                  <Calendar className="w-6 h-6 mr-3" />
                  Prenota Ora
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
