import React from 'react';
import { NodeData } from '../types';
import { Activity, ShieldCheck } from 'lucide-react';

interface ConsensusTooltipProps {
  nodes: NodeData[];
  consensusPrice: number;
}

const ConsensusTooltip: React.FC<ConsensusTooltipProps> = ({ nodes, consensusPrice }) => {
  return (
    <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-[#09090b] border border-white/10 shadow-2xl p-0 transform transition-all duration-200 ease-out origin-top-left animate-in fade-in slide-in-from-top-2 font-mono rounded-none">
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/[0.02]">
        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck size={12} className="text-[#00C896]" />
          Consensus Proof
        </h4>
        <span className="text-[#00C896] text-xs">{(consensusPrice).toFixed(2)}</span>
      </div>

      <div className="p-2 space-y-px">
        {nodes.map((node) => (
          <div key={node.id} className="flex items-center justify-between text-xs p-1.5 hover:bg-white/5 transition-colors group border-l-2 border-transparent hover:border-zinc-500">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{node.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                {node.latency}ms
              </span>
              <span className={`${Math.abs(node.lastReportedPrice - consensusPrice) > 0.05 ? 'text-[#FF3333]' : 'text-zinc-400'}`}>
                {node.lastReportedPrice.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-white/10 flex justify-between items-center text-[10px] text-zinc-600 bg-black/20">
        <span className="flex items-center gap-1">
            <Activity size={10} />
            Aggregation
        </span>
        <span className="uppercase tracking-wide">Weighted Median</span>
      </div>
    </div>
  );
};

export default ConsensusTooltip;