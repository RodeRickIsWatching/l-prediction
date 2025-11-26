import React, { useState } from 'react';
import { PredictionDirection, PredictionStatus, UserPrediction } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, Loader2, Play } from 'lucide-react';

interface TradePanelProps {
  currentPrice: number;
  onPlacePrediction: (direction: PredictionDirection, amount: number) => void;
  isLoading?: boolean;
}

const TradePanel: React.FC<TradePanelProps> = ({ currentPrice, onPlacePrediction, isLoading = false }) => {
  const [selectedDirection, setSelectedDirection] = useState<PredictionDirection>(PredictionDirection.CALL);
  const [amount, setAmount] = useState<string>('100');
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const handleSubmit = () => {
    setLocalSubmitting(true);
    // Simulate network delay logic in parent, but we handle local loading state mostly
    setTimeout(() => {
      onPlacePrediction(selectedDirection, parseFloat(amount));
      setLocalSubmitting(false);
    }, 600);
  };

  const isProcessing = isLoading || localSubmitting;

  return (
    <div className="flex flex-col font-mono text-sm bg-[#050505] border border-white/[0.06] rounded-sm p-0 overflow-hidden">
      
      {/* Header */}
      <div className="p-3 border-b border-white/[0.06] bg-white/[0.01] flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-xs"></span>
            Execute_Trade
        </h3>
      </div>

      <div className="p-4 flex flex-col gap-4">
        
        {/* Direction Tabs */}
        <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-xs overflow-hidden">
          <button
            onClick={() => setSelectedDirection(PredictionDirection.CALL)}
            className={`py-2.5 flex items-center justify-center gap-2 transition-all ${
              selectedDirection === PredictionDirection.CALL
                ? 'bg-[#0A0A0A] text-[#00C896]'
                : 'bg-[#151517] text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1A1D]'
            }`}
          >
            <ArrowUpRight size={14} />
            <span className="text-[11px] font-bold tracking-wider">CALL</span>
          </button>

          <button
            onClick={() => setSelectedDirection(PredictionDirection.PUT)}
            className={`py-2.5 flex items-center justify-center gap-2 transition-all ${
              selectedDirection === PredictionDirection.PUT
                ? 'bg-[#0A0A0A] text-[#FF3333]'
                : 'bg-[#151517] text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1A1D]'
            }`}
          >
            <ArrowDownRight size={14} />
            <span className="text-[11px] font-bold tracking-wider">PUT</span>
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] text-zinc-500 uppercase tracking-wider">
                <span>Input_Amount</span>
                <span className="flex items-center gap-1"><Wallet size={10} /> Bal: 2,450.00</span>
            </div>
            <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-xs">{'>'}</span>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/[0.08] rounded-xs py-2.5 pl-8 pr-12 text-white font-mono text-sm focus:outline-none focus:border-white/20 focus:bg-black transition-colors placeholder-zinc-800"
                    placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-bold">USDC</span>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 py-1">
             <div>
                <span className="block text-[9px] text-zinc-600 uppercase mb-0.5">Fee (0.1%)</span>
                <span className="block text-xs text-zinc-400 font-mono">
                    {(parseFloat(amount || '0') * 0.001).toFixed(3)}
                </span>
             </div>
             <div className="text-right">
                <span className="block text-[9px] text-zinc-600 uppercase mb-0.5">Est. Payout</span>
                <span className="block text-xs text-[#00C896] font-mono">
                    {(parseFloat(amount || '0') * 1.8).toFixed(2)}
                </span>
             </div>
        </div>

        {/* Action Button */}
        <button
            onClick={handleSubmit}
            disabled={isProcessing || !amount}
            className={`w-full py-2.5 rounded-xs font-bold text-[11px] tracking-[0.1em] uppercase transition-all duration-100 flex items-center justify-center gap-2 ${
                isProcessing 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent' 
                : 'bg-white text-black hover:bg-zinc-200 border border-white'
            }`}
        >
            {isProcessing ? <Loader2 className="animate-spin" size={12}/> : <Play size={12} fill="currentColor" />}
            {isProcessing ? 'EXECUTING...' : 'EXECUTE_ORDER'}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;