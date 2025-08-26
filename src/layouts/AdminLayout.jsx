// src/layouts/AdminLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1 bg-white p-4 rounded shadow">
        <nav className="space-y-2">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/courses">Courses</Link>
          <Link to="/admin/campaigns">Campaigns</Link>
        </nav>
      </aside>

      <section className="md:col-span-3 bg-white p-4 rounded shadow">
        <Outlet />
      </section>
    </div>
  );
}
