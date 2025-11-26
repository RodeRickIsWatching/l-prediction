
import React from 'react';
import { TradeRecord } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OrderBookProps {
  trades: TradeRecord[];
}

const OrderBook: React.FC<OrderBookProps> = ({ trades }) => {
  return (
    <div className="bg-[#050505] border border-white/[0.06] rounded-sm flex flex-col h-full font-mono overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-white/[0.06] bg-white/[0.01]">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-xs"></span>
            Recent_Trades
        </span>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] font-bold text-zinc-600 uppercase tracking-wider border-b border-white/[0.02]">
        <div className="col-span-4">Price</div>
        <div className="col-span-4 text-center">Side</div>
        <div className="col-span-4 text-right">Size</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {trades.map((trade) => (
            <div 
                key={trade.id} 
                className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group"
            >
                <div className={`col-span-4 font-mono font-medium ${trade.side === 'buy' ? 'text-[#00C896]' : 'text-[#FF3333]'}`}>
                    {trade.price.toFixed(2)}
                </div>
                <div className="col-span-4 text-center flex justify-center items-center">
                    <span className={`flex items-center gap-1 ${trade.side === 'buy' ? 'text-[#00C896]/70' : 'text-[#FF3333]/70'}`}>
                        {trade.side === 'buy' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {trade.side === 'buy' ? 'CALL' : 'PUT'}
                    </span>
                </div>
                <div className="col-span-4 text-right text-zinc-400 font-mono">
                    {trade.size.toFixed(2)}
                </div>
            </div>
        ))}
        {trades.length === 0 && (
            <div className="p-4 text-center text-[10px] text-zinc-700 italic">
                Waiting for market activity...
            </div>
        )}
      </div>
      
      {/* Footer Status */}
      <div className="p-2 border-t border-white/[0.06] bg-white/[0.01] flex justify-between items-center text-[9px] text-zinc-600">
         <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-[#00C896] rounded-full animate-pulse"></span>
            LIVE FEED
         </span>
         <span>Spread: 0.00</span>
      </div>
    </div>
  );
};

export default OrderBook;
