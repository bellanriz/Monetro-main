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
  const [showCardSettings, setShowCardSettings] = useState(false);

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
    { name: 'Food', color: 'bg-orange-100 text-orange-600' },
    { name: 'Games', color: 'bg-purple-100 text-purple-600' },
    { name: 'Shopping', color: 'bg-blue-100 text-blue-600' },
    { name: 'Transport', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Education', color: 'bg-indigo-100 text-indigo-600' },
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

    return (
      <div className="max-w-md mx-auto p-6 space-y-6 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Wallet</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Balance & Transactions</p>
          </div>
          <button
            onClick={() => setShowCardSettings(!showCardSettings)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              showCardSettings ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            <Key size={18} />
          </button>
        </header>

        {/* Card Settings (Parent Controlled) */}
        <AnimatePresence>
          {showCardSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="border border-slate-100 shadow-sm rounded-[2rem] bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Settings</p>
                  <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md border border-amber-200">
                    Parent Controlled
                  </span>
                </div>

                {/* Freeze Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl",
                      currentCard.status === 'frozen' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                    )}>
                      {currentCard.status === 'frozen' ? <Lock size={14} /> : <Unlock size={14} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Freeze Card</h4>
                      <p className="text-[9px] text-slate-400">Stop all new card spends</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2.5 py-1 rounded-full",
                    currentCard.status === 'frozen' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {currentCard.status === 'frozen' ? 'Frozen' : 'Active'}
                  </span>
                </div>

                {/* Domestic */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Domestic Spending</h4>
                      <p className="text-[9px] text-slate-400">Local stores in Malaysia</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2.5 py-1 rounded-full",
                    currentCard.allowDomestic ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {currentCard.allowDomestic ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                {/* Overseas */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                      <Globe size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Overseas Purchases</h4>
                      <p className="text-[9px] text-slate-400">Foreign shops & platforms</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2.5 py-1 rounded-full",
                    currentCard.allowOverseas ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {currentCard.allowOverseas ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                {/* Request Change Button */}
                <button
                  onClick={() => toast.info('Request sent to parent for approval.')}
                  className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl text-xs uppercase tracking-wider transition-colors active:scale-95"
                >
                  Request Change from Parent
                </button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Balance Card */}
        <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden p-7">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <p className="text-slate-400 font-extrabold uppercase tracking-[0.2em] text-[10px]">Current Balance</p>
            <h3 className="text-4xl font-black tracking-tighter">
              RM {profile?.balance.toLocaleString()}
            </h3>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toast.info('Send money feature coming soon!')}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ArrowUpRight size={18} className="text-slate-900" />
            <span className="font-black text-sm text-slate-900">Send</span>
          </button>
          <button
            onClick={() => toast.info('Scan & Pay feature coming soon!')}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Smartphone size={18} className="text-slate-900" />
            <span className="font-black text-sm text-slate-900">Scan & Pay</span>
          </button>
        </div>

        {/* Transaction History */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Transactions</h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">This month</span>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <Card key={tx.id} className="border border-slate-100 bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">{tx.description}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{tx.category}</p>
                  </div>
                  <span className={cn(
                    "font-black text-base shrink-0 ml-3 tabular-nums",
                    tx.type === 'spending' ? "text-rose-500" : "text-emerald-500"
                  )}>
                    {tx.type === 'spending' ? '−' : '+'}RM{tx.amount.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Savings Goals</h3>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600">
            <Plus size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all p-5 rounded-[2rem] bg-white border border-slate-50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                          {goal.category === 'university' && <GraduationCap size={20} />}
                          {goal.category === 'laptop' && <Laptop size={20} />}
                          {goal.category === 'car' && <Car size={20} />}
                          {!['university', 'laptop', 'car'].includes(goal.category) && <Sparkles size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{goal.title}</h4>
                            {goal.category === 'university' && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md border border-amber-200 flex items-center gap-0.5">
                                <Lock size={8} /> SSPN Locked
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{goal.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900 tracking-tighter">RM {(goal.targetAmount - goal.currentAmount).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">remaining</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-baseline">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                           {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                         </span>
                         <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                           RM {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}
                         </span>
                       </div>
                       <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                           className="h-full bg-blue-600 rounded-full" 
                         />
                       </div>
                       {goal.category === 'university' && (
                         <p className="text-[9px] text-amber-600 font-bold mt-1">
                           This fund is linked to SSPN and cannot be withdrawn until maturity.
                         </p>
                       )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {goals.length === 0 && (
             <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 space-y-4">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                    <Sparkles className="text-slate-300" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-extrabold text-sm">No goals yet</p>
                  <p className="text-slate-400 font-bold text-xs px-8">Add your first savings goal to start tracking!</p>
                </div>
             </div>
          )}
        </div>
      </section>

      <section className="space-y-4 pb-4">
      </section>
    </div>
  );
};
