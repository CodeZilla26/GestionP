export interface Project {
  id: string; // Firebase usa string IDs
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
  assigneeId?: string; // Firebase usa string IDs
  assigneeName?: string;
}

export interface TeamMember {
  id: string; // Firebase usa string IDs
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
}

export interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: string;
  technologies: string[];
  technologiesText: string;
  assigneeId: string | null;
  assigneeName: string;
  createAutoTasks: boolean;
}

export interface ProjectFilters {
  search: string;
  status: string;
  priority: string;
  assignee: string;
}
