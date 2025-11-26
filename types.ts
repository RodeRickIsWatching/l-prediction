
export interface PricePoint {
  time: string;
  value: number;
}

export enum PredictionDirection {
  CALL = 'CALL',
  PUT = 'PUT'
}

export enum PredictionStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SETTLED_WIN = 'Settled (Win)',
  SETTLED_LOSS = 'Settled (Loss)'
}

export interface NodeData {
  id: string;
  name: string;
  status: 'Active' | 'Idle' | 'Validating';
  latency: number; // ms
  weight: number;
  lastReportedPrice: number;
}

export interface UserPrediction {
  id: string;
  direction: PredictionDirection;
  entryPrice: number;
  targetPrice?: number; // Optional visual target
  amount: number;
  status: PredictionStatus;
  timestamp: number;
  settleTime: number;
}

export interface SettlementLog {
  id: string;
  user: string;
  result: 'Win' | 'Loss';
  payout: number;
  timestamp: string;
}

export interface TradeRecord {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell'; // buy = Call, sell = Put
  time: string;
}

export interface MarketStatsData {
  callRatio: number; // 0-100
  putRatio: number;  // 0-100
  volume24h: number;
  openInterest: number;
}
