// Import Firebase API instead of using Express server
import FirebaseAPI from './firebase-api';

// Lightweight cross-component signal so the header can refresh the badge instantly
let notifChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    notifChannel = new BroadcastChannel('notifications');
  } catch {}
}

function notifyNotificationsChanged() {
  try {
    notifChannel?.postMessage({ type: 'changed', at: Date.now() });
  } catch {}
}

// Legacy HTTP function - now only used for AI endpoints (Next.js API routes)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
    cache: 'no-store' as RequestCache,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const API = {
  // ==================== FIREBASE METHODS ====================
  
  // Projects - Now using Firebase
  getProjects: async () => {
    try {
      return await FirebaseAPI.getProjects();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  createProject: async (data: any) => {
    try {
      const res = await FirebaseAPI.createProject(data);
      notifyNotificationsChanged();
      return res;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  updateProject: async (id: string, data: any) => {
    try {
      const res = await FirebaseAPI.updateProject(id, data);
      notifyNotificationsChanged();
      return res;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },
  
  deleteProject: async (id: string) => {
    try {
      const res = await FirebaseAPI.deleteProject(id);
      notifyNotificationsChanged();
      return res;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Tasks - Now using Firebase
  getTasks: async () => {
    try {
      return await FirebaseAPI.getTasks();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  createTask: async (data: any) => {
    try {
      const res = await FirebaseAPI.createTask(data);
      notifyNotificationsChanged();
      return res;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  updateTask: async (id: string, data: any) => {
    try {
      const res = await FirebaseAPI.updateTask(id, data);
      notifyNotificationsChanged();
      return res;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },
  
  deleteTask: async (id: string) => {
    try {
      const res = await FirebaseAPI.deleteTask(id);
      notifyNotificationsChanged();
      return res;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Team - Now using Firebase
  getTeam: async () => {
    try {
      return await FirebaseAPI.getTeam();
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  },
  
  createTeamMember: async (data: any) => {
    try {
      return await FirebaseAPI.createTeamMember(data);
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  // Auth - Now using Firebase
  authLogin: async (email: string, password: string) => {
    try {
      return await FirebaseAPI.login(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Dashboard - Now using Firebase
  getDashboard: async () => {
    try {
      const stats = await FirebaseAPI.getDashboardStats();
      const recentProjects = await FirebaseAPI.getProjects();
      return {
        stats,
        recentProjects: recentProjects.slice(0, 5) // Últimos 5 proyectos
      };
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  // User management - Now using Firebase
  getMe: async (email: string) => {
    try {
      const user = await FirebaseAPI.getUserByEmail(email);
      return { ok: true, user };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { ok: false, user: null };
    }
  },

  getUserSettings: async (email: string) => {
    try {
      const user = await FirebaseAPI.getUserByEmail(email);
      return { ok: true, settings: (user as any)?.settings || {} };
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return { ok: false, settings: {} };
    }
  },

  updateUserSettings: async (email: string, settings: any) => {
    try {
      const user = await FirebaseAPI.getUserByEmail(email);
      if (user) {
        await FirebaseAPI.updateUserSettings(user.id, settings);
        return { ok: true, settings };
      }
      return { ok: false, settings: {} };
    } catch (error) {
      console.error('Error updating user settings:', error);
      return { ok: false, settings: {} };
    }
  },

  // Notifications - Now using Firebase
  getNotifications: async (params: { userId?: number; unread?: boolean; limit?: number; offset?: number } = {}) => {
    try {
      return await FirebaseAPI.getNotifications();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
  getUnreadNotificationsCount: async (userId?: number) => {
    try {
      const notifications = await FirebaseAPI.getNotifications();
      const unreadCount = notifications.filter((n: any) => !n.read).length;
      return { count: unreadCount };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { count: 0 };
    }
  },
  
  createNotification: async (data: any) => {
    try {
      const res = await FirebaseAPI.createNotification(data);
      notifyNotificationsChanged();
      return res;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // ==================== AI ENDPOINTS (Next.js API routes) ====================
  // Estas funciones siguen usando fetch directo porque son API routes de Next.js

  // AI Endpoints (usando Next.js API routes)
  generateProjectSuggestions: async (description: string, teamMembers?: any[]) => {
    const res = await fetch('/api/ai/generate-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, teamMembers }),
    });
    return res.json();
  },
  generateTaskSuggestions: async (description: string, projects: any[], team: any[]) => {
    const response = await fetch('/api/ai/generate-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, projects, team }),
    });
    return response.json();
  },
  generateProjectTasks: async (projectData: any, team: any[]) => {
    const response = await fetch('/api/ai/generate-project-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, team }),
    });
    return response.json();
  },
};

export default API;
