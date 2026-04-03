'use client';

import { useState, useMemo } from 'react';
import { Users, Loader2, UserCircle, Edit, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser, User } from '@/hooks/useUsers';
import { UserForm, UserFormData } from '@/components/forms/UserForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import toast from 'react-hot-toast';

type SortField = 'email' | 'createdAt' | 'name';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
  return sortDir === 'asc'
    ? <ArrowUp className="w-3.5 h-3.5 ml-1 text-blue-400" />
    : <ArrowDown className="w-3.5 h-3.5 ml-1 text-blue-400" />;
}

export default function UsersPage() {
  const { data: usersResponse, isLoading } = useGetUsers();
  const users: User[] = (usersResponse as any)?.data || usersResponse || [];

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [sortField, setSortField] = useState<SortField>('email');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const lowSearch = searchQuery.toLowerCase();
    return users.filter(u => 
      u.email.toLowerCase().includes(lowSearch) || 
      (u.firstName && u.firstName.toLowerCase().includes(lowSearch)) ||
      (u.lastName && u.lastName.toLowerCase().includes(lowSearch))
    );
  }, [users, searchQuery]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aVal: string;
      let bVal: string;
      if (sortField === 'email') {
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
      } else if (sortField === 'name') {
        aVal = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
        bVal = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
      } else {
        aVal = a.createdAt || '';
        bVal = b.createdAt || '';
      }
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [users, sortField, sortDir]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, ...data },
        {
          onSuccess: () => {
            toast.success('Benutzer erfolgreich aktualisiert');
            setIsModalOpen(false);
          },
          onError: (err: any) => toast.error(err.message || 'Fehler beim Aktualisieren'),
        }
      );
    } else {
      createUser.mutate(data as Partial<User>, {
        onSuccess: () => {
          toast.success('Benutzer erfolgreich erstellt');
          setIsModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || 'Fehler beim Erstellen'),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success('Benutzer erfolgreich gelöscht');
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      },
      onError: (err: any) => toast.error(err.message || 'Fehler beim Löschen'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const thClass = 'px-6 py-4 cursor-pointer select-none hover:text-slate-200 transition-colors';

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-amber-500" /> Benutzerverzeichnis
          </h1>
          <p className="text-slate-400 mt-1">Verwalte rollenbasierte Zugriffskontrolle (RBAC) und Anmeldedaten.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Benutzer suchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Benutzer hinzufügen
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        {users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Noch keine Benutzer vorhanden.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th
                  className={thClass}
                  onClick={() => handleSort('email')}
                >
                  <span className="flex items-center">
                    E-Mail-Konto
                    <SortIcon field="email" sortField={sortField} sortDir={sortDir} />
                  </span>
                </th>
                <th
                  className={thClass}
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center">
                    Name
                    <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                  </span>
                </th>
                <th className="px-6 py-4">Sicherheitsrolle</th>
                <th
                  className={thClass}
                  onClick={() => handleSort('createdAt')}
                >
                  <span className="flex items-center">
                    Erstellt am
                    <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} />
                  </span>
                </th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {sortedUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-200">
                    <div className="flex items-center gap-3">
                      <UserCircle className="w-6 h-6 text-slate-500" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {user.firstName || user.lastName
                      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                      : <span className="text-slate-600 italic">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      user.role === 'ADMIN'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit', month: '2-digit', year: 'numeric'
                    }) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 p-1.5 rounded transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(user)}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer anlegen'}
      >
        <UserForm
          initialData={editingUser}
          onSubmit={handleSubmit}
          isLoading={createUser.isPending || updateUser.isPending}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Benutzer löschen"
        message={`Bist du sicher, dass du den Benutzer "${userToDelete?.email}" löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.`}
        isDeleting={deleteUser.isPending}
      />
    </div>
  );
}
