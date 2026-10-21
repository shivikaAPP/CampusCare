const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('campuscare_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Complaints
  async getMyComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/complaints/my?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getAllComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/complaints/all?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getComplaintById(id) {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createComplaint(complaintData) {
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(complaintData),
    });
    return handleResponse(res);
  },

  async updateComplaintStatus(id, updateData) {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  async getComplaintStats() {
    const res = await fetch(`${API_BASE_URL}/complaints/analytics`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async deleteComplaint(id) {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
