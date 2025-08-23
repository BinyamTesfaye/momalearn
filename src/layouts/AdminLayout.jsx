import React, { useEffect } from "react";
import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaUsers, FaHandHoldingUsd, FaChartLine, FaShieldAlt, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function AdminLayout() {
  const { user, loading, logout, hasRole } = useAuth();
  const location = useLocation();

  // Redirect non-admins immediately
  if (!loading && (!user || !hasRole('admin'))) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  const handleLogout = () => {
    logout();
    return <Navigate to="/adminlogin" replace />;
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr] bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
            <span className="font-bold">A</span>
          </div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="space-y-1 flex-grow">
          <NavLink 
            to="/admin" 
            end
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border-l-4 border-blue-400" 
                  : "text-gray-400 hover:bg-gray-700/50"
              }`
            }
          >
            <FaHome className="mr-3" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border-l-4 border-blue-400" 
                  : "text-gray-400 hover:bg-gray-700/50"
              }`
            }
          >
            <FaUsers className="mr-3" />
            <span>Manage Users</span>
          </NavLink>
          
          <NavLink 
            to="/admin/campaigns" 
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border-l-4 border-blue-400" 
                  : "text-gray-400 hover:bg-gray-700/50"
              }`
            }
          >
            <FaChartLine className="mr-3" />
            <span>Manage Campaigns</span>
          </NavLink>
          
          <NavLink 
            to="/admin/withdrawals" 
            className={({isActive}) => 
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border-l-4 border-blue-400" 
                  : "text-gray-400 hover:bg-gray-700/50"
              }`
            }
          >
            <FaHandHoldingUsd className="mr-3" />
            <span>Approve Withdrawals</span>
          </NavLink>
          
          <div className="pt-4 mt-4 border-t border-gray-700">
            <NavLink 
              to="/admin/fraud-detection" 
              className={({isActive}) => 
                `flex items-center px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border-l-4 border-blue-400" 
                    : "text-gray-400 hover:bg-gray-700/50"
                }`
              }
            >
              <FaShieldAlt className="mr-3" />
              <span>Security</span>
            </NavLink>
            
            <NavLink 
              to="/admin/settings" 
              className={({isActive}) => 
                `flex items-center px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border-l-4 border-blue-400" 
                    : "text-gray-400 hover:bg-gray-700/50"
                }`
              }
            >
              <FaCog className="mr-3" />
              <span>System Settings</span>
            </NavLink>
          </div>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}