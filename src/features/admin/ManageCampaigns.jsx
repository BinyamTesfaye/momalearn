import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPlus, FaChartLine, FaBan, FaCheck } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';
import CampaignCard from '../../components/CampaignCard';
import CampaignFilters from './components/CampaignFilters';

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'newest',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getCampaigns(filters);
        setCampaigns(data);
      } catch (err) {
        setError('Failed to load campaigns');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const toggleCampaignStatus = async (campaignId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await adminAPI.updateCampaign(campaignId, { status: newStatus });
      
      setCampaigns(campaigns.map(camp => 
        camp.id === campaignId ? { ...camp, status: newStatus } : camp
      ));
    } catch (err) {
      setError(`Failed to update campaign status: ${err.message}`);
    }
  };

  return (
    <div className="glass p-8 rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Manage Campaigns
          </h1>
          <p className="text-gray-400 mt-2">Review and manage all fundraising campaigns</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <CampaignFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-futuristic">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6 mb-3"></div>
                <div className="h-2 bg-gray-700 rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id}
              campaign={campaign}
              onToggleStatus={toggleCampaignStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No campaigns found matching your filters
        </div>
      )}
    </div>
  );
}