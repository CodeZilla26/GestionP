'use client';

import { useState } from 'react';
import { Notebook as Robot, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FirebaseAPI } from '@/lib/firebase-api';
import { ProjectFormData, TeamMember } from '../types/project.types';

interface ProjectFormProps {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  team: TeamMember[];
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export function ProjectForm({ formData, setFormData, team, onSubmit, isEditing }: ProjectFormProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Autoasignación basada en skills y carga
  const autoAssignCollaborator = (technologies: string[]) => {
    const techsLower = technologies.map(t => t.toLowerCase());
    const activeTeam = team.filter(m => m.status === 'activo');
    if (!activeTeam.length) return null;

    const scored = activeTeam.map(member => {
      const skillMatches = member.skills.filter(skill => 
        techsLower.some(tech => skill.toLowerCase().includes(tech) || tech.includes(skill.toLowerCase()))
      ).length;
      const workload = member.tasksInProgress + (member.projects?.length || 0);
      return { member, score: skillMatches * 10 - workload };
    }).sort((a, b) => b.score - a.score);

    return scored[0]?.member || null;
  };

  const generateAISuggestions = async () => {
    if (!formData.description) {
      toast.error('Por favor, ingresa una descripción del proyecto para generar sugerencias');
      return;
    }

    setIsGeneratingAI(true);
    toast.loading('Generando sugerencias con IA...', { id: 'ai-loading' });

    try {
      const res = await fetch('/api/ai/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description, team })
      });
      const payload = await res.json();
      const suggestions = payload?.suggestions || {};
      
      // Calcular fechas
      const startDate = formData.startDate || new Date().toISOString().split('T')[0];
      const estimatedDays = parseInt(suggestions.estimatedDuration) || 30;
      const endDate = (() => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + estimatedDays);
        return date.toISOString().split('T')[0];
      })();

      // Buscar colaborador sugerido
      const suggestedMember = suggestions.suggestedAssignee 
        ? team.find(m => m.name.toLowerCase().includes(suggestions.suggestedAssignee.toLowerCase()) || 
                         m.role.toLowerCase().includes(suggestions.suggestedAssignee.toLowerCase()))
        : autoAssignCollaborator(suggestions.technologies || []);

      setFormData(prev => ({
        ...prev,
        name: suggestions.name || prev.name,
        startDate,
        endDate,
        priority: suggestions.priority || prev.priority,
        technologies: suggestions.technologies || [],
        technologiesText: (suggestions.technologies || []).join(', '),
        assigneeId: suggestedMember ? (suggestedMember.id as any) : prev.assigneeId,
        assigneeName: suggestedMember ? suggestedMember.name : prev.assigneeName
      }));

      toast.success(`¡Sugerencias generadas con IA! ${suggestions.reasoning || ''}`, { id: 'ai-loading' });
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast.error('Error al generar sugerencias con IA. Por favor, intenta de nuevo.', { id: 'ai-loading' });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Nombre del proyecto */}
        <div className="col-span-2">
          <Label htmlFor="name">Nombre del proyecto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-slate-700 border-slate-600"
            placeholder="Ej: Sistema de gestión de inventario"
            required
          />
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="bg-slate-700 border-slate-600 min-h-[100px]"
            placeholder="Describe el proyecto, sus objetivos y características principales..."
            required
          />
          
          {/* Botón de IA */}
          <div className="mt-2">
            <Button
              type="button"
              onClick={generateAISuggestions}
              disabled={isGeneratingAI || !formData.description}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 text-purple-400 hover:from-purple-500/20 hover:to-blue-500/20"
            >
              <Robot className="w-4 h-4 mr-2" />
              {isGeneratingAI ? 'Generando...' : 'Generar sugerencias con IA'}
            </Button>
          </div>
        </div>

        {/* Fechas */}
        <div>
          <Label htmlFor="startDate">Fecha de inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="bg-slate-700 border-slate-600"
            required
          />
        </div>

        <div>
          <Label htmlFor="endDate">Fecha de fin</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="bg-slate-700 border-slate-600"
            required
          />
        </div>

        {/* Tecnologías */}
        <div className="col-span-2">
          <Label htmlFor="technologies">Tecnologías</Label>
          <Input
            id="technologies"
            value={formData.technologiesText}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              technologiesText: e.target.value,
              technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
            }))}
            className="bg-slate-700 border-slate-600"
            placeholder="React, Node.js, MongoDB, etc."
          />
          <p className="text-xs text-slate-400 mt-1">Separar con comas</p>
        </div>

        {/* Crear tareas automáticamente */}
        {!isEditing && (
          <div className="col-span-2 flex items-center space-x-2">
            <Checkbox
              id="createAutoTasks"
              checked={formData.createAutoTasks}
              onCheckedChange={(val) => setFormData(prev => ({ ...prev, createAutoTasks: Boolean(val) }))}
            />
            <Label htmlFor="createAutoTasks" className="text-slate-300">
              Crear tareas iniciales automáticamente
            </Label>
          </div>
        )}

        {/* Colaborador asignado */}
        <div className="col-span-2">
          <Label>Colaborador asignado</Label>
          <Select
            value={formData.assigneeId || ''}
            onValueChange={(value) => {
              const member = team.find(m => m.id === value) || null;
              setFormData(prev => ({
                ...prev,
                assigneeId: member ? member.id : null,
                assigneeName: member ? member.name : ''
              }));
            }}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue placeholder="Selecciona un colaborador" />
            </SelectTrigger>
            <SelectContent>
              {team
                .filter(m => m.status === 'activo')
                .map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} — {m.role}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prioridad */}
        <div>
          <Label htmlFor="priority">Prioridad</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baja">Baja</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
}
