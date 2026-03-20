import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmergencyAI from './pages/EmergencyAI';
import SosDashboard from './pages/SosDashboard';
import PetProfile from './pages/PetProfile';
import HygieneGuide from './pages/HygieneGuide';
import Auth from './pages/Auth';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ToastProvider';
import FloatingAssistant from './components/FloatingAssistant';
import { GamificationProvider } from './components/GamificationProvider';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <GamificationProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-dark dark:text-slate-50 transition-colors">
              <Navbar />
              <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/ai" element={<EmergencyAI />} />
                  <Route path="/sos" element={<SosDashboard />} />
                  <Route path="/pets" element={<PetProfile />} />
                  <Route path="/hygiene" element={<HygieneGuide />} />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
              </main>
              <FloatingAssistant />
            </div>
          </Router>
        </GamificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
