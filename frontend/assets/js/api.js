/**
 * Syrian Renaissance Platform - API Client
 * Handles all communication with the backend API
 */

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// ====================================
// API Client Class
// ====================================
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Get authorization headers
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = storage.get('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      // If token expired, try to refresh
      if (response.status === 401 && storage.get('refreshToken')) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          return { retry: true };
        }
      }

      throw new Error(data.message || 'حدث خطأ في الاتصال');
    }

    return data;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.auth !== false),
    };

    try {
      const response = await fetch(url, config);
      const result = await this.handleResponse(response);

      // If needs retry (token refreshed)
      if (result.retry) {
        return this.request(endpoint, options);
      }

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // ====================================
  // Authentication Methods
  // ====================================

  /**
   * Register new user
   */
  async register(userData) {
    const response = await this.post('/auth/register', userData, { auth: false });

    if (response.data && response.data.tokens) {
      this.saveTokens(response.data.tokens);
    }

    return response;
  }

  /**
   * Login user
   */
  async login(credentials) {
    const response = await this.post('/auth/login', credentials, { auth: false });

    if (response.data && response.data.tokens) {
      this.saveTokens(response.data.tokens);
      storage.set('user', response.data.user);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken() {
    try {
      const refreshToken = storage.get('refreshToken');
      if (!refreshToken) return false;

      const response = await this.post('/auth/refresh-token', { refreshToken }, { auth: false });

      if (response.data && response.data.tokens) {
        this.saveTokens(response.data.tokens);
        return true;
      }

      return false;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  /**
   * Save tokens to storage
   */
  saveTokens(tokens) {
    storage.set('accessToken', tokens.accessToken);
    storage.set('refreshToken', tokens.refreshToken);
  }

  /**
   * Clear tokens from storage
   */
  clearTokens() {
    storage.remove('accessToken');
    storage.remove('refreshToken');
    storage.remove('user');
  }

  // ====================================
  // User Methods
  // ====================================

  /**
   * Get user profile
   */
  async getProfile() {
    return this.get('/users/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(data) {
    return this.put('/users/profile', data);
  }

  /**
   * Get user dashboard
   */
  async getDashboard() {
    return this.get('/users/dashboard');
  }

  /**
   * Get user progress
   */
  async getProgress() {
    return this.get('/users/progress');
  }

  /**
   * Log mood check
   */
  async logMood(moodData) {
    return this.post('/users/mood-check', moodData);
  }

  // ====================================
  // Journey Methods
  // ====================================

  /**
   * Get current phase
   */
  async getCurrentPhase() {
    return this.get('/journey/current-phase');
  }

  /**
   * Get today's ritual
   */
  async getTodayRitual() {
    return this.get('/journey/today-ritual');
  }

  /**
   * Complete ritual
   */
  async completeRitual(ritualId) {
    return this.post('/journey/complete-ritual', { ritualId });
  }

  /**
   * Get milestones
   */
  async getMilestones() {
    return this.get('/journey/milestones');
  }

  // ====================================
  // Module Methods
  // ====================================

  /**
   * Get all modules
   */
  async getModules(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/modules${query ? '?' + query : ''}`);
  }

  /**
   * Get module by ID
   */
  async getModule(id) {
    return this.get(`/modules/${id}`);
  }

  /**
   * Start module
   */
  async startModule(id) {
    return this.post(`/modules/${id}/start`);
  }

  /**
   * Complete module
   */
  async completeModule(id, data = {}) {
    return this.post(`/modules/${id}/complete`, data);
  }

  // ====================================
  // Chat (Sham) Methods
  // ====================================

  /**
   * Get conversations
   */
  async getConversations() {
    return this.get('/chat/conversations');
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(conversationId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/chat/conversation/${conversationId}/messages${query ? '?' + query : ''}`);
  }

  /**
   * Send message to Sham
   */
  async sendMessage(message, conversationId = null) {
    return this.post('/chat/send', { message, conversationId });
  }

  /**
   * Get suggested responses
   */
  async getSuggestedResponses() {
    return this.get('/chat/suggested-responses');
  }

  // ====================================
  // Job Methods
  // ====================================

  /**
   * Get all jobs
   */
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/jobs${query ? '?' + query : ''}`);
  }

  /**
   * Get job by ID
   */
  async getJob(id) {
    return this.get(`/jobs/${id}`);
  }

  /**
   * Apply to job
   */
  async applyToJob(id, applicationData) {
    return this.post(`/jobs/${id}/apply`, applicationData);
  }

  /**
   * Get my applications
   */
  async getMyApplications() {
    return this.get('/jobs/my-applications');
  }

  // ====================================
  // Community Methods
  // ====================================

  /**
   * Get all groups
   */
  async getGroups() {
    return this.get('/community/groups');
  }

  /**
   * Get group by ID
   */
  async getGroup(id) {
    return this.get(`/community/groups/${id}`);
  }

  /**
   * Join group
   */
  async joinGroup(id) {
    return this.post(`/community/groups/${id}/join`);
  }

  /**
   * Get group messages
   */
  async getGroupMessages(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/community/groups/${id}/messages${query ? '?' + query : ''}`);
  }

  /**
   * Send group message
   */
  async sendGroupMessage(id, content) {
    return this.post(`/community/groups/${id}/messages`, { content });
  }
}

// Create global API instance
window.api = new APIClient(API_BASE_URL);

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIClient;
}

console.log('✅ API Client initialized');
