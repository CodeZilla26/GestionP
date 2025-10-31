'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FirebaseAPI } from '@/lib/firebase-api';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    projectUpdates: boolean;
    taskReminders: boolean;
    teamMessages: boolean;
  };
  appearance: {
    theme: string;
    language: string;
    timezone: string;
  };
  security: {
    twoFactor: boolean;
    loginNotifications: boolean;
    sessionTimeout: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      location: ''
    },
    notifications: {
      email: true,
      push: true,
      desktop: false,
      projectUpdates: true,
      taskReminders: true,
      teamMessages: false
    },
    appearance: {
      theme: 'dark',
      language: 'es',
      timezone: 'America/Mexico_City'
    },
    security: {
      twoFactor: false,
      loginNotifications: true,
      sessionTimeout: '30'
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Initialize profile settings with user data
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        // If no name, derive a sensible default from email (before @)
        name: (parsedUser?.name && typeof parsedUser.name === 'string' && parsedUser.name.trim())
          ? parsedUser.name
          : (parsedUser?.email && typeof parsedUser.email === 'string')
            ? String(parsedUser.email).split('@')[0]
            : '',
        email: parsedUser.email
      }
    }));

    // Load settings from backend
    const loadSettings = async () => {
      try {
        const email = parsedUser?.email as string;
        if (!email) return;
        const res = await FirebaseAPI.getUserByEmail(email);
        if (res) {
          setSettings((prev) => ({
            ...prev,
            ...((res as any).settings || {}),
            // Ensure profile email/name stay consistent with user
            profile: {
              ...prev.profile,
              ...((res as any).settings?.profile || {}),
              email: parsedUser.email,
              name: ((((res as any).settings?.profile?.name as string) || prev.profile.name) as string),
            },
          }));
        }
      } catch (e) {
        console.error('Error cargando configuración:', e);
      }
    };
    loadSettings();
  }, [router]);

  const handleProfileUpdate = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleNotificationUpdate = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleAppearanceUpdate = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: value
      }
    }));
  };

  const handleSecurityUpdate = (field: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      const email = user?.email as string;
      if (!email) return;
      const doc = await FirebaseAPI.getUserByEmail(email);
      if (doc?.id) {
        await FirebaseAPI.updateUserSettings(doc.id, settings);
        // Update localStorage user cache (for UI like sidebar/header)
        try {
          const cached = localStorage.getItem('user');
          if (cached) {
            const parsed = JSON.parse(cached);
            const updated = { ...parsed, name: settings.profile.name, email: settings.profile.email };
            localStorage.setItem('user', JSON.stringify(updated));
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('user-updated'));
            }
          }
        } catch {}
        toast.success('Configuración guardada exitosamente');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al guardar la configuración');
    }
  };

  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string') return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    const initials = parts.slice(0, 2).map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  if (!user) return null;

  return (
    <DashboardLayout title="Configuración">
      <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md bg-white/10 backdrop-blur-xl mb-8">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white/20">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white/20">
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-white/20">
                <Palette className="w-4 h-4 mr-2" />
                Apariencia
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white/20">
                <Shield className="w-4 h-4 mr-2" />
                Seguridad
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Información del Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600">
                      <AvatarFallback className="bg-transparent text-white font-bold text-2xl">
                        {getInitials(settings.profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="mb-2">
                        <Camera className="w-4 h-4 mr-2" />
                        Cambiar Foto
                      </Button>
                      <p className="text-sm text-slate-400">
                        Recomendamos una imagen de 400x400px
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-200">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) => handleProfileUpdate('name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-slate-200">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-slate-200">Teléfono</Label>
                      <Input
                        id="phone"
                        value={settings.profile.phone}
                        onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="text-slate-200">Ubicación</Label>
                      <Input
                        id="location"
                        value={settings.profile.location}
                        onChange={(e) => handleProfileUpdate('location', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className="text-slate-200">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={settings.profile.bio}
                      onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                      placeholder="Cuéntanos un poco sobre ti..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-green-400" />
                    Configuración de Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-200 font-medium">Notificaciones por Email</Label>
                        <p className="text-sm text-slate-400">Recibir notificaciones en tu correo electrónico</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => handleNotificationUpdate('email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-200 font-medium">Notificaciones Push</Label>
                        <p className="text-sm text-slate-400">Notificaciones en tiempo real</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => handleNotificationUpdate('push', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-200 font-medium">Notificaciones de Escritorio</Label>
                        <p className="text-sm text-slate-400">Mostrar notificaciones en el escritorio</p>
                      </div>
                      <Switch
                        checked={settings.notifications.desktop}
                        onCheckedChange={(checked) => handleNotificationUpdate('desktop', checked)}
                      />
                    </div>
                    
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-slate-200 font-medium mb-4">Tipos de Notificación</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-slate-200">Actualizaciones de Proyecto</Label>
                            <p className="text-sm text-slate-400">Cambios en proyectos que sigues</p>
                          </div>
                          <Switch
                            checked={settings.notifications.projectUpdates}
                            onCheckedChange={(checked) => handleNotificationUpdate('projectUpdates', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-slate-200">Recordatorios de Tareas</Label>
                            <p className="text-sm text-slate-400">Alertas sobre fechas límite</p>
                          </div>
                          <Switch
                            checked={settings.notifications.taskReminders}
                            onCheckedChange={(checked) => handleNotificationUpdate('taskReminders', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-slate-200">Mensajes del Equipo</Label>
                            <p className="text-sm text-slate-400">Mensajes de compañeros de equipo</p>
                          </div>
                          <Switch
                            checked={settings.notifications.teamMessages}
                            onCheckedChange={(checked) => handleNotificationUpdate('teamMessages', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Configuración de Apariencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-slate-200 font-medium">Tema</Label>
                      <Select value={settings.appearance.theme} onValueChange={(value) => handleAppearanceUpdate('theme', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-slate-200 font-medium">Idioma</Label>
                      <Select value={settings.appearance.language} onValueChange={(value) => handleAppearanceUpdate('language', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label className="text-slate-200 font-medium">Zona Horaria</Label>
                      <Select value={settings.appearance.timezone} onValueChange={(value) => handleAppearanceUpdate('timezone', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                          <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                          <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Configuración de Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-200 font-medium">Autenticación de Dos Factores</Label>
                        <p className="text-sm text-slate-400">Añade una capa extra de seguridad a tu cuenta</p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => handleSecurityUpdate('twoFactor', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-200 font-medium">Notificaciones de Inicio de Sesión</Label>
                        <p className="text-sm text-slate-400">Recibe alertas cuando alguien acceda a tu cuenta</p>
                      </div>
                      <Switch
                        checked={settings.security.loginNotifications}
                        onCheckedChange={(checked) => handleSecurityUpdate('loginNotifications', checked)}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-200 font-medium">Tiempo de Expiración de Sesión</Label>
                      <Select 
                        value={settings.security.sessionTimeout} 
                        onValueChange={(value) => handleSecurityUpdate('sessionTimeout', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="480">8 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-slate-200 font-medium mb-4">Cambiar Contraseña</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-200">Contraseña Actual</Label>
                          <Input
                            type="password"
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-200">Nueva Contraseña</Label>
                          <Input
                            type="password"
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <Button className="mt-4 bg-red-600 hover:bg-red-700">
                        Cambiar Contraseña
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={saveSettings} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg">
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </DashboardLayout>
  );
}