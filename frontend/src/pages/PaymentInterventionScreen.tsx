import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, X } from 'lucide-react';

export type InterventionType = 'MULE_ACCOUNT' | 'UNUSUAL_MEDIUM' | 'UNUSUAL_HIGH';

interface PaymentInterventionScreenProps {
  type: InterventionType;
  amount: string;
  onClose: () => void;
}

const interventionConfig: Record<InterventionType, { title: string; description: string; severity: string; color: string }> = {
  MULE_ACCOUNT: {
    title: 'Suspected Mule Account',
    description: 'This recipient has been flagged by our AI security system as a potential mule account. Proceed with extreme caution.',
    severity: 'Critical',
    color: 'bg-red-500',
  },
  UNUSUAL_MEDIUM: {
    title: 'Unusual Transaction Detected',
    description: 'This amount is higher than your typical transfer pattern. Our AI recommends verifying the recipient before proceeding.',
    severity: 'Medium',
    color: 'bg-amber-500',
  },
  UNUSUAL_HIGH: {
    title: 'High-Risk Transfer Alert',
    description: 'This transaction exceeds your safety threshold. Additional verification is required to protect your funds.',
    severity: 'High',
    color: 'bg-orange-500',
  },
};

export const PaymentInterventionScreen: React.FC<PaymentInterventionScreenProps> = ({ type, amount, onClose }) => {
  const config = interventionConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`w-16 h-16 rounded-full ${config.color} flex items-center justify-center`}>
            <AlertTriangle size={28} className="text-white" />
          </div>

          <div className="space-y-1">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${config.color} text-white`}>
              {config.severity} Risk
            </span>
            <h3 className="text-xl font-black text-slate-900 pt-2">{config.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{config.description}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 w-full">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Flagged Amount</p>
            <p className="text-2xl font-black text-slate-900">RM {parseFloat(amount).toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl text-sm uppercase tracking-wider active:scale-95 transition-all"
          >
            Cancel Transfer
          </button>
          <button
            onClick={onClose}
            className="w-full h-12 bg-slate-100 text-slate-600 font-bold rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition-all"
          >
            I understand the risk, proceed anyway
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
