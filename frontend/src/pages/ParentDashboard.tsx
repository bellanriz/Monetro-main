import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { toast } from 'sonner';
import { Html5Qrcode } from 'html5-qrcode';
import { ParentSettings } from './parent/ParentSettings';
import { ParentWallet } from './parent/ParentWallet';
import { ParentFamily } from './parent/ParentFamily';
import { ParentInsights } from './parent/ParentInsights';
import { ParentHome } from './parent/ParentHome';

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
  const [showFamilySavings, setShowFamilySavings] = useState<boolean>(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [showCardControls, setShowCardControls] = useState<string | null>(null);
  const [showCreateQuest, setShowCreateQuest] = useState<string | null>(null);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestReward, setNewQuestReward] = useState('10');
  const [quests, setQuests] = useState<{ id: string; kid: string; title: string; reward: number; status: 'in_progress' | 'reviewing' | 'paid' }[]>([
    { id: 'q1', kid: 'isac', title: 'Wash and Dry the Family Car', reward: 15, status: 'reviewing' },
    { id: 'q2', kid: 'isac', title: 'Tidy up Your Gaming Desk', reward: 5, status: 'paid' },
    { id: 'q3', kid: 'alisya', title: 'Help Mom Fold Laundry', reward: 10, status: 'reviewing' },
    { id: 'q4', kid: 'alisya', title: 'Complete Homework Before 8pm', reward: 5, status: 'paid' },
    { id: 'q5', kid: 'alisya', title: 'Read 2 Books This Week', reward: 20, status: 'in_progress' },
  ]);
  
  // Send money modal form states
  const [sendRecipientId, setSendRecipientId] = useState<string>('kid-455');
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
      id: 'fc2',
      holder: 'Nadine',
      title: "Nadine (Wife's Card)",
      type: 'Spouse Debit',
      brand: 'MasterCard',
      number: '1092',
      balance: 14350.00,
      theme: 'black'
    },
    {
      id: 'fc1',
      holder: 'Isac',
      title: "Isac Mikhael (Kid's Card)",
      type: 'Kid Debit',
      brand: 'VISA',
      number: '7854',
      balance: 120.00,
      theme: 'green'
    },
    {
      id: 'fc3',
      holder: 'Alisya',
      title: "Alisya (Kid's Card)",
      type: 'Kid Debit',
      brand: 'VISA',
      number: '3261',
      balance: 85.00,
      theme: 'white'
    },
    {
      id: 'fc4',
      holder: 'Mom',
      title: "Mom (Parent Allowance)",
      type: 'Parent Allowance',
      brand: 'MasterCard',
      number: '5478',
      balance: 3200.00,
      theme: 'green'
    },
    {
      id: 'fc5',
      holder: 'Dad',
      title: "Dad (Parent Allowance)",
      type: 'Parent Allowance',
      brand: 'VISA',
      number: '9103',
      balance: 2800.00,
      theme: 'black'
    }
  ]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardType, setNewCardType] = useState('Kid');
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
    const walk = (x - dragStartX) * 1.5;
    cardsSliderRef.current.scrollLeft = dragScrollLeft - walk;
  };

  const stopCardsDragging = () => {
    setIsDraggingCards(false);
  };

  const scrollCards = (direction: 'left' | 'right') => {
    if (cardsSliderRef.current) {
      const scrollAmount = 300;
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
    
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cardNumber = `${randomSuffix}`;

    const themesByType: Record<string, string> = {
      'Kid': 'green',
      'Spouse': 'white',
      'Parent': 'black',
    };
    const theme = themesByType[newCardType] || 'black';

    const titleMap: Record<string, string> = {
      'Kid': `${newCardHolder} (Kid's Card)`,
      'Spouse': `${newCardHolder} (Spouse Card)`,
      'Parent': `${newCardHolder} (Parent Allowance)`,
    };

    const newCard = {
      id: `fc-${Date.now()}`,
      holder: newCardHolder,
      title: titleMap[newCardType] || `${newCardHolder}'s Card`,
      type: newCardType === 'Kid' ? 'Kid Debit' : newCardType === 'Parent' ? 'Parent Allowance' : 'Spouse Debit',
      brand: newCardBrand,
      number: cardNumber,
      balance: balanceNum,
      theme: theme
    };

    setFamilyCards([...familyCards, newCard]);
    setShowAddCardModal(false);
    setNewCardHolder('');
    setNewCardType('Kid');
    setNewCardBalance('500');
    
    const successMsg = newCardType === 'Parent' 
      ? `💳 Issued allowance card for ${newCardHolder}! Annual funds will be disbursed on schedule.`
      : `💳 Linked ${newCardHolder}'s new ${newCardType} card successfully!`;
    toast.success(successMsg);
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
    const mockKids = [
      { 
        uid: 'kid-455', 
        displayName: 'Isac Mikhael', 
        balance: 120, 
        photoURL: '/images/isac.png', 
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
      <ParentSettings
        profile={profile}
        parentBiometrics={parentBiometrics}
        setParentBiometrics={setParentBiometrics}
        allowanceApproved={allowanceApproved}
        setAllowanceApproved={setAllowanceApproved}
        dailyDigest={dailyDigest}
        setDailyDigest={setDailyDigest}
        logout={logout}
      />
    );
  }

  // 2. WALLET TAB FOR PARENT
  if (activeTab === 'wallet') {
    return (
      <ParentWallet
        profile={profile}
        transactions={transactions}
        setSelectedTransaction={setSelectedTransaction}
      />
    );
  }

  // 3. FAMILY TAB FOR PARENT
  if (activeTab === 'family') {
    return (
      <ParentFamily
        profile={profile}
        transactions={transactions}
        cards={cards}
        pendingApprovals={pendingApprovals}
        approveTransaction={approveTransaction}
        rejectTransaction={rejectTransaction}
        updateCardSetting={updateCardSetting}
        addTransaction={addTransaction}
        familyCards={familyCards}
        setFamilyCards={setFamilyCards}
        activeCardId={activeCardId}
        setActiveCardId={setActiveCardId}
        showCardControls={showCardControls}
        setShowCardControls={setShowCardControls}
        showAddCardModal={showAddCardModal}
        setShowAddCardModal={setShowAddCardModal}
        showFamilySavings={showFamilySavings}
        setShowFamilySavings={setShowFamilySavings}
        showCreateQuest={showCreateQuest}
        setShowCreateQuest={setShowCreateQuest}
        newQuestTitle={newQuestTitle}
        setNewQuestTitle={setNewQuestTitle}
        newQuestReward={newQuestReward}
        setNewQuestReward={setNewQuestReward}
        quests={quests}
        setQuests={setQuests}
      />
    );
  }

  // 4. INSIGHTS / ANALYTICS TAB FOR PARENT
  if (activeTab === 'analytics') {
    return (
      <ParentInsights
        historyFilter={historyFilter}
      />
    );
  }

  if (activeTab !== 'home') {
    return <div className="flex items-center justify-center min-h-screen text-slate-400 font-medium pt-12">Coming soon: {activeTab}</div>;
  }

  // 5. HOME TAB (default)
  return (
    <ParentHome
      profile={profile}
      transactions={transactions}
      cards={cards}
      pendingApprovals={pendingApprovals}
      approveTransaction={approveTransaction}
      rejectTransaction={rejectTransaction}
      showQrModal={showQrModal}
      setShowQrModal={setShowQrModal}
      showSendModal={showSendModal}
      setShowSendModal={setShowSendModal}
      showReceiveModal={showReceiveModal}
      setShowReceiveModal={setShowReceiveModal}
      showAddCardModal={showAddCardModal}
      setShowAddCardModal={setShowAddCardModal}
      qrActiveTab={qrActiveTab}
      setQrActiveTab={setQrActiveTab}
      setSendRecipientId={setSendRecipientId}
      setSendReasonText={setSendReasonText}
      familyCards={familyCards}
      newCardHolder={newCardHolder}
      setNewCardHolder={setNewCardHolder}
      newCardType={newCardType}
      setNewCardType={setNewCardType}
      newCardBrand={newCardBrand}
      setNewCardBrand={setNewCardBrand}
      newCardBalance={newCardBalance}
      setNewCardBalance={setNewCardBalance}
      handleAddFamilyCard={handleAddFamilyCard}
    />
  );
};
