import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function GlobalHealthChart({ critical, high, medium }: { critical: number; high: number; medium: number }) {
  const safe = Math.max(0, 100 - (critical * 5 + high * 2 + medium)); // Mock algo
  const data = [
    { name: 'Safe', value: safe, color: '#10B981' },
    { name: 'Warning', value: high + medium, color: '#F59E0B' },
    { name: 'Critical', value: critical, color: '#EF4444' },
  ];

  const score = Math.max(0, 100 - (critical * 10 + high * 5 + medium * 2));

  return (
    <div className="relative w-full h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#F8FAFC' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="text-2xl font-black text-slate-100">{score}</span>
        </div>
      </div>
    </div>
  );
}
