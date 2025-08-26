// Save as: src/features/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [{ data: users }, { data: courses }, { data: enrollments }] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('enrollments').select('id', { count: 'exact' }),
      ]);
      if (mounted) setStats({ users: users?.length ?? 0, courses: courses?.length ?? 0, enrollments: enrollments?.length ?? 0 });
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">Users: {stats.users}</div>
        <div className="p-4 border rounded">Courses: {stats.courses}</div>
        <div className="p-4 border rounded">Enrollments: {stats.enrollments}</div>
      </div>
      <div className="mt-4 space-x-2">
        <Link to="/admin/users" className="text-indigo-600">Manage Users</Link>
        <Link to="/admin/courses" className="text-indigo-600">Manage Courses</Link>
      </div>
    </div>
  );
}
