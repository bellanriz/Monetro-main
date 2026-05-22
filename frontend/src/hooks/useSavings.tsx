import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline?: any;
}

const MOCK_GOALS: SavingsGoal[] = [
  {
    id: 'g1',
    userId: 'kid-456',
    title: 'University Fund',
    targetAmount: 50000,
    currentAmount: 12000,
    category: 'university'
  },
  {
    id: 'g2',
    userId: 'kid-456',
    title: 'New Laptop',
    targetAmount: 3500,
    currentAmount: 1200,
    category: 'laptop'
  }
];

export const useSavings = (kidId?: string) => {
  const { profile } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const data = localStorage.getItem('famwallet_goals');
    if (data) {
      setGoals(JSON.parse(data));
    } else {
      setGoals(MOCK_GOALS);
    }
    setLoading(false);
  }, [profile, kidId]);

  const addGoal = async (data: Partial<SavingsGoal>) => {
    const newGoal = {
      id: Math.random().toString(36).substr(2, 9),
      userId: kidId || profile?.uid || '',
      currentAmount: 0,
      ...data,
    } as SavingsGoal;
    
    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem('famwallet_goals', JSON.stringify(updated));
    return newGoal;
  };

  const updateProgress = async (id: string, amount: number) => {
    const updated = goals.map(g => 
      g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
    );
    setGoals(updated);
    localStorage.setItem('famwallet_goals', JSON.stringify(updated));
  };

  return { goals, loading, addGoal, updateProgress };
};
