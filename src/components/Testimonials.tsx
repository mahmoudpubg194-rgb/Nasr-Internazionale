import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { useTranslation } from 'react-i18next';

export const Testimonials = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section className="py-24 bg-brand-blue relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/10 backdrop-blur-sm">
            {t('sections_testimonials_badge', 'Recensioni')}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {t('sections_testimonials_title', 'Cosa dicono i nostri clienti')}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t('sections_testimonials_desc', 'La fiducia dei nostri clienti è il nostro traguardo più importante.')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative group">
          <div className="relative h-[400px] md:h-[300px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-12"
              >
                <div className="mb-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Quote className="text-brand-green w-8 h-8" />
                  </div>
                  <div className="flex justify-center gap-1 mb-6 text-brand-green">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={20} 
                        fill={i < TESTIMONIALS[currentIndex].rating ? "currentColor" : "none"} 
                        className={i < TESTIMONIALS[currentIndex].rating ? "" : "text-white/20"}
                      />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8 italic">
                    "{t(`testimonials.text_${TESTIMONIALS[currentIndex].id}`, TESTIMONIALS[currentIndex].text)}"
                  </p>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      {TESTIMONIALS[currentIndex].name}
                    </h4>
                    <p className="text-sm font-bold text-brand-green uppercase tracking-widest">
                      {t(`testimonials.role_${TESTIMONIALS[currentIndex].id === '1' ? 'privato' : TESTIMONIALS[currentIndex].id === '2' ? 'straniero' : TESTIMONIALS[currentIndex].id === '3' ? 'madre' : TESTIMONIALS[currentIndex].id === '4' ? 'imprenditore' : 'fedele'}`, (TESTIMONIALS[currentIndex] as any).role || 'Cliente') as string}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-blue transition-all group/btn"
            >
              <ChevronLeft size={24} className="group-hover/btn:-translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-brand-green' : 'bg-white/30 hover:bg-white/60'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-blue transition-all group/btn"
            >
              <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
