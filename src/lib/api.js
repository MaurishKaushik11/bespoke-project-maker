const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Profile API functions
export const profileAPI = {
  // Get all profiles
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    return handleResponse(response);
  },

  // Get single profile
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
    return handleResponse(response);
  },

  // Create profile
  create: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Update profile
  update: async (id, profileData) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Delete profile
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Event API functions
export const eventAPI = {
  // Get all events
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/events`);
    return handleResponse(response);
  },

  // Get events for specific profile
  getByProfile: async (profileId) => {
    const response = await fetch(`${API_BASE_URL}/events/profile/${profileId}`);
    return handleResponse(response);
  },

  // Create event
  create: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  // Update event
  update: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  // Delete event
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Get event update logs
  getUpdateLogs: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/logs`);
    return handleResponse(response);
  },
};
