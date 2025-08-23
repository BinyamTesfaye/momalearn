import React from 'react';
import { FaPercentage, FaMoneyBillWave, FaGlobe, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

const SettingsForm = ({ settings, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="space-y-6">
      {/* Platform Fee */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center mb-4">
          <FaPercentage className="text-blue-400 mr-3" />
          <h3 className="text-xl font-bold">Platform Fees</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Platform Fee (%)</label>
            <div className="relative">
              <input
                type="number"
                name="platformFee"
                min="0"
                max="20"
                step="0.5"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={settings.platformFee}
                onChange={handleInputChange}
              />
              <div className="absolute left-3 top-3.5 text-gray-500">%</div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Minimum Withdrawal ($)</label>
            <div className="relative">
              <input
                type="number"
                name="minWithdrawal"
                min="1"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={settings.minWithdrawal}
                onChange={handleInputChange}
              />
              <FaMoneyBillWave className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Currency Settings */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center mb-4">
          <FaGlobe className="text-green-400 mr-3" />
          <h3 className="text-xl font-bold">Currency & Localization</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Default Currency</label>
            <select
              name="currency"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={settings.currency}
              onChange={handleInputChange}
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="CAD">Canadian Dollar (CAD)</option>
              <option value="AUD">Australian Dollar (AUD)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Date Format</label>
            <select
              name="dateFormat"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={settings.dateFormat}
              onChange={handleInputChange}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Automation Settings */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-purple-400 mr-3" />
          <h3 className="text-xl font-bold">Automation Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Auto-approve Campaigns</h4>
              <p className="text-gray-400 text-sm">New campaigns will be automatically approved</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                name="autoApproveCampaigns"
                checked={settings.autoApproveCampaigns}
                onChange={handleInputChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Email Notifications</h4>
              <p className="text-gray-400 text-sm">Send email notifications for admin activities</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Security Settings */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center mb-4">
          <FaShieldAlt className="text-yellow-400 mr-3" />
          <h3 className="text-xl font-bold">Security Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Fraud Detection</h4>
              <p className="text-gray-400 text-sm">Enable automated fraud detection system</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                name="fraudDetectionEnabled"
                checked={settings.fraudDetectionEnabled}
                onChange={handleInputChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Two-Factor Authentication</h4>
              <p className="text-gray-400 text-sm">Require 2FA for admin accounts</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                name="require2FA"
                checked={settings.require2FA}
                onChange={handleInputChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              name="sessionTimeout"
              min="5"
              max="120"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={settings.sessionTimeout}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;