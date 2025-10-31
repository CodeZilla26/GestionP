'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  Plus, 
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FirebaseAPI } from '@/lib/firebase-api';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  location: string;
  joinDate: string;
  avatar?: string;
  skills: string[];
  status: 'activo' | 'inactivo' | 'vacaciones';
}

export default function TeamPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    location: '',
    skills: [] as string[]
  });

  // Estado para edición y eliminación
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    location: '',
    skills: [] as string[]
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Cargar equipo desde backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const list = await FirebaseAPI.getTeam();
        const norm = (list as any[]).map((m: any) => ({
          ...m,
          id: String(m.id ?? ''),
          joinDate: typeof m.joinDate === 'string' ? m.joinDate : m.joinDate?.toDate ? m.joinDate.toDate().toISOString().slice(0,10) : new Date().toISOString().slice(0,10),
        })) as TeamMember[];
        setTeamMembers(norm);
      } catch (e) {
        console.error(e);
        toast.error('No se pudo cargar el equipo');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>;
      case 'vacaciones':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Vacaciones</Badge>;
      case 'inactivo':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Inactivo</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  // Handlers: Editar
  const openEditModal = (member: TeamMember) => {
    setEditingId(member.id);
    setEditData({
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email,
      phone: member.phone || '',
      location: member.location,
      skills: [...member.skills]
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId == null) return;
    try {
      await FirebaseAPI.updateTeamMember(editingId, {
        name: editData.name,
        role: editData.role,
        department: editData.department,
        email: editData.email,
        phone: editData.phone,
        location: editData.location,
        skills: editData.skills
      });
      setTeamMembers(prev => prev.map(m => m.id === editingId ? {
        ...m,
        name: editData.name,
        role: editData.role,
        department: editData.department,
        email: editData.email,
        phone: editData.phone,
        location: editData.location,
        skills: editData.skills
      } : m));
      setIsEditOpen(false);
      setEditingId(null);
      toast.success('Colaborador actualizado');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo actualizar el colaborador');
    }
  };

  // Handlers: Eliminar
  const requestDelete = (member: TeamMember) => {
    setDeleteTarget(member);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await FirebaseAPI.deleteTeamMember(deleteTarget.id);
      setTeamMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
      toast.success('Colaborador eliminado');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo eliminar el colaborador');
    } finally {
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };
  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await FirebaseAPI.createTeamMember({
        name: formData.name,
        role: formData.role,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        joinDate: new Date().toISOString().split('T')[0],
        skills: formData.skills,
        status: 'activo',
        avatar: null,
        projects: [],
        tasksCompleted: 0,
        tasksInProgress: 0
      });
      setTeamMembers(prev => [...prev, { ...(created as any), id: String((created as any).id ?? '') } as TeamMember]);
      setFormData({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        location: '',
        skills: []
      });
      setIsModalOpen(false);
      toast.success('¡Colaborador agregado exitosamente!');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo crear el colaborador');
    }
  };

  const getRandomGradient = (id: string) => {
    const gradients = [
      'from-blue-400 to-purple-600',
      'from-green-400 to-blue-600',
      'from-purple-400 to-pink-600',
      'from-yellow-400 to-red-600',
      'from-indigo-400 to-purple-600',
      'from-pink-400 to-red-600'
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return gradients[hash % gradients.length];
  };

  return (
    <DashboardLayout title="Gestión de Colaboradores">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar colaboradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
          />
        </div>

      {/* Edit Member Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl bg-slate-800/95 backdrop-blur-xl border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="w-5 h-5 text-purple-400" />
              Editar Colaborador
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input id="edit-name" value={editData.name} onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} className="bg-slate-700 border-slate-600" required />
              </div>
              <div>
                <Label htmlFor="edit-role">Rol</Label>
                <Input id="edit-role" value={editData.role} onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))} className="bg-slate-700 border-slate-600" required />
              </div>
              <div>
                <Label htmlFor="edit-department">Departamento</Label>
                <Select value={editData.department} onValueChange={(value) => setEditData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="Diseño">Diseño</SelectItem>
                    <SelectItem value="Gestión">Gestión</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-location">Ubicación</Label>
                <Input id="edit-location" value={editData.location} onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))} className="bg-slate-700 border-slate-600" required />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={editData.email} onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))} className="bg-slate-700 border-slate-600" required />
              </div>
              <div>
                <Label htmlFor="edit-phone">Teléfono (opcional)</Label>
                <Input id="edit-phone" type="tel" value={editData.phone} onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))} className="bg-slate-700 border-slate-600" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">Guardar Cambios</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar colaborador?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Colaborador
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-slate-800/95 backdrop-blur-xl border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Users className="w-5 h-5 text-purple-400" />
                Nuevo Colaborador
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-slate-700 border-slate-600" required />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Input id="role" value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} className="bg-slate-700 border-slate-600" required />
                </div>
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                      <SelectItem value="Diseño">Diseño</SelectItem>
                      <SelectItem value="Gestión">Gestión</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="bg-slate-700 border-slate-600" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="bg-slate-700 border-slate-600" required />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="bg-slate-700 border-slate-600" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">Guardar Colaborador</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Colaboradores</p>
              <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Activos</p>
              <p className="text-2xl font-bold text-white">{teamMembers.filter(m => m.status === 'activo').length}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">En Vacaciones</p>
              <p className="text-2xl font-bold text-white">{teamMembers.filter(m => m.status === 'vacaciones').length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Departamentos</p>
              <p className="text-2xl font-bold text-white">{new Set(teamMembers.map(m => m.department)).size}</p>
            </div>
            <Award className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className={`w-12 h-12 bg-gradient-to-br ${getRandomGradient(member.id)}`}>
                  <AvatarFallback className="bg-transparent text-white font-semibold">{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-slate-400">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white" onClick={() => openEditModal(member)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-red-400" onClick={() => requestDelete(member)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Status and Department */}
            <div className="flex items-center justify-between mb-4">
              {getStatusBadge(member.status)}
              <Badge variant="outline" className="text-slate-300 border-slate-600">{member.department}</Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-300"><Mail className="w-4 h-4 text-slate-400" />{member.email}</div>
              {member.phone && <div className="flex items-center gap-2 text-sm text-slate-300"><Phone className="w-4 h-4 text-slate-400" />{member.phone}</div>}
              <div className="flex items-center gap-2 text-sm text-slate-300"><MapPin className="w-4 h-4 text-slate-400" />{member.location}</div>
              <div className="flex items-center gap-2 text-sm text-slate-300"><Calendar className="w-4 h-4 text-slate-400" />Desde {new Date(member.joinDate).toLocaleDateString('es-ES')}</div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-sm text-slate-400 mb-2">Habilidades</p>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">{skill}</Badge>
                ))}
                {member.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">+{member.skills.length - 4}</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}