// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/momalogo.png";

export default function Navbar() {
  const { profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userRole = profile?.role;

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Moma Logo" className="h-10 w-auto" />
          <span className="text-xl md:text-2xl font-bold text-blue-900">MOMA</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">Courses</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {profile ? (
            <div className="hidden md:flex items-center space-x-4">
              {/* Role-specific Dashboard */}
              {userRole === "student" && (
                <Link to="/student" className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  My courses
                </Link>
              )}
              {userRole === "instructor" && (
                <Link to="/instructor" className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Instructor Panel
                </Link>
              )}

              {/* Profile Circle */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <img src={profile.profile_image || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block">
                 {/* Profile and Logout 
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile / Settings</Link>
                  */}
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/login" className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">Login</Link>
              <Link to="/signup" className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Show/hide based on state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/courses" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
            <Link to="/about" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            {profile ? (
              <div className="pt-3 border-t space-y-2">
                {userRole === "student" && (
                  <Link to="/student" className="block bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                )}
                {userRole === "instructor" && (
                  <Link to="/instructor" className="block bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 text-sm" onClick={() => setMobileMenuOpen(false)}>Instructor Panel</Link>
                )}
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>Profile / Settings</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Logout</button>
              </div>
            ) : (
              <div className="flex space-x-2 pt-3 border-t">
                <Link to="/login" className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 text-center text-sm" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 text-center text-sm" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}