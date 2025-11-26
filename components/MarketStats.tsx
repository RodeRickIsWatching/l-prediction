import React from 'react';
import { MarketStatsData } from '../types';
import { BarChart3, Users } from 'lucide-react';

interface MarketStatsProps {
  stats: MarketStatsData;
}

const MarketStats: React.FC<MarketStatsProps> = ({ stats }) => {
  return (
    <div className="bg-[#050505] border border-white/[0.06] rounded-sm p-4 font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
        <div className="flex items-center gap-2">
            <Users size={12} />
            <span>Market_Sentiment</span>
        </div>
        <span>24H</span>
      </div>

      {/* Ratio Bar */}
      <div className="mb-2 flex justify-between text-xs font-bold">
        <span className="text-[#00C896]">{stats.callRatio}% Calls</span>
        <span className="text-[#FF3333]">{stats.putRatio}% Puts</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-xs flex overflow-hidden">
        <div 
            className="h-full bg-[#00C896] shadow-[0_0_10px_rgba(0,200,150,0.3)] transition-all duration-1000 ease-in-out" 
            style={{ width: `${stats.callRatio}%` }}
        ></div>
        <div 
            className="h-full bg-[#FF3333] shadow-[0_0_10px_rgba(255,51,51,0.3)] transition-all duration-1000 ease-in-out" 
            style={{ width: `${stats.putRatio}%` }}
        ></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4 border-t border-white/[0.06] pt-3">
        <div>
            <span className="block text-[9px] text-zinc-600 uppercase mb-1">24h Vol</span>
            <span className="block text-xs text-zinc-300 font-mono tracking-wide">
                ${(stats.volume24h / 1000000).toFixed(2)}M
            </span>
        </div>
        <div className="text-right">
            <span className="block text-[9px] text-zinc-600 uppercase mb-1">Open Interest</span>
            <span className="block text-xs text-zinc-300 font-mono tracking-wide">
                ${(stats.openInterest / 1000).toFixed(2)}K
            </span>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;