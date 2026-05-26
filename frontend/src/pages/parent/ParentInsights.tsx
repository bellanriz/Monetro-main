import React from 'react';
import { Card } from '../../components/ui/card';
import { TrendingUp, ArrowUpRight, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ParentInsightsProps {
  historyFilter: string;
}

export const ParentInsights: React.FC<ParentInsightsProps> = ({
  historyFilter,
}) => {
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

        {/* Per-member spending breakdown */}
        <div className="space-y-4">
          {[
            { name: 'Isac', avatar: '/images/isac.png', spend: 420, bars: [40, 65, 30, 80, 55, 90, 45], color: 'bg-slate-900' },
            { name: 'Alisya', avatar: '/images/alisya.png', spend: 380, bars: [55, 40, 70, 35, 60, 45, 75], color: 'bg-slate-900' },
            { name: 'Nadine', avatar: '/images/nadine.png', spend: 650, bars: [70, 85, 50, 90, 65, 40, 80], color: 'bg-slate-900' },
            { name: 'Mom', avatar: '/images/grandma.png', spend: 280, bars: [30, 45, 25, 50, 35, 60, 40], color: 'bg-slate-900' },
            { name: 'Dad', avatar: '/images/grandpa.png', spend: 190, bars: [20, 35, 40, 25, 45, 30, 50], color: 'bg-slate-900' },
          ].map((member) => (
            <div key={member.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                  <span className="text-xs font-black text-slate-900">{member.name}</span>
                </div>
                <span className="text-xs font-extrabold text-slate-900">RM {member.spend.toLocaleString()}</span>
              </div>
              <div className="flex items-end gap-1.5 h-12">
                {member.bars.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      className={cn("w-full rounded-t-md", member.color, "opacity-70")}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregate family spend</p>
            <p className="text-2xl font-extrabold text-slate-900">RM 1,920.00</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </Card>

      {/* Web3 Reward Token Card */}
      <Card className="border border-slate-100 bg-gradient-to-br from-[#1b1b1e] to-[#2d2d32] rounded-[2.5rem] p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
              <Coins size={18} className="text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Monetro Token (MNTR)</h4>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">ERC-20 · Sepolia Testnet</p>
            </div>
          </div>
          <a 
            href="https://sepolia.etherscan.io/address/0x1667fa2593beAFc6e63406c94F975DD859D35e4B" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider hover:bg-purple-500/20 transition-colors"
          >
            View Contract ↗
          </a>
        </div>

        {/* Family Members Token Balances */}
        <div className="space-y-2.5">
          {[
            { name: 'Isac', avatar: '/images/isac.png', balance: 10000, earned: 50, role: 'Son' },
            { name: 'Alisya', avatar: '/images/alisya.png', balance: 7500, earned: 35, role: 'Daughter' },
            { name: 'Nadine', avatar: '/images/nadine.png', balance: 4200, earned: 20, role: 'Wife' },
            { name: 'Mom', avatar: '/images/grandma.png', balance: 3000, earned: 15, role: 'Grandmother' },
            { name: 'Dad', avatar: '/images/grandpa.png', balance: 3000, earned: 15, role: 'Grandfather' },
          ].map((member) => (
            <div key={member.name} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                <div>
                  <p className="text-xs font-black text-white">{member.name}</p>
                  <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-white">{member.balance.toLocaleString()} <span className="text-[10px] text-purple-400">MNTR</span></p>
                <p className="text-[9px] font-bold text-[#74c300]">+{member.earned} this week</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <span className="text-[8px] font-black text-white/40 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider">💰 Savings: +10</span>
          <span className="text-[8px] font-black text-white/40 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider">🎯 Goals: +50</span>
          <span className="text-[8px] font-black text-white/40 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider">🔥 Streaks: +20</span>
        </div>
      </Card>
    </div>
  );
};
