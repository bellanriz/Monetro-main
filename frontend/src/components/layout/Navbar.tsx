import React from 'react';
import { Home, Wallet, LayoutGrid, Users, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  visible?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, visible = true }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'family', icon: Users, label: 'Family', hasDot: true },
    { id: 'analytics', icon: LayoutGrid, label: 'Insights' },
    { id: 'settings', icon: User, label: 'Profile' },
  ];

  return (
    <motion.div
      initial={{ y: 0, opacity: 1, x: '-50%' }}
      animate={{ 
        y: visible ? 0 : 80, 
        opacity: visible ? 1 : 0,
        x: '-50%'
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-8 left-1/2 w-[90%] max-w-sm z-50 px-2"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <nav className="bg-[#121214]/95 backdrop-blur-3xl rounded-[2rem] p-2 flex items-center justify-between shadow-[0_24px_50px_rgba(0,0,0,0.91)] border border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative outline-none flex items-center justify-center transition-all duration-300 rounded-[1.25rem] h-11 px-1",
                isActive ? "flex-[1.6] max-w-[130px]" : "flex-[0.8] max-w-[44px]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white rounded-[1.25rem] shadow-[0_8px_20px_rgba(255,255,255,0.15)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center gap-1.5 transition-all duration-300",
                  isActive ? "text-slate-950 font-extrabold px-3 py-1.5" : "text-zinc-500 hover:text-zinc-300 p-2"
                )}
              >
                <div className="relative">
                  <Icon 
                    size={isActive ? 16 : 20} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "text-slate-950 stroke-[2.5]" : "stroke-[2]"
                    )} 
                  />
                  {tab.hasDot && !isActive && (
                    <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#CCFF00]"></span>
                    </span>
                  )}
                </div>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[11px] font-black tracking-tight uppercase truncate select-none leading-none"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </motion.div>
  );
};

