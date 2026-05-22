import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, Delete, ShieldCheck } from 'lucide-react';
import { MALE_AVATAR_URL } from '@/lib/constants/assets';
import { PaymentInterventionScreen, InterventionType } from './PaymentInterventionScreen';

interface SendMoneyScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function SendMoneyScreen({ onSuccess, onBack }: SendMoneyScreenProps) {
  const [amount, setAmount] = useState('0');
  const [isPressing, setIsPressing] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [intervention, setIntervention] = useState<{ type: InterventionType; amount: string } | null>(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [transferMode, setTransferMode] = useState<'eWallet' | 'DuitNow'>('eWallet');
  const [duitNowStep, setDuitNowStep] = useState<'form' | 'amount' | 'reason'>('form');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transferType] = useState('Fund Transfer');
  const [transferTo, setTransferTo] = useState('Bank/E-Wallet Account');
  const [transferReason, setTransferReason] = useState('Others');
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [showTransferToPicker, setShowTransferToPicker] = useState(false);
  const [showReasonPicker, setShowReasonPicker] = useState(false);

  const banks = [
    'Maybank', 'CIMB Bank', 'Public Bank', 'RHB Bank',
    'Hong Leong Bank', 'AmBank', 'UOB Bank', 'Bank Islam',
    "Touch 'n Go eWallet", 'GrabPay'
  ];

  const transferToOptions = ['Bank/E-Wallet Account', 'DuitNow ID'];

  const reasonOptions = [
    'Others', 'Bill Payment', 'Dining', 'Shopping',
    'Investment', 'Loan Repayment', 'Maintenance', 'Gift'
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (Math.abs(currentScrollY - lastScrollY) > 10) {
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    }
  };

