import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, Grid, Shield, ShieldCheck, ChevronLeft, ChevronRight, CheckCircle2, Globe, Lock, Unlock, MapPin, XCircle, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface ParentFamilyProps {
  profile: any;
  transactions: any[];
  cards: any[];
  pendingApprovals: any[];
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string) => void;
  updateCardSetting: (cardId: string, setting: string, value: any) => void;
  addTransaction: (tx: any) => Promise<any>;
  familyCards: any[];
  setFamilyCards: (cards: any[]) => void;
  activeCardId: string | null;
  setActiveCardId: (id: string | null) => void;
  showCardControls: string | null;
  setShowCardControls: (id: string | null) => void;
  showAddCardModal: boolean;
  setShowAddCardModal: (val: boolean) => void;
  showFamilySavings: boolean;
  setShowFamilySavings: (val: boolean) => void;
  showCreateQuest: string | null;
  setShowCreateQuest: (val: string | null) => void;
  newQuestTitle: string;
  setNewQuestTitle: (val: string) => void;
  newQuestReward: string;
  setNewQuestReward: (val: string) => void;
  quests: { id: string; kid: string; title: string; reward: number; status: 'in_progress' | 'reviewing' | 'paid' }[];
  setQuests: React.Dispatch<React.SetStateAction<{ id: string; kid: string; title: string; reward: number; status: 'in_progress' | 'reviewing' | 'paid' }[]>>;
}

