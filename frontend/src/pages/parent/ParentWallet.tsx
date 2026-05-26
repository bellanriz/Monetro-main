import React from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Landmark, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ParentWalletProps {
  profile: {
    balance: number;
  } | null;
  transactions: any[];
  setSelectedTransaction: (tx: any) => void;
}

export const ParentWallet: React.FC<ParentWalletProps> = ({
  profile,
  transactions,
  setSelectedTransaction,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Wallet</h2>
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
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-slate-500 uppercase">{(tx.category || 'TX').slice(0, 2)}</span>
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
};
