import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Wallet, TrendingUp, LogOut, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const ElderDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { profile, logout } = useAuth();

  // Mock spending history for elder
  const momSpending = [
    { id: 1, desc: 'Groceries - Jaya Grocer', amount: -85.50, date: 'Today', category: 'Groceries' },
    { id: 2, desc: 'Monthly Allowance from Adam', amount: 2000, date: 'May 1', category: 'Allowance' },
    { id: 3, desc: 'Clinic Visit - Dr. Tan', amount: -120, date: 'Apr 28', category: 'Health' },
    { id: 4, desc: 'Grab Ride - KLCC', amount: -18.50, date: 'Apr 26', category: 'Transport' },
    { id: 5, desc: 'Pharmacy - Watson', amount: -45.80, date: 'Apr 25', category: 'Health' },
    { id: 6, desc: 'Monthly Allowance from Adam', amount: 2000, date: 'Apr 1', category: 'Allowance' },
  ];

  const dadSpending = [
    { id: 1, desc: 'Petrol - Petronas', amount: -80.00, date: 'Today', category: 'Transport' },
    { id: 2, desc: 'Monthly Allowance from Adam', amount: 2500, date: 'May 1', category: 'Allowance' },
    { id: 3, desc: 'Coffee - Kopitiam', amount: -12.50, date: 'Apr 29', category: 'Food' },
    { id: 4, desc: 'Hardware Store - Mr DIY', amount: -65.00, date: 'Apr 27', category: 'Shopping' },
    { id: 5, desc: 'Fishing Supplies', amount: -95.00, date: 'Apr 24', category: 'Leisure' },
    { id: 6, desc: 'Monthly Allowance from Adam', amount: 2500, date: 'Apr 1', category: 'Allowance' },
  ];

  const spendingHistory = profile?.displayName === 'Dad' ? dadSpending : momSpending;

  if (activeTab === 'settings') {
    return (
      <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Elder Account</p>
        </header>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-slate-900 shadow-md">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback>{profile?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{profile?.displayName}</h3>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-800 text-white rounded-full">
                  Elder
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Family Adam</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Balance</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">RM {profile?.balance?.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Savings</p>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">RM {profile?.savingsBalance?.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Button 
          onClick={() => logout()}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black rounded-3xl h-14 text-sm shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 border-none"
        >
          <LogOut size={18} className="stroke-[2.5]" />
          Log Out
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 pb-32">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-slate-200 shadow-md">
            <AvatarImage src={profile?.photoURL} />
            <AvatarFallback>{profile?.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Welcome Back!</span>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
              {profile?.displayName}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Protected</span>
        </div>
      </motion.header>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden p-7">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 font-extrabold uppercase tracking-[0.2em] text-[10px]">My Balance</p>
              <Heart size={16} className="text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-400">RM</span>
              <h3 className="text-4xl font-black tracking-tighter">
                {profile?.balance?.toLocaleString()}
              </h3>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold">Next Allowance</p>
                <p className="text-xs font-black text-white">1 Jun 2026</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold">From</p>
                <p className="text-xs font-black text-white">Adam</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold">Amount</p>
                <p className="text-xs font-black text-emerald-400">RM {profile?.displayName === 'Dad' ? '2,500' : '2,000'}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <Card className="border border-slate-100 bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
              <Wallet size={14} className="text-slate-600" />
            </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">This Month Spent</p>
          <p className="text-lg font-black text-slate-900 mt-0.5">RM {profile?.displayName === 'Dad' ? '252.50' : '269.80'}</p>
        </Card>
        <Card className="border border-slate-100 bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={14} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Savings</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">RM {profile?.savingsBalance?.toLocaleString()}</p>
        </Card>
      </motion.div>

      {/* Spending History */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h3>
          <span className="text-[10px] uppercase font-bold text-slate-400">This month</span>
        </div>

        <div className="space-y-3">
          {spendingHistory.map((item) => (
            <Card key={item.id} className="border border-slate-100 bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <span className="text-xs font-black text-slate-600 uppercase">{item.category.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{item.desc}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{item.date}</p>
                  </div>
                </div>
                <span className={`font-black text-sm ${item.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {item.amount > 0 ? '+' : ''}RM {Math.abs(item.amount).toFixed(2)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
