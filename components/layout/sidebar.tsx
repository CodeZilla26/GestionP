'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  FolderOpen,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface User {
  id: number;
  username: string;
  role: string;
  name: string;
  email: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Proyectos', href: '/projects', icon: FolderOpen },
  { name: 'Tareas', href: '/tasks', icon: CheckSquare },
  { name: 'Colaboradores', href: '/team', icon: Users },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const load = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      } catch {}
    };
    load();
    const handler = () => load();
    if (typeof window !== 'undefined') {
      window.addEventListener('user-updated', handler as EventListener);
      window.addEventListener('storage', handler as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('user-updated', handler as EventListener);
        window.removeEventListener('storage', handler as EventListener);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    } catch {}
    // Redirigir con recarga completa para limpiar estado
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  // Valores derivados y seguros
  const displayName = user?.name || (user as any)?.username || (user as any)?.email?.split?.('@')?.[0] || 'Usuario';
  const initial = (displayName?.charAt?.(0) || 'U').toUpperCase();
  const roleText = (user as any)?.role || 'usuario';

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white/10 backdrop-blur-lg border border-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-72 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
        border-r border-white/10 backdrop-blur-xl
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ProyectoSG</h1>
                <p className="text-xs text-slate-400">Gestión Inteligente</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600">
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{displayName}</h3>
                  <p className="text-sm text-slate-400 capitalize">{roleText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}