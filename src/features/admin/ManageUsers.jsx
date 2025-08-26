// Save as: src/features/admin/ManageUsers.jsx
import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => { (async () => {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setUsers(data ?? []);
  })(); }, []);

  async function changeRole(id, role) {
    await supabase.from('users').update({ role }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Manage Users</h1>
      <div className="mt-4 space-y-2">
        {users.map(u => (
          <div key={u.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{u.full_name} ({u.email})</div>
              <div className="text-xs text-gray-500">Role: {u.role}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => changeRole(u.id, 'student')} className="text-sm">Student</button>
              <button onClick={() => changeRole(u.id, 'instructor')} className="text-sm">Instructor</button>
              <button onClick={() => changeRole(u.id, 'admin')} className="text-sm">Admin</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
