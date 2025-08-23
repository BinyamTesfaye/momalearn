import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
      <aside className="bg-white border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        <nav className="space-y-2">
          <NavLink to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Donor</NavLink>
          <NavLink to="/dashboard/owner" className="block px-3 py-2 rounded hover:bg-gray-100">Campaign Owner</NavLink>
        </nav>
      </aside>
      <main className="p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
