// Firebase API wrapper - Reemplaza el servidor Express
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { db, auth } from './firebase';

// Tipos para TypeScript
interface Project {
  id?: string;
  name: string;
  description: string;
  client: string;
  startDate: string;
  endDate: string;
  status: 'activo' | 'progreso' | 'completado';
  progress: number;
  technologies: string[];
  priority: string;
  budget?: number;
  assigneeId?: string;
  assigneeName?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface Task {
  id?: string;
  name: string;
  description: string;
  project: string;
  projectId: string | number;
  assignee: string;
  assigneeId?: number;
  deadline: string;
  status: 'pendiente' | 'progreso' | 'completado';
  progress: number;
  estimatedTime: number;
  priority: string;
  tags: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string | null;
  location: string;
  joinDate: string;
  avatar: string | null;
  skills: string[];
  status: 'activo' | 'vacaciones' | string;
  projects: number[];
  tasksCompleted: number;
  tasksInProgress: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Firebase API que reemplaza tu servidor Express
export const FirebaseAPI = {
  // ==================== AUTENTICACIÓN ====================
  
  // Crear usuario completo (Auth + Firestore)
  createUser: async (userData: any) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return {
        id: docRef.id,
        ...userData
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Contar no leídas (opcionalmente por usuario)
  getUnreadNotificationsCount: async (userId?: number | null) => {
    try {
      const baseCol = collection(db, 'notifications');
      let qRef: any = query(baseCol, where('read', '==', false));
      if (userId != null) {
        qRef = query(baseCol, where('read', '==', false), where('userId', '==', userId));
      }
      const snap = await getDocs(qRef);
      return { count: snap.size };
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      return { count: 0 };
    }
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || 'Usuario'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Register
  register: async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Crear perfil de usuario en Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        email,
        role: 'user',
        createdAt: Timestamp.now(),
        settings: {
          profile: { name, email, phone: '', bio: '', location: '' },
          notifications: { email: true, push: true, desktop: false },
          appearance: { theme: 'dark', language: 'es' }
        }
      });

      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ==================== PROYECTOS ====================
  
  // Obtener todos los proyectos
  getProjects: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return projects;
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },

  // Crear proyecto
  createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return {
        id: docRef.id,
        ...projectData
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Actualizar proyecto
  updateProject: async (id: string, projectData: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: Timestamp.now()
      });
      return { id, ...projectData };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Eliminar proyecto
  deleteProject: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // ==================== TAREAS ====================
  
  // Obtener todas las tareas
  getTasks: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Crear tarea
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return {
        id: docRef.id,
        ...taskData
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Actualizar tarea
  updateTask: async (id: string, taskData: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: Timestamp.now()
      });
      return { id, ...taskData };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Eliminar tarea
  deleteTask: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // ==================== EQUIPO ====================
  
  // Obtener equipo
  getTeam: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'team'));
      const team = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return team;
    } catch (error) {
      console.error('Error getting team:', error);
      throw error;
    }
  },

  // Crear miembro del equipo
  createTeamMember: async (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'team'), {
        ...memberData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return {
        id: docRef.id,
        ...memberData
      };
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  // Actualizar miembro del equipo
  updateTeamMember: async (id: string, memberData: Partial<TeamMember>) => {
    try {
      const ref = doc(db, 'team', id);
      await updateDoc(ref, { ...memberData, updatedAt: Timestamp.now() });
      return { id, ...memberData };
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Eliminar miembro del equipo
  deleteTeamMember: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'team', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },

  // ==================== NOTIFICACIONES ====================
  
  // Obtener notificaciones
  getNotifications: async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))
      );
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Crear notificación
  createNotification: async (notificationData: any) => {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: Timestamp.now(),
        read: false
      });
      
      return {
        id: docRef.id,
        ...notificationData
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Marcar una notificación como leída
  markNotificationRead: async (id: string) => {
    try {
      const ref = doc(db, 'notifications', id);
      await updateDoc(ref, { read: true, updatedAt: Timestamp.now() });
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas (opcionalmente filtradas por userId)
  markAllNotificationsRead: async (userId?: number | null) => {
    try {
      const baseCol = collection(db, 'notifications');
      const q = userId != null ? query(baseCol, where('userId', '==', userId)) : baseCol;
      const snap = await getDocs(q as any);
      const updates = snap.docs.map((d) => updateDoc(d.ref, { read: true, updatedAt: Timestamp.now() }));
      await Promise.all(updates);
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // ==================== USUARIOS ====================
  
  // Obtener usuario por email
  getUserByEmail: async (email: string) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // Actualizar configuraciones de usuario
  updateUserSettings: async (userId: string, settings: any) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        settings,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },

  // ==================== DASHBOARD STATS ====================
  
  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    try {
      const [projectsSnapshot, tasksSnapshot, teamSnapshot] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'tasks')),
        getDocs(collection(db, 'team'))
      ]);

      const projects = projectsSnapshot.docs.map(doc => doc.data());
      const tasks = tasksSnapshot.docs.map(doc => doc.data());
      const team = teamSnapshot.docs.map(doc => doc.data());

      return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'activo').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completado').length,
        pendingTasks: tasks.filter(t => t.status === 'pendiente').length,
        teamMembers: team.length,
        activeMembers: team.filter(m => m.status === 'activo').length
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
};

export default FirebaseAPI;
