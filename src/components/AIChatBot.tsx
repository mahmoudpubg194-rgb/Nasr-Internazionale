import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const AIChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { role: 'model', content: t('chat_greeting') }
    ]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getChatResponse(userMessage, messages);
      setMessages(prev => [...prev, { role: 'model', content: response || 'Non ho ricevuto una risposta valida.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Si è verificato un errore tecnico. Riprova tra poco.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all hover:bg-brand-blue-light"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-green"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-32 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-border flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand-blue p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Assistente Nasr AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></span>
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-brand-bg/50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-white border border-brand-border text-brand-blue'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-white border border-brand-border text-brand-text-main rounded-tl-none shadow-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] items-center">
                    <div className="w-8 h-8 rounded-full bg-white border border-brand-border text-brand-blue flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white border border-brand-border p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <Loader2 size={16} className="animate-spin text-brand-blue" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-brand-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Chiedi qualcosa..."
                className="flex-grow bg-brand-bg/50 border-2 border-transparent focus:border-brand-blue/30 outline-none rounded-xl px-4 py-2 text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-brand-blue-light transition-all flex-shrink-0 shadow-lg"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
