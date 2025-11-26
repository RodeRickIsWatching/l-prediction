
import React, { useState, useEffect, useRef } from 'react';
import { Box } from 'lucide-react';
import PriceChart from './components/PriceChart';
import BottomLogs from './components/BottomLogs';
import ConsensusTooltip from './components/ConsensusTooltip';
import RightSidebar from './components/RightSidebar';
import OrderBook from './components/OrderBook'; // This now renders Recent Trades
import { PricePoint, NodeData, UserPrediction, PredictionDirection, PredictionStatus, SettlementLog, MarketStatsData, TradeRecord } from './types';
import { MOCK_NODES, INITIAL_PRICE } from './constants';

// Helper for random walk
const generateNextPrice = (current: number) => {
  const change = (Math.random() - 0.5) * 2; // -1 to +1
  return current + change;
};

const App: React.FC = () => {
  // --- State ---
  const [currentPrice, setCurrentPrice] = useState<number>(INITIAL_PRICE);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>(MOCK_NODES);
  const [predictions, setPredictions] = useState<UserPrediction[]>([]);
  const [settlements, setSettlements] = useState<SettlementLog[]>([]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  // New Market Data State
  const [marketStats, setMarketStats] = useState<MarketStatsData>({
    callRatio: 55,
    putRatio: 45,
    volume24h: 12540000,
    openInterest: 84300
  });
  
  // Replaced OrderBook state with Recent Trades
  const [recentTrades, setRecentTrades] = useState<TradeRecord[]>([]);

  // Refs for managing intervals cleanly
  const priceRef = useRef(INITIAL_PRICE);

  // --- Initialization ---
  useEffect(() => {
    // Generate initial history
    const history: PricePoint[] = [];
    let price = INITIAL_PRICE;
    const now = Date.now();
    for (let i = 50; i > 0; i--) {
      history.push({
        time: new Date(now - i * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' }),
        value: price
      });
      price = generateNextPrice(price);
    }
    setPriceHistory(history);
    priceRef.current = price;
    setCurrentPrice(price);
    
    // Initial trades
    const initialTrades: TradeRecord[] = [];
    for(let i=0; i<15; i++) {
        initialTrades.push({
            id: Math.random().toString(36).substr(2, 9),
            price: price + (Math.random() - 0.5) * 2,
            size: Math.random() * 500 + 50,
            side: Math.random() > 0.5 ? 'buy' : 'sell',
            time: new Date(now - i * 2000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })
        });
    }
    setRecentTrades(initialTrades);
  }, []);

  // --- Market Simulation Loop (The Heartbeat) ---
  useEffect(() => {
    const interval = setInterval(() => {
      const prevPrice = priceRef.current;
      const newPrice = generateNextPrice(prevPrice);
      priceRef.current = newPrice;
      
      const nowStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // 1. Update Price
      setCurrentPrice(newPrice);
      setPriceDirection(newPrice > prevPrice ? 'up' : 'down');
      
      // 2. Update History (Rolling window)
      setPriceHistory(prev => {
        const newHist = [...prev, { time: nowStr, value: newPrice }];
        return newHist.slice(-60); // Keep last 60 points
      });

      // 3. Update Nodes (Simulate variance from consensus)
      setNodes(prevNodes => prevNodes.map(node => ({
        ...node,
        lastReportedPrice: newPrice + (Math.random() - 0.5) * 0.1, // Slight variance
        latency: Math.floor(20 + Math.random() * 50)
      })));

      // 4. Generate Random Market Trades (Simulate global activity)
      if (Math.random() > 0.4) {
          const newTrade: TradeRecord = {
              id: Math.random().toString(36).substr(2, 9),
              price: newPrice,
              size: Math.random() * 1000 + 100,
              side: Math.random() > 0.5 ? 'buy' : 'sell', // buy=Call, sell=Put
              time: nowStr
          };
          setRecentTrades(prev => [newTrade, ...prev].slice(0, 25)); // Keep last 25
      }
      
      // Update stats occasionally
      if (Math.random() > 0.8) {
         setMarketStats(prev => ({
             ...prev,
             volume24h: prev.volume24h + Math.floor(Math.random() * 1000),
             // Randomly fluctuate ratios slightly
             callRatio: Math.min(90, Math.max(10, prev.callRatio + (Math.random() - 0.5) * 2)),
             putRatio: 100 - Math.min(90, Math.max(10, prev.callRatio + (Math.random() - 0.5) * 2))
         }));
      }

      // 5. Check Predictions (Hook Settlements)
      setPredictions(prevPreds => {
        return prevPreds.map(p => {
            if (p.status !== PredictionStatus.PENDING) return p;

            // Simple logic: if 10 seconds passed, settle it
            // In a real app, this would be based on target time or price
            const isReadyToSettle = Date.now() - p.timestamp > 5000; // 5s simulation
            
            if (isReadyToSettle) {
                const isWin = (p.direction === PredictionDirection.CALL && newPrice > p.entryPrice) ||
                              (p.direction === PredictionDirection.PUT && newPrice < p.entryPrice);
                
                const finalStatus = isWin ? PredictionStatus.SETTLED_WIN : PredictionStatus.SETTLED_LOSS;
                
                // Add to settlement log
                const newLog: SettlementLog = {
                    id: Math.random().toString(36).substr(2, 9),
                    user: 'Current User',
                    result: isWin ? 'Win' : 'Loss',
                    payout: isWin ? p.amount * 1.8 : 0,
                    timestamp: nowStr
                };
                setSettlements(s => [newLog, ...s].slice(0, 5)); // Keep recent 5

                return { ...p, status: finalStatus, settleTime: Date.now() };
            }
            return p;
        });
      });

    }, 1000); // 1-second Tick

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handlePrediction = (direction: PredictionDirection, amount: number) => {
    const newPrediction: UserPrediction = {
        id: Math.random().toString(36).substr(2, 9),
        direction,
        entryPrice: currentPrice,
        amount,
        status: PredictionStatus.PENDING,
        timestamp: Date.now(),
        settleTime: 0
    };
    setPredictions(prev => [newPrediction, ...prev]);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-transparent text-zinc-300 font-sans overflow-hidden flex flex-col selection:bg-white/20">
      
      {/* Header - Minimal Command Bar */}
      <header className="h-14 border-b border-white/[0.06] flex items-center px-6 justify-between bg-[#020202] z-50 shrink-0">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
                <Box size={18} strokeWidth={2} />
                <span className="text-sm font-bold tracking-[0.2em]">LYQUOR</span>
            </div>
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <div className="flex gap-6 text-[11px] font-mono font-medium text-zinc-500">
                <span className="hover:text-white cursor-pointer transition-colors text-white">DASHBOARD</span>
                <span className="hover:text-white cursor-pointer transition-colors">NODES</span>
                <span className="hover:text-white cursor-pointer transition-colors">DOCS</span>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-xs">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-mono text-emerald-500 tracking-wider">MAINNET_A</span>
            </div>
            <button className="text-[11px] font-mono font-bold bg-white text-black px-4 py-1.5 rounded-xs hover:bg-zinc-200 transition-colors">
                CONNECT_WALLET
            </button>
        </div>
      </header>

      {/* Main Content (Flex Column) */}
      <main className="flex-1 p-6 flex flex-col gap-6 max-w-[1800px] mx-auto w-full h-[calc(100vh-56px)] pb-12">
        
        {/* Top Section: Price Header (Full Width) */}
        {/* By moving this out of the columns, the columns below (Chart vs Sidebar) will naturally start at the same vertical height */}
        <div className="flex justify-between items-end border-b border-white/[0.06] pb-6 shrink-0 min-h-[80px]">
            <div className="relative">
                <div 
                    className="group cursor-help inline-block"
                    onMouseEnter={() => setIsTooltipOpen(true)}
                    onMouseLeave={() => setIsTooltipOpen(false)}
                >
                    <div className="flex items-center gap-2 mb-2 text-zinc-500">
                        <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest">BTC-USD Oracle</h2>
                        <span className="text-[10px] px-1 bg-white/10 text-zinc-300 rounded-xs font-mono">V2.1</span>
                    </div>
                    
                    <div className="flex items-baseline gap-4">
                        <span className={`text-6xl font-mono font-medium tracking-tighter ${
                            priceDirection === 'up' ? 'text-white' : priceDirection === 'down' ? 'text-white' : 'text-white'
                        }`}>
                            {currentPrice.toFixed(2)}
                        </span>
                        <div className={`flex flex-col items-start ${priceDirection === 'up' ? 'text-[#00C896]' : 'text-[#FF3333]'}`}>
                            <span className="text-xl font-mono">
                                {priceDirection === 'up' ? '↗' : '↘'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Tooltip */}
                    {isTooltipOpen && (
                        <ConsensusTooltip nodes={nodes} consensusPrice={currentPrice} />
                    )}
                </div>
            </div>

            {/* Recent Settlements (Hooks) */}
            <div className="flex gap-2">
                {settlements.map((settlement) => (
                    <div key={settlement.id} className="hidden md:flex flex-col justify-center px-4 h-12 border-l border-white/[0.06] bg-transparent animate-in fade-in slide-in-from-bottom-2">
                        <span className={`text-[10px] font-mono font-bold uppercase ${settlement.result === 'Win' ? 'text-[#00C896]' : 'text-zinc-600'}`}>
                            {settlement.result}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                            {settlement.result === 'Win' ? `+$${settlement.payout.toFixed(0)}` : '-$100'}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Content Row: Grid Split */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            
            {/* Left Column: Chart & Trades */}
            <div className="col-span-12 lg:col-span-9 h-full min-h-0 flex gap-4">
                {/* Chart Container */}
                <div className="flex-1 bg-[#050505] rounded-sm border border-white/[0.06] p-1 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-8 flex items-center justify-end px-4 gap-2 z-10 border-b border-white/[0.03] bg-[#050505]/50 backdrop-blur-sm">
                        {['1M', '5M', '15M', '1H'].map(tf => (
                            <button key={tf} className={`px-2 py-0.5 text-[10px] font-mono rounded-xs transition-colors ${tf === '1M' ? 'text-white bg-white/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
                                {tf}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 flex-1">
                        <PriceChart 
                            data={priceHistory} 
                            color={priceDirection === 'up' || priceDirection === 'neutral' ? '#00C896' : '#FF3333'} 
                        />
                    </div>
                </div>

                {/* Recent Trades Column */}
                <div className="hidden md:block w-[260px] shrink-0 h-full">
                     <OrderBook trades={recentTrades} />
                </div>
            </div>

            {/* Right Column: Analysis, Order Entry, Holdings */}
            <div className="col-span-12 lg:col-span-3 h-full min-h-0">
                 <RightSidebar 
                    currentPrice={currentPrice} 
                    marketStats={marketStats}
                    userPredictions={predictions}
                    onPlacePrediction={handlePrediction} 
                />
            </div>

        </div>
      </main>

      {/* Bottom Collapsible Logs */}
      <BottomLogs 
        nodes={nodes} 
        lastConsensusTime={priceHistory[priceHistory.length - 1]?.time || '--:--:--'} 
      />
    </div>
  );
};

export default App;
