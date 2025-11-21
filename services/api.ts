
import { Registration, Memory } from '../types';

// Use relative URL so it works on Vercel (same domain) and Localhost (via Vite proxy)
const API_URL = '/api';

// Helper to check if backend is likely down
const handleApiError = (error: any, fallbackAction: () => any) => {
  console.warn("API Connection failed. Falling back to LocalStorage.", error);
  return fallbackAction();
};

// --- Local Storage Helpers (Fallback) ---
const getLocalData = (): Registration[] => {
  try {
    return JSON.parse(localStorage.getItem('dhs_registrations') || '[]');
  } catch { 
    return []; 
  }
};

const setLocalData = (data: Registration[]) => {
  localStorage.setItem('dhs_registrations', JSON.stringify(data));
};

// --- Service Methods ---

export const registrationService = {
  // 1. Get All Registrations
  getAll: async (): Promise<Registration[]> => {
    try {
      const response = await fetch(`${API_URL}/registrations`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      return handleApiError(error, () => getLocalData());
    }
  },

  // 2. Create Registration
  create: async (registration: Registration): Promise<Registration> => {
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration),
      });
      if (!response.ok) throw new Error('Failed to create');
      return await response.json();
    } catch (error) {
      return handleApiError(error, () => {
        const current = getLocalData();
        const updated = [...current, registration];
        setLocalData(updated);
        return registration;
      });
    }
  },

  // 3. Update Status
  updateStatus: async (id: string, status: 'approved' | 'rejected'): Promise<Registration | null> => {
    try {
      const response = await fetch(`${API_URL}/registrations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update');
      return await response.json();
    } catch (error) {
      return handleApiError(error, () => {
        const current = getLocalData();
        let updatedItem: Registration | null = null;
        const updated = current.map(item => {
          if (item.id === id) {
            updatedItem = { ...item, status };
            return updatedItem;
          }
          return item;
        });
        setLocalData(updated);
        return updatedItem;
      });
    }
  },

  // 4. Find One (Status Check)
  findRegistration: async (mobile: string, sscYear: string): Promise<Registration | null> => {
    try {
      const response = await fetch(`${API_URL}/registrations/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, sscYear }),
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      return handleApiError(error, () => {
        const current = getLocalData();
        return current.find(r => 
          r.student.mobile === mobile && 
          r.student.sscYear.toString() === sscYear
        ) || null;
      });
    }
  }
};

export const memoryService = {
  verifyUser: async (mobile: string, sscYear: string) => {
    const response = await fetch(`${API_URL}/verify-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, sscYear })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Verification failed');
    }
    return await response.json();
  },

  refineText: async (text: string): Promise<string> => {
    const response = await fetch(`${API_URL}/refine-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error("Failed to refine");
    const data = await response.json();
    return data.text;
  },

  getAll: async (): Promise<Memory[]> => {
    try {
      const response = await fetch(`${API_URL}/memories`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      return [];
    }
  },

  create: async (memory: Partial<Memory>) => {
    const response = await fetch(`${API_URL}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory)
    });
    if (!response.ok) throw new Error("Failed to post memory");
    return await response.json();
  }
};
