import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Bell, LogOut, Landmark, Settings, User } from 'lucide-react';

export interface ParentSettingsProps {
  profile: {
    displayName: string;
    photoURL?: string;
    balance: number;
    savingsBalance: number;
  } | null;
  parentBiometrics: boolean;
  setParentBiometrics: (val: boolean) => void;
  allowanceApproved: boolean;
  setAllowanceApproved: (val: boolean) => void;
  dailyDigest: boolean;
  setDailyDigest: (val: boolean) => void;
  logout: () => void;
}

export const ParentSettings: React.FC<ParentSettingsProps> = ({
  profile,
  parentBiometrics,
  setParentBiometrics,
  allowanceApproved,
  setAllowanceApproved,
  dailyDigest,
  setDailyDigest,
  logout,
}) => {
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
};
