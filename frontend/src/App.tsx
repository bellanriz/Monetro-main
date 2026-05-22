/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ParentDashboard } from './pages/ParentDashboard';
import { KidDashboard } from './pages/KidDashboard';
import { Landing } from './pages/Landing';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/layout/Navbar';

function AppContent() {
  const { profile, loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsNavbarVisible(true);
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollDifference = scrollTop - lastScrollTopRef.current;
    
    // Ignore small scroll deltas
    if (Math.abs(scrollDifference) < 8) {
      return;
    }

    if (scrollTop <= 40) {
      setIsNavbarVisible(true);
    } else if (scrollDifference > 0) {
      setIsNavbarVisible(false);
    } else {
      setIsNavbarVisible(true);
    }

    lastScrollTopRef.current = scrollTop;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-slate-50">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Loading FamWallet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-950 font-sans p-0 md:p-6 overflow-hidden select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        {/* Background Ambience on Desktop */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Device Mock Frame (looks like an iPhone on desktop, full bleed on mobile) */}
        <div className="w-full h-[100dvh] md:max-w-[412px] md:h-[844px] md:rounded-[3.5rem] md:border-[12px] md:border-slate-900 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] md:ring-1 md:ring-white/10 md:overflow-hidden relative bg-white flex flex-col justify-between select-text">
          
          {/* Dynamic Notch / Island & Status Bar on Desktop */}
          <div className="hidden md:flex justify-between items-center px-8 pt-4 pb-2 bg-white/85 backdrop-blur-md sticky top-0 z-50 text-slate-950 select-none border-b border-slate-100/60">
            <span className="text-xs font-black tracking-tight text-slate-800">9:41</span>
            <div className="absolute left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full flex items-center justify-center shadow-inner">
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800/50 absolute right-3" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-800">
              {/* Cellular strength indicator */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M2 22h20V2z" />
              </svg>
              <span className="text-[9px] font-black tracking-tighter">5G</span>
              {/* Battery percentage */}
              <div className="w-5 h-2.5 border border-slate-700 rounded-sm p-0.5 flex items-center">
                <div className="bg-slate-800 h-full w-[80%] rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Content Viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide bg-white">
            <Landing />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-950 font-sans p-0 md:p-6 overflow-hidden select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* Background Ambience on Desktop */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Device Mock Frame (looks like an iPhone on desktop, full bleed on mobile) */}
      <div className="w-full h-[100dvh] md:max-w-[412px] md:h-[844px] md:rounded-[3.5rem] md:border-[12px] md:border-slate-900 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] md:ring-1 md:ring-white/10 md:overflow-hidden relative bg-slate-50 flex flex-col justify-between select-text">
        
        {/* Dynamic Notch / Island & Status Bar on Desktop */}
        <div className="hidden md:flex justify-between items-center px-8 pt-4 pb-2 bg-slate-50/80 backdrop-blur-md sticky top-0 z-50 text-slate-900 select-none border-b border-slate-100/30">
          <span className="text-xs font-black tracking-tight text-slate-800">9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full flex items-center justify-center shadow-inner">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800/50 absolute right-3" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800">
            {/* Cellular strength indicator */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M2 22h20V2z" />
            </svg>
            <span className="text-[9px] font-black tracking-tighter">5G</span>
            {/* Battery percentage */}
            <div className="w-5 h-2.5 border border-slate-700 rounded-sm p-0.5 flex items-center">
              <div className="bg-slate-800 h-full w-[80%] rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Content Viewport */}
        <div 
          ref={viewportRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide bg-slate-50"
        >
          <div className="pb-32 bg-slate-50 min-h-full">
            {profile?.role === 'parent' ? (
              <ParentDashboard activeTab={activeTab} />
            ) : (
              <KidDashboard activeTab={activeTab} />
            )}
          </div>
        </div>

        {/* Navigation Bar inside the frame */}
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} visible={isNavbarVisible} />
        <Toaster position="top-center" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

