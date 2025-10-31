'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useSearchParams } from 'next/navigation';
import { 
  Plus, 
  Filter, 
  Edit, 
  Trash2,
  CheckSquare,
  Calendar,
  Clock,
  User,
  RotateCcw,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FirebaseAPI } from '@/lib/firebase-api';

interface Task {
  id: string;
  name: string;
  description: string;
  project: string;
  assignee: string;
  deadline: string;
  status: 'pendiente' | 'progreso' | 'completado';
  progress: number;
  estimatedTime: number;
  priority: 'baja' | 'media' | 'alta';
}

function TasksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [cardVariant] = useState<'A'|'B'|'C'>('B');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project: '',
    assignee: '',
    deadline: '',
    estimatedTime: '',
    priority: 'media' as 'baja' | 'media' | 'alta'
  });

  // Helpers: proyecto y sugerencias IA
  const getProjectByName = (name: string) => projects.find((p: any) => p.name === name);
  const getTeamForProject = (name: string) => {
    const proj = getProjectByName(name);
    if (!proj) return [] as { id: string; name: string; status?: string; tasksInProgress?: number }[];
    const teamNames: string[] = (proj.team || []);
    return team
      .filter((m: any) => teamNames.includes(m.name))
      .map((m: any) => ({ id: String(m.id ?? ''), name: m.name, status: m.status, tasksInProgress: m.tasksInProgress ?? 0 }));
  };

  // Autoasignación al cambiar proyecto en el modal de nueva tarea
  useEffect(() => {
    if (!formData.project) return;
    const team = getTeamForProject(formData.project);
    const stillValid = formData.assignee && team.some(m => m.name === formData.assignee);
    if (stillValid) return;
    const best = autoAssignCollaboratorForTask(formData.project);
    setFormData(prev => ({
      ...prev,
      assignee: best ? best.name : ''
    }));
  }, [formData.project]);

  const suggestTaskPriority = (desc: string): 'baja' | 'media' | 'alta' => {
    const d = (desc || '').toLowerCase();
    if (/critico|urgente|bloqueante|pago|seguridad/.test(d)) return 'alta';
    if (/optimizar|mejorar|refactor|documentar/.test(d)) return 'baja';
    return 'media';
  };

  const suggestEstimatedTime = (desc: string, priority: 'baja'|'media'|'alta') => {
    const d = (desc || '').toLowerCase();
    let base = priority === 'alta' ? 16 : priority === 'media' ? 8 : 4; // horas base
    if (/implement(ar|ación)|integrar|backend|api|autenticación/.test(d)) base += 8;
    if (/diseñ|ui|ux|maquetar|responsive/.test(d)) base += 4;
    return Math.min(80, Math.max(2, base));
  };

  const suggestDeadlineFromEstimated = (estimatedHours: number) => {
    const days = Math.ceil(estimatedHours / 6); // 6h efectivas por día
    const dt = new Date();
    dt.setDate(dt.getDate() + days);
    return dt.toISOString().split('T')[0];
  };

  const autoAssignCollaboratorForTask = (projectName: string) => {
    const candidates = getTeamForProject(projectName)
      .filter(m => (m.status ?? 'activo') === 'activo');
    if (!candidates.length) return null as { id: string; name: string } | null;
    const best = candidates.reduce((a, b) => ((a.tasksInProgress ?? 0) <= (b.tasksInProgress ?? 0) ? a : b));
    return { id: best.id, name: best.name };
  };

  // Sugerencia de proyecto según la descripción
  const suggestProjectFromDescription = (desc: string) => {
    const d = (desc || '').toLowerCase();
    const tokens = d.split(/[^a-z0-9áéíóúüñ.#+\-]+/i).filter(Boolean);
    const includesToken = (text: string) => tokens.some(t => text.toLowerCase().includes(t));
    let best = null as any;
    let bestScore = 0;
    for (const p of projects) {
      let score = 0;
      // Tecnologías mencionadas
      for (const tech of p.technologies || []) {
        if (d.includes(tech.toLowerCase())) score += 3;
      }
      // Nombre del proyecto
      if (includesToken(p.name)) score += 2;
      // Descripción del proyecto
      if (p.description) {
        const pd = p.description.toLowerCase();
        // +1 por cada token de la descripción de la tarea que aparece en la del proyecto
        score += tokens.reduce((acc, t) => acc + (pd.includes(t) ? 1 : 0), 0);
      }
      // Pequeño sesgo por proyectos activos/progreso
      if (p.status === 'activo' || p.status === 'progreso') score += 1;
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
    return bestScore > 0 ? best : null;
  };

  const generateTaskAISuggestions = async () => {
    if (!formData.description) {
      toast.error('Ingresa una descripción para generar sugerencias');
      return;
    }
    
    toast.loading('Generando sugerencias con IA...', { id: 'task-ai' });

    try {
      const res = await fetch('/api/ai/generate-project-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description, projects, team })
      });
      const response = await res.json();
      const suggestions = response?.suggestions ?? {};

      // Buscar proyecto sugerido en la lista local
      const suggestedProject = suggestions.suggestedProject 
        ? projects.find(p => p.name.toLowerCase().includes(suggestions.suggestedProject.toLowerCase()))
        : null;

      // Buscar colaborador sugerido
      const suggestedMember = suggestions.suggestedAssignee
        ? team.find(m => m.name.toLowerCase().includes(suggestions.suggestedAssignee.toLowerCase()))
        : null;

      setFormData(prev => ({
        ...prev,
        project: suggestedProject ? suggestedProject.name : prev.project,
        priority: suggestions.priority || prev.priority,
        estimatedTime: suggestions.estimatedHours || prev.estimatedTime,
        deadline: suggestions.deadline || prev.deadline,
        assignee: suggestedMember ? suggestedMember.name : prev.assignee
      }));

      const projectInfo = suggestedProject ? ` · Proyecto: ${suggestedProject.name}` : '';
      toast.success(`¡Sugerencias generadas con IA!${projectInfo} ${suggestions.reasoning || ''}`, { id: 'task-ai' });
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast.error('Error al generar sugerencias. Usando sugerencias locales...', { id: 'task-ai' });
      
      // Fallback a lógica local
      const suggestedProject = suggestProjectFromDescription(formData.description);
      const projectName = suggestedProject ? suggestedProject.name : formData.project;
      const pr = suggestTaskPriority(formData.description);
      const est = suggestEstimatedTime(formData.description, pr);
      const dl = suggestDeadlineFromEstimated(est);
      const assignee = projectName ? autoAssignCollaboratorForTask(projectName) : null;

      setFormData(prev => ({
        ...prev,
        project: projectName || prev.project,
        priority: pr,
        estimatedTime: String(est),
        deadline: dl,
        assignee: assignee ? assignee.name : (prev.assignee || '')
      }));
    }
  };

  // Edición y eliminación
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const [updateData, setUpdateData] = useState({
    status: 'pendiente' as 'pendiente' | 'progreso' | 'completado',
    progress: 0,
    timeSpent: 0,
    comments: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Cargar datos desde el backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [tks, projs, members] = await Promise.all([
          FirebaseAPI.getTasks(),
          FirebaseAPI.getProjects(),
          FirebaseAPI.getTeam(),
        ]);
        const normTasks: Task[] = (tks as any[]).map((t: any) => ({
          id: String(t.id ?? ''),
          name: t.name ?? '',
          description: t.description ?? '',
          project: t.project ?? '',
          assignee: t.assignee ?? '',
          deadline: typeof t.deadline === 'string' ? t.deadline : t.deadline?.toDate ? t.deadline.toDate().toISOString() : new Date().toISOString(),
          status: (t.status ?? 'pendiente') as Task['status'],
          progress: Number(t.progress ?? 0),
          estimatedTime: Number(t.estimatedTime ?? 0),
          priority: (t.priority ?? 'media') as Task['priority'],
        }));
        setTasks(normTasks);
        setProjects((projs as any[]).map((p: any) => ({ ...p, id: String(p.id ?? '') })));
        setTeam((members as any[]).map((m: any) => ({ ...m, id: String(m.id ?? '') })));
      } catch (e) {
        console.error(e);
        toast.error('No se pudieron cargar tareas/proyectos/equipo');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const q = searchParams?.get('q') || '';
    setSearchTerm(q);
  }, [searchParams]);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'todas' || task.status === filter;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return matchesFilter;
    return (
      matchesFilter && (
        task.name.toLowerCase().includes(q) ||
        (task.description || '').toLowerCase().includes(q) ||
        (task.project || '').toLowerCase().includes(q) ||
        (task.assignee || '').toLowerCase().includes(q)
      )
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Pendiente</Badge>;
      case 'progreso':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Progreso</Badge>;
      case 'completado':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const openEditModal = (task: Task) => {
    setEditingId(task.id);
    setFormData({
      name: task.name,
      description: task.description,
      project: task.project,
      assignee: task.assignee,
      deadline: task.deadline,
      estimatedTime: String(task.estimatedTime),
      priority: task.priority
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await FirebaseAPI.updateTask(editingId, {
        name: formData.name,
        description: formData.description,
        project: formData.project,
        assignee: formData.assignee,
        deadline: formData.deadline,
        estimatedTime: parseInt(formData.estimatedTime),
        priority: formData.priority,
      });
      setTasks(prev => prev.map(t => t.id === editingId ? {
        ...t,
        name: formData.name,
        description: formData.description,
        project: formData.project,
        assignee: formData.assignee,
        deadline: formData.deadline,
        estimatedTime: parseInt(formData.estimatedTime),
        priority: formData.priority
      } : t));
      setIsEditOpen(false);
      setEditingId(null);
      toast.success('¡Tarea actualizada!');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo actualizar la tarea');
    }
  };

  const requestDelete = (task: Task) => {
    setDeleteTarget(task);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await FirebaseAPI.deleteTask(deleteTarget.id);
      setTasks(prev => prev.filter(t => t.id !== deleteTarget.id));
      toast.success('Tarea eliminada');
    } catch (e) {
      console.error(e);
      toast.error('No se pudo eliminar la tarea');
    } finally {
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Media</Badge>;
      case 'baja':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Baja</Badge>;
      default:
        return <Badge variant="outline">Media</Badge>;
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const created = await FirebaseAPI.createTask({
        name: formData.name,
        description: formData.description,
        project: formData.project,
        projectId: formData.project,
        assignee: formData.assignee,
        deadline: formData.deadline,
        status: 'pendiente',
        progress: 0,
        estimatedTime: parseInt(formData.estimatedTime),
        priority: formData.priority,
        tags: []
      });
      const newTask: Task = {
        id: String((created as any).id ?? ''),
        name: formData.name,
        description: formData.description,
        project: formData.project,
        assignee: formData.assignee,
        deadline: formData.deadline,
        status: 'pendiente',
        progress: 0,
        estimatedTime: parseInt(formData.estimatedTime),
        priority: formData.priority
      };
      setTasks(prev => [...prev, newTask]);
      setFormData({
        name: '',
        description: '',
        project: '',
        assignee: '',
        deadline: '',
        estimatedTime: '',
        priority: 'media'
      });
      setIsModalOpen(false);
      toast.success('¡Tarea creada exitosamente!');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo crear la tarea');
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await FirebaseAPI.updateTask(selectedTask.id, {
        status: updateData.status,
        progress: updateData.progress,
      });
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: updateData.status, progress: updateData.progress }
          : task
      ));
      setIsUpdateModalOpen(false);
      setSelectedTask(null);
      toast.success('Estado de tarea actualizado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo actualizar el estado');
    }
  };

  const openUpdateModal = (task: Task) => {
    setSelectedTask(task);
    setUpdateData({
      status: task.status,
      progress: task.progress,
      timeSpent: 0,
      comments: ''
    });
    setIsUpdateModalOpen(true);
  };

  const statusColor = (status: Task['status']) => {
    switch (status) {
      case 'pendiente': return 'bg-orange-400';
      case 'progreso': return 'bg-blue-400';
      case 'completado': return 'bg-green-400';
    }
  };

  const priorityTint = (priority: Task['priority']) => {
    switch (priority) {
      case 'alta': return 'ring-red-500/40';
      case 'media': return 'ring-yellow-500/40';
      case 'baja': return 'ring-green-500/40';
    }
  };

  const renderTaskCard = (task: Task) => {
    const overdue = isOverdue(task.deadline) && task.status !== 'completado';
    if (cardVariant === 'A') {
      // Compacta tipo lista
      return (
        <div
          key={task.id}
          className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 ring-1 ${priorityTint(task.priority)} ${overdue ? 'border-red-500/50 bg-red-500/5' : ''}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${statusColor(task.status)}`} />
                <h3 className="font-semibold text-white truncate">{task.name}</h3>
                <span className="text-sm text-slate-400 truncate">• {task.project}</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {task.assignee}</span>
                <span className={`flex items-center gap-1 ${overdue ? 'text-red-400' : ''}`}>
                  <Calendar className="w-3.5 h-3.5" /> {new Date(task.deadline).toLocaleDateString('es-ES')}
                </span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.estimatedTime}h</span>
                {getPriorityBadge(task.priority)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-slate-400">{task.progress}%</div>
                <Progress value={task.progress} className="h-1 w-24" />
              </div>
              <Button 
                variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white"
                onClick={() => openUpdateModal(task)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white" onClick={() => openEditModal(task)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-red-400" onClick={() => requestDelete(task)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (cardVariant === 'B') {
      // Stats a la derecha
      return (
        <div
          key={task.id}
          className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4 ${overdue ? 'border-red-500/50 bg-red-500/5' : ''}`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-block w-2 h-2 rounded-full ${statusColor(task.status)}`} />
              <h3 className="text-lg font-semibold text-white">{task.name}</h3>
              <span className="text-sm text-slate-400">• {task.project}</span>
            </div>
            {getStatusBadge(task.status)}
            <p className="text-slate-300 mt-3 line-clamp-3">{task.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-slate-400"><User className="w-4 h-4" /> {task.assignee}</span>
              <span className={`flex items-center gap-2 ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                <Calendar className="w-4 h-4" /> {new Date(task.deadline).toLocaleDateString('es-ES')}
              </span>
              <span className="flex items-center gap-2 text-slate-400"><Clock className="w-4 h-4" /> {task.estimatedTime}h</span>
              {getPriorityBadge(task.priority)}
            </div>
          </div>
          <div className="md:border-l md:border-white/10 md:pl-4 flex md:flex-col justify-between md:justify-start md:gap-4">
            <div className="flex items-end gap-3">
              <div className="w-2 h-28 bg-slate-700 rounded relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500" style={{ height: `${task.progress}%` }} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Progreso</div>
                <div className="text-sm text-white font-medium">{task.progress}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white"
                onClick={() => openUpdateModal(task)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white" onClick={() => openEditModal(task)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-red-400" onClick={() => requestDelete(task)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Variante C: header banda y chips
    return (
      <div
        key={task.id}
        className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all ${overdue ? 'border-red-500/50 bg-red-500/5' : ''}`}
      >
        <div className={`h-2 ${statusColor(task.status)}`} />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{task.name}</h3>
              <div className="text-sm text-slate-400">{task.project}</div>
            </div>
            {getPriorityBadge(task.priority)}
          </div>
          <p className="text-slate-300 mt-3">{task.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-xs flex items-center gap-1"><User className="w-3.5 h-3.5" /> {task.assignee}</Badge>
            <Badge variant="secondary" className={`text-xs flex items-center gap-1 ${overdue ? 'bg-red-500/20 text-red-300 border-red-500/30' : ''}`}>
              <Calendar className="w-3.5 h-3.5" /> {new Date(task.deadline).toLocaleDateString('es-ES')}
            </Badge>
            <Badge variant="secondary" className="text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.estimatedTime}h</Badge>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">Progreso</span>
              <span className="text-sm text-slate-400">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white"
              onClick={() => openUpdateModal(task)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white" onClick={() => openEditModal(task)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-red-400" onClick={() => requestDelete(task)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Gestión de Tareas">
      {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-slate-400" />
              <div className="flex bg-white/10 backdrop-blur-xl rounded-full p-1 gap-1">
                {[
                  { key: 'todas', label: 'Todas' },
                  { key: 'pendiente', label: 'Pendientes' },
                  { key: 'progreso', label: 'En Progreso' },
                  { key: 'completado', label: 'Completadas' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filter === item.key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Search */}
            <div className="relative max-w-md w-full mx-4 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl bg-slate-800/95 backdrop-blur-xl border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <CheckSquare className="w-5 h-5 text-green-400" />
                    Nueva Tarea
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name">Nombre de la Tarea</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-700 border-slate-600"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-slate-700 border-slate-600"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="project">Proyecto</Label>
                      <Select value={formData.project} onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((p: any) => (
                            <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="assignee">Asignado a</Label>
                      <Select value={formData.assignee} onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Seleccionar colaborador" />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.project ? getTeamForProject(formData.project) : team.filter((m: any) => (m.status ?? 'activo') === 'activo'))
                            .map((m: any) => (
                              <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="deadline">Fecha Límite</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                        className="bg-slate-700 border-slate-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="estimatedTime">Tiempo Estimado (horas)</Label>
                      <Input
                        id="estimatedTime"
                        type="number"
                        min="1"
                        value={formData.estimatedTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                        className="bg-slate-700 border-slate-600"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label>Prioridad</Label>
                      <div className="flex gap-3 mt-2">
                        {[
                          { value: 'baja', label: 'Baja', color: 'bg-green-500/20 text-green-400' },
                          { value: 'media', label: 'Media', color: 'bg-yellow-500/20 text-yellow-400' },
                          { value: 'alta', label: 'Alta', color: 'bg-red-500/20 text-red-400' }
                        ].map((priority) => (
                          <label key={priority.value} className="flex items-center">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={formData.priority === priority.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                              className="sr-only"
                            />
                            <Badge 
                              className={`cursor-pointer ${priority.color} ${
                                formData.priority === priority.value ? 'ring-2 ring-white/50' : ''
                              }`}
                            >
                              {priority.label}
                            </Badge>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="button" variant="secondary" onClick={generateTaskAISuggestions} className="flex-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30">
                      Generar sugerencias con IA
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      Guardar Tarea
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tasks List */}
          <div className="space-y-6">
            {filteredTasks.map((task) => renderTaskCard(task))}
          </div>

          {/* Update Status Modal */}
          <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
            <DialogContent className="max-w-md bg-slate-800/95 backdrop-blur-xl border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-blue-400" />
                  Actualizar Estado
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <Label htmlFor="status">Estado de la Tarea</Label>
                  <Select value={updateData.status} onValueChange={(value: any) => setUpdateData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="progreso">En Progreso</SelectItem>
                      <SelectItem value="completado">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="progress">Progreso (%)</Label>
                  <Input
                    id="progress"
                    type="range"
                    min="0"
                    max="100"
                    value={updateData.progress}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                    className="bg-slate-700 border-slate-600"
                  />
                  <div className="text-center text-sm text-slate-400 mt-1">{updateData.progress}%</div>
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsUpdateModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Guardar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Task Modal */}
          <Dialog open={isEditOpen} onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditingId(null); }}>
            <DialogContent className="max-w-2xl bg-slate-800/95 backdrop-blur-xl border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Edit className="w-5 h-5 text-yellow-400" />
                  Editar Tarea
                </DialogTitle>
                <DialogDescription>Edita los campos de la tarea seleccionada</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="edit_name">Nombre de la Tarea</Label>
                    <Input
                      id="edit_name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit_description">Descripción</Label>
                    <Textarea
                      id="edit_description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_project">Proyecto</Label>
                    <Select value={formData.project} onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Seleccionar proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p: any) => (
                          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_assignee">Asignado a</Label>
                    <Select value={formData.assignee} onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Seleccionar colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {team
                          .filter((m: any) => (m.status ?? 'activo') === 'activo')
                          .map((m: any) => (
                            <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_deadline">Fecha Límite</Label>
                    <Input
                      id="edit_deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_estimatedTime">Tiempo Estimado (horas)</Label>
                    <Input
                      id="edit_estimatedTime"
                      type="number"
                      min="1"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Prioridad</Label>
                    <div className="flex gap-3 mt-2">
                      {[
                        { value: 'baja', label: 'Baja', color: 'bg-green-500/20 text-green-400' },
                        { value: 'media', label: 'Media', color: 'bg-yellow-500/20 text-yellow-400' },
                        { value: 'alta', label: 'Alta', color: 'bg-red-500/20 text-red-400' }
                      ].map((priority) => (
                        <label key={priority.value} className="flex items-center">
                          <input
                            type="radio"
                            name="edit_priority"
                            value={priority.value}
                            checked={formData.priority === priority.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="sr-only"
                          />
                          <Badge 
                            className={`cursor-pointer ${priority.color} ${
                              formData.priority === priority.value ? 'ring-2 ring-white/50' : ''
                            }`}
                          >
                            {priority.label}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); setEditingId(null); }} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent className="bg-slate-800/95 border-slate-700 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Seguro que deseas eliminar "{deleteTarget?.name}"? Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </DashboardLayout>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={
      <DashboardLayout title="Gestión de Tareas">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Cargando tareas...</div>
        </div>
      </DashboardLayout>
    }>
      <TasksPageContent />
    </Suspense>
  );
}