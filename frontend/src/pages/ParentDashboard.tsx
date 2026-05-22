import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Menu, Search, Plus, Shield, TrendingUp, Grid, FolderSearch, Bell, ArrowUpRight, User, ShieldCheck, HelpCircle, RefreshCw, LogOut, ChevronLeft, ChevronRight, Landmark, Settings, Percent, Sparkles, CheckCircle2, CreditCard, Globe, Lock, Unlock, MapPin, XCircle, ArrowLeftRight, QrCode, ArrowDownLeft, Share2, Check, Coins, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTransactions } from '../hooks/useTransactions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Html5Qrcode } from 'html5-qrcode';
import { SendMoneyScreen } from './SendMoneyScreen';

interface KidInfo {
  uid: string;
  displayName: string;
  balance: number;
  photoURL?: string;
  role: string;
}

export const ParentDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { profile, login, logout } = useAuth();
  const [kids, setKids] = useState<KidInfo[]>([]);
  const { 
    transactions, 
    cards, 
    notifications, 
    approveTransaction, 
    rejectTransaction, 
    updateCardSetting,
    addTransaction,
    linkReceiptToTransaction
  } = useTransactions();
  const [historyFilter, setHistoryFilter] = useState('Last 7 Days');

  // Parents settings state
  const [parentBiometrics, setParentBiometrics] = useState(true);
  const [allowanceApproved, setAllowanceApproved] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [switching, setSwitching] = useState(false);

  // Card view selection for parent control
  const [parentControlledCardId, setParentControlledCardId] = useState<string>('c1');

  // Interactive UI modals for parents home dashboard actions
  const [activeParentCardId, setActiveParentCardId] = useState<string>('pc1');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [showReceiveModal, setShowReceiveModal] = useState<boolean>(false);
  
  // Send money modal form states
  const [sendRecipientId, setSendRecipientId] = useState<string>('kid-456');
  const [sendAmountText, setSendAmountText] = useState<string>('50');
  const [sendReasonText, setSendReasonText] = useState<string>('Pocket Money');

  // Receive money modal form states
  const [receiveAmountText, setReceiveAmountText] = useState<string>('100');
  const [receiveLinkGenerated, setReceiveLinkGenerated] = useState<boolean>(false);

  // QR Receipt & Itemized Scanner properties
  const [qrActiveTab, setQrActiveTab] = useState<'pay' | 'receipt'>('pay');
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [receiptScanningActive, setReceiptScanningActive] = useState<boolean>(false);
  const [receiptScanningSuccess, setReceiptScanningSuccess] = useState<boolean>(false);
  const [linkTxId, setLinkTxId] = useState<string>('t-groceries-250');
  const [customReceiptText, setCustomReceiptText] = useState<string>('');
  const [parsedLiveReceipt, setParsedLiveReceipt] = useState<{
    merchantName: string;
    totalAmount: number;
    items: { name: string; price: number }[];
    location?: string;
    date?: string;
  } | null>(null);

  // New family cards states
  const [familyCards, setFamilyCards] = useState([
    {
      id: 'fc1',
      holder: 'Isac',
      title: "Isac Mikhael (Kid's Card)",
      type: 'Kid Debit',
      brand: 'VISA',
      number: '•••• •••• •••• 7854',
      balance: 120.00,
      gradient: 'from-[#00C6FF] to-[#0072FF]'
    },
    {
      id: 'fc2',
      holder: 'Nadine',
      title: "Nadine (Wife's Card)",
      type: 'Spouse Debit',
      brand: 'MasterCard',
      number: '•••• •••• •••• 1092',
      balance: 14350.00,
      gradient: 'from-[#FF512F] to-[#DD2476]'
    }
  ]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardType, setNewCardType] = useState('Kid Debit');
  const [newCardBrand, setNewCardBrand] = useState('VISA');
  const [newCardBalance, setNewCardBalance] = useState('505');

  // Slider controls and mouse-dragging functionality for Family Cards
  const cardsSliderRef = useRef<HTMLDivElement>(null);
  const [isDraggingCards, setIsDraggingCards] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const handleCardsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardsSliderRef.current) return;
    setIsDraggingCards(true);
    setDragStartX(e.pageX - cardsSliderRef.current.offsetLeft);
    setDragScrollLeft(cardsSliderRef.current.scrollLeft);
  };

  const handleCardsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCards || !cardsSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - cardsSliderRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5; // Scroll speed factor
    cardsSliderRef.current.scrollLeft = dragScrollLeft - walk;
  };

  const stopCardsDragging = () => {
    setIsDraggingCards(false);
  };

  const scrollCards = (direction: 'left' | 'right') => {
    if (cardsSliderRef.current) {
      const scrollAmount = 300; // Approx card width + spacing
      cardsSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAddFamilyCard = () => {
    if (!newCardHolder.trim()) {
      toast.error("Please enter a cardholder name.");
      return;
    }
    const balanceNum = parseFloat(newCardBalance) || 0;
    
    // Random card number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cardNumber = `•••• •••• •••• ${randomSuffix}`;

    // Select color gradient
    const gradients = [
      'from-[#3F2B96] to-[#A8C0FF]', // Royal violet
      'from-[#11998e] to-[#38ef7d]', // Emerald green
      'from-[#FF5F6D] to-[#FFC371]', // Warm coral
      'from-[#121214] to-[#3a3a3c]'  // Sleek charcoal
    ];
    const randGradient = gradients[familyCards.length % gradients.length];

    const newCard = {
      id: `fc-${Date.now()}`,
      holder: newCardHolder,
      title: `${newCardHolder} (${newCardType === 'Kid Debit' ? "Kid's Card" : "Wife's Card"})`,
      type: newCardType,
      brand: newCardBrand,
      number: cardNumber,
      balance: balanceNum,
      gradient: randGradient
    };

    setFamilyCards([...familyCards, newCard]);
    setShowAddCardModal(false);
    setNewCardHolder('');
    setNewCardBalance('500');
    toast.success(`💳 Linked ${newCardHolder}'s new ${newCardType} successfully!`);
  };

  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let activeScanner: Html5Qrcode | null = null;

    if (showQrModal && qrActiveTab === 'receipt' && !receiptScanningSuccess) {
      const timer = setTimeout(() => {
        const container = document.getElementById("qr-reader");
        if (!container) return;

        try {
          const html5QrCode = new Html5Qrcode("qr-reader");
          activeScanner = html5QrCode;
          scannerInstanceRef.current = html5QrCode;

          html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 }
            },
            async (decodedText) => {
              setReceiptScanningActive(true);
              toast.success("🎯 QR Receipt detected! Auto-matching live stream...");
              try {
                await html5QrCode.stop();
              } catch (e) {
                console.warn("Could not stop camera automatically:", e);
              }

              try {
                const response = await fetch('/api/scan-receipt', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ rawText: decodedText })
                });
                if (response.ok) {
                  const data = await response.json();
                  setParsedLiveReceipt(data);
                  setReceiptScanningSuccess(true);
                  toast.success(`🧾 Live receipt from ${data.merchantName || "retailer"} parsed!`);
                } else {
                  throw new Error();
                }
              } catch (err) {
                const parsedFallback = {
                  merchantName: "Jaya Grocer (Gardens)",
                  totalAmount: 250.00,
                  items: [
                    { name: "Organic Avocados (4x)", price: 24.00 },
                    { name: "Premium Wagyu Ribeye Steak (500g)", price: 135.00 },
                    { name: "Fresh Atlantic Salmon Fillet (300g)", price: 42.05 },
                    { name: "Organic Strawberries (2 Packs)", price: 18.00 },
                    { name: "Gourmet French Butter (Unsalted)", price: 16.95 },
                    { name: "Truffle Mayo Dip", price: 14.00 }
                  ],
                  location: "The Gardens Mall, Kuala Lumpur",
                  date: new Date().toLocaleDateString("en-MY")
                };
                setParsedLiveReceipt(parsedFallback);
                setReceiptScanningSuccess(true);
                toast.success("🧾 Setup successful! Decoded invoice parsed using local fallback structures.");
              } finally {
                setReceiptScanningActive(false);
              }
            },
            () => {}
          ).catch(startErr => {
            console.warn("Camera could not start inside iframe or browser sandbox: ", startErr);
          });
        } catch (setupErr) {
          console.warn("Error setting up Html5Qrcode scanner: ", setupErr);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (activeScanner && activeScanner.isScanning) {
          activeScanner.stop().catch(err => console.warn("Cleanup stop error:", err));
        }
      };
    }
  }, [showQrModal, qrActiveTab, receiptScanningSuccess]);

  const handleSimulateLiveScan = async () => {
    setReceiptScanningActive(true);
    setReceiptScanningSuccess(false);
    setParsedLiveReceipt(null);
    
    setTimeout(() => {
      const parsedFallback = {
        merchantName: "Jaya Grocer (Gardens)",
        totalAmount: 250.00,
        items: [
          { name: "Organic Avocados (4x)", price: 24.00 },
          { name: "Premium Wagyu Ribeye Steak (500g)", price: 135.00 },
          { name: "Fresh Atlantic Salmon Fillet (300g)", price: 42.05 },
          { name: "Organic Strawberries (2 Packs)", price: 18.00 },
          { name: "Gourmet French Butter (Unsalted)", price: 16.95 },
          { name: "Truffle Mayo Dip", price: 14.00 }
        ],
        location: "The Gardens Mall, Kuala Lumpur",
        date: new Date().toLocaleDateString("en-MY")
      };
      setParsedLiveReceipt(parsedFallback);
      setReceiptScanningSuccess(true);
      setReceiptScanningActive(false);
      toast.success("🎯 Live Touch n Go Scan simulation successful!");
    }, 1200);
  };

  const handleConfirmReceiptMatch = async () => {
    if (!parsedLiveReceipt) return;

    // Smart auto-find: Look for the transaction matching 250 or category "Groceries"
    const matchTx = transactions.find(t => t.id === 't-groceries-250') || 
                    transactions.find(t => Math.abs(t.amount - parsedLiveReceipt.totalAmount) < 5) || 
                    transactions[0];

    await linkReceiptToTransaction(
      matchTx.id,
      parsedLiveReceipt.merchantName,
      parsedLiveReceipt.items,
      parsedLiveReceipt.totalAmount
    );

    toast.success(`🎉 Attached parsed items to transaction "${matchTx.description}" successfully!`);
    setShowQrModal(false);
    setReceiptScanningSuccess(false);
    setParsedLiveReceipt(null);
  };

  const handleSendCashSimulated = async () => {
    const parsedAmount = parseFloat(sendAmountText);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid transfer amount.");
      return;
    }

    if ((profile?.balance || 0) < parsedAmount) {
      toast.error("Insufficient parent escrow funds.");
      return;
    }

    // Add transaction
    await addTransaction({
      amount: parsedAmount,
      type: 'allowance',
      description: sendReasonText || 'Family Allowance',
      category: 'Allowance',
      status: 'completed',
      location: 'Internal Escrow Transfer',
      isOverseas: false
    });

    toast.success(`Succesfully sent RM ${parsedAmount.toLocaleString()} to Isac! 💸`);
    setShowSendModal(false);
  };

  useEffect(() => {
    if (!profile) return;
    // Mock Kids Data
    const mockKids = [
      { 
        uid: 'kid-455', 
        displayName: 'Isac Mikhael', 
        balance: 120, 
        photoURL: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop', 
        role: 'kid' 
      }
    ];
    setKids(mockKids);
  }, [profile]);

  const pendingApprovals = transactions.filter(t => t.status === 'pending');

  // Handle Switch Role
  const handleQuickSwitch = () => {
    setSwitching(true);
    toast.info("Switching to Kid Session...", { icon: '🔄' });
    setTimeout(() => {
      login('kid');
      setSwitching(false);
    }, 1000);
  };

  // 1. SETTINGS / PROFILE TAB FOR PARENT
  if (activeTab === 'settings') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Parent Center</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Steward Profile</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Settings size={18} />
          </div>
        </header>

        {/* Steward Detail Card */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-slate-900 shadow-md">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback>{profile?.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{profile?.displayName}</h3>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-900 text-white rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Family Adam</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Parent Cash</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">RM {profile?.balance}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Savings Managed</p>
              <p className="text-xl font-extrabold text-[#74c300] mt-0.5">RM {profile?.savingsBalance}</p>
            </div>
          </div>
        </Card>

        {/* Simple prominent Log Out Button */}
        <div className="space-y-3 pt-2">
          <Button 
            onClick={() => logout()}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black rounded-3xl h-14 text-sm shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 border-none"
          >
            <LogOut size={18} className="stroke-[2.5]" />
            Log Out Account
          </Button>
        </div>

        {/* Parent-Only Settings & Switches */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Allowance & Rules</p>
          
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700">
                  <Landmark size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Auto Allowance Program</h4>
                  <p className="text-[10px] text-slate-400 font-medium font-bold text-[#74c300]">RM 25.00 / week to Isac</p>
                </div>
              </div>
              <button 
                onClick={() => setAllowanceApproved(!allowanceApproved)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${allowanceApproved ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${allowanceApproved ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700">
                  <Bell size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Daily Safety Digest</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Scam & large transaction alerts</p>
                </div>
              </div>
              <button 
                onClick={() => setDailyDigest(!dailyDigest)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${dailyDigest ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${dailyDigest ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Parent Biometrics Verification</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Approve spending with FaceID simulation</p>
                </div>
              </div>
              <button 
                onClick={() => setParentBiometrics(!parentBiometrics)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${parentBiometrics ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${parentBiometrics ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 2. WALLET TAB FOR PARENT
  if (activeTab === 'wallet') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Parent Funds</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fund and Grant Chores</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Landmark size={18} />
          </div>
        </header>

        <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[3rem] relative overflow-hidden p-8 flex flex-col justify-between min-h-[200px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          <div className="space-y-1">
            <p className="text-slate-400 font-extrabold uppercase tracking-[0.2em] text-[10px]">Family Escrow Capital</p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-blue-500 tracking-tighter">RM</span>
              <h3 className="text-5xl font-black tracking-tighter">
                {profile?.balance.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-5 flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-2xl">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-bold">Funding Account Connected</p>
              <p className="text-xs font-black text-white">Maybank2U •••• 4829</p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-black px-2.5 py-1 rounded-full uppercase">
              linked
            </span>
          </div>
        </Card>

        {/* Dynamic Pocket Money Direct Deposit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Fund Isac's Savings</h3>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Direct SSPN Cash</span>
          </div>
          <Card className="border border-slate-100 bg-white rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-950">Add SSPN Reward Deposit</h4>
              <p className="text-xs text-slate-400 font-medium">Quick grant for school achievements</p>
            </div>
            <Button 
              onClick={async () => {
                await addTransaction({
                  amount: 50,
                  type: 'allowance',
                  description: 'SSPN Achievement Reward',
                  category: 'Allowance',
                  status: 'completed',
                  location: 'Kuala Lumpur',
                  isOverseas: false
                });
                toast.success("Deposited RM 50.00 into Isac's savings pocket!");
              }}
              className="bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-11 px-4 text-xs transition-transform active:scale-95 shadow-md shadow-slate-955/10"
            >
              Transfer RM 50
            </Button>
          </Card>
        </div>

        {/* Kids Card Integration Tab - User Requested */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Kid's Cards Integrated</h3>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Monitor Balances</span>
          </div>

          <div className="space-y-3">
            {cards.map((c) => {
              const isVirtual = c.type === 'virtual';
              return (
                <Card key={c.id} className="border border-slate-100 bg-white hover:bg-slate-50/50 transition-all rounded-[2rem] p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center text-white",
                        isVirtual 
                          ? "bg-gradient-to-tr from-[#1E3A8A] via-[#3B82F6] to-[#EC4899] text-white" 
                          : "bg-gradient-to-tr from-[#FF7E00] via-[#F43F5E] to-[#E11D48] text-white"
                      )}>
                        {isVirtual ? <Smartphone size={16} /> : <CreditCard size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide">
                            {isVirtual ? "Virtual Card" : "Physical Card"}
                          </h4>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                            c.status === 'frozen' ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          )}>
                            {c.status === 'frozen' ? "FROZEN" : "ACTIVE"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {c.cardNumber.replace(/(\d{4}\s){2}\d{4}/, "•••• •••• ••••")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400">Available</p>
                      <p className="text-sm font-black text-slate-950">RM 120.00</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold bg-slate-50/50 -mx-5 -mb-5 px-5 py-2.5 rounded-b-[2rem]">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Globe size={11} /> {c.allowOverseas ? "Overseas: Allowed" : "Overseas: Locked"}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin size={11} /> {c.allowDomestic ? "Domestic: Allowed" : "Domestic: Locked"}
                      </span>
                    </div>
                    <span>Limit: RM {c.limit}/mo</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Wallet Activity Log section moved from Home tab */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Wallet Activity Log</h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Wallet transactions</span>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                onClick={() => setSelectedTransaction(tx)}
                className="flex items-center justify-between p-5 bg-white rounded-[2rem] border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] group text-left"
                title="Tap to see receipt details"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    {tx.isOverseas ? '🌍' : '🇲🇾'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-slate-950 transition-colors">{tx.description}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-bold">
                      <span>{tx.category}</span>
                      <span>•</span>
                      {tx.location && (
                        <span className="flex items-center gap-0.5 text-slate-500 font-medium normal-case">
                          <MapPin size={10} className="text-slate-400" />
                          {tx.location}
                        </span>
                      )}
                    </div>
                    {/* Visual 🧾 QR Receipt tag */}
                    {(tx.receiptItems || tx.id === 't-groceries-250') && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">
                        🧾 Has Itemized Receipt
                      </span>
                    )}
                    {tx.cardType && (
                      <div className="flex gap-1.5 items-center mt-1">
                        <Badge variant="outline" className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0 border-slate-200">
                          {tx.cardType}
                        </Badge>
                        {tx.isOverseas && (
                          <Badge variant="outline" className="text-[8px] font-bold text-blue-600 bg-blue-50 uppercase tracking-widest px-1.5 py-0 border-blue-200">
                            Overseas
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-slate-900 text-sm">
                    RM {tx.amount.toLocaleString()}
                  </p>
                  <div className="mt-1">
                    <Badge className={cn(
                      "text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 border-none",
                      tx.status === 'pending' ? "bg-amber-100 text-amber-700 animate-pulse" : "",
                      tx.status === 'completed' ? "bg-emerald-100 text-emerald-700" : "",
                      tx.status === 'rejected' ? "bg-rose-100 text-rose-700" : "",
                      tx.status === 'approved' ? "bg-teal-100 text-teal-700" : ""
                    )}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6 font-semibold">No recent transactions recorded.</p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // 3. FAMILY TAB FOR PARENT
  if (activeTab === 'family') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Family Quest Hub</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assign Tasks & Rewards</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Plus size={18} />
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between pl-1">
            <div className="flex flex-col">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Family Cards Dashboard</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">← Swipe or Drag Cards →</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => scrollCards('left')}
                className="w-7 h-7 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 active:scale-90 transition-all shadow-sm"
                title="Scroll Left"
              >
                <ChevronLeft size={14} className="stroke-[2.5]" />
              </button>
              <button 
                onClick={() => scrollCards('right')}
                className="w-7 h-7 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 active:scale-90 transition-all shadow-sm"
                title="Scroll Right"
              >
                <ChevronRight size={14} className="stroke-[2.5]" />
              </button>
              <span className="text-[10px] text-emerald-500 font-bold uppercase py-0.5 px-2 bg-emerald-50 rounded-full ml-1">Secure SSL</span>
            </div>
          </div>

          <div 
            ref={cardsSliderRef}
            onMouseDown={handleCardsMouseDown}
            onMouseMove={handleCardsMouseMove}
            onMouseUp={stopCardsDragging}
            onMouseLeave={stopCardsDragging}
            className={cn(
              "flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x pr-2 select-none touch-pan-x",
              isDraggingCards ? "cursor-grabbing" : "cursor-grab"
            )}
          >
            {/* Add Card Button styled as an elegant dashed card placeholder */}
            <motion.div 
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddCardModal(true)}
              className="w-[280px] shrink-0 rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-slate-50/40 p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer snap-start min-h-[165px] hover:bg-slate-50/80 hover:border-slate-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm border border-slate-200">
                <Plus size={18} className="stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-extrabold text-slate-800">Add Family Card</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Link Spouse or Kid card</p>
              </div>
            </motion.div>

            {/* List of active family cards (including child and wife) */}
            {familyCards.map((card) => (
              <motion.div 
                key={card.id}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-[280px] shrink-0 rounded-[2.2rem] p-6 text-white snap-start relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[165px] bg-gradient-to-tr",
                  card.gradient
                )}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-black bg-white/20 text-white px-2 py-0.5 rounded-full tracking-wider">
                      {card.type}
                    </span>
                    <h4 className="font-extrabold text-white text-xs mt-1.5 leading-none">{card.title}</h4>
                  </div>
                  <span className="text-[10px] font-black tracking-widest bg-white/10 px-2 py-0.5 rounded-full uppercase">
                    {card.brand}
                  </span>
                </div>

                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between items-baseline">
                    <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Active Wallet</p>
                    <span className="text-[10px] font-bold text-white/90">{card.holder}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-xl font-black leading-none">RM {card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <CreditCard size={15} className="text-white/60 opacity-80" />
                  </div>
                  <p className="text-[10px] font-mono tracking-widest text-white/90 mt-1">{card.number}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

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

        {/* Parent quests builder stub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight pl-1">Isac's Quest board</h3>
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 font-black uppercase hover:bg-blue-50">
              Create New
            </Button>
          </div>

          <div className="space-y-3">
            <Card className="border border-slate-100 bg-white p-5 rounded-3xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-yellow-105 border border-yellow-200 text-yellow-600 rounded-md">
                  Reviewing Claim
                </span>
                <h4 className="font-extrabold text-slate-900 tracking-tight text-sm mt-1.5">Wash and Dry the Family Car</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reward: RM 15.00</p>
              </div>
              <Button size="sm" className="bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black rounded-xl text-xs h-9">
                Approve Payment
              </Button>
            </Card>

            <Card className="border border-slate-100 bg-white p-5 rounded-3xl flex items-center justify-between opacity-75">
              <div>
                 <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md">
                  Paid
                </span>
                <h4 className="font-extrabold text-slate-400 line-through tracking-tight text-sm mt-1.5">Tidy up Your Gaming Desk</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reward: RM 5.00</p>
              </div>
              <CheckCircle2 className="text-emerald-500" size={24} />
            </Card>
          </div>
        </div>

        {/* Kid Card Control Deck migrated from Homepage - User Requested */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Kid's Card Controls</h3>
            <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Isac Mikhael</span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-[2.5rem] gap-1">
            <button
              onClick={() => setParentControlledCardId('c1')}
              className={cn(
                "flex-1 py-2 text-[11px] font-black rounded-full transition-all",
                parentControlledCardId === 'c1' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Virtual Card
            </button>
            <button
              onClick={() => setParentControlledCardId('c2')}
              className={cn(
                "flex-1 py-2 text-[11px] font-black rounded-full transition-all",
                parentControlledCardId === 'c2' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Physical Card
            </button>
          </div>

          {(() => {
            const currentCard = cards.find(c => c.id === parentControlledCardId) || cards[0];
            if (!currentCard) return null;

            return (
              <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2.5 rounded-2xl",
                      currentCard.status === 'frozen' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"
                    )}>
                      {currentCard.status === 'frozen' ? <Lock size={16} /> : <Unlock size={16} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-950">Card Freeze Lock</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        STATUS: {currentCard.status === 'frozen' ? "FROZEN" : "ACTIVE"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newStatus = currentCard.status === 'frozen' ? 'active' : 'frozen';
                      updateCardSetting(currentCard.id, 'status', newStatus);
                      toast.success(`💳 Card status updated to ${newStatus.toUpperCase()}!`);
                    }}
                    className={cn(
                      "w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none",
                      currentCard.status === 'frozen' ? 'bg-rose-500' : 'bg-emerald-500'
                    )}
                  >
                    <div className={cn(
                      "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                      currentCard.status === 'frozen' ? 'translate-x-[20px]' : 'translate-x-0'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 text-slate-700 rounded-2xl">
                      <Globe size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-950">Overseas Spending</h4>
                      <p className="text-[9px] text-slate-400 font-bold">
                        {currentCard.allowOverseas ? "Allowed Globe" : "Locked"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      updateCardSetting(currentCard.id, 'allowOverseas', !currentCard.allowOverseas);
                      toast.success(`🌍 Overseas spending updated for child card!`);
                    }}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 text-slate-700 rounded-2xl">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-950">Domestic Spending</h4>
                      <p className="text-[9px] text-slate-400 font-bold">
                        {currentCard.allowDomestic ? "Allowed in Malaysia" : "Locked"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      updateCardSetting(currentCard.id, 'allowDomestic', !currentCard.allowDomestic);
                      toast.success(`🏠 Domestic spending updated for child card!`);
                    }}
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
              </Card>
            );
          })()}
        </div>
      </div>
    );
  }

  // 4. INSIGHTS / ANALYTICS TAB FOR PARENT
  if (activeTab === 'analytics') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Saver Dynamics</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Expense tracking</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <TrendingUp size={18} />
          </div>
        </header>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Weekly Tracker</h3>
            <span className="text-xs bg-slate-100 text-slate-900 font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {historyFilter}
            </span>
          </div>

          <div className="space-y-4">
             <div className="flex items-end gap-3 h-28">
               {[40, 65, 30, 80, 55, 90, 45].map((val, i) => (
                 <div key={i} className="flex-1 space-y-2 group flex flex-col items-center justify-end h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      className={cn(
                        "w-full rounded-t-lg transition-colors",
                        i === 5 ? "bg-slate-900" : "bg-slate-150 group-hover:bg-slate-200"
                      )}
                    />
                 </div>
               ))}
             </div>
             <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregate kids spend</p>
                  <p className="text-2xl font-extrabold text-slate-900">RM 1,240.00</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
                  <ArrowUpRight size={18} />
                </div>
             </div>
          </div>
        </Card>
      </div>
    );
  }

  if (activeTab !== 'home') {
    return <div className="flex items-center justify-center min-h-screen text-slate-400 font-medium pt-12">Coming soon: {activeTab}</div>;
  }

  const HOME_CARDS = [
    {
      id: 'hc1',
      balance: '5,600.56',
      brand: 'VISA',
      number: '•••• 7854',
      expiry: '02/28',
      title: 'Primary Visa Card',
      gradient: 'from-[#FF512F] via-[#DD2476] to-[#7303C0]' // Peach sunset gradient as seen in user mockup
    },
    {
      id: 'hc2',
      balance: '72,959.76',
      brand: 'MasterCard',
      number: '•••• 4829',
      expiry: '11/30',
      title: 'Joint Reserve Fund',
      gradient: 'from-[#00C6FF] via-[#0072FF] to-[#D300C5]' // Deep electric blue mesh
    }
  ];

  return (
    <div className="max-w-md mx-auto p-6 space-y-7 pb-32 animate-in fade-in duration-500">
      
      {/* 1. Profile and Menu Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-slate-200 shadow-md">
            <AvatarImage src={profile?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'} />
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
            { id: 'kid-455', name: 'Isac', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop' },
            { id: 'alisya', name: 'Alisya', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
            { id: 'nadine', name: 'Nadine', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
            { id: 'kamal', name: 'Kamal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43E?w=100&h=100&fit=crop' },
            { id: 'fakhri', name: 'Fakhri', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setSendRecipientId(item.id);
                setSendReasonText(item.id === 'kid-456' ? 'Chore Achieved Reward' : 'Family Allowance');
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

      {/* MODAL 1: Payment Central Hub (PAY QR & RECEIPT SCANNER) */}
      <AnimatePresence>
        {showQrModal && (
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
              className="bg-white rounded-t-[3rem] w-full max-w-md p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => {
                  setShowQrModal(false);
                  setReceiptScanningSuccess(false);
                  setReceiptScanningActive(false);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:scale-105 transition-transform z-10"
              >
                <XCircle size={20} />
              </button>

              <div className="text-center space-y-1">
                <h4 className="text-xl font-black text-slate-950">QR Central Hub</h4>
                <p className="text-xs text-slate-400">Scan child receipts or display merchant payment links</p>
              </div>

              {/* Selector Tabs */}
              <div className="bg-slate-100 p-1.5 rounded-2xl grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setQrActiveTab('pay')}
                  className={cn(
                    "py-2.5 px-3 rounded-xl font-black text-xs transition-all",
                    qrActiveTab === 'pay' ? "bg-white text-slate-950 shadow-sm font-black" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  💳 QR Retail Pay
                </button>
                <button
                  type="button"
                  onClick={() => setQrActiveTab('receipt')}
                  className={cn(
                    "py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1",
                    qrActiveTab === 'receipt' ? "bg-white text-slate-950 shadow-sm font-black" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  🧾 Scan QR Receipt <span className="w-1.5 h-1.5 bg-[#74c300] rounded-full" />
                </button>
              </div>

              {qrActiveTab === 'pay' ? (
                <>
                  {/* QR representation box */}
                  <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-slate-700 rounded-tl-3xl m-4" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-slate-700 rounded-tr-3xl m-4" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-slate-700 rounded-bl-3xl m-4" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-slate-700 rounded-br-3xl m-4" />

                    <div className="w-44 h-44 bg-white rounded-2xl flex items-center justify-center p-3 shadow-md">
                      {/* Styled SVG QR Code */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 shrink-0">
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
                        <rect x="65" y="20" width="8" height="5" fill="currentColor" />
                        <rect x="30" y="45" width="15" height="15" fill="currentColor" />
                        <rect x="55" y="50" width="10" height="25" fill="currentColor" />
                        <rect x="35" y="80" width="20" height="15" fill="currentColor" />
                        <rect x="75" y="45" width="12" height="12" fill="currentColor" />
                        <rect x="80" y="75" width="15" height="8" fill="currentColor" />
                        <rect x="70" y="65" width="9" height="9" fill="currentColor" />
                      </svg>
                    </div>

                    <div className="text-center space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">MALAYSIA UNI-QR PROTOCOL</span>
                      <p className="text-sm font-black text-white/95 tracking-tight">Adam's Escrow Primary QR</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        toast.success("Merchant QR Barcode scanned! Direct payment simulating.");
                        setShowQrModal(false);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 font-extrabold rounded-2xl h-12 text-xs"
                    >
                      Simulate Scanner Pay
                    </Button>
                    <Button 
                      onClick={() => {
                        toast.success("Saved QR image to photo stream!");
                      }}
                      className="flex-1 bg-slate-905 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-2xl h-12 text-xs"
                    >
                      Share QR Code
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-left">
                  {!receiptScanningSuccess ? (
                    <div className="space-y-4">
                      {/* Touch 'n Go Live Camera Viewfinder */}
                      <div className="relative w-full aspect-square bg-[#0c1017] rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-inner flex flex-col items-center justify-center p-6">
                        
                        {/* Live streaming video target container */}
                        <div id="qr-reader" className="absolute inset-0 w-full h-full object-cover z-0" />

                        {/* Scanner Graphic Overlays */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-8">
                          
                          {/* Corner bracket indicators */}
                          <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl animate-pulse" />
                          <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl animate-pulse" />
                          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl animate-pulse" />
                          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl animate-pulse" />

                          {/* Glowing scanning laser bar */}
                          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.8)] absolute top-1/4 animate-bounce" />

                          {receiptScanningActive ? (
                            <div className="bg-slate-950/90 text-white rounded-2xl px-5 py-4 text-center space-y-2 max-w-[260px] shadow-2xl backdrop-blur-sm pointer-events-auto">
                              <RefreshCw size={24} className="animate-spin text-emerald-400 mx-auto" />
                              <p className="text-xs font-black tracking-widest text-emerald-400 uppercase animate-pulse">RUNNING LIVE PARSER</p>
                              <p className="text-[10px] text-slate-350">Gemini reading store receipts and parsing price columns...</p>
                            </div>
                          ) : (
                            <div className="bg-slate-950/85 text-white/95 rounded-2xl p-4 text-center max-w-[280px] mt-auto shadow-xl backdrop-blur-sm">
                              <span className="text-[8px] tracking-wider uppercase font-extrabold bg-[#74c300] text-slate-950 px-2 py-0.5 rounded-full mb-1 inline-block">
                                LIVE QR RECONCILE
                              </span>
                              <p className="text-xs font-bold text-white leading-tight">Camera stream scanning live...</p>
                              <p className="text-[10px] text-slate-300 leading-tight mt-0.5">Align any retail or supermarket receipt checkout code inside brackets.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fallback mock scan if camera is disabled, blocked in iframe, or lack of devices */}
                      <div className="space-y-2">
                        <Button
                          type="button"
                          disabled={receiptScanningActive}
                          onClick={handleSimulateLiveScan}
                          className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black rounded-2xl h-14 text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer text-center"
                        >
                          <Smartphone size={16} className="text-emerald-400" />
                          📸 Simulate Live TNG Cam Scan (RM 250)
                        </Button>
                        <p className="text-[9px] text-slate-400 text-center uppercase tracking-wider font-bold">
                          Trigger instantaneous camera emulation to mock physical scanning inside iframe
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* SCANNING SUCCESS! Render the beautiful physical receipt replica */
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white border text-left border-slate-200 rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col space-y-4 animate-fade-in"
                      style={{
                        backgroundImage: "linear-gradient(#fbfcfc 1px, transparent 1px), linear-gradient(90deg, #fbfcfc 1px, transparent 1px)",
                        backgroundSize: "20px 20px"
                      }}
                    >
                      {/* Fake zigzag border effect at top */}
                      <div className="flex justify-between -mx-6 -mt-6 h-3 bg-slate-100 border-b border-dashed border-slate-200" 
                           style={{ clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)" }} 
                      />

                      <div className="text-center space-y-1 pt-1">
                        <span className="text-[8px] bg-emerald-600 text-white font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded">TAX INVOICE PARSED</span>
                        <h5 className="font-extrabold text-slate-900 text-base leading-tight uppercase font-mono tracking-tight">
                          {parsedLiveReceipt?.merchantName || "RETAIL OUTLET"}
                        </h5>
                        <p className="text-[9px] text-slate-400 font-extrabold tracking-wider">
                          {parsedLiveReceipt?.location || "KUALA LUMPUR, MALAYSIA"}
                        </p>
                      </div>

                      <div className="border-t border-b border-dashed border-slate-200 py-2.5 font-mono text-[10px] text-slate-400 space-y-0.5 bg-slate-50 px-2 rounded-xl">
                        <div className="flex justify-between">
                          <span>Date: {parsedLiveReceipt?.date || "Today"}</span>
                          <span>Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-bold">
                          <span>Ref: JG-940251-X</span>
                          <span>Live matched: Yes</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>Primary Card:</span>
                          <span className="text-emerald-600">Visa ending *7854</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-slate-400 text-[10px] font-bold border-b border-slate-100 pb-1 uppercase">
                          <span>Description</span>
                          <span>Price (RM)</span>
                        </div>
                        
                        <div className="space-y-1 text-slate-800">
                          {(parsedLiveReceipt?.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.name}</span>
                              <span className="font-bold">{parseFloat(item.price || "0").toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-dashed border-slate-200 pt-2 space-y-1 text-xs">
                          <div className="flex justify-between text-slate-500 font-bold">
                            <span>Subtotal</span>
                            <span>{(parsedLiveReceipt?.totalAmount || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-black text-slate-950 text-sm border-t border-slate-950 pt-1 mt-1">
                            <span>RECONCILED AMOUNT</span>
                            <span>RM {(parsedLiveReceipt?.totalAmount || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Virtual Barcode */}
                      <div className="pt-1 flex flex-col items-center space-y-0.5 opacity-60">
                        <div className="w-full h-5 bg-[repeating-linear-gradient(90deg,#005,#005_1.5px,transparent_1.5px,transparent_4.5px,#005_4.5px,#005_8px)]" />
                        <span className="text-[8px] font-mono font-black tracking-widest text-[#74c300]">*LINKED & VERIFIED AT FINSIGHTS*</span>
                      </div>
                    </motion.div>
                  )}

                  {receiptScanningSuccess && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => {
                          setReceiptScanningSuccess(false);
                          setReceiptScanningActive(false);
                          setParsedLiveReceipt(null);
                        }}
                        variant="outline" 
                        className="flex-1 rounded-2xl h-12 text-xs font-black border-slate-200 select-none cursor-pointer"
                      >
                        File New Scan
                      </Button>
                      <Button 
                        onClick={handleConfirmReceiptMatch}
                        className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-2xl h-12 text-xs select-none cursor-pointer text-center"
                      >
                        Link & Reconcile
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRANSACTION DETAILS & RECEIPT DIALOG DRAWER */}
      <AnimatePresence>
        {selectedTransaction && (
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
              className="bg-white rounded-t-[3rem] w-full max-w-md p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:scale-105 transition-transform"
              >
                <XCircle size={20} />
              </button>

              <div className="text-center space-y-1">
                <h4 className="text-xl font-black text-slate-950">Transaction Insights</h4>
                <p className="text-xs text-slate-400">Deep verified logs & itemized paper receipt</p>
              </div>

              {/* Card Badge Details */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Assigned Card</h5>
                  <p className="text-xs font-extrabold text-slate-800">
                    {selectedTransaction.cardType === 'virtual' ? "💻 Space Virtual Credit" : "💳 Finsight Visa Primary"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 font-black uppercase px-2.5 py-1 rounded-full border border-emerald-100/50">
                    ✔ Verified Link
                  </span>
                </div>
              </div>

              {/* THE PHYSICAL-STYLE THERMAL RECEIPT DISPLAY */}
              <div 
                className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col space-y-4"
                style={{
                  backgroundImage: "linear-gradient(#fafafa 1px, transparent 1px), linear-gradient(90deg, #fafafa 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              >
                {/* Fake jagged border effect at top */}
                <div className="flex justify-between -mx-5 -mt-5 h-2.5 bg-slate-100 border-b border-dashed border-slate-200" 
                     style={{ clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)" }} 
                />

                <div className="text-center space-y-1">
                  <span className="text-[8px] bg-slate-900 text-white font-mono uppercase tracking-widest px-2 py-0.5 rounded">VERIFIED RECEIPT</span>
                  <h4 className="font-black text-slate-900 text-base leading-tight uppercase font-mono tracking-tight block">
                    {selectedTransaction.description}
                  </h4>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider">{selectedTransaction.location || "Kuala Lumpur, Malaysia"}</p>
                </div>

                <div className="border-t border-b border-dashed border-slate-200 py-2 font-mono text-[10px] text-slate-500 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Date: Today</span>
                    <span>Status: {selectedTransaction.status?.toUpperCase() || "COMPLETED"}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>ID: #{selectedTransaction.id}</span>
                    <span>User: Adam</span>
                  </div>
                </div>

                {/* Receipts Item List display */}
                <div className="font-mono text-xs space-y-2 text-left">
                  <div className="flex justify-between text-slate-400 text-[10px] font-bold border-b border-slate-100 pb-1 uppercase">
                    <span>Itemized Breakdown</span>
                    <span>Price (RM)</span>
                  </div>

                  {selectedTransaction.receiptItems || selectedTransaction.id === 't-groceries-250' ? (
                    <div className="space-y-1 text-slate-800">
                      {(selectedTransaction.receiptItems || [
                        { name: 'Organic Avocados (4x)', price: 24.00 },
                        { name: 'Premium Wagyu Steak (500g)', price: 135.00 },
                        { name: 'Fresh Atlantic Salmon (300g)', price: 42.05 },
                        { name: 'Organic Strawberries (2 Packs)', price: 18.00 },
                        { name: 'Gourmet French Butter', price: 16.95 },
                        { name: 'Truffle Mayo Dip', price: 14.00 }
                      ]).map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.name}</span>
                          <span className="font-bold">{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback generated receipt list depending on transaction description */
                    <div className="space-y-1 text-slate-800">
                      {selectedTransaction.description?.toLowerCase().includes("mcdonald") ? (
                        <>
                          <div className="flex justify-between">
                            <span>1x McSpicy Veg Special Meal</span>
                            <span className="font-bold">12.50</span>
                          </div>
                          <div className="flex justify-between">
                            <span>1x Premium Chocolate Sundae</span>
                            <span className="font-bold">2.50</span>
                          </div>
                        </>
                      ) : selectedTransaction.description?.toLowerCase().includes("steam") ? (
                        <>
                          <div className="flex justify-between">
                            <span>1x Steam Wallet Core Code (Global)</span>
                            <span className="font-bold">100.00</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Platform Tax (Direct Settle)</span>
                            <span className="font-bold">20.00</span>
                          </div>
                        </>
                      ) : selectedTransaction.description?.toLowerCase().includes("gaming") || selectedTransaction.description?.toLowerCase().includes("vr") ? (
                        <>
                          <div className="flex justify-between">
                            <span>1x VR Laser Tracker Sensor</span>
                            <span className="font-bold">950.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>1x Valve HMD Extreme Kit</span>
                            <span className="font-bold">1500.00</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>1x Direct Escrow Settlement</span>
                            <span className="font-bold">{(selectedTransaction.amount * 0.9).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Brokerage Processing Fee (10%)</span>
                            <span className="font-bold">{(selectedTransaction.amount * 0.1).toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="border-t border-dashed border-slate-200 pt-2 space-y-1">
                    <div className="flex justify-between text-slate-500 text-xs">
                      <span>Total Amount Settled</span>
                      <span>RM {selectedTransaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-950 text-sm border-t border-slate-900 pt-1.5 mt-1">
                      <span>FINAL TRANSACTION</span>
                      <span>RM {selectedTransaction.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Virtual Barcode */}
                <div className="pt-2 flex flex-col items-center space-y-0.5 opacity-60">
                  <div className="w-full h-5 bg-[repeating-linear-gradient(90deg,#000,#000_1.5px,transparent_1.5px,transparent_4.5px,#000_4.5px,#000_8px)]" />
                  <span className="text-[8px] font-mono font-black tracking-widest text-slate-500">*VERIFIED INSIGHT QR STAMP*</span>
                </div>
              </div>

              {/* Prompt to link receipt if groceries missed scanning */}
              {selectedTransaction.id === 't-groceries-250' && !receiptScanningSuccess && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-xs font-bold text-amber-800">
                    💡 Unsure of what you bought? Tap "Attach / Parse Receipt QR" to match item details instantly!
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTransaction(null);
                      setQrActiveTab('receipt');
                      setShowQrModal(true);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] rounded-xl h-8 px-4"
                  >
                    Attach / Parse Receipt QR
                  </Button>
                </div>
              )}

              <Button 
                onClick={() => setSelectedTransaction(null)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl h-14 text-sm"
              >
                Close Insights
              </Button>
            </motion.div>
          </motion.div>
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

      {/* MODAL 3: RECEIVE FUNDS POPUP */}
      <AnimatePresence>
        {showReceiveModal && (
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
                onClick={() => {
                  setShowReceiveModal(false);
                  setReceiveLinkGenerated(false);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <XCircle size={20} />
              </button>

              <div className="space-y-1 text-center">
                <h4 className="text-xl font-black text-slate-950">Receive Money</h4>
                <p className="text-xs text-slate-400">Request funding from linked bank profiles</p>
              </div>

              {!receiveLinkGenerated ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Request Amount (RM)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-900 text-lg">RM</span>
                      <input 
                        type="number" 
                        value={receiveAmountText}
                        onChange={(e) => setReceiveAmountText(e.target.value)}
                        className="w-full bg-slate-50 rounded-2xl h-14 pl-12 pr-4 font-black text-slate-950 text-xl focus:outline-none"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      setReceiveLinkGenerated(true);
                      toast.success("Family fund request link generated! 🔗");
                    }}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-14 text-xs"
                  >
                    Generate Request Code & Link
                  </Button>
                </>
              ) : (
                <div className="space-y-5 text-center animate-in zoom-in-95 duration-200">
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-center items-center gap-1.5">
                    <CheckCircle2 className="text-emerald-500" size={32} />
                    <p className="text-xs font-black text-slate-950">Payment Request Code Generated</p>
                    <p className="text-2xl font-black text-emerald-600">RM {parseFloat(receiveAmountText || '100').toLocaleString()}</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-1 text-xs">
                    <p className="text-slate-400 font-bold">Secure Request Link:</p>
                    <p className="text-slate-950 font-mono font-medium truncate bg-white p-2.5 rounded-lg border border-slate-100 selection:bg-slate-205">
                      https://monetro.app/req/74b92-j{receiveAmountText}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        toast.success("Copied to clipboard!");
                      }}
                      className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-2xl h-12 text-xs"
                    >
                      Copy Link
                    </Button>
                    <Button 
                      onClick={() => {
                        toast.success("Direct SMS request sent to Co-Parent!");
                      }}
                      variant="outline"
                      className="flex-1 rounded-2xl h-12 text-xs font-black border-slate-205"
                    >
                      Share with partner
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
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
                <p className="text-xs text-slate-400">Link security controls & pocket balances instantly</p>
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
                    placeholder="Enter name (e.g. Alisya, Nadine)"
                  />
                  {/* Preset quick recommendations */}
                  <div className="flex gap-1.5 pt-1 overflow-x-auto scrollbar-hide">
                    {['Alisya', 'Nadine', 'Kamal', 'Fakhri'].map((nameSuggested) => (
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Relationship Card Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Kid Debit', 'Spouse Debit'].map((typeOption) => (
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
                </div>
 
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Initial Balance Limit (RM)</label>
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
                  Link Card Instantly
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
