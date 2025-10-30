'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import projectsRaw from '@/data/projects.json';
import tasksRaw from '@/data/tasks.json';
import teamRaw from '@/data/team.json';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

export default function ReportsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('general');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Helpers de fechas y etiquetas
  const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const weekdayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const parseDate = (s?: string) => (s ? new Date(s) : null);

  const getLastNMonths = (n: number) => {
    const now = new Date();
    const arr: { key: string; year: number; month: number }[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({ key: `${monthNames[d.getMonth()]}`, year: d.getFullYear(), month: d.getMonth() });
    }
    return arr;
  };

  const getLastNDays = (n: number) => {
    const today = new Date();
    const days: { key: string; date: Date }[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = n <= 7 ? weekdayNames[d.getDay()] : `${('0'+d.getDate()).slice(-2)}/${('0'+(d.getMonth()+1)).slice(-2)}`;
      days.push({ key, date: d });
    }
    return days;
  };

  const monthsForRange = (range: string) => {
    switch (range) {
      case 'week': return 1; // mostrar último mes para proyectos/productividad
      case 'month': return 1;
      case 'quarter': return 3;
      case 'year': return 12;
      default: return 6;
    }
  };

  const daysForRange = (range: string) => {
    switch (range) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return 7;
    }
  };

  // Agregaciones: Proyectos por mes (últimos 6)
  const projectsData = (() => {
    const months = getLastNMonths(monthsForRange(timeRange));
    return months.map(m => {
      const completados = projectsRaw.filter(p => p.status === 'completado' && (() => { const ed = parseDate(p.endDate); return ed && ed.getFullYear() === m.year && ed.getMonth() === m.month; })()).length;
      const activos = projectsRaw.filter(p => (p.status === 'activo' || p.status === 'progreso') && (() => { const sd = parseDate(p.startDate); return sd && sd.getFullYear() === m.year && sd.getMonth() === m.month; })()).length;
      return { name: m.key, completados, activos, total: completados + activos };
    });
  })();

  // Agregaciones: Tareas por día (últimos 7)
  const tasksData = (() => {
    const days = getLastNDays(daysForRange(timeRange));
    return days.map(d => {
      const y = d.date.getFullYear();
      const m = d.date.getMonth();
      const day = d.date.getDate();
      const sameDay = (s?: string) => { const dt = parseDate(s); return !!dt && dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === day; };
      const completed = tasksRaw.filter(t => t.status === 'completada' && sameDay(t.deadline)).length;
      const pending = tasksRaw.filter(t => t.status !== 'completada' && sameDay(t.deadline)).length;
      return { name: d.key, completed, pending };
    });
  })();

  // Agregaciones: Distribución por departamento (miembros activos)
  const departmentData = (() => {
    const active = teamRaw.filter((m: any) => m.status === 'activo');
    const total = active.length || 1;
    const groups: Record<string, number> = {};
    for (const m of active as any[]) {
      groups[m.department] = (groups[m.department] || 0) + 1;
    }
    const palette = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#84CC16'];
    return Object.entries(groups).map(([name, count], idx) => ({ name, value: Math.round((count / total) * 100), color: palette[idx % palette.length] }));
  })();

  // Agregaciones: Productividad mensual (ratio tareas completadas)
  const productivityData = (() => {
    const months = getLastNMonths(monthsForRange(timeRange));
    return months.map(mo => {
      const inMonth = (s?: string) => { const d = parseDate(s); return !!d && d.getFullYear() === mo.year && d.getMonth() === mo.month; };
      const completed = tasksRaw.filter(t => t.status === 'completada' && inMonth(t.deadline)).length;
      const total = tasksRaw.filter(t => inMonth(t.deadline)).length;
      const productivity = total ? Math.round((completed / total) * 100) : 0;
      return { name: mo.key, productivity };
    });
  })();

  // Métricas para Summary Cards
  const summaryProjectsCompleted = projectsRaw.filter(p => p.status === 'completado').length;
  const summaryProjectsPct = Math.round((summaryProjectsCompleted / (projectsRaw.length || 1)) * 100);
  const summaryTasksCompleted = tasksRaw.filter(t => t.status === 'completada').length;
  const summaryTasksPct = Math.round((summaryTasksCompleted / (tasksRaw.length || 1)) * 100);
  const summaryProductivity = Math.round(
    productivityData.reduce((acc, x) => acc + x.productivity, 0) / (productivityData.length || 1)
  );
  const avgHours = (() => {
    const nums = tasksRaw.map(t => Number(t.estimatedTime)).filter(x => !isNaN(x));
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  })();
  const avgDays = Math.round(((avgHours / 8) + Number.EPSILON) * 10) / 10; // día laboral=8h
  const summaryTimePct = Math.min(100, Math.round((avgDays / 10) * 100)); // normaliza sobre 10 días

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Reportes y Analytics">
      {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-slate-400" />
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mes</SelectItem>
                  <SelectItem value="quarter">Último Trimestre</SelectItem>
                  <SelectItem value="year">Último Año</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="projects">Proyectos</SelectItem>
                  <SelectItem value="tasks">Tareas</SelectItem>
                  <SelectItem value="team">Equipo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg">
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Proyectos Completados</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{summaryProjectsCompleted}</div>
                <p className="text-xs text-slate-400">
                  {summaryProjectsPct}% del total
                </p>
                <Progress value={summaryProjectsPct} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Tareas Finalizadas</CardTitle>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{summaryTasksCompleted}</div>
                <p className="text-xs text-slate-400">
                  {summaryTasksPct}% del total
                </p>
                <Progress value={summaryTasksPct} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Productividad</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{summaryProductivity}%</div>
                <p className="text-xs text-slate-400">
                  Promedio últimos 6 meses
                </p>
                <Progress value={summaryProductivity} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Tiempo Promedio</CardTitle>
                <Calendar className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{avgDays}d</div>
                <p className="text-xs text-slate-400">
                  Estimado (8h/día)
                </p>
                <Progress value={summaryTimePct} className="mt-3 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Charts by reportType */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {(reportType === 'general' || reportType === 'projects') && (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Estado de Proyectos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="completados" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="activos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {(reportType === 'general' || reportType === 'team') && (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-400" />
                    Distribución por Departamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                        stroke="none"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {departmentData.map((dept, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        />
                        <span className="text-sm text-slate-300">{dept.name}</span>
                        <span className="text-xs text-slate-400 ml-auto">{dept.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Charts by reportType */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(reportType === 'general' || reportType === 'tasks') && (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Tareas - {timeRange === 'week' ? 'Última Semana' : timeRange === 'month' ? 'Último Mes' : timeRange === 'quarter' ? 'Último Trimestre' : 'Último Año'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={tasksData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="completed" 
                        stackId="1"
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pending" 
                        stackId="1"
                        stroke="#F59E0B" 
                        fill="#F59E0B" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {(reportType === 'general' || reportType === 'projects') && (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Tendencia de Productividad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={productivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="productivity" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
    </DashboardLayout>
  );
}