import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer, WhatsAppButton } from './components/Footer';
import { BookingFlow } from './components/BookingFlow';
import { AIChatBot } from './components/AIChatBot';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BonusFinder = lazy(() => import('./pages/BonusFinder'));
const ColfBadanti = lazy(() => import('./pages/ColfBadanti'));
const Expatriates = lazy(() => import('./pages/Expatriates'));

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <Navigation onOpenBooking={openBooking} />
        
        <div className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home onOpenBooking={openBooking} />} />
              <Route path="/servizi" element={<Services />} />
              <Route path="/chi-siamo" element={<About />} />
              <Route path="/contatti" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bonus-finder" element={<BonusFinder />} />
              <Route path="/servizi/colf-badanti" element={<ColfBadanti />} />
              <Route path="/servizi/espatriati" element={<Expatriates />} />
            </Routes>
          </Suspense>
        </div>

        <Footer />
        <WhatsAppButton />
        <AIChatBot />
        
        <BookingFlow isOpen={isBookingOpen} onClose={closeBooking} />
      </div>
    </Router>
  );
}
