import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

const QUICK_QUESTIONS = [
  'Come faccio il 730?',
  'Quali documenti servono per l\'ISEE?',
  'Costo rinnovo permesso soggiorno',
  'Prenota un biglietto aereo'
];

export const AIChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { role: 'model', content: `Ciao! Sono **Nasr AI**, l'assistente virtuale d'élite di CAF Nasr. 🇮🇹\n\nPosso aiutarti con pratiche fiscali, ISEE, permessi di soggiorno e molto altro. Come posso esserti utile oggi?` }
    ]);

    // Hide tooltip after some time
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent, directMessage?: string, isRetry: boolean = false) => {
    e?.preventDefault();
    const userMessage = directMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!directMessage && !isRetry) setInput('');
    
    // Se non è un retry, aggiungiamo il messaggio dell'utente
    if (!isRetry) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    }
    
    setIsLoading(true);

    try {
      // Passiamo solo i messaggi che non sono errori come cronologia
      const history = messages.filter(m => !m.isError);
      const response = await getChatResponse(userMessage, history);
      
      // Controlliamo se la risposta indica un errore (basato sulle stringhe restituite dal servizio)
      const isActuallyError = response.includes("Errore") || 
                              response.includes("Spiacente") || 
                              response.includes("non è configurato correttamente") ||
                              response.includes("Mi dispiace");

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: response || 'Non ho ricevuto una risposta valida.',
        isError: isActuallyError
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: 'Si è verificato un errore tecnico di connessione. Riprova tra poco.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // Trova l'ultimo messaggio dell'utente per riprovare
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Rimuoviamo l'ultimo messaggio di errore se presente
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[newMsgs.length - 1].isError) {
          newMsgs.pop();
        }
        return newMsgs;
      });
      handleSubmit(undefined, lastUserMsg.content, true);
    }
  };

  return (
    <>
      {/* Toggle Button & Tooltip */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {(showTooltip && !isOpen) && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="bg-brand-blue text-white px-4 py-2 rounded-2xl shadow-xl border border-white/20 text-sm font-bold flex items-center gap-2 mb-2 whitespace-nowrap"
            >
              <Sparkles size={16} className="text-yellow-400 animate-pulse" />
              Hai una domanda? Chiedi a Nasr AI!
              <div className="absolute -bottom-1 right-6 w-3 h-3 bg-brand-blue rotate-45 border-r border-b border-white/20"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-white text-brand-blue border-2 border-brand-blue' : 'hero-gradient text-white ring-4 ring-white shadow-brand-blue/30'
          }`}
        >
          {isOpen ? <X size={28} /> : (
            <div className="relative">
              <MessageSquare size={28} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-brand-green rounded-full border-2 border-white" 
              />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 top-0 sm:top-auto sm:left-auto sm:bottom-32 sm:right-6 z-[55] w-full sm:w-[420px] h-full sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,58,138,0.3)] overflow-hidden border-t sm:border border-brand-border flex flex-col glass"
          >
            {/* Header */}
            <div className="bg-brand-blue p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                    <Bot className="text-brand-blue" size={24} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-brand-green rounded-full border-2 sm:border-4 border-brand-blue animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-black text-base sm:text-lg tracking-tight leading-none mb-1">Nasr AI</h3>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-white/60 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap animate-marquee">
                      Supporto Fiscale Intelligente • H24 •
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Chiudi"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-white border border-brand-border text-brand-blue'}`}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm relative ${
                      msg.role === 'user' 
                        ? 'bg-brand-blue text-white rounded-tr-none' 
                        : msg.isError
                          ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none'
                          : 'bg-white border border-brand-border text-brand-text-main rounded-tl-none markdown-body'
                    }`}>
                      {msg.role === 'model' && msg.isError && (
                        <div className="flex items-center gap-2 mb-2 font-black uppercase text-[10px] tracking-widest text-red-500">
                          <AlertCircle size={14} />
                          Errore di Sistema
                        </div>
                      )}
                      {msg.role === 'model' ? (
                        <Markdown>{msg.content}</Markdown>
                      ) : (
                        msg.content
                      )}
                      {msg.isError && index === messages.length - 1 && (
                        <button 
                          onClick={handleRetry}
                          className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-[11px] font-bold transition-all border border-red-200"
                        >
                          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                          Riprova ora
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] items-center">
                    <div className="w-9 h-9 rounded-xl bg-white border border-brand-border text-brand-blue flex items-center justify-center shadow-sm">
                      <Bot size={18} />
                    </div>
                    <div className="bg-white border border-brand-border px-5 py-3 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Questions */}
              {!isLoading && messages.length < 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 space-y-2"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">Domande Frequenti</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubmit(undefined, q)}
                        className="bg-white border border-brand-border hover:border-brand-blue hover:text-brand-blue px-3 py-2 rounded-2xl text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 group"
                      >
                        {q}
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all text-brand-blue" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 sm:p-6 bg-white border-t border-brand-border">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrivi qui il tuo dubbio fiscale..."
                  className="w-full bg-brand-bg/80 border-2 border-brand-border focus:border-brand-blue/50 focus:bg-white outline-none rounded-[2rem] pl-5 sm:pl-6 pr-14 py-3 sm:py-4 text-sm font-medium transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 w-11 h-11 bg-brand-blue text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-brand-blue-light transition-all shadow-[0_4px_15px_rgba(30,58,138,0.3)] group"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                </button>
              </form>
              <p className="text-[10px] text-center text-gray-400 mt-4 font-medium italic">
                Nasr AI può commettere errori. Verifica le informazioni importanti.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
