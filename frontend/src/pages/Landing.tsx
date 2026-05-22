import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LogIn, ArrowLeft, Delete, GraduationCap, ShieldCheck, Lock, CheckCircle2, User, Users, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileItem {
  id: string;
  role: 'parent' | 'kid';
  name: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  avatar: string;
}

export const Landing: React.FC = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<'select-type' | 'select-profile' | 'pin'>('select-type');
  const [selectedType, setSelectedType] = useState<'parent' | 'kid' | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const profiles: ProfileItem[] = [
    // Parent profiles
    {
      id: 'father',
      role: 'parent',
      name: 'Adam',
      title: 'Main',
      desc: 'Controls allowance, checks progress & approves transaction',
      badge: 'Main',
      badgeColor: 'bg-slate-900 text-white border-slate-850',
      tagline: 'Secured with Biometrics',
      avatar: '/images/Adam.png',
    },
    {
      id: 'mother',
      role: 'parent',
      name: 'Nadine',
      title: 'Co-Main',
      desc: 'Co-manages allowance, approves transaction & reviews goals',
      badge: 'Co-Main',
      badgeColor: 'bg-indigo-900 text-white border-indigo-850',
      tagline: 'Secured with Biometrics',
      avatar: '/images/Nadine.png',
    },
    {
      id: 'guardian',
      role: 'parent',
      name: 'Grandpa Kamal',
      title: 'Backup Adam',
      desc: 'Provides saving rewards, grants quest bonus funds',
      badge: 'Guardian',
      badgeColor: 'bg-blue-950 text-white border-blue-900',
      tagline: 'Alternative access key',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    },
    // Kid profiles
    {
      id: 'Isac',
      role: 'kid',
      name: 'Isac',
      title: 'Smart Saver (Age 17)',
      desc: 'Saves up, requests weekly allowance & completes chores',
      badge: 'Saver Pro',
      badgeColor: 'bg-[#CCFF00] text-slate-950 border-[#CCFF00]/10',
      tagline: 'Daily Streak: 12 days 🔥',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=120&h=120&fit=crop',
    },
    {
      id: 'Alisya',
      role: 'kid',
      name: 'Alisya',
      title: 'Junior Saver (Age 9)',
      desc: 'Learns how to budget, saves for toys & tidy up quests',
      badge: 'Tiny Cat',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-250',
      tagline: 'Daily Streak: 5 days 🔥',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop',
    }
  ];

  const handleTypeSelect = (type: 'parent' | 'kid') => {
    setSelectedType(type);
    setStep('select-profile');
  };

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id);
    setPin('');
    setStep('pin');
  };

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      // Auto-trigger on 4 digits
      if (newPin.length === 4) {
        setIsSuccess(true);
        setTimeout(() => {
          if (selectedType) {
            login(selectedType);
          }
        }, 600);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const filteredProfiles = profiles.filter(p => p.role === selectedType);
  const currentProfile = profiles.find(p => p.id === selectedProfileId);

  return (
    <div className="min-h-full bg-slate-50 flex flex-col justify-between p-6 relative overflow-hidden py-10 select-none">
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'select-type' ? (
          <motion.div
            key="select-type-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between gap-8 relative z-10"
          >
            {/* Header Content */}
            <div className="text-center pt-4 space-y-4">
              <motion.div 
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-24 h-24 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-slate-900/20 overflow-hidden ring-4 ring-slate-100"
              >
                <motion.img 
                  src="/images/monetro-logo.png" 
                  alt="Monetro" 
                  className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-1"
              >
                <h1 className="text-4xl font-extrabold tracking-tighter text-slate-950">
                  Mon<span className="text-slate-950 italic underline decoration-[#CCFF00] decoration-4">etro</span>
                </h1>
                <p className="text-slate-400 font-extrabold uppercase tracking-[0.25em] text-[9px]">Smart Family FinTech</p>
              </motion.div>

              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4 max-w-xs mx-auto">
                Teach children smart savings, AI-guided spends, and reach family goals together.
              </p>
            </div>

            {/* Type selector options (Large category cards) */}
            <div className="space-y-4">
              <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] text-center mb-1">
                Choose Access Space
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <motion.div
                  onClick={() => handleTypeSelect('parent')}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                >
                  <Card className="border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all bg-white rounded-3xl p-5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50/50 rounded-bl-[4rem] group-hover:bg-indigo-50 transition-colors flex items-center justify-center">
                      <Shield size={22} className="text-indigo-650" />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-900 mb-1">
                        Steward Area
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Login as Parents</h3>
                      <p className="text-xs text-slate-400 font-medium leading-normal max-w-[200px]">
                        Mother, Father, or Guardian control panels
                      </p>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  onClick={() => handleTypeSelect('kid')}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                >
                  <Card className="border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all bg-white rounded-3xl p-5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-[#CCFF00]/5 rounded-bl-[4rem] group-hover:bg-[#CCFF00]/10 transition-colors flex items-center justify-center">
                      <Sparkles size={22} className="text-[#99bf00]" />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="bg-[#CCFF00] text-slate-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#CCFF00]/20 mb-1">
                        Saver Area
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Login as Kid</h3>
                      <p className="text-xs text-slate-400 font-medium leading-normal max-w-[200px]">
                        Isac or Alisya's junior savings dashboards
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Footer with trust line */}
            <div className="pt-2 text-center">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <span className="w-10 h-[1px] bg-slate-200" />
                Gemini AI Shield Protection
                <span className="w-10 h-[1px] bg-slate-200" />
              </p>
            </div>
          </motion.div>
        ) : step === 'select-profile' ? (
          <motion.div
            key="select-profile-screen"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between gap-6 relative z-10"
          >
            {/* Header: Back to main choice */}
            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => setStep('select-type')}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 transition-colors active:scale-95 shadow-sm"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Select Your Profile
              </span>
              <div className="w-10 h-10" />
            </div>

            {/* Profiles Container */}
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="space-y-3">
                {filteredProfiles.map((prof) => (
                  <motion.div
                    key={prof.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProfileSelect(prof.id)}
                    className="cursor-pointer"
                  >
                    <Card className="border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all bg-white rounded-[2rem] overflow-hidden relative group">
                      <div className="absolute right-3 top-3">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${prof.badgeColor}`}>
                          {prof.badge}
                        </span>
                      </div>

                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="relative">
                          <img 
                            src={prof.avatar} 
                            alt={prof.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ${prof.role === 'parent' ? 'bg-slate-900' : 'bg-[#CCFF00]'}`} />
                        </div>

                        <div className="text-left space-y-0.5">
                          <h3 className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                            {prof.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">
                            {prof.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight max-w-[210px] mt-1 pt-0.5 border-t border-slate-50">
                            {prof.desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Back indicator or subtext */}
            <p className="text-slate-400 text-[10px] font-bold tracking-tight text-center italic">
              Tap any profile to enter credentials
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="pin-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between relative z-10"
          >
            {/* Header: Go Back to Profile Grid */}
            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => setStep('select-profile')}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 transition-colors active:scale-95"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Security Verification
              </span>
              <div className="w-10 h-10" />
            </div>

            {/* Selected Profile View */}
            <div className="text-center my-6 space-y-4">
              <div className="relative inline-block">
                <img 
                  src={currentProfile?.avatar} 
                  alt={currentProfile?.name} 
                  className="w-20 h-20 rounded-[2rem] object-cover mx-auto border-2 border-white shadow-xl ring-4 ring-[#CCFF00]/20"
                />
                <div className="absolute bottom-0 right-0 p-1.5 bg-slate-900 rounded-full border-2 border-white shadow-md text-white">
                  <Lock size={12} className="text-[#CCFF00]" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentProfile?.name}
                </h2>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">
                  Enter Your 4-Digit Security PIN
                </p>
              </div>

              {/* Pin Display Indicators */}
              <div className="flex justify-center gap-4 py-3">
                {[0, 1, 2, 3].map((index) => {
                  const filled = pin.length > index;
                  return (
                    <motion.div
                      key={index}
                      animate={filled ? { scale: [1, 1.3, 1] } : {}}
                      className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                        isSuccess 
                          ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : filled 
                            ? 'bg-slate-950 shadow-[0_0_8px_rgba(0,0,0,0.15)]' 
                            : 'bg-slate-200 border-2 border-slate-300'
                      }`}
                    />
                  );
                })}
              </div>

              {isSuccess ? (
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Unlocking Wallet...
                </p>
              ) : (
                <p className="text-slate-400 text-[10px] font-medium italic">
                  Note: Any 4 digits are accepted for simulation demo.
                </p>
              )}
            </div>

            {/* Custom Interactive Numerical Keypad */}
            <div className="space-y-3 pb-4">
              <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberPress(num)}
                    disabled={isSuccess}
                    className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xl border border-slate-100 flex items-center justify-center transition-all duration-150 active:scale-90 active:bg-slate-100 shadow-sm"
                  >
                    {num}
                  </button>
                ))}
                
                {/* Custom bypass button / fingerprint login simulation */}
                <button
                  onClick={() => {
                    setPin('1234');
                    setIsSuccess(true);
                    setTimeout(() => {
                      if (selectedType) {
                        login(selectedType);
                      }
                    }, 600);
                  }}
                  disabled={isSuccess}
                  className="w-16 h-16 rounded-full text-[10px] text-slate-400 hover:text-slate-900 font-bold tracking-tighter uppercase leading-tight bg-white border border-slate-50 flex items-center justify-center transition-transform active:scale-95 shadow-2xs"
                >
                  Bypass
                </button>

                <button
                  onClick={() => handleNumberPress('0')}
                  disabled={isSuccess}
                  className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xl border border-slate-100 flex items-center justify-center transition-all duration-150 active:scale-90 active:bg-slate-100 shadow-sm"
                >
                  0
                </button>

                <button
                  onClick={handleBackspace}
                  disabled={isSuccess}
                  className="w-16 h-16 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 active:scale-90 flex items-center justify-center bg-white border border-slate-100 transition-colors shadow-2xs"
                >
                  <Delete size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

