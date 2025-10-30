'use client';

import { Eye, Edit, Trash2, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Project } from '../types/project.types';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>;
      case 'progreso':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Progreso</Badge>;
      case 'completado':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Completado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'text-red-400';
      case 'alta': return 'text-orange-400';
      case 'media': return 'text-yellow-400';
      case 'baja': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            onClick={() => onView(project)} 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-slate-400 hover:text-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => onEdit(project)} 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-slate-400 hover:text-white"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => onDelete(project)} 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-slate-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-md border border-blue-500/20"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-slate-500/10 text-slate-400 text-xs rounded-md border border-slate-500/20">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
        {project.startDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(project.startDate).toLocaleDateString()}</span>
          </div>
        )}
        
        {project.assigneeName && (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="truncate">{project.assigneeName}</span>
          </div>
        )}
        
        {project.priority && (
          <div className={`font-medium ${getPriorityColor(project.priority)}`}>
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        {getStatusBadge(project.status)}
        
        <div className="flex items-center gap-2">
          <div className="flex-1 w-16">
            <Progress value={project.progress} className="h-2" />
          </div>
          <span className="text-xs text-slate-400 min-w-0">{project.progress}%</span>
        </div>
      </div>
    </div>
  );
}
