import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaSave } from 'react-icons/fa';
import SettingsForm from '../../components/admin/SettingsForm';
import { adminAPI } from '../../utils/api';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    platformFee: 5,
    minWithdrawal: 100,
    currency: 'USD',
    autoApproveCampaigns: false,
    fraudDetectionEnabled: true,
    emailNotifications: true,
    require2FA: false,
    sessionTimeout: 30,
    dateFormat: 'MM/DD/YYYY'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getSystemSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to load system settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (name, value) => {
    setSettings(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await adminAPI.updateSystemSettings(settings);
      setSuccess(true);
      setIsDirty(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      const defaultSettings = {
        platformFee: 5,
        minWithdrawal: 100,
        currency: 'USD',
        autoApproveCampaigns: false,
        fraudDetectionEnabled: true,
        emailNotifications: true,
        require2FA: false,
        sessionTimeout: 30,
        dateFormat: 'MM/DD/YYYY'
      };
      
      setSettings(defaultSettings);
      setIsDirty(true);
    }
  };

  if (loading) {
    return (
      <div className="glass p-8 rounded-3xl flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            System Configuration
          </h1>
          <p className="text-gray-400 mt-2">Configure platform settings and preferences</p>
        </div>
        
        <button 
          className="btn-futuristic bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center"
          onClick={handleSave}
          disabled={!isDirty || loading}
        >
          <FaSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center">
          <FaExclamationTriangle className="mr-3" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 text-green-300 px-4 py-3 rounded-lg mb-6">
          Settings saved successfully!
        </div>
      )}

      <SettingsForm settings={settings} onChange={handleChange} />
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Danger Zone
        </h2>
        
        <div className="border border-red-500/50 bg-red-500/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg text-white">Reset All Settings</h3>
              <p className="text-red-300">
                Restore all settings to their default values
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="btn-futuristic bg-red-700 hover:bg-red-800 px-6 py-3"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;