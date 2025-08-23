import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import Donate from './pages/Donate';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';        // ✅ fixed
import Signup from './pages/Signup';      // ✅ fixed
import AdminLogin from './pages/AdminLogin'; // ✅ fixed

// Admin Pages
import AdminDashboard from './features/admin/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import ManageUsers from './features/admin/ManageUsers';
import ManageCampaigns from './features/admin/ManageCampaigns';
import ApproveWithdrawals from './features/admin/ApproveWithdrawals';
import Analytics from './features/admin/Analytics';
import FraudDetection from './features/admin/FraudDetection';
import ContentModeration from './features/admin/ContentModeration';
import SystemSettings from './features/admin/SystemSettings';

// UI Components
import ParticlesBackground from './components/ui/ParticlesBackground';
import GradientOverlay from './components/ui/GradientOverlay';
import ErrorBoundary from './components/ui/ErrorBoundary';

export default function App() {
  useEffect(() => {
    // Add futuristic cursor effect
    try {
      const cursor = document.createElement('div');
      cursor.className = 'futuristic-cursor';
      document.body.appendChild(cursor);
      
      const moveCursor = (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      };
      
      document.addEventListener('mousemove', moveCursor);
      
      return () => {
        document.removeEventListener('mousemove', moveCursor);
        if (document.body.contains(cursor)) {
          document.body.removeChild(cursor);
        }
      };
    } catch (error) {
      console.error('Cursor effect error:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="futuristic-theme min-h-screen flex flex-col">
        <ParticlesBackground />
        <GradientOverlay />
        
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="campaigns" element={<ManageCampaigns />} />
              <Route path="withdrawals" element={<ApproveWithdrawals />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="fraud-detection" element={<FraudDetection />} />
              <Route path="content-moderation" element={<ContentModeration />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
