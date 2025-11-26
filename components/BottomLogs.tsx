import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { NodeData } from '../types';

interface BottomLogsProps {
  nodes: NodeData[];
  lastConsensusTime: string;
}

const BottomLogs: React.FC<BottomLogsProps> = ({ nodes, lastConsensusTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#09090b] border-t border-white/[0.06] transition-all duration-300 ease-in-out z-40 font-mono ${isExpanded ? 'h-80' : 'h-8'}`}>
      {/* Toggle Header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-8 bg-[#020202] hover:bg-[#09090b] flex items-center justify-between px-4 border-b border-white/[0.06] transition-colors group"
      >
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
                <Terminal size={12} />
                <span className="text-[10px] font-bold tracking-wider uppercase">Node_Logs</span>
            </div>
            <span className="text-[10px] text-zinc-600">::</span>
            <span className="text-[10px] text-zinc-600">Last Consensus: <span className="text-zinc-400">{lastConsensusTime}</span></span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-600 group-hover:text-zinc-400 uppercase tracking-wider transition-colors">
            {isExpanded ? 'Minimize' : 'Expand'}
            {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </div>
      </button>

      {/* Content */}
      <div className="p-0 h-[calc(100%-32px)] overflow-hidden bg-[#050505]">
        <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-zinc-600 border-b border-white/[0.06] py-2 px-4 uppercase tracking-widest bg-white/[0.02]">
            <div className="col-span-3">Node ID</div>
            <div className="col-span-2">State</div>
            <div className="col-span-2">Ping</div>
            <div className="col-span-2">Weight</div>
            <div className="col-span-3 text-right">Output</div>
        </div>
        
        <div className="space-y-0 overflow-y-auto h-full pb-10 custom-scrollbar">
            {nodes.map((node, idx) => (
                <div key={node.id} className={`grid grid-cols-12 gap-4 items-center py-2 px-4 text-xs border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group font-mono ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.005]'}`}>
                    <div className="col-span-3 flex items-center gap-3">
                        <div className={`w-1 h-1 rounded-sm ${node.status === 'Active' ? 'bg-[#00C896]' : 'bg-amber-500'}`}></div>
                        <span className="text-zinc-400">{node.name}</span>
                        <span className="text-[9px] text-zinc-700">{node.id}</span>
                    </div>
                    <div className="col-span-2">
                        <span className={`inline-block text-[10px] uppercase ${
                            node.status === 'Active' ? 'text-[#00C896]' : node.status === 'Validating' ? 'text-amber-500' : 'text-[#FF3333]'
                        }`}>
                            {node.status}
                        </span>
                    </div>
                    <div className="col-span-2 text-zinc-500">
                        {node.latency}ms
                    </div>
                    <div className="col-span-2">
                        <div className="w-16 h-1 bg-zinc-800 rounded-none overflow-hidden">
                            <div className="h-full bg-zinc-500" style={{ width: `${node.weight * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="col-span-3 text-right text-zinc-300">
                        {node.lastReportedPrice.toFixed(4)}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BottomLogs;