export const ParentFamily: React.FC<ParentFamilyProps> = ({
  transactions,
  cards,
  pendingApprovals,
  approveTransaction,
  rejectTransaction,
  updateCardSetting,
  addTransaction,
  familyCards,
  activeCardId,
  setActiveCardId,
  showCardControls,
  setShowCardControls,
  setShowAddCardModal,
  showFamilySavings,
  setShowFamilySavings,
  showCreateQuest,
  setShowCreateQuest,
  newQuestTitle,
  setNewQuestTitle,
  newQuestReward,
  setNewQuestReward,
  quests,
  setQuests,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Family Quest Hub</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assign Tasks & Rewards</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <Grid size={18} />
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-900">Family Cards</h3>
        </div>

        {/* Stacked card layout like Apple Wallet */}
        <div className="space-y-0">
          {(() => {
            return familyCards.map((card, index) => {
              const isGreen = card.theme === 'green';
              const isBlack = card.theme === 'black';
              const isWhite = card.theme === 'white';
              const isActive = card.id === activeCardId;
              const isKidCard = card.id === 'fc1' || card.id === 'fc3';

              // Find the index of the active card
              const activeIndex = familyCards.findIndex(c => c.id === activeCardId);
              // Cards after the active card need to push down
              const isAfterActive = activeCardId && index > activeIndex;

              return (
                <React.Fragment key={card.id}>
                  <motion.div
                    onClick={() => {
                      if (isKidCard) {
                        setActiveCardId(isActive ? null : card.id);
                        if (isActive) setShowCardControls(null);
                      }
                    }}
                    className={cn(
                      "relative rounded-[1.5rem] p-5 overflow-hidden shadow-lg min-h-[180px] flex flex-col justify-between cursor-pointer",
                      isGreen && "bg-[#a3e635]",
                      isBlack && "bg-[#121214]",
                      isWhite && "bg-white border border-slate-200",
                      index > 0 && !isAfterActive && "-mt-[125px]",
                      isAfterActive && "-mt-[125px]"
                    )}
                    style={{
                      zIndex: familyCards.length - index + (isActive ? 50 : 0)
                    }}
                    animate={{ 
                      marginTop: index === 0 ? 0 : isAfterActive ? 8 : -125
                    }}
                    transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                  >
                    {/* Monetro watermark */}
                    <span className={cn(
                      "absolute bottom-5 left-5 text-[44px] font-black italic tracking-tighter leading-none select-none pointer-events-none",
                      isGreen && "text-[#8bc62a]/40",
                      isBlack && "text-white/[0.06]",
                      isWhite && "text-slate-200/60"
                    )}>
                      Monetro
                    </span>

                    {/* Top row: Name + Brand */}
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className={cn(
                          "text-sm font-black",
                          isGreen && "text-slate-900",
                          isBlack && "text-white",
                          isWhite && "text-slate-900"
                        )}>
                          {card.holder}
                        </p>
                        <p className={cn(
                          "text-2xl font-black tracking-tight mt-0.5",
                          isGreen && "text-slate-900",
                          isBlack && "text-white",
                          isWhite && "text-slate-900"
                        )}>
                          RM {card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-black italic tracking-tight",
                          isGreen && "text-slate-900",
                          isBlack && "text-white",
                          isWhite && "text-slate-900"
                        )}>
                          {card.brand}
                        </span>
                      </div>
                    </div>

                    {/* Bottom row: Card number + badge */}
                    <div className="flex justify-between items-end relative z-10 mt-auto pt-6">
                      <p className={cn(
                        "text-xs font-mono font-bold tracking-widest",
                        isGreen && "text-slate-900/70",
                        isBlack && "text-white/70",
                        isWhite && "text-slate-500"
                      )}>
                        •••• {card.number}
                      </p>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
                        isGreen && "bg-slate-900/10 text-slate-900/60",
                        isBlack && "bg-white/10 text-white/50",
                        isWhite && "bg-slate-100 text-slate-400"
                      )}>
                        {card.type}
                      </span>
                    </div>
                  </motion.div>

                  {/* Card Controls - appears right below the active kid card */}
                  <AnimatePresence>
                    {isActive && isKidCard && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                        className="overflow-hidden relative"
                        style={{ zIndex: familyCards.length - index + 49 }}
                      >
                        <Card className="border-none bg-white rounded-3xl p-5 shadow-md space-y-4 mt-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-slate-900">{card.holder}'s Card Controls</h4>
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Active</span>
                          </div>

                          {(() => {
                            const currentCard = cards.find(c => c.id === (card.id === 'fc1' ? 'c1' : 'c2')) || cards[0];
                            if (!currentCard) return null;
                            return (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={cn("p-2.5 rounded-2xl", currentCard.status === 'frozen' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500")}>
                                      {currentCard.status === 'frozen' ? <Lock size={16} /> : <Unlock size={16} />}
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black text-slate-950">Card Freeze</h4>
                                      <p className="text-[9px] text-slate-400 font-bold uppercase">{currentCard.status === 'frozen' ? "FROZEN" : "ACTIVE"}</p>
                                    </div>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); updateCardSetting(currentCard.id, 'status', currentCard.status === 'frozen' ? 'active' : 'frozen'); toast.success(`💳 Card ${currentCard.status === 'frozen' ? 'unfrozen' : 'frozen'}!`); }} className={cn("w-11 h-6 rounded-full p-1 transition-colors", currentCard.status === 'frozen' ? 'bg-rose-500' : 'bg-emerald-500')}>
                                    <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transition-transform", currentCard.status === 'frozen' ? 'translate-x-[20px]' : 'translate-x-0')} />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-slate-50 text-slate-700 rounded-2xl"><Globe size={16} /></div>
                                    <div>
                                      <h4 className="text-xs font-black text-slate-950">Overseas</h4>
                                      <p className="text-[9px] text-slate-400 font-bold">{currentCard.allowOverseas ? "Allowed" : "Locked"}</p>
                                    </div>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); updateCardSetting(currentCard.id, 'allowOverseas', !currentCard.allowOverseas); toast.success(`🌍 Overseas spending updated!`); }} className={cn("w-11 h-6 rounded-full p-1 transition-colors", currentCard.allowOverseas ? 'bg-emerald-500' : 'bg-slate-200')}>
                                    <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transition-transform", currentCard.allowOverseas ? 'translate-x-[20px]' : 'translate-x-0')} />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-slate-50 text-slate-700 rounded-2xl"><MapPin size={16} /></div>
                                    <div>
                                      <h4 className="text-xs font-black text-slate-950">Domestic</h4>
                                      <p className="text-[9px] text-slate-400 font-bold">{currentCard.allowDomestic ? "Allowed" : "Locked"}</p>
                                    </div>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); updateCardSetting(currentCard.id, 'allowDomestic', !currentCard.allowDomestic); toast.success(`🏠 Domestic spending updated!`); }} className={cn("w-11 h-6 rounded-full p-1 transition-colors", currentCard.allowDomestic ? 'bg-emerald-500' : 'bg-slate-200')}>
                                    <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transition-transform", currentCard.allowDomestic ? 'translate-x-[20px]' : 'translate-x-0')} />
                                  </button>
                                </div>
                              </>
                            );
                          })()}
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            });
          })()}
        </div>

        {/* Add Card Button */}
        <motion.div 
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddCardModal(true)}
          className="w-full rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/40 p-6 flex items-center justify-center gap-3 cursor-pointer min-h-[80px] hover:bg-slate-50/80 hover:border-slate-300 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Plus size={16} className="stroke-[3]" />
          </div>
          <span className="text-sm font-extrabold text-slate-800">Add Card</span>
        </motion.div>
      </section>

      {/* Family Savings Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowFamilySavings(true)}
        className="w-full bg-[#121214] rounded-3xl p-5 shadow-lg flex items-center justify-between text-left border border-white/5 relative overflow-hidden"
      >
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Coins size={22} className="text-white" />
          </div>
          <div>
            <h4 className="font-black text-white text-sm">Family Savings</h4>
            <p className="text-[10px] text-white/60 font-bold">SSPN, Emergency & Renovation Funds</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-white/50" />
      </motion.button>

      {/* Family Savings Full Page Overlay */}
      <AnimatePresence>
        {showFamilySavings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-[#f4f4f7] z-[60] overflow-y-auto pb-32 md:max-w-[440px] md:mx-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFamilySavings(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Family Savings</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Managed by Adam</p>
                  </div>
                </div>
              </div>

              <Card className="bg-slate-900 text-white border-none shadow-xl rounded-[2.5rem] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-[9px] text-white/50 font-black uppercase tracking-widest">Total Family Savings</p>
                <p className="text-3xl font-black text-white tracking-tight mt-1">RM 41,800.00</p>
                <div className="flex gap-3 mt-3">
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">4 Active Goals</span>
                  <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">5 Members</span>
                </div>
              </Card>

              <Card className="border border-slate-100 bg-white rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/images/isac.png" alt="Isac" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-950">Isac's SSPN Fund</h4>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">Son</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">School achievement rewards</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Saved</p>
                    <p className="text-sm font-black text-slate-900">RM 2,400</p>
                  </div>
                  <Button onClick={async () => { await addTransaction({ amount: 50, type: 'allowance', description: 'SSPN Achievement Reward - Isac', category: 'Allowance', status: 'completed', location: 'Kuala Lumpur', isOverseas: false }); toast.success("Deposited RM 50.00 into Isac's SSPN savings!"); }} className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-11 px-4 text-xs transition-transform active:scale-95 shadow-md">Transfer RM 50</Button>
                </div>
              </Card>

              <Card className="border border-slate-100 bg-white rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/images/alisya.png" alt="Alisya" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-950">Alisya's SSPN Fund</h4>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full border border-pink-100">Daughter</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">School achievement rewards</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Saved</p>
                    <p className="text-sm font-black text-slate-900">RM 1,800</p>
                  </div>
                  <Button onClick={async () => { await addTransaction({ amount: 50, type: 'allowance', description: 'SSPN Achievement Reward - Alisya', category: 'Allowance', status: 'completed', location: 'Kuala Lumpur', isOverseas: false }); toast.success("Deposited RM 50.00 into Alisya's SSPN savings!"); }} className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-11 px-4 text-xs transition-transform active:scale-95 shadow-md">Transfer RM 50</Button>
                </div>
              </Card>

              {/* Isac's Savings Goal */}
              <Card className="border border-slate-100 bg-white rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/images/isac.png" alt="Isac" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-950">Isac's Savings Goal</h4>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">Goal</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">New Gaming PC</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">RM 1,950 / RM 3,000</p>
                    <p className="text-sm font-black text-slate-900">65% reached</p>
                  </div>
                  <Button onClick={async () => { await addTransaction({ amount: 100, type: 'savings', description: 'Savings Goal - Isac Gaming PC', category: 'Savings Goal', status: 'completed', location: 'Kuala Lumpur', isOverseas: false }); toast.success("Deposited RM 100.00 into Isac's Gaming PC goal!"); }} className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-11 px-4 text-xs transition-transform active:scale-95 shadow-md">Transfer RM 100</Button>
                </div>
              </Card>

              {/* Alisya's Savings Goal */}
              <Card className="border border-slate-100 bg-white rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/images/alisya.png" alt="Alisya" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-950">Alisya's Savings Goal</h4>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full border border-pink-100">Goal</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">New iPad for School</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: '42%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">RM 840 / RM 2,000</p>
                    <p className="text-sm font-black text-slate-900">42% reached</p>
                  </div>
                  <Button onClick={async () => { await addTransaction({ amount: 100, type: 'savings', description: 'Savings Goal - Alisya iPad', category: 'Savings Goal', status: 'completed', location: 'Kuala Lumpur', isOverseas: false }); toast.success("Deposited RM 100.00 into Alisya's iPad goal!"); }} className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-11 px-4 text-xs transition-transform active:scale-95 shadow-md">Transfer RM 100</Button>
                </div>
              </Card>

              <Card className="border border-rose-100 bg-gradient-to-br from-white to-rose-50/30 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/images/nadine.png" alt="Nadine" className="w-9 h-9 rounded-full object-cover border border-rose-200" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-950">Emergency Fund</h4>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">Wife</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Joint emergency savings with Nadine</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: '62%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">RM 18,600 / RM 30,000</p>
                    <p className="text-sm font-black text-slate-900">62% reached</p>
                  </div>
                  <Button onClick={async () => { await addTransaction({ amount: 200, type: 'savings', description: 'Emergency Fund Deposit', category: 'Emergency', status: 'completed', location: 'Joint Account - Nadine', isOverseas: false }); toast.success("Deposited RM 200.00 into Emergency Fund (Nadine)!"); }} className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-11 px-4 text-xs transition-transform active:scale-95 shadow-md">Transfer RM 200</Button>
                </div>
              </Card>

              <Card className="border border-amber-100 bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img src="/images/grandma.png" alt="Mom" className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                    <img src="/images/grandpa.png" alt="Dad" className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-950">House Renovation</h4>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Parents</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Renovation fund for Mom & Dad's house</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: '38%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">RM 19,000 / RM 50,000</p>
                    <p className="text-sm font-black text-slate-900">38% reached</p>
                  </div>
                  <Button onClick={async () => { await addTransaction({ amount: 500, type: 'savings', description: 'House Renovation Fund', category: 'Renovation', status: 'completed', location: 'Parents House Fund', isOverseas: false }); toast.success("Deposited RM 500.00 into Parents House Renovation Fund!"); }} className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-11 px-4 text-xs transition-transform active:scale-95 shadow-md">Transfer RM 500</Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Family Approvals Center moved from Home tab */}
      <div className="space-y-4 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-xl font-bold text-slate-900">Family Approvals</h3>
          <Badge className="bg-amber-100 text-amber-700 font-black uppercase text-[9px] border-none px-2 rounded-full h-fit">
            {pendingApprovals.length} Family Pending
          </Badge>
        </div>

        <div className="space-y-3">
          {pendingApprovals.map((tx) => (
            <Card key={tx.id} className="border-2 border-amber-200 bg-amber-50/20 shadow-lg rounded-[2.5rem] p-6 space-y-4 relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                    <Shield size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">Limit Threshold Alert</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Transaction exceeds RM 2,000 allowance</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-black text-slate-900 bg-white border border-slate-100 rounded-lg px-2 py-0.5">
                  {tx.cardType || 'Virtual'}
                </span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount requested</p>
                  <p className="text-xl font-black text-amber-600">RM {tx.amount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <p className="text-slate-400 font-bold">Merchant Name:</p>
                  <p className="text-slate-950 font-extrabold">{tx.description}</p>
                </div>
                {tx.location && (
                  <div className="flex justify-between items-center text-xs">
                    <p className="text-slate-400 font-bold">Location & Currency:</p>
                    <p className="text-slate-900 font-extrabold flex items-center gap-1">
                      <MapPin size={12} className="text-amber-600" />
                      {tx.location}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    approveTransaction(tx.id);
                    toast.success(`💳 Authorized spending! RM ${tx.amount} approved at ${tx.description}.`);
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl h-12 text-xs shadow-md shadow-emerald-500/15 border-none"
                >
                  Approve Checkout
                </Button>
                <Button
                  onClick={() => {
                    rejectTransaction(tx.id);
                    toast.error(`❌ Checkout Rejected: transaction of RM ${tx.amount} denied.`);
                  }}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl h-12 text-xs shadow-md shadow-rose-500/15 border-none"
                >
                  Decline & Reject
                </Button>
              </div>
            </Card>
          ))}

          {pendingApprovals.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 space-y-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-slate-150 text-slate-350 shadow-sm">
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-slate-900 font-black text-xs">All locks active & secure</p>
                <p className="text-slate-400 font-bold text-[10px] px-8 leading-relaxed">No pending requests over RM 2,000 threshold.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Quest Boards */}
      {['isac', 'alisya'].map((kid) => {
        const kidQuests = quests.filter(q => q.kid === kid);
        const kidName = kid === 'isac' ? 'Isac' : 'Alisya';
        const accentColor = kid === 'isac' ? 'blue' : 'pink';

        return (
          <div key={kid} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 tracking-tight pl-1">{kidName}'s Quest board</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCreateQuest(kid)}
                className={`text-xs text-${accentColor}-600 font-black uppercase hover:bg-${accentColor}-50`}
              >
                Create New
              </Button>
            </div>

            <div className="space-y-3">
              {kidQuests.map((quest) => (
                <Card key={quest.id} className={cn("border border-slate-100 bg-white p-5 rounded-3xl flex items-center justify-between", quest.status === 'paid' && "opacity-75")}>
                  <div>
                    {quest.status === 'reviewing' && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-md">Reviewing Claim</span>
                    )}
                    {quest.status === 'in_progress' && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-md">In Progress</span>
                    )}
                    {quest.status === 'paid' && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md">Paid</span>
                    )}
                    <h4 className={cn("font-extrabold tracking-tight text-sm mt-1.5", quest.status === 'paid' ? "text-slate-400 line-through" : "text-slate-900")}>{quest.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reward: RM {quest.reward.toFixed(2)}</p>
                  </div>
                  {quest.status === 'reviewing' && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, status: 'paid' } : q));
                        toast.success(`💸 RM ${quest.reward.toFixed(2)} transferred to ${kidName} for "${quest.title}"!`);
                      }}
                      className="bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black rounded-xl text-xs h-9"
                    >
                      Approve & Pay
                    </Button>
                  )}
                  {quest.status === 'paid' && <CheckCircle2 className="text-emerald-500" size={24} />}
                  {quest.status === 'in_progress' && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, status: 'reviewing' } : q));
                        toast.info(`📋 ${kidName} claims "${quest.title}" is done! Review it.`);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-[10px] h-9"
                    >
                      Simulate Done
                    </Button>
                  )}
                </Card>
              ))}

              {kidQuests.length === 0 && (
                <div className="text-center py-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-xs font-bold text-slate-400">No quests yet. Tap "Create New" to add one.</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Create Quest Modal */}
      <AnimatePresence>
        {showCreateQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-black text-slate-900">New Quest for {showCreateQuest === 'isac' ? 'Isac' : 'Alisya'}</h4>
                <button onClick={() => { setShowCreateQuest(null); setNewQuestTitle(''); setNewQuestReward('10'); }} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black ml-1">Quest Title</p>
                  <input
                    type="text"
                    value={newQuestTitle}
                    onChange={(e) => setNewQuestTitle(e.target.value)}
                    placeholder="e.g. Clean your room"
                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 font-black text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black ml-1">Reward (RM)</p>
                  <input
                    type="number"
                    value={newQuestReward}
                    onChange={(e) => setNewQuestReward(e.target.value)}
                    placeholder="10"
                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 font-black text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-300"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  if (!newQuestTitle.trim()) { toast.error("Please enter a quest title."); return; }
                  const newQuest = {
                    id: `q-${Date.now()}`,
                    kid: showCreateQuest,
                    title: newQuestTitle,
                    reward: parseFloat(newQuestReward) || 10,
                    status: 'in_progress' as const,
                  };
                  setQuests(prev => [...prev, newQuest]);
                  toast.success(`🎯 New quest "${newQuestTitle}" assigned to ${showCreateQuest === 'isac' ? 'Isac' : 'Alisya'}!`);
                  setShowCreateQuest(null);
                  setNewQuestTitle('');
                  setNewQuestReward('10');
                }}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-14 text-sm shadow-xl"
              >
                Assign Quest
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
