import { NodeData } from './types';

export const INITIAL_PRICE = 2450.00;

export const MOCK_NODES: NodeData[] = [
  { id: 'n1', name: 'Alpha Oracle', status: 'Active', latency: 45, weight: 0.35, lastReportedPrice: INITIAL_PRICE },
  { id: 'n2', name: 'Beta Sentinel', status: 'Active', latency: 32, weight: 0.25, lastReportedPrice: INITIAL_PRICE },
  { id: 'n3', name: 'Gamma Relay', status: 'Validating', latency: 120, weight: 0.20, lastReportedPrice: INITIAL_PRICE },
  { id: 'n4', name: 'Delta Watch', status: 'Active', latency: 55, weight: 0.20, lastReportedPrice: INITIAL_PRICE },
];

export const TIME_FRAMES = [
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
  { label: '15m', value: 900 },
];