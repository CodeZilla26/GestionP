'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import FirebaseAPI from '../../lib/firebase-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('Jose Ampuero');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con nombre en Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Crear perfil completo en Firestore
      await FirebaseAPI.createUser({
        uid: userCredential.user.uid,
        name,
        email,
        role: 'admin',
        settings: {
          profile: { 
            name, 
            email, 
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
        }
      });

      toast.success('¡Usuario creado exitosamente con perfil completo!');
      console.log('Usuario creado:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName
      });

      // Redirigir al login
      window.location.href = '/login';
      
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.success('El usuario ya existe. Puedes hacer login.');
        window.location.href = '/login';
      } else {
        toast.error('Error creando usuario: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-center">
            Crear Usuario de Prueba
          </CardTitle>
          <p className="text-slate-400 text-center text-sm">
            Solo para configuración inicial
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm">Nombre</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div>
              <label className="text-slate-300 text-sm">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div>
              <label className="text-slate-300 text-sm">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <a 
              href="/login" 
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ¿Ya tienes cuenta? Ir al login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
