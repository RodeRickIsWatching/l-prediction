import React from 'react';
import MarketStats from './MarketStats';
import TradePanel from './TradePanel';
import { MarketStatsData, PredictionDirection, UserPrediction, PredictionStatus } from '../types';
import { Terminal } from 'lucide-react';

interface RightSidebarProps {
  currentPrice: number;
  marketStats: MarketStatsData;
  userPredictions: UserPrediction[];
  onPlacePrediction: (direction: PredictionDirection, amount: number) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ 
    currentPrice, 
    marketStats, 
    userPredictions, 
    onPlacePrediction 
}) => {
    
  const activePredictions = userPredictions.filter(p => p.status === PredictionStatus.PENDING || p.status === PredictionStatus.CONFIRMED);

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* 1. Market Analysis */}
      <MarketStats stats={marketStats} />

      {/* 2. Trade Entry */}
      <TradePanel 
        currentPrice={currentPrice} 
        onPlacePrediction={onPlacePrediction}
      />

      {/* 3. Active User Positions (Terminal Style) */}
      <div className="flex-1 min-h-[150px] bg-[#020202] border border-white/[0.06] rounded-sm p-4 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
             <Terminal size={12} className="text-zinc-600" />
             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">User_Logs</span>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
            {activePredictions.length === 0 ? (
                <div className="text-[10px] text-zinc-800 font-mono italic p-2">
                    // Waiting for orders...
                </div>
            ) : (
                activePredictions.map((pred) => (
                    <div key={pred.id} className="text-[10px] font-mono p-2 border-l-2 border-white/[0.1] bg-white/[0.02] mb-1 hover:bg-white/[0.04] transition-colors group">
                        <div className="flex justify-between mb-1">
                             <span className={`font-bold ${pred.direction === PredictionDirection.CALL ? 'text-[#00C896]' : 'text-[#FF3333]'}`}>
                                {pred.direction}
                             </span>
                             <span className="text-zinc-600 group-hover:text-zinc-400">
                                #{pred.id}
                             </span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                             <span>@{pred.entryPrice.toFixed(2)}</span>
                             <span className={currentPrice > pred.entryPrice && pred.direction === 'CALL' ? 'text-zinc-300' : 'text-zinc-500'}>
                                {currentPrice.toFixed(2)}
                             </span>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;