  const handlePay = () => {
    if (transferMode === 'DuitNow') {
      if (duitNowStep === 'form') {
        if (!bank || !accountNumber) return;
        setDuitNowStep('amount');
        return;
      }
      if (duitNowStep === 'amount') {
        if (amount === '0') return;
        setDuitNowStep('reason');
        return;
      }
    }

    if (amount !== '0') {
      if (amount === '1500') {
        setIntervention({ type: 'MULE_ACCOUNT', amount });
        return;
      }
      if (amount === '1000') {
        setIntervention({ type: 'UNUSUAL_MEDIUM', amount });
        return;
      }
      if (amount === '2000') {
        setIntervention({ type: 'UNUSUAL_HIGH', amount });
        return;
      }

      setIsProcessing(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    }
  };

  const handleBack = () => {
    if (transferMode === 'DuitNow') {
      if (duitNowStep === 'amount') {
        setDuitNowStep('form');
        return;
      }
      if (duitNowStep === 'reason') {
        setDuitNowStep('amount');
        return;
      }
    }
    onBack();
  };

  const handleKeyPress = (num: string) => {
    if (amount === '0' && num !== '000') {
      setAmount(num);
    } else if (amount !== '0') {
      if (amount.length < 9) {
        setAmount(prev => prev + num);
      }
    }
  };

  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'delete'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onScroll={handleScroll}
      className="fixed inset-0 bg-[#f4f4f7] z-[60] overflow-y-auto pb-32 md:max-w-[440px] md:mx-auto scrollbar-hide"
    >
      {/* Floating Header */}
      <AnimatePresence>
        {showHeader && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-[62] flex justify-center px-4 py-4 pointer-events-none md:max-w-[440px] md:mx-auto"
          >
            <div className="pointer-events-auto w-full flex items-center justify-between bg-[#0a0a0b] border border-white/5 shadow-2xl rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all active:scale-95"
                >
                  <ArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col">
                  <span className="font-sans font-black text-[15px] tracking-tight text-white leading-tight">Send Money</span>
                  <span className="text-[9px] font-black text-white/50 tracking-widest uppercase">Security Active</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 border border-white/5">
                  Help
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ x: -400, y: 100, rotate: -20, scale: 0.5 }}
              animate={{
                x: [null, 0, 400],
                y: [null, 0, -100],
                rotate: [null, 0, 20],
                scale: [null, 1.5, 2]
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="text-[#0a0a0b] font-[900] text-7xl tracking-tighter italic"
            >
              Monetro
            </motion.div>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 500, opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, delay: i * 0.1, repeat: 3, ease: "linear" }}
                className="absolute h-1 bg-[#0a0a0b]/10 rounded-full"
                style={{ width: Math.random() * 200 + 100, top: `${20 + i * 15}%` }}
              />
            ))}
          </motion.div>
        )}
        {intervention && (
          <PaymentInterventionScreen
            type={intervention.type}
            amount={intervention.amount}
            onClose={() => setIntervention(null)}
          />
        )}
      </AnimatePresence>

      {/* Logo */}
      <div className="px-6 pt-32 shrink-0 flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-4 w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-2xl ring-4 ring-black/5"
        >
          <motion.img
            src="/images/monetro-logo.png"
            alt="Monetro"
            className="w-full h-full object-cover"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0a0a0b]/40"
        >
          Security Active
        </motion.span>
      </div>

      {/* Transfer Mode Tabs */}
      <div className="px-6 mb-8">
        <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-black/5 flex gap-1 shadow-sm">
          {(['eWallet', 'DuitNow'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTransferMode(mode)}
              className={`flex-1 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
                transferMode === mode
                  ? 'bg-[#0a0a0b] text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)]'
                  : 'text-[#0a0a0b]/40 hover:bg-black/5'
              }`}
            >
              {mode === 'eWallet' ? 'Monetro Wallet' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-2">
        {transferMode === 'eWallet' ? (
          /* Recipient Card */
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 mb-8">
            <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black mb-4">Send to</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={MALE_AVATAR_URL}
                    alt="Recipient"
                    className="w-14 h-14 rounded-full object-cover border-2 border-black/10"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#0a0a0b] p-1 rounded-full border border-white">
                    <ShieldCheck size={10} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-[#0a0a0b] text-[16px]">Daniel bin Kamal</h3>
                  <p className="text-xs text-[#0a0a0b]/50 font-mono font-medium">8921362190</p>
                </div>
              </div>
              <button className="bg-[#f4f4f7] px-4 py-2 rounded-xl text-[12px] font-black tracking-tight active:scale-95 transition-all text-[#0a0a0b]">
                Change
              </button>
            </div>
          </div>
        ) : (
          /* DuitNow Multi-step Flow */
          <AnimatePresence mode="wait">
            {duitNowStep === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 mb-8 space-y-6"
              >
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black ml-1">Transfer to</p>
                  <button
                    onClick={() => setShowTransferToPicker(!showTransferToPicker)}
                    className={`w-full flex items-center justify-between bg-[#f4f4f7] px-5 py-4 rounded-2xl border transition-all ${
                      showTransferToPicker ? 'border-[#0a0a0b] ring-2 ring-[#0a0a0b]/5' : 'border-black/5'
                    }`}
                  >
                    <span className="font-black text-[15px] text-[#0a0a0b]">{transferTo}</span>
                    <ChevronRight size={18} className="text-[#0a0a0b]/30 rotate-90" />
                  </button>
                  <AnimatePresence>
                    {showTransferToPicker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#f4f4f7] rounded-2xl border border-black/5 mt-2"
                      >
                        {transferToOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => { setTransferTo(option); setShowTransferToPicker(false); }}
                            className="w-full text-left px-5 py-4 font-black text-[14px] text-[#0a0a0b] hover:bg-black/5 active:bg-black/10 border-b border-black/5 last:border-none transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black ml-1">Recipient Bank/E-Wallet</p>
                  <button
                    onClick={() => setShowBankPicker(!showBankPicker)}
                    className={`w-full flex items-center justify-between bg-[#f4f4f7] px-5 py-4 rounded-2xl border transition-all ${
                      showBankPicker ? 'border-[#0a0a0b] ring-2 ring-[#0a0a0b]/5' : 'border-black/5'
                    }`}
                  >
                    <span className={`font-black text-[15px] ${bank ? 'text-[#0a0a0b]' : 'text-[#0a0a0b]/30'}`}>
                      {bank || 'Select one'}
                    </span>
                    <ChevronRight size={18} className="text-[#0a0a0b]/30 rotate-90" />
                  </button>
                  <AnimatePresence>
                    {showBankPicker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#f4f4f7] rounded-2xl border border-black/5 mt-2 max-h-[240px] overflow-y-auto scrollbar-hide"
                      >
                        {banks.map((b) => (
                          <button
                            key={b}
                            onClick={() => { setBank(b); setShowBankPicker(false); }}
                            className="w-full text-left px-5 py-4 font-black text-[14px] text-[#0a0a0b] hover:bg-black/5 active:bg-black/10 border-b border-black/5 last:border-none transition-colors"
                          >
                            {b}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black ml-1">
                    {transferTo === 'DuitNow ID' ? 'DuitNow ID' : 'Account Number'}
                  </p>
                  <div className="bg-[#f4f4f7] px-5 py-4 rounded-2xl border border-black/5 focus-within:border-[#0a0a0b] focus-within:ring-2 focus-within:ring-[#0a0a0b]/5 transition-all">
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder={transferTo === 'DuitNow ID' ? 'Enter ID (e.g. Mobile, IC)' : 'Enter account number'}
                      className="w-full bg-transparent border-none outline-none font-black text-[15px] text-[#0a0a0b] placeholder:text-[#0a0a0b]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black ml-1">Transfer Type</p>
                  <button className="w-full flex items-center justify-between bg-[#f4f4f7] px-5 py-4 rounded-2xl border border-black/5 active:scale-[0.99] transition-all">
                    <span className="font-black text-[15px] text-[#0a0a0b]">{transferType}</span>
                    <ChevronRight size={18} className="text-[#0a0a0b]/30 rotate-90" />
                  </button>
                </div>
              </motion.div>
            )}

            {duitNowStep === 'amount' && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 mb-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#f4f4f7] flex items-center justify-center font-black text-[#0a0a0b]/40 italic">
                    {bank.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-black text-[#0a0a0b] text-[15px]">{bank}</h3>
                    <p className="text-[12px] text-[#0a0a0b]/60 font-mono">{accountNumber}</p>
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black text-center mb-2">Enter Amount</p>
                <div className="flex items-center justify-center">
                  <span className="text-[32px] font-black text-[#0a0a0b] mr-1 mt-1">RM</span>
                  <span className="text-[64px] font-black text-[#0a0a0b] tracking-tighter leading-none">{amount}</span>
                </div>
              </motion.div>
            )}

            {duitNowStep === 'reason' && (
              <motion.div
                key="reason"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 mb-8 space-y-6"
              >
                <div className="bg-[#f4f4f7] p-4 rounded-2xl border border-black/5 flex justify-between items-center mb-2">
                  <div className="flex flex-col">
                    <p className="text-[9px] font-black uppercase text-[#0a0a0b]/40 tracking-widest mb-0.5">Total Transfer</p>
                    <p className="text-xl font-black text-[#0a0a0b]">RM{amount}.00</p>
                  </div>
                  <button
                    onClick={() => setDuitNowStep('amount')}
                    className="text-[11px] font-black text-white bg-[#0a0a0b] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                  >
                    EDIT
                  </button>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black ml-1">Reason for transfer</p>
                  <button
                    onClick={() => setShowReasonPicker(!showReasonPicker)}
                    className={`w-full flex items-center justify-between bg-[#f4f4f7] px-5 py-4 rounded-2xl border transition-all ${
                      showReasonPicker ? 'border-[#0a0a0b] ring-2 ring-[#0a0a0b]/5' : 'border-black/5'
                    }`}
                  >
                    <span className="font-black text-[15px] text-[#0a0a0b]">{transferReason}</span>
                    <ChevronRight size={18} className="text-[#0a0a0b]/30 rotate-90" />
                  </button>
                  <AnimatePresence>
                    {showReasonPicker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#f4f4f7] rounded-2xl border border-black/5 mt-2 max-h-[200px] overflow-y-auto"
                      >
                        {reasonOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => { setTransferReason(opt); setShowReasonPicker(false); }}
                            className="w-full text-left px-5 py-3.5 font-black text-[13px] text-[#0a0a0b] border-b border-black/5 last:border-none"
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-[#0a0a0b]/40 font-black ml-1">References (Optional)</p>
                  <div className="bg-[#f4f4f7] px-5 py-4 rounded-2xl border border-black/5">
                    <input
                      type="text"
                      placeholder="e.g. Lunch with friends"
                      className="w-full bg-transparent border-none outline-none font-black text-[14px] text-[#0a0a0b] placeholder:text-[#0a0a0b]/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Amount Display (eWallet only) */}
        {transferMode === 'eWallet' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center">
              <span className="text-[40px] font-black text-[#0a0a0b] mr-1 mt-2">RM</span>
              <div className="flex items-center gap-1">
                <span className="text-[80px] font-black text-[#0a0a0b] tracking-tighter leading-none">{amount}</span>
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-[4px] h-[70px] bg-[#0a0a0b] rounded-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Funding Source */}
        {(transferMode === 'eWallet' || (transferMode === 'DuitNow' && (duitNowStep === 'form' || duitNowStep === 'amount'))) && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-10 bg-[#0a0a0b] rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex flex-col justify-between p-1.5">
                    <div className="w-4 h-1 bg-white/30 rounded-full" />
                    <div className="w-10 h-0.5 bg-white/30 rounded-full" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-[#0a0a0b] text-[14px]">Adam's card</h3>
                  <p className="text-xs text-[#0a0a0b]/50 font-mono font-medium">Balance RM23,678.80</p>
                </div>
              </div>
              <button className="bg-[#f4f4f7] px-4 py-2 rounded-xl text-[12px] font-black tracking-tight active:scale-95 transition-all text-[#0a0a0b]">
                Change
              </button>
            </div>
          </div>
        )}

        {/* Keypad */}
        {(transferMode === 'eWallet' || (transferMode === 'DuitNow' && duitNowStep === 'amount')) && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {keys.map((key) => (
              <button
                key={key}
                onMouseDown={() => setIsPressing(key)}
                onMouseUp={() => setIsPressing(null)}
                onMouseLeave={() => setIsPressing(null)}
                onTouchStart={() => setIsPressing(key)}
                onTouchEnd={() => setIsPressing(null)}
                onClick={() => key === 'delete' ? handleDelete() : handleKeyPress(key)}
                className={`h-[72px] rounded-3xl flex items-center justify-center transition-all duration-150 bg-white ${
                  isPressing === key ? 'scale-95 bg-black/5' : 'scale-100 shadow-sm border border-black/5'
                } active:scale-95`}
              >
                {key === 'delete' ? (
                  <Delete size={24} className="text-[#0a0a0b]" />
                ) : (
                  <span className="text-2xl font-black text-[#0a0a0b]">{key}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-[#f4f4f7] via-[#f4f4f7] to-transparent z-[61] md:max-w-[440px] md:mx-auto">
        <button
          onClick={handlePay}
          className="w-full h-16 bg-[#0a0a0b] text-white rounded-3xl font-black text-[15px] uppercase tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/10"
        >
          {transferMode === 'DuitNow' ? (duitNowStep === 'reason' ? 'Confirm & Transfer' : 'Next') : 'Send money'}
        </button>
      </div>
    </motion.div>
  );
}
