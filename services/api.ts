
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
  getAll: async (): Promise<Memory[]> => {
    try {
      const response = await fetch(`${API_URL}/memories`);
      if (!response.ok) throw new Error('Failed to fetch memories');
      return await response.json();
    } catch (error) {
      // Simple fallback for demo/offline
      return JSON.parse(localStorage.getItem('dhs_memories') || '[]');
    }
  },

  create: async (memory: { studentName: string, sscYear: number, text: string }) => {
    try {
      const response = await fetch(`${API_URL}/memories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memory),
      });
      if (!response.ok) throw new Error('Failed to create memory');
      return await response.json();
    } catch (error) {
      // Fallback
      const current = JSON.parse(localStorage.getItem('dhs_memories') || '[]');
      const newMem = { ...memory, id: Date.now().toString(), timestamp: new Date().toISOString() };
      localStorage.setItem('dhs_memories', JSON.stringify([newMem, ...current]));
      return newMem;
    }
  },

  verifyUser: async (mobile: string, sscYear: string) => {
    const response = await fetch(`${API_URL}/memories/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, sscYear }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Verification failed');
    return data;
  },

  refineText: async (text: string): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/memories/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) return text;
      const data = await response.json();
      return data.text || text;
    } catch (e) {
      return text;
    }
  }
};

export const liveChatService = {
  getMessages: async () => {
    const response = await fetch(`${API_URL}/live-chat`);
    if (!response.ok) return [];
    return await response.json();
  },

  sendMessage: async (senderName: string, sscYear: number, message: string) => {
    const response = await fetch(`${API_URL}/live-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderName, sscYear, message })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to send");
    }
    return data;
  }
};
