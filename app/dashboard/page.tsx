'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  TrendingUp,
  Calendar,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import API from '@/lib/api';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalTeamMembers: number;
  overdueTasks: number;
}

interface RecentProject {
  id: number;
  name: string;
  progress: number;
  status: string;
  deadline: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalTeamMembers: 0,
    overdueTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // middleware protege esta ruta, pero mantenemos fallback
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await API.getDashboard();
        setStats(data.stats as DashboardStats);
        setRecentProjects(data.recentProjects as RecentProject[]);
      } catch (e) {
        console.error('Error cargando dashboard:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>;
      case 'progreso':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">En Progreso</Badge>;
      case 'completado':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Total Proyectos</CardTitle>
                <FolderOpen className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
                <p className="text-xs text-slate-400">
                  {stats.activeProjects} activos, {stats.completedProjects} completados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Tareas</CardTitle>
                <CheckSquare className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
                <p className="text-xs text-slate-400">
                  {stats.completedTasks} completadas ({Math.round((stats.completedTasks / stats.totalTasks) * 100)}%)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Equipo</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalTeamMembers}</div>
                <p className="text-xs text-slate-400">
                  Colaboradores activos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Tareas Vencidas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.overdueTasks}</div>
                <p className="text-xs text-slate-400">
                  Requieren atención inmediata
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Proyectos Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">{project.name}</h4>
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-xs text-slate-400 min-w-0">{project.progress}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        Entrega: {new Date(project.deadline).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => router.push('/projects')}
                    className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-center"
                  >
                    <FolderOpen className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Nuevo Proyecto</span>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/tasks')}
                    className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-center"
                  >
                    <CheckSquare className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Nueva Tarea</span>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/team')}
                    className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors text-center"
                  >
                    <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Gestionar Equipo</span>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/reports')}
                    className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-colors text-center"
                  >
                    <TrendingUp className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Ver Reportes</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
    </DashboardLayout>
  );
}