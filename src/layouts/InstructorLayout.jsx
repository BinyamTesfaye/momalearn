// src/layouts/InstructorLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function InstructorLayout() {
  return (
    <div className="flex  min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white pt-20 pl-20 space-y-4">
        <h2 className="text-xl font-bold">Instructor</h2>
        <nav className="space-y-2">
          <NavLink to="/instructor" end className="block hover:text-blue-400">
            Dashboard
          </NavLink>
          {/* Additional links for instructor functionalities 
          <NavLink to="/instructor/create" className="block hover:text-blue-400">
            Create Course
          </NavLink>
          
          <NavLink to="/instructor/edit" className="block hover:text-blue-400">
            Edit Course
          </NavLink>
          */}
          <NavLink
            to="/instructor/profile"
            className="block hover:text-blue-400"
          >

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
