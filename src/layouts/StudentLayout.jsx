// src/layouts/StudentLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4 pt-20">
        <h2 className="text-xl font-bold">Student</h2>
        <nav className="space-y-2">
          <NavLink to="/student" end className="block hover:text-yellow-400">
            Dashboard
          </NavLink>
          <NavLink to="/student/my-courses" className="block hover:text-yellow-400">
            My Courses
          </NavLink>
          <NavLink to="/student/profile" className="block hover:text-yellow-400">
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
