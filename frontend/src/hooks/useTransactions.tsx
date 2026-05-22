import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface CardControl {
  id: string;
  userId: string;
  type: 'virtual' | 'physical';
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  status: 'active' | 'frozen';
  allowOverseas: boolean;
  allowDomestic: boolean;
  limit: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  amount: number;
  location: string;
  timestamp: any;
  read: boolean;
  type: 'approval_required' | 'limit_alert' | 'general';
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'spending' | 'allowance' | 'savings';
  category: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  timestamp: any;
  isSuspicious: boolean;
  scamReport?: string;
  location?: string;
  isOverseas?: boolean;
  cardType?: 'virtual' | 'physical';
  receiptItems?: { name: string; price: number }[];
}

const DEFAULT_CARDS: CardControl[] = [
  {
    id: 'c1',
    userId: 'kid-455',
    type: 'virtual',
    cardNumber: '4123 5600 9012 7854',
    cardHolder: 'Isac Mikhael',
    expiry: '02/28',
    cvv: '392',
    status: 'active',
    allowOverseas: true,
    allowDomestic: true,
    limit: 2500,
  },
  {
    id: 'c2',
    userId: 'kid-456',
    type: 'physical',
    cardNumber: '4502 9184 2038 4390',
    cardHolder: 'Alisya',
    expiry: '10/29',
    cvv: '811',
    status: 'active',
    allowOverseas: false,
    allowDomestic: true,
    limit: 1500,
  }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Limit Exceeded Needs Approval',
    message: 'Isac Mikhael is trying to spend RM 2,450.00 for Shopping at Tokyo, Japan (Overseas shop)',
    amount: 2450,
    location: 'Tokyo, Japan (Overseas shop)',
    timestamp: new Date(Date.now() - 3600000 * 4),
    read: false,
    type: 'approval_required',
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't-groceries-250',
    userId: 'parent-adam',
    amount: 250,
    type: 'spending',
    category: 'Groceries',
    description: 'Jaya Grocer (Gardens Mall)',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000 * 5),
    isSuspicious: false,
    location: 'Kuala Lumpur, Malaysia (In-Country)',
    isOverseas: false,
    cardType: 'physical',
    receiptItems: [
      { name: 'Organic Avocados (4x)', price: 24.00 },
      { name: 'Premium Wagyu Ribeye Steak (500g)', price: 135.00 },
      { name: 'Fresh Atlantic Salmon Fillet (300g)', price: 42.05 },
      { name: 'Organic Strawberries (2 Packs)', price: 18.00 },
      { name: 'Gourmet French Butter (Unsalted)', price: 16.95 },
      { name: 'Truffle Mayo Dip', price: 14.00 }
    ]
  },
  {
    id: 't1',
    userId: 'kid-456',
    amount: 15,
    type: 'spending',
    category: 'Food',
    description: 'McDonalds Lunch',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000 * 2),
    isSuspicious: false,
    location: 'Kuala Lumpur, Malaysia (In-Country)',
    isOverseas: false,
    cardType: 'physical'
  },
  {
    id: 't2',
    userId: 'kid-455',
    amount: 120,
    type: 'spending',
    category: 'Games',
    description: 'Steam Game Purchase',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000 * 24),
    isSuspicious: false,
    location: 'Steam Purchase, Online (Overseas)',
    isOverseas: true,
    cardType: 'virtual'
  },
  {
    id: 't3',
    userId: 'kid-455',
    amount: 2450,
    type: 'spending',
    category: 'Shopping',
    description: 'High-end VR Gaming Headset',
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000 * 4),
    isSuspicious: true,
    scamReport: 'Exceeds RM 2,000 threshold. Needs Parent approval.',
    location: 'Tokyo, Japan (Overseas shop)',
    isOverseas: true,
    cardType: 'virtual'
  }
];

