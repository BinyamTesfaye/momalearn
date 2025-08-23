import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import your logo image
import logo from "../assets/erteban-logo.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={logo} 
            alt="Erteban Logo" 
            className="h-10 w-auto" 
          />
          <span className="text-xl md:text-2xl font-bold text-blue-900">Erteban</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
          <Link to="/campaigns" className="text-gray-700 hover:text-blue-600 transition-colors">Campaigns</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
          
          {/* Admin Link - Only shows for admin users */}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-red-600 font-medium hover:text-red-700 transition-colors">
              Admin Panel
            </Link>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Donate Button (always visible) */}
          <Link to="/donate" className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm md:text-base">
            Donate
          </Link>
          
          {/* User State */}
          {user ? (
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-gray-700">Hi, {user.name}</span>
              <div className="flex space-x-2">
                {user.role === "owner" && (
                  <Link to="/dashboard/owner" className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    My Dashboard
                  </Link>
                )}
                {user.role === "donor" && (
                  <Link to="/dashboard" className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    My Dashboard
                  </Link>
                )}
                <button 
                  onClick={logout} 
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/login" className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                Login
              </Link>
              <Link to="/signup" className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu (Dropdown) */}
      <div className="md:hidden bg-white border-t">
        <div className="container mx-auto px-4 py-3 space-y-3">
          <Link to="/" className="block text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-600 transition-colors">About</Link>
          <Link to="/campaigns" className="block text-gray-700 hover:text-blue-600 transition-colors">Campaigns</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
          
          {user?.role === "admin" && (
            <Link to="/admin" className="block text-red-600 font-medium hover:text-red-700 transition-colors">
              Admin Panel
            </Link>
          )}
          
          <div className="pt-3 border-t">
            {user ? (
              <div className="space-y-3">
                <div className="text-gray-700">Hi, {user.name}</div>
                <div className="flex space-x-2">
                  {user.role === "owner" && (
                    <Link to="/dashboard/owner" className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      My Dashboard
                    </Link>
                  )}
                  {user.role === "donor" && (
                    <Link to="/dashboard" className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      My Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={logout} 
                    className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-center text-sm">
                  Login
                </Link>
                <Link to="/signup" className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-center text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}