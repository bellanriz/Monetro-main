import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Sparkles, GraduationCap, Laptop, Car, ArrowUpRight, Plus, BrainCircuit, User, ShieldCheck, Flame, Bell, Smartphone, Key, HelpCircle, RefreshCw, LogOut, ChevronRight, Coins, Target, CheckCircle2, CreditCard, Globe, Lock, Unlock, Eye, EyeOff, AlertCircle, MapPin, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useTransactions } from '../hooks/useTransactions';
import { useSavings } from '../hooks/useSavings';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export const KidDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { profile, login, logout } = useAuth();
  const { transactions, cards, updateCardSetting, addTransaction } = useTransactions();
  const { goals } = useSavings();
  const [insights, setInsights] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Card Tab UI states
  const [selectedCardId, setSelectedCardId] = useState<string>('c1');
  const [showCardNumber, setShowCardNumber] = useState<boolean>(false);
  const [simulateIndex, setSimulateIndex] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  // Profile-specific toggles
  const [biometrics, setBiometrics] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (activeTab === 'analytics' && transactions.length > 0 && !insights) {
      generateInsights();
    }
  }, [activeTab, transactions]);

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: transactions.slice(0, 10), role: 'kid' })
      });
      const data = await response.json();
      setInsights(data.insights);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = [
    { name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
    { name: 'Games', icon: '🎮', color: 'bg-purple-100 text-purple-600' },
    { name: 'Shopping', icon: '🛍️', color: 'bg-blue-100 text-blue-600' },
    { name: 'Transport', icon: '🚌', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Education', icon: '📚', color: 'bg-indigo-100 text-indigo-600' },
  ];

  // SWITCHING FUNCTION
  const handleQuickSwitch = async () => {
    setSwitching(true);
    setTimeout(() => {
      login('parent');
      setSwitching(false);
    }, 1000);
  };

  // PROFILE / SETTINGS TAB
  if (activeTab === 'settings') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Account Settings</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <User size={18} />
          </div>
        </header>

        {/* Dynamic Personal Streak Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-orange-500/10">
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10 animate-bounce">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
              🔥
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-orange-100">Saver Streak</p>
              <h3 className="text-3xl font-black tracking-tight mt-0.5">12 Days Active!</h3>
              <p className="text-[10px] text-orange-500 bg-white font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-1.5 uppercase tracking-wide">
                Next Reward: RM 10.00
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card details */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[#CCFF00] shadow-md ring-4 ring-[#CCFF00]/10">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback>{profile?.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{profile?.displayName}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Savings Advocate</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total Saved</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">RM {profile?.savingsBalance}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Goals Met</p>
              <p className="text-xl font-extrabold text-indigo-600 mt-0.5">3 Complete</p>
            </div>
          </div>
        </Card>

        {/* SEAMLESS ACCOUNTS SWITCHING MODULE (The Core Request!) */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Fast Switch Roles</p>
          
          <Card className="border-2 border-slate-100 bg-white shadow-md rounded-[2.5rem] overflow-hidden p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 tracking-tight text-base">Quick-Switch to Parent</h4>
                  <p className="text-xs text-slate-405 font-medium">Instantly log into Adam's account</p>
                </div>
                <Button 
                  onClick={handleQuickSwitch} 
                  disabled={switching}
                  className="bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-extrabold rounded-2xl px-4 py-2 text-xs shadow-md shadow-[#CCFF00]/10 border border-[#CCFF00]/20 flex items-center gap-1.5 transition-transform active:scale-95 duration-150"
                >
                  {switching ? (
                    <RefreshCw className="animate-spin w-3.5 h-3.5" />
                  ) : (
                    <>
                      Switch <ChevronRight size={14} className="stroke-[3]" />
                    </>
                  )}
                </Button>
              </div>

              <div className="w-full h-[1px] bg-slate-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Current Role</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Smart Kid Profile</p>
                  </div>
                </div>
                <Button 
                  onClick={() => logout()}
                  variant="outline"
                  className="rounded-xl border-dashed border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-extrabold text-xs h-9 flex items-center gap-1"
                >
                  <LogOut size={13} />
                  Log Out
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Extra Security Settings & Toggles */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">System Preferences</p>
          
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Biometric Authentication</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Verify login using FaceID simulation</p>
                </div>
              </div>
              <button 
                onClick={() => setBiometrics(!biometrics)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${biometrics ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${biometrics ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                  <Bell size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Push Notifications</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Instant balance & reward transfers</p>
                </div>
              </div>
              <button 
                onClick={() => setPushAlerts(!pushAlerts)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${pushAlerts ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${pushAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // WALLET TAB
  if (activeTab === 'wallet') {
    const currentCard = cards.find(c => c.id === selectedCardId) || cards[0];
    const isVirtual = currentCard.type === 'virtual';

    const TEST_SPENDS = [
      { description: 'Chicken McNuggets', amount: 15, location: 'Kuala Lumpur, Malaysia (Domestic)', category: 'Food', isOverseas: false },
      { description: 'Robux Coins Premium', amount: 45, location: 'Roblox Online US (Overseas)', category: 'Games', isOverseas: true },
      { description: 'Nintendo Shop Akihabara', amount: 2450, location: 'Tokyo, Japan (Overseas shop)', category: 'Games', isOverseas: true },
      { description: 'Harrods Gift Arcade', amount: 4200, location: 'London, United Kingdom (Overseas)', category: 'Shopping', isOverseas: true }
    ];

    const currentSpendPreset = TEST_SPENDS[simulateIndex];

    const handleSimulateSwipe = async () => {
      if (!currentCard) return;

      if (currentCard.status === 'frozen') {
        toast.error('🔒 Transaction Denied: Card is currently frozen!');
        return;
      }

      if (currentSpendPreset.isOverseas && !currentCard.allowOverseas) {
        toast.error('🌍 Transaction Denied: Overseas purchases are disabled on this card!');
        return;
      }

      if (!currentSpendPreset.isOverseas && !currentCard.allowDomestic) {
        toast.error('🏠 Transaction Denied: Domestic purchases are disabled on this card!');
        return;
      }

      setIsSwiping(true);
      
      setTimeout(async () => {
        setIsSwiping(false);
        
        const newTx = await addTransaction({
          amount: currentSpendPreset.amount,
          type: 'spending',
          category: currentSpendPreset.category,
          description: currentSpendPreset.description,
          location: currentSpendPreset.location,
          isOverseas: currentSpendPreset.isOverseas,
          cardType: currentCard.type
        });

        if (currentSpendPreset.amount > 2000) {
          toast.warning(`⚠️ Exceeded parent limit! RM ${currentSpendPreset.amount} at ${currentSpendPreset.location} pending parent approval.`);
        } else {
          toast.success(`💳 Simulated purchase successful! RM ${currentSpendPreset.amount} spent.`);
        }
      }, 1000);
    };

    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kid Wallet</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Configure Cards & Spends</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Coins size={18} />
          </div>
        </header>

        {/* Card Type Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-[2rem]">
          <button 
            onClick={() => { setSelectedCardId('c1'); setShowCardNumber(false); }}
            className={cn(
              "flex-1 py-3 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5",
              selectedCardId === 'c1' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Smartphone size={14} /> Virtual Card
          </button>
          <button 
            onClick={() => { setSelectedCardId('c2'); setShowCardNumber(false); }}
            className={cn(
              "flex-1 py-3 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5",
              selectedCardId === 'c2' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <CreditCard size={14} /> Physical Card
          </button>
        </div>

        {/* Dynamic Fintech Card Component */}
        <div className="relative">
          <motion.div
            key={selectedCardId}
            initial={{ rotateY: 50, opacity: 0.8 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className={cn(
              "w-full text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden p-8 flex flex-col justify-between min-h-[210px] transform-gpu",
              isVirtual 
                ? "bg-gradient-to-tr from-[#1E3A8A] via-[#3B82F6] to-[#EC4899] text-white" 
                : "bg-gradient-to-tr from-[#FF7E00] via-[#F43F5E] to-[#E11D48] text-white",
              currentCard.status === 'frozen' && "grayscale contrast-75 brightness-75 duration-300"
            )}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />

            {/* Frozen Watermark */}
            {currentCard.status === 'frozen' && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1 z-30">
                <Lock className="text-white animate-bounce" size={32} />
                <span className="text-xs font-black tracking-widest uppercase text-white bg-slate-900/80 px-3 py-1 rounded-full border border-white/15">Card Frozen</span>
              </div>
            )}

            {/* Top row */}
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-0.5">
                <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[9px]">Card Balance</p>
                <h3 className="text-4xl font-extrabold tracking-tight">
                  RM {profile?.balance.toLocaleString()}
                </h3>
              </div>
              <div className="bg-white/10 border border-white/20 p-2.5 rounded-2xl">
                {isVirtual ? <Smartphone size={18} /> : <CreditCard size={18} />}
              </div>
            </div>

            {/* Middle row: Card Number */}
            <div className="pt-2 relative z-10 flex items-center gap-3">
              <span className="font-mono text-lg font-bold tracking-widest leading-none">
                {showCardNumber ? currentCard.cardNumber : `•••• •••• •••• ${currentCard.cardNumber.slice(-4)}`}
              </span>
              <button 
                onClick={() => setShowCardNumber(!showCardNumber)}
                className="p-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white/80"
              >
                {showCardNumber ? <EyeOff size={11} /> : <Eye size={11} />}
              </button>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 flex justify-between items-end relative z-10">
              <div className="space-y-0.5">
                <p className="text-white/40 uppercase tracking-widest text-[8px] font-black">Cardholder</p>
                <p className="text-xs font-black tracking-wider uppercase">{currentCard.cardHolder}</p>
              </div>
              <div className="flex gap-4 text-right">
                <div>
                  <p className="text-white/40 uppercase tracking-widest text-[8px] font-black">Expiry</p>
                  <p className="text-xs font-mono font-black">{currentCard.expiry}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-widest text-[8px] font-black">CVV</p>
                  <p className="text-xs font-mono font-black">{showCardNumber ? currentCard.cvv : '•••'}</p>
                </div>
                <div className="font-sans font-black tracking-widest text-lg text-white/50 flex align-middle">
                  VISA
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card Customization & Settings Switches */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Card Controls</p>
          <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden p-6 space-y-4">
            
            {/* Freeze Card Option */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  currentCard.status === 'frozen' ? "bg-rose-50 text-rose-500" : "bg-[#CCFF00]/10 text-slate-900"
                )}>
                  {currentCard.status === 'frozen' ? <Lock size={16} /> : <Unlock size={16} />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Freeze Card Setting</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Instantly stop all new card spends</p>
                </div>
              </div>
              <button 
                onClick={() => updateCardSetting(currentCard.id, 'status', currentCard.status === 'frozen' ? 'active' : 'frozen')}
                className={cn(
                  "w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none",
                  currentCard.status === 'frozen' ? 'bg-rose-500' : 'bg-[#CCFF00]'
                )}
              >
                <div className={cn(
                  "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                  currentCard.status === 'frozen' ? 'translate-x-[20px]' : 'translate-x-0'
                )} />
              </button>
            </div>

            {/* Domestic In-Country purchases toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Domestic In-Country Spending</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Purchase at local stores inside Malaysia</p>
                </div>
              </div>
              <button 
                onClick={() => updateCardSetting(currentCard.id, 'allowDomestic', !currentCard.allowDomestic)}
                className={cn(
                  "w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none",
                  currentCard.allowDomestic ? 'bg-emerald-500' : 'bg-slate-200'
                )}
              >
                <div className={cn(
                  "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                  currentCard.allowDomestic ? 'translate-x-[20px]' : 'translate-x-0'
                )} />
              </button>
            </div>

            {/* Overseas Toggle Option */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl">
                  <Globe size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Overseas & Global Purchases</h4>
                  <p className="text-[10px] text-slate-400 font-medium font-semibold">Enable foreign shops & platforms</p>
                </div>
              </div>
              <button 
                onClick={() => updateCardSetting(currentCard.id, 'allowOverseas', !currentCard.allowOverseas)}
                className={cn(
                  "w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none",
                  currentCard.allowOverseas ? 'bg-emerald-500' : 'bg-slate-200'
                )}
              >
                <div className={cn(
                  "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                  currentCard.allowOverseas ? 'translate-x-[20px]' : 'translate-x-0'
                )} />
              </button>
            </div>

            {/* Predefined Limit Alert Monitor card indicator */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-50 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="text-slate-500 stroke-[2.5]" size={14} />
                <span>Limit Monitoring</span>
              </div>
              <span className="font-mono text-slate-900 font-black">Spends &gt; RM 2k request authorization</span>
            </div>
          </Card>
        </div>

        {/* INTERACTIVE SWIPE PLAYGROUND */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Fintech Spend Simulator</p>
          
          <Card className="border-2 border-slate-100 bg-gradient-to-b from-white to-slate-50/50 shadow-md rounded-[2rem] p-6 space-y-4">
            <h4 className="font-extrabold text-slate-900 tracking-tight text-sm">Interactive Swipe Card Test</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Test card regulations and overseas limits! Exceeding RM 2,000 threshold will request live parent authorization.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {TEST_SPENDS.map((s, index) => (
                <button
                  key={index}
                  onClick={() => setSimulateIndex(index)}
                  className={cn(
                    "p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-20 relative overflow-hidden",
                    simulateIndex === index 
                      ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-950/15" 
                      : "border-slate-100 bg-white text-slate-800 hover:bg-slate-50"
                  )}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-tight block">
                    {s.isOverseas ? "🌍 Overseas" : "🏠 Domestic"}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold line-clamp-1 leading-tight">{s.description}</p>
                    <p className="text-xs font-black mt-0.5 font-mono">RM {s.amount}</p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleSimulateSwipe}
              disabled={isSwiping}
              className={cn(
                "w-full rounded-[1.5rem] py-6 font-extrabold h-12 flex items-center justify-center gap-2",
                currentCard.status === 'frozen' 
                  ? "bg-slate-250 text-slate-400 cursor-not-allowed" 
                  : "bg-slate-950 text-white hover:bg-slate-800 shadow-md shadow-slate-950/15 transition-all"
              )}
            >
              {isSwiping ? (
                <>
                  <RefreshCw className="animate-spin w-4 h-4 text-white" />
                  Swiping Card...
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 text-[#CCFF00]" />
                  Simulate Swipe Card (Swipe!)
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // FAMILY GOALS / TASKS TAB
  if (activeTab === 'family') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Family Quest</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Earn & Complete Chores</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Target size={18} />
          </div>
        </header>

        {/* Parent Announcement */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-indigo-900 text-white p-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-800 rounded-full blur-2xl" />
          <p className="text-amber-300 font-extrabold text-[10px] uppercase tracking-widest">Notice from Father</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">
            "Alisya, finish your school science project and I'll send a bonus RM 30.00 SSPN savings deposit!"
          </p>
        </Card>

        {/* Chores list */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight pl-1">Available Quests</h3>
          <div className="space-y-3">
            <Card className="border border-slate-100 bg-white p-5 rounded-3xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-900 rounded-md">
                  Active
                </span>
                <h4 className="font-extrabold text-slate-900 tracking-tight text-sm mt-1.5">Wash and Dry the Family Car</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reward: RM 15.00</p>
              </div>
              <Button size="sm" className="bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black rounded-xl text-xs h-9">
                Claim Progress
              </Button>
            </Card>

            <Card className="border border-slate-100 bg-white p-5 rounded-3xl flex items-center justify-between opacity-75">
              <div>
                 <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md">
                  Approved
                </span>
                <h4 className="font-extrabold text-slate-400 line-through tracking-tight text-sm mt-1.5">Tidy up Your Gaming Desk</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reward: RM 5.00</p>
              </div>
              <CheckCircle2 className="text-emerald-500" size={24} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab !== 'home') {
     return <div className="flex items-center justify-center min-h-screen text-slate-400 font-medium pt-12">Tab under development ({activeTab})</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-12 pb-32 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-slate-400 tracking-tight">Hey there,</p>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{profile?.displayName.split(' ')[0]} 👋</h2>
        </div>
        <Avatar className="h-14 w-14 ring-4 ring-blue-500/10 ring-offset-4 border-2 border-white shadow-md">
          <AvatarImage src={profile?.photoURL} />
          <AvatarFallback>{profile?.displayName[0]}</AvatarFallback>
        </Avatar>
      </header>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[3rem] relative overflow-hidden h-72 flex flex-col justify-center px-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
          
          <div className="space-y-1 relative z-10">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Current Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-500 tracking-tighter">RM</span>
              <h3 className="text-7xl font-extrabold tracking-tighter tabular-nums drop-shadow-sm">
                {profile?.balance.toLocaleString()}
              </h3>
            </div>
          </div>
          
          <div className="mt-10 flex gap-4 relative z-10">
             <Button className="bg-slate-800 hover:bg-slate-700 text-white border-none rounded-2xl h-14 flex-1 font-extrabold shadow-lg">
               Send
             </Button>
             <Button className="bg-blue-600 hover:bg-blue-500 text-white border-none rounded-2xl h-14 flex-1 font-extrabold shadow-lg shadow-blue-500/20">
               Scan & Pay
             </Button>
          </div>
        </Card>
      </motion.div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Savings Goals</h3>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600">
            <Plus size={20} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-none shadow-sm hover:shadow-xl transition-all p-8 rounded-[2.5rem] bg-white group border border-slate-50">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-slate-50 rounded-[1.5rem] group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6 text-slate-600">
                          {goal.category === 'university' && <GraduationCap size={28} />}
                          {goal.category === 'laptop' && <Laptop size={28} />}
                          {goal.category === 'car' && <Car size={28} />}
                          {!['university', 'laptop', 'car'].includes(goal.category) && <Sparkles size={28} />}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xl tracking-tight">{goal.title}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{goal.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">RM {goal.targetAmount - goal.currentAmount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Remaining</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                       <div className="flex justify-between items-baseline">
                         <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
                           {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Complete
                         </span>
                         <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                           RM {goal.currentAmount} / {goal.targetAmount}
                         </span>
                       </div>
                       <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden p-1">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                           className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                         />
                       </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {goals.length === 0 && (
             <div className="text-center py-16 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto transform rotate-6 border border-slate-100">
                    <Sparkles className="text-slate-300" size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-extrabold text-lg">Goal-less?</p>
                  <p className="text-slate-400 font-bold px-12 leading-relaxed">Saving for something big? Add your first goal to get started!</p>
                </div>
             </div>
          )}
        </div>
      </section>

      <section className="space-y-6 pb-4">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-5 bg-white rounded-[2rem] shadow-sm border border-slate-50 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="text-2xl w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {categories.find(c => c.name === tx.category)?.icon || '💸'}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">{tx.description}</h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-[10px] text-slate-400 font-bold">
                    <span className="uppercase tracking-widest">{tx.category}</span>
                    {tx.location && (
                      <span className="flex items-center gap-0.5 text-slate-500 font-medium normal-case">
                        <MapPin size={10} className="text-slate-400" />
                        {tx.location}
                      </span>
                    )}
                  </div>
                  {tx.cardType && (
                    <div className="mt-1.5 flex gap-1 items-center">
                      <Badge variant="outline" className="text-[8px] uppercase tracking-wide px-1.5 py-0 rounded-md font-bold text-slate-400 border-slate-200">
                        {tx.cardType}
                      </Badge>
                      {tx.isOverseas && (
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wide px-1.5 py-0 rounded-md font-bold text-indigo-500 border-indigo-200 bg-indigo-50/50">
                          Overseas
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-black text-lg tracking-tighter",
                  tx.type === 'spending' ? 'text-slate-900' : 'text-emerald-500'
                )}>
                  {tx.type === 'spending' ? '-' : '+'} RM {tx.amount.toLocaleString()}
                </p>
                <div className="mt-1">
                  <Badge className={cn(
                    "text-[9px] uppercase font-black px-2 py-0.5 h-auto rounded-md shadow-none",
                    tx.status === 'pending' ? "bg-amber-100 text-amber-700 animate-pulse border-none" : "",
                    tx.status === 'completed' ? "bg-emerald-100 text-emerald-700 border-none" : "",
                    tx.status === 'rejected' ? "bg-rose-100 text-rose-700 border-none" : "",
                    tx.status === 'approved' ? "bg-teal-100 text-teal-700 border-none" : ""
                  )}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