export const useTransactions = (kidId?: string) => {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CardControl[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    // Transactions
    const data = localStorage.getItem('famwallet_txs');
    if (data) {
      let parsed = JSON.parse(data) as Transaction[];
      if (!parsed.some(t => t.id === 't-groceries-250')) {
        parsed = [MOCK_TRANSACTIONS[0], ...parsed];
        localStorage.setItem('famwallet_txs', JSON.stringify(parsed));
      }
      setTransactions(parsed);
    } else {
      setTransactions(MOCK_TRANSACTIONS);
      localStorage.setItem('famwallet_txs', JSON.stringify(MOCK_TRANSACTIONS));
    }

    // Cards
    const cardsData = localStorage.getItem('famwallet_cards');
    if (cardsData) {
      setCards(JSON.parse(cardsData));
    } else {
      setCards(DEFAULT_CARDS);
      localStorage.setItem('famwallet_cards', JSON.stringify(DEFAULT_CARDS));
    }

    // Notifications
    const notifData = localStorage.getItem('famwallet_notifications');
    if (notifData) {
      setNotifications(JSON.parse(notifData));
    } else {
      setNotifications(DEFAULT_NOTIFICATIONS);
      localStorage.setItem('famwallet_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    }

    setLoading(false);
  }, [profile, kidId]);

  const addTransaction = async (data: Partial<Transaction>) => {
    const amount = data.amount || 0;
    const isHighAmount = amount > 2000;
    const isOverseas = data.isOverseas || false;
    
    const newTx = {
      id: Math.random().toString(36).substr(2, 9),
      userId: kidId || profile?.uid || 'kid-456',
      timestamp: new Date(),
      status: isHighAmount ? 'pending' : 'completed',
      isSuspicious: isHighAmount,
      scamReport: isHighAmount ? 'Exceeds RM 2,000 safety threshold. Parents must check and authorize.' : undefined,
      ...data,
    } as Transaction;

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('famwallet_txs', JSON.stringify(updatedTxs));

    // If more than 2,000, automatically add parent notification
    if (isHighAmount) {
      const newNotif: NotificationItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Limit Exceeded Needs Approval',
        message: `${profile?.displayName || 'Oliver'} wants to spend RM ${amount.toLocaleString()} for ${data.category || 'Shopping'} at ${data.location || 'Unknown location'}.`,
        amount,
        location: data.location || 'Unknown location',
        timestamp: new Date(),
        read: false,
        type: 'approval_required',
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('famwallet_notifications', JSON.stringify(updatedNotifs));
    }

    return newTx;
  };

  const approveTransaction = async (id: string) => {
    const updated = transactions.map(tx => 
      tx.id === id ? { ...tx, status: 'completed' as const, isSuspicious: false, scamReport: undefined } : tx
    );
    setTransactions(updated);
    localStorage.setItem('famwallet_txs', JSON.stringify(updated));

    // Clear matching notification
    const matchedTx = transactions.find(t => t.id === id);
    if (matchedTx) {
      const updatedNotifs = notifications.filter(n => n.amount !== matchedTx.amount);
      setNotifications(updatedNotifs);
      localStorage.setItem('famwallet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  const rejectTransaction = async (id: string) => {
    const updated = transactions.map(tx => 
      tx.id === id ? { ...tx, status: 'rejected' as const, isSuspicious: false } : tx
    );
    setTransactions(updated);
    localStorage.setItem('famwallet_txs', JSON.stringify(updated));

    // Clear matching notification
    const matchedTx = transactions.find(t => t.id === id);
    if (matchedTx) {
      const updatedNotifs = notifications.filter(n => n.amount !== matchedTx.amount);
      setNotifications(updatedNotifs);
      localStorage.setItem('famwallet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  const updateCardSetting = async (cardId: string, key: keyof CardControl, value: any) => {
    const updatedCards = cards.map(c => 
      c.id === cardId ? { ...c, [key]: value } : c
    );
    setCards(updatedCards);
    localStorage.setItem('famwallet_cards', JSON.stringify(updatedCards));
  };

  const clearNotification = async (notifId: string) => {
    const updatedNotifs = notifications.filter(n => n.id !== notifId);
    setNotifications(updatedNotifs);
    localStorage.setItem('famwallet_notifications', JSON.stringify(updatedNotifs));
  };

  const linkReceiptToTransaction = async (transactionId: string, merchantName: string, items: { name: string; price: number }[], totalAmount?: number) => {
    const updated = transactions.map(tx => {
      if (tx.id === transactionId) {
        return {
          ...tx,
          receiptItems: items,
          description: merchantName || tx.description,
          amount: totalAmount !== undefined && totalAmount > 0 ? totalAmount : tx.amount
        };
      }
      return tx;
    });
    setTransactions(updated);
    localStorage.setItem('famwallet_txs', JSON.stringify(updated));
  };

  return { 
    transactions, 
    cards, 
    notifications, 
    loading, 
    addTransaction, 
    approveTransaction, 
    rejectTransaction,
    updateCardSetting,
    clearNotification,
    linkReceiptToTransaction
  };
};

