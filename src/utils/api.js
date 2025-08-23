// Create a centralized API client
class APIClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, method = 'GET', body = null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    };

    try {
      const response = await fetch(`/api/${endpoint}`, config);
      
      // Handle empty responses
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `API request failed: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw new Error(error.message || 'Network request failed');
    }
  }
}

// Create a singleton instance
const apiClient = new APIClient();

// Initialize with token from localStorage if available
const savedToken = localStorage.getItem('authToken');
if (savedToken) {
  apiClient.setToken(savedToken);
}

// Admin API methods
export const adminAPI = {
  getUsers: (page = 1, limit = 10, search = '') => 
    apiClient.request(`admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),
  
  updateUser: (userId, updates) => 
    apiClient.request(`admin/users/${userId}`, 'PUT', updates),
  
  getCampaigns: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiClient.request(`admin/campaigns?${query}`);
  },
  
  updateCampaign: (campaignId, updates) => 
    apiClient.request(`admin/campaigns/${campaignId}`, 'PUT', updates),
  
  getWithdrawals: (status = 'pending') => 
    apiClient.request(`admin/withdrawals?status=${status}`),
  
  processWithdrawal: (withdrawalId, action) => 
    apiClient.request(`admin/withdrawals/${withdrawalId}`, 'PUT', { action }),
  
  getPlatformMetrics: () => 
    apiClient.request('admin/metrics'),
  
  getRecentActivity: (limit = 10) => 
    apiClient.request(`admin/activity?limit=${limit}`),
  
  getSystemSettings: () => 
    apiClient.request('admin/settings'),
  
  updateSystemSettings: (settings) => 
    apiClient.request('admin/settings', 'PUT', settings),
  
  // Fraud detection endpoints
  getFraudAlerts: (status = 'active') => 
    apiClient.request(`admin/fraud-alerts?status=${status}`),
  
  resolveFraudAlert: (alertId) => 
    apiClient.request(`admin/fraud-alerts/${alertId}/resolve`, 'POST'),
  
  // Content moderation endpoints
  getModerationQueue: () => 
    apiClient.request('admin/moderation-queue'),
  
  approveContent: (itemId) => 
    apiClient.request(`admin/moderation/${itemId}/approve`, 'POST'),
  
  rejectContent: (itemId) => 
    apiClient.request(`admin/moderation/${itemId}/reject`, 'POST')
};

// Auth context will set token using this method
export const setAPIToken = (token) => {
  apiClient.setToken(token);
};