import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHandHoldingUsd, FaChartLine, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import SummaryCard from './components/SummaryCard';
import ActivityFeed from './components/ActivityFeed';
import { adminAPI } from '../../utils/api';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [metricsData, activityData] = await Promise.all([
          adminAPI.getPlatformMetrics(),
          adminAPI.getRecentActivity()
        ]);
        
        setMetrics(metricsData);
        setRecentActivity(activityData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="glass p-8 rounded-3xl flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-8 rounded-3xl">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  const handleAction = (path) => {
    navigate(path);
  };

  return (
    <div className="glass p-8 rounded-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Admin Overview
        </h1>
        <p className="text-gray-400 mt-2">Monitor platform activity, approve campaigns, and manage transactions</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard 
          icon={<FaUsers className="text-3xl text-primary" />}
          title="Total Users"
          value={metrics?.totalUsers}
          change="+12% this month"
          onClick={() => handleAction('/admin/users')}
        />
        
        <SummaryCard 
          icon={<FaHandHoldingUsd className="text-3xl text-secondary" />}
          title="Total Donations"
          value={metrics?.totalDonations ? `$${metrics.totalDonations.toLocaleString()}` : null}
          change="+8% this week"
        />
        
        <SummaryCard 
          icon={<FaChartLine className="text-3xl text-accent" />}
          title="Active Campaigns"
          value={metrics?.activeCampaigns}
          change="+5 new today"
          onClick={() => handleAction('/admin/campaigns')}
        />
        
        <SummaryCard 
          title="Pending Approvals"
          value={metrics?.pendingApprovals}
          icon={<FaClock className="text-3xl text-yellow-400" />}
          path="/admin/campaigns?status=pending"
          btnText="Review Campaigns"
          highlight={metrics?.pendingApprovals > 0}
        />
        
        <SummaryCard 
          title="Withdrawal Requests"
          value={metrics?.pendingWithdrawals}
          icon={<FaCheckCircle className="text-3xl text-green-400" />}
          path="/admin/withdrawals"
          btnText="Process Requests"
          highlight={metrics?.pendingWithdrawals > 0}
        />
        
        <SummaryCard 
          title="Flagged Content"
          value={metrics?.flaggedContent}
          icon={<FaExclamationTriangle className="text-3xl text-red-400" />}
          path="/admin/content-moderation"
          btnText="Investigate"
          highlight={metrics?.flaggedContent > 0}
        />
      </div>

      {/* Recent Activity */}
      <ActivityFeed activities={recentActivity} />
    </div>
  );
}