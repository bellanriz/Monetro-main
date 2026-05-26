import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Bell, Shield, ArrowUpRight, HelpCircle, ChevronLeft, Sparkles, QrCode, XCircle, ArrowDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SendMoneyScreen } from '../SendMoneyScreen';

export interface ParentHomeProps {
  profile: any;
  transactions: any[];
  cards: any[];
  pendingApprovals: any[];
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string) => void;
  showQrModal: boolean;
  setShowQrModal: (val: boolean) => void;
  showSendModal: boolean;
  setShowSendModal: (val: boolean) => void;
  showReceiveModal: boolean;
  setShowReceiveModal: (val: boolean) => void;
  showAddCardModal: boolean;
  setShowAddCardModal: (val: boolean) => void;
  qrActiveTab: 'pay' | 'receipt';
  setQrActiveTab: (val: 'pay' | 'receipt') => void;
  setSendRecipientId: (val: string) => void;
  setSendReasonText: (val: string) => void;
  familyCards: any[];
  newCardHolder: string;
  setNewCardHolder: (val: string) => void;
  newCardType: string;
  setNewCardType: (val: string) => void;
  newCardBrand: string;
  setNewCardBrand: (val: string) => void;
  newCardBalance: string;
  setNewCardBalance: (val: string) => void;
  handleAddFamilyCard: () => void;
}

