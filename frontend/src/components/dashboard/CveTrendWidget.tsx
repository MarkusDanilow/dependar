import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export function CveTrendWidget() {
  // Mock data for weekly trends
  const data = [
    { name: 'Mon', new: 2, resolved: 0 },
    { name: 'Tue', new: 5, resolved: 2 },
    { name: 'Wed', new: 1, resolved: 4 },
    { name: 'Thu', new: 3, resolved: 1 },
    { name: 'Fri', new: 0, resolved: 5 },
    { name: 'Sat', new: 1, resolved: 0 },
    { name: 'Sun', new: 0, resolved: 2 },
  ];

  return (
    <div className="w-full h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#94A3B8' }}
          />
          <Line type="monotone" dataKey="new" stroke="#EF4444" strokeWidth={3} dot={{ r: 3, fill: '#EF4444', strokeWidth: 0 }} />
          <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
