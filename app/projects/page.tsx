'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Plus, Filter, Search, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Componentes locales
import { ProjectCard } from './components/ProjectCard';
import { ProjectForm } from './components/ProjectForm';
import { useProjects } from './hooks/useProjects';

export default function ProjectsPage() {
  const router = useRouter();
  
  const {
    // Data
    filteredProjects,
    team,
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
  } = useProjects();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout title="Gestión de Proyectos">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Cargando proyectos...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestión de Proyectos">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="progreso">En Progreso</SelectItem>
              <SelectItem value="completado">Completados</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isModalOpen} onOpenChange={(open) => { 
            if (!open) resetForm(); 
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingId ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                </DialogTitle>
              </DialogHeader>
              
              <ProjectForm
                formData={formData}
                setFormData={setFormData}
                team={team}
                onSubmit={handleSubmit}
                isEditing={!!editingId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">
            {searchTerm || filter !== 'todos' ? 'No se encontraron proyectos' : 'No hay proyectos'}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || filter !== 'todos' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza creando tu primer proyecto'
            }
          </p>
          {!searchTerm && filter === 'todos' && (
            <Button 
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Proyecto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* View Project Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedProject?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-300 mb-2">Descripción</h4>
                <p className="text-slate-400">{selectedProject.description}</p>
              </div>
              
              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-300 mb-2">Tecnologías</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-md border border-blue-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-300 mb-1">Fecha de inicio</h4>
                  <p className="text-slate-400">{new Date(selectedProject.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-300 mb-1">Fecha de fin</h4>
                  <p className="text-slate-400">{new Date(selectedProject.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedProject.assigneeName && (
                <div>
                  <h4 className="font-medium text-slate-300 mb-1">Asignado a</h4>
                  <p className="text-slate-400">{selectedProject.assigneeName}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={(open) => {
        if (!open) {
          setIsDeleteOpen(false);
          setDeleteTarget(null);
        }
      }}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto
              <span className="font-medium text-white"> "{deleteTarget?.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteTarget(null);
              }}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