export const ParentHome: React.FC<ParentHomeProps> = ({
  profile,
  pendingApprovals,
  approveTransaction,
  rejectTransaction,
  showQrModal,
  setShowQrModal,
  showSendModal,
  setShowSendModal,
  showReceiveModal,
  setShowReceiveModal,
  showAddCardModal,
  setShowAddCardModal,
  qrActiveTab,
  setQrActiveTab,
  setSendRecipientId,
  setSendReasonText,
  familyCards,
  newCardHolder,
  setNewCardHolder,
  newCardType,
  setNewCardType,
  newCardBrand,
  setNewCardBrand,
  newCardBalance,
  setNewCardBalance,
  handleAddFamilyCard,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 space-y-7 pb-32 animate-in fade-in duration-500">
      
      {/* 1. Profile and Menu Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-slate-200 shadow-md">
            <AvatarImage src={profile?.photoURL || '/images/adam.png'} />
            <AvatarFallback>{profile?.displayName?.[0] || 'A'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Welcome Back!</span>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
              {profile?.displayName || 'Adam'}
            </h3>
          </div>
        </div>
        
        {/* Beautiful Notification Bell option with pending state dot */}
        <button 
          onClick={() => {
            if (pendingApprovals.length > 0) {
              toast.info(`🔔 You have ${pendingApprovals.length} family actions pending approval! Tap 'Family' to manage chores.`);
            } else {
              toast.success("🔔 Security Shield holds zero threats. All cards synced!");
            }
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm text-slate-705 flex items-center justify-center relative hover:scale-105 active:scale-95 transition-transform outline-none"
        >
          <Bell size={18} className="stroke-[2.5]" />
          {pendingApprovals.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-505 bg-red-500 rounded-full border border-white animate-pulse" />
          )}
        </button>
      </header>

      {/* 2. Total Balance Block replaced with My Wallet and Finsight mockup black card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">My Wallet</h3>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Safe Controls</span>
        </div>

        {/* Finsight Debit Card Deck */}
        <div className="w-full rounded-[2.2rem] p-7 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[195px] bg-gradient-to-tr from-[#1b1b1e] via-[#121214] to-[#252529] border border-white/5">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-zinc-805 bg-zinc-800/[0.1] rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-black tracking-tight text-white/90 text-sm">Finsight</h4>
              <p className="text-[8px] text-[#74c300] font-black uppercase tracking-widest mt-0.5">Family Elite</p>
            </div>
            <span className="text-[11px] font-black tracking-widest text-white px-2 py-0.5 bg-white/10 rounded-md">
              VISA
            </span>
          </div>

          <div className="space-y-1 my-2">
            <span className="text-[10px] text-white/50 uppercase font-black tracking-widest leading-none">Current Balance</span>
            <p className="text-3xl font-black text-white leading-none tracking-tight">
              RM 78,560.32
            </p>
          </div>

          <div className="flex justify-between items-end pt-3">
            <div>
              <p className="text-xs font-mono font-bold tracking-widest text-white/80">•••• •••• •••• 6925</p>
              <p className="text-[8px] uppercase font-bold text-white/50 tracking-widest mt-1">ADAM FAMILY ADMIN</p>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-white/40 uppercase font-black block tracking-wider">Exp.Date</span>
              <span className="text-[11px] font-bold text-white/95">10/28</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Actions Hub (Send, Request, QR) styled as white elegant cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Send Action Card */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSendRecipientId('kid-455');
            setShowSendModal(true);
          }}
          className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all aspect-square min-h-[96px]"
        >
          <div className="w-10 h-10 bg-slate-950 text-white rounded-full flex items-center justify-center shadow-md">
            <ArrowUpRight size={18} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-extrabold text-slate-800">Send</span>
        </motion.div>

        {/* Request/Receive Action Card */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReceiveModal(true)}
          className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all aspect-square min-h-[96px]"
        >
          <div className="w-10 h-10 bg-slate-950 text-white rounded-full flex items-center justify-center shadow-md">
            <ArrowDownLeft size={18} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-extrabold text-slate-800">Request</span>
        </motion.div>

        {/* QR Scanner/Payment Card */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQrModal(true)}
          className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all aspect-square min-h-[96px]"
        >
          <div className="w-10 h-10 bg-slate-950 text-white rounded-full flex items-center justify-center shadow-md">
            <QrCode size={18} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-extrabold text-slate-800">QR Pay</span>
        </motion.div>
      </div>

      {/* 5. Quick Send Family Contacts Carousel */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Quick Send</h3>
          <span 
            onClick={() => {
              setSendRecipientId('kid-455');
              setShowSendModal(true);
            }}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            See All
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide snap-x">
          {[
            { id: 'kid-455', name: 'Isac', avatar: '/images/isac.png' },
            { id: 'alisya', name: 'Alisya', avatar: '/images/alisya.png' },
            { id: 'nadine', name: 'Nadine', avatar: '/images/nadine.png' },
            { id: 'kamal', name: 'Kamal', avatar: '/images/grandpa.png' },
            { id: 'fakhri', name: 'Fakhri', avatar: '/images/isac.png' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setSendRecipientId(item.id);
                setSendReasonText(item.id === 'kid-455' ? 'Chore Achieved Reward' : 'Family Allowance');
                setShowSendModal(true);
              }}
              className="flex flex-col items-center gap-2 snap-start cursor-pointer group shrink-0 outline-none"
            >
              <div className="relative">
                <Avatar className="h-14 w-14 border-2 border-transparent group-hover:border-slate-300 transition-all shadow-sm">
                  <AvatarImage src={item.avatar} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <span className="text-[11px] font-black text-slate-500 group-hover:text-slate-950 transition-colors">{item.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Bento Grid cards - User Requested (few more cards) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card A: Savings SSPN progress tracker */}
        <Card className="border border-slate-100 bg-white p-5 rounded-[2rem] flex flex-col justify-between h-40 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-[11px]">
              84%
            </div>
            <Sparkles size={16} className="text-orange-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">SSPN Kid Fund</h4>
            <p className="text-xs font-black text-slate-900 truncate">RM 15,400 / 18k</p>
            <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: '84%' }} />
            </div>
          </div>
        </Card>

        {/* Card B: Security Locks summary */}
        <Card className="border border-slate-100 bg-white p-5 rounded-[2rem] flex flex-col justify-between h-40 shadow-sm group hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield size={16} className="stroke-[2.5]" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Safety Shield</h4>
            <p className="text-xs font-black text-slate-950">Lock Center Live</p>
            <p className="text-[8px] text-[#74c300] font-black uppercase tracking-wider">0 Scams Logged</p>
          </div>
        </Card>
      </div>

      {/* Floating security toaster notification overlay */}
      <AnimatePresence>
        {pendingApprovals.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 55, opacity: 0 }}
            className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none"
          >
            <Card className="pointer-events-auto border-none shadow-2xl glass rounded-3xl p-4 flex items-center justify-between border-l-4 border-l-amber-505 border-l-amber-500 bg-white/95 backdrop-blur-md">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                   <Shield size={20} className="stroke-[2.5]" />
                 </div>
                 <div>
                   <p className="text-xs font-black text-slate-950 flex items-center gap-1">
                     Approval Alert (RM {pendingApprovals[0].amount.toLocaleString()})
                   </p>
                   <p className="text-[10px] text-slate-500 font-bold truncate max-w-[150px]">
                     Requested at {pendingApprovals[0].description}
                   </p>
                 </div>
               </div>
               <div className="flex gap-1.5">
                 <Button 
                   size="sm" 
                   onClick={() => {
                     approveTransaction(pendingApprovals[0].id);
                     toast.success("Transaction authorized.");
                   }} 
                   className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black h-8 px-2.5"
                 >
                   Allow
                 </Button>
                 <Button 
                   size="sm" 
                   onClick={() => {
                     rejectTransaction(pendingApprovals[0].id);
                     toast.error("Transaction declined.");
                   }} 
                   className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black h-8 px-2.5"
                 >
                   Decline
                 </Button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: QR Scan */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-[#f4f4f7] z-[60] flex flex-col md:max-w-[440px] md:mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <button
                onClick={() => setShowQrModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-slate-700 active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="text-lg font-black text-slate-900">QR Scan</h3>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-slate-700">
                <HelpCircle size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pb-6">
              <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
                <button
                  onClick={() => setQrActiveTab('pay')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-black transition-all",
                    qrActiveTab === 'pay' ? "bg-slate-50 text-slate-900" : "text-slate-400"
                  )}
                >
                  My QR
                </button>
                <button
                  onClick={() => setQrActiveTab('receipt')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-black transition-all",
                    qrActiveTab === 'receipt' ? "bg-[#121214] text-white" : "text-slate-400"
                  )}
                >
                  Scan QR
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {qrActiveTab === 'pay' ? (
                /* My QR */
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 w-full max-w-[300px] flex flex-col items-center gap-4">
                    <div className="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center p-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                        <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                        <rect x="5" y="5" width="15" height="15" fill="white" />
                        <rect x="8" y="8" width="9" height="9" fill="currentColor" />
                        <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                        <rect x="80" y="5" width="15" height="15" fill="white" />
                        <rect x="83" y="8" width="9" height="9" fill="currentColor" />
                        <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                        <rect x="5" y="80" width="15" height="15" fill="white" />
                        <rect x="8" y="83" width="9" height="9" fill="currentColor" />
                        <rect x="35" y="5" width="8" height="8" fill="currentColor" />
                        <rect x="50" y="10" width="12" height="12" fill="currentColor" />
                        <rect x="30" y="45" width="15" height="15" fill="currentColor" />
                        <rect x="55" y="50" width="10" height="25" fill="currentColor" />
                        <rect x="35" y="80" width="20" height="15" fill="currentColor" />
                        <rect x="75" y="45" width="12" height="12" fill="currentColor" />
                        <rect x="80" y="75" width="15" height="8" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-900">Adam's Payment QR</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Scan to pay me</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => { toast.success("QR code shared!"); }}
                    className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-12 px-8 text-xs"
                  >
                    Share QR Code
                  </Button>
                </div>
              ) : (
                /* Scan QR */
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="relative w-[280px] h-[280px] bg-slate-100 rounded-3xl flex items-center justify-center">
                    {/* Corner brackets */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-[3px] border-l-[3px] border-slate-900 rounded-tl-xl" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-[3px] border-r-[3px] border-slate-900 rounded-tr-xl" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-[3px] border-l-[3px] border-slate-900 rounded-bl-xl" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-[3px] border-r-[3px] border-slate-900 rounded-br-xl" />

                    {/* Scanner area */}
                    <div id="qr-reader" className="w-[200px] h-[200px] rounded-xl overflow-hidden" />
                  </div>
                  <p className="text-sm text-slate-400 font-bold">Hold your camera on QR code to Scan</p>
                  <Button
                    onClick={() => {
                      toast.success("QR scanned! Payment of RM 25.00 processing...");
                      setShowQrModal(false);
                    }}
                    className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-12 px-8 text-xs"
                  >
                    Simulate Scan
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Request Money (same as Send Money) */}
      <AnimatePresence>
        {showReceiveModal && (
          <SendMoneyScreen
            onSuccess={() => {
              setShowReceiveModal(false);
              toast.success('Request sent successfully! 💸');
            }}
            onBack={() => setShowReceiveModal(false)}
          />
        )}
      </AnimatePresence>
      {/* MODAL 2: SEND MONEY SCREEN */}
      <AnimatePresence>
        {showSendModal && (
          <SendMoneyScreen
            onSuccess={() => {
              setShowSendModal(false);
              toast.success('Transfer completed successfully! 💸');
            }}
            onBack={() => setShowSendModal(false)}
          />
        )}
      </AnimatePresence>

      {/* MODAL 4: ADD FAMILY CARD */}
      <AnimatePresence>
        {showAddCardModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="bg-white rounded-t-[3rem] w-full max-w-md p-8 space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddCardModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:scale-105 transition-transform"
              >
                <XCircle size={20} />
              </button>
 
              <div className="space-y-1 text-center">
                <h4 className="text-xl font-black text-slate-950">Add Family Card</h4>
                <p className="text-xs text-slate-400">Issue cards to kids, spouse, or parents (annual allowance)</p>
              </div>
 
              <div className="space-y-4">
                {/* 1. Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Cardholder Name</label>
                  <input 
                    type="text" 
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-12 px-4 font-bold text-slate-900 text-sm focus:outline-none"
                    placeholder="Enter name (e.g. Alisya, Mama, Ayah)"
                  />
                  {/* Preset quick recommendations */}
                  <div className="flex gap-1.5 pt-1 overflow-x-auto scrollbar-hide">
                    {['Isac', 'Alisya', 'Nadine', 'Mama', 'Ayah', 'Kamal'].map((nameSuggested) => (
                      <button
                        key={nameSuggested}
                        onClick={() => setNewCardHolder(nameSuggested)}
                        className="py-1 px-3 bg-slate-100 hover:bg-slate-205 transition-colors text-[10px] font-extrabold text-slate-600 rounded-lg shrink-0"
                      >
                        {nameSuggested}
                      </button>
                    ))}
                  </div>
                </div>
 
                {/* 2. Card Type Tag Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Relationship Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Kid', 'Spouse', 'Parent'].map((typeOption) => (
                      <button
                        key={typeOption}
                        onClick={() => setNewCardType(typeOption)}
                        className={cn(
                          "h-11 rounded-2xl font-black text-xs transition-colors",
                          newCardType === typeOption ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {typeOption}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium pl-1">
                    {newCardType === 'Parent' && '💡 For retired parents — set annual allowance & monitor spending'}
                    {newCardType === 'Kid' && '💡 For children — set weekly/monthly limits & approve transactions'}
                    {newCardType === 'Spouse' && '💡 For spouse — shared family budget with full access'}
                  </p>
                </div>

                {/* 3. Allowance Frequency (for Kid & Parent) */}
                {(newCardType === 'Kid' || newCardType === 'Parent') && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                      {newCardType === 'Parent' ? 'Annual Allowance Schedule' : 'Allowance Schedule'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(newCardType === 'Parent' ? ['Monthly', 'Quarterly', 'Annually'] : ['Weekly', 'Bi-Weekly', 'Monthly']).map((freq) => (
                        <button
                          key={freq}
                          className="h-10 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold text-[10px] transition-colors border border-slate-100"
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
 
                {/* 3. Card Brand Option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Card Network Brand</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['VISA', 'MasterCard', 'MyDebit'].map((brandOption) => (
                      <button
                        key={brandOption}
                        onClick={() => setNewCardBrand(brandOption)}
                        className={cn(
                          "h-11 rounded-2xl font-black text-xs transition-colors",
                          newCardBrand === brandOption ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {brandOption}
                      </button>
                    ))}
                  </div>
                </div>
 
                {/* 4. Initial balance input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    {newCardType === 'Parent' ? 'Annual Allowance Amount (RM)' : 'Initial Balance Limit (RM)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-600 text-sm">RM</span>
                    <input 
                      type="number" 
                      value={newCardBalance}
                      onChange={(e) => setNewCardBalance(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-11 pl-12 pr-4 font-extrabold text-slate-950 text-sm focus:outline-none"
                      placeholder="500"
                    />
                  </div>
                </div>
 
                <Button 
                  onClick={handleAddFamilyCard}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black rounded-2xl h-14 text-sm mt-2 shadow-xl shadow-slate-950/10"
                >
                  {newCardType === 'Parent' ? 'Issue Parent Allowance Card' : 'Link Card Instantly'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
