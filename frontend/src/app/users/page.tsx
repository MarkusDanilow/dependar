'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Users, Loader2, UserCircle, Edit, Trash2, Plus } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to deactivate this mapped administrator?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="text-amber-500" /> User Directory</h1>
          <p className="text-slate-400 mt-1">Manage Role Based Access Control (RBAC) and credentials.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <tr>
              <th className="px-6 py-4">Email Account</th>
              <th className="px-6 py-4">Security Role</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-700/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-6 h-6 text-slate-500" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${user.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-blue-400 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
