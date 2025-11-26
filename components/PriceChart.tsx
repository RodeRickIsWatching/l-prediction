import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricePoint } from '../types';

interface PriceChartProps {
  data: PricePoint[];
  color: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, color }) => {
  return (
    <div className="w-full h-full min-h-[250px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.1} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={true} horizontal={true} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            axisLine={false} 
            tickLine={false}
            minTickGap={40}
            dy={10}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right"
            tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(val) => val.toFixed(2)}
            dx={-10}
          />
          <Tooltip
            contentStyle={{ 
                backgroundColor: '#09090b', 
                borderColor: '#27272a', 
                borderRadius: '0px', 
                color: '#fff',
                fontFamily: 'JetBrains Mono',
                fontSize: '11px',
                padding: '6px 10px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: color }}
            formatter={(value: number) => [value.toFixed(2), 'Price']}
            labelStyle={{ color: '#71717a', marginBottom: '4px' }}
            cursor={{ stroke: '#52525b', strokeWidth: 1 }}
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            isAnimationActive={false} 
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;