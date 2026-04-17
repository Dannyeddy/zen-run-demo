import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Tracker from './pages/Tracker';
import Login from './pages/Login';
import PetSpace from './pages/PetSpace';
import Treasure from './pages/Treasure';
import Rankings from './pages/Rankings';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import RunCompletionSummary from './pages/RunCompletionSummary';
import HistoricalRewardResult from './pages/HistoricalRewardResult';
import ModernRewardResult from './pages/ModernRewardResult';
import Onboarding from './pages/Onboarding';
import Navbar from './components/Navbar';
import { PetProvider } from './context/PetContext';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/pet-space" element={<PetSpace />} />
        <Route path="/treasure" element={<Treasure />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/completion-summary" element={<RunCompletionSummary />} />
        <Route path="/reward-result" element={<HistoricalRewardResult />} />
        <Route path="/modern-reward" element={<ModernRewardResult />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarOn = ['/login', '/onboarding', '/tracker', '/reward-result', '/modern-reward'];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden pb-24">
      <AnimatedRoutes />
      {showNavbar && <Navbar />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <PetProvider>
        <AppContent />
      </PetProvider>
    </Router>
  );
}
