'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FirebaseAPI } from '@/lib/firebase-api';
import { Project, TeamMember, ProjectFormData } from '../types/project.types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'media',
    technologies: [] as string[],
    technologiesText: '',
    assigneeId: null as string | null,
    assigneeName: '',
    createAutoTasks: true,
  });

  // Modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Cargar proyectos y equipo desde el backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [p, t] = await Promise.all([
          FirebaseAPI.getProjects(),
          FirebaseAPI.getTeam()
        ]);
        const normP = (p as any[]).map((x: any) => ({
          ...x,
          id: String(x.id ?? ''),
          startDate: typeof x.startDate === 'string' ? x.startDate : x.startDate?.toDate ? x.startDate.toDate().toISOString().slice(0,10) : '',
          endDate: typeof x.endDate === 'string' ? x.endDate : x.endDate?.toDate ? x.endDate.toDate().toISOString().slice(0,10) : '',
        })) as Project[];
        const normT = (t as any[]).map((x: any) => ({ ...x, id: String(x.id ?? '') })) as TeamMember[];
        setProjects(normP);
        setTeam(normT);
      } catch (e: any) {
        console.error(e);
        toast.error('No se pudieron cargar los datos del servidor');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtrar proyectos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'todos' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      priority: 'media',
      technologies: [],
      technologiesText: '',
      assigneeId: null,
      assigneeName: '',
      createAutoTasks: true,
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setIsViewOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      priority: project.priority || 'media',
      technologies: project.technologies || [],
      technologiesText: (project.technologies || []).join(', '),
      assigneeId: project.assigneeId ?? null,
      assigneeName: project.assigneeName || '',
      createAutoTasks: true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (project: Project) => {
    setDeleteTarget(project);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await FirebaseAPI.deleteProject(deleteTarget.id);
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      toast.success('Proyecto eliminado');
    } catch (e) {
      console.error(e);
      toast.error('No se pudo eliminar el proyecto');
    } finally {
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalizar tecnologías desde el texto
    const techsFromText = formData.technologiesText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    const techs = formData.technologies.length ? formData.technologies : techsFromText;

    try {
      if (editingId) {
        // Actualizar proyecto existente
        await FirebaseAPI.updateProject(editingId, {
          name: formData.name,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          technologies: techs,
          priority: formData.priority,
          assigneeId: formData.assigneeId || undefined,
          assigneeName: formData.assigneeName || undefined,
        });
        
        setProjects(prev => prev.map(p => p.id === editingId ? {
          ...p,
          name: formData.name,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          technologies: techs,
          priority: formData.priority,
          assigneeId: formData.assigneeId || undefined,
          assigneeName: formData.assigneeName || undefined
        } as Project : p));
        
        toast.success('¡Proyecto actualizado!');
      } else {
        // Crear nuevo proyecto
        const created = await FirebaseAPI.createProject({
          name: formData.name,
          description: formData.description,
          client: '',
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: 'activo',
          progress: 0,
          technologies: techs,
          priority: formData.priority,
          budget: undefined,
          assigneeId: formData.assigneeId ?? undefined,
          assigneeName: formData.assigneeName || undefined,
        });
        
        setProjects(prev => [...prev, { ...(created as any), id: String((created as any).id ?? '') } as Project]);
        toast.success('¡Proyecto creado exitosamente!');

        // Crear tareas iniciales automáticamente si está habilitado
        if (formData.createAutoTasks && created && (created as any).id) {
          const projectId = (created as any).id as string;
          const projectName = (created as any).name as string;
          const projectData = {
            projectName,
            description: formData.description,
            technologies: techs,
            priority: formData.priority,
            startDate: formData.startDate,
            endDate: formData.endDate
          };

          toast.loading('Generando tareas con IA...', { id: 'auto-tasks' });

          try {
            // Intentar generar tareas con IA
            const res = await fetch('/api/ai/generate-project-tasks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ project: projectData, team })
            });
            const aiResponse = await res.json();
            
            if (aiResponse.success && aiResponse.tasks) {
              const base = formData.startDate ? new Date(formData.startDate) : new Date();
              const addDays = (d: Date, n: number) => {
                const x = new Date(d);
                x.setDate(x.getDate() + n);
                return x.toISOString().split('T')[0];
              };

              const payloads = aiResponse.tasks.map((task: any) => {
                // Buscar colaborador sugerido en el equipo local
                const suggestedMember = task.suggestedAssignee 
                  ? team.find(m => m.name.toLowerCase().includes(task.suggestedAssignee.toLowerCase()))
                  : null;

                return {
                  name: task.name,
                  description: task.description,
                  project: projectName,
                  projectId,
                  assignee: suggestedMember ? suggestedMember.name : (formData.assigneeName || ''),
                  assigneeId: suggestedMember ? suggestedMember.id : (formData.assigneeId ?? undefined),
                  deadline: addDays(base, task.daysFromStart || 7),
                  status: 'pendiente',
                  progress: 0,
                  estimatedTime: task.estimatedHours || 8,
                  priority: task.priority || 'media',
                  tags: ['auto', task.category || 'general']
                };
              });

              let ok = 0, fail = 0;
              for (const p of payloads) {
                try {
                  await FirebaseAPI.createTask(p as any);
                  ok += 1;
                } catch (e) {
                  console.error('Error creando tarea IA', p.name, e);
                  fail += 1;
                }
              }
              
              if (ok) {
                toast.success(`¡IA generó ${ok} tareas específicas! ${aiResponse.reasoning || ''}`, { id: 'auto-tasks' });
              } else {
                throw new Error('No se pudieron crear las tareas IA');
              }
            } else {
              throw new Error('Respuesta IA inválida');
            }
          } catch (aiError) {
            console.error('Error generando tareas con IA:', aiError);
            toast.error('Error generando tareas con IA. No se crearon tareas automáticas.', { id: 'auto-tasks' });
          }
        }
      }
      
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error('No se pudo guardar el proyecto');
    }
  };

  return {
    // Data
    projects,
    team,
    filteredProjects,
    loading,
    
    // Form state
    formData,
    setFormData,
    
    // Filters
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    
    // Modal states
    selectedProject,
    isViewOpen,
    setIsViewOpen,
    isModalOpen,
    setIsModalOpen,
    editingId,
    isDeleteOpen,
    setIsDeleteOpen,
    deleteTarget,
    setDeleteTarget,
    
    // Actions
    handleView,
    handleCreate,
    handleEdit,
    handleDeleteRequest,
    confirmDelete,
    handleSubmit,
    resetForm,
  };
}
