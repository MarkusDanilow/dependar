import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function TechOverviewChart({ techGroups }: { techGroups: { name: string, count: number }[] }) {
  const sorted = [...techGroups].sort((a, b) => b.count - a.count).slice(0, 5); // top 5
  
  return (
    <div className="w-full h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#F8FAFC' }}
            cursor={{ fill: '#334155', opacity: 0.4 }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
            {sorted.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#64748B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
