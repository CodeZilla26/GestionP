"use client";

import { useState } from 'react';
import { FirebaseAPI } from '@/lib/firebase-api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUserShield, FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email || !password) {
        setError('Por favor ingresa tu correo y contraseña');
        return;
      }
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || 'Credenciales incorrectas. Usa admin@example.com / admin123');
        return;
      }
      const payload = await res.json().catch(() => ({ ok: true, user: { email } }));
      // Guardar info no sensible en localStorage sólo para UI
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
        // Try to resolve a friendly display name
        let displayName = '';
        try {
          const userDoc = await FirebaseAPI.getUserByEmail(email).catch(() => null as any);
          displayName = userDoc?.settings?.profile?.name || '';
        } catch {}
        if (!displayName) {
          displayName = payload?.user?.name || String(email).split('@')[0];
        }
        const role = payload?.user?.role || 'usuario';
        localStorage.setItem('user', JSON.stringify({ email, name: displayName, role }));
        // Notify UI parts (e.g., sidebar) to refresh
        window.dispatchEvent(new Event('user-updated'));
        // Redirigir con recarga completa para asegurar lectura de cookies por middleware
        window.location.href = '/dashboard';
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intenta de nuevo.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaUserShield className="login-icon" />
          <h1>Sistema de Gestión</h1>
        </div>
        
        <div className="error-message" role="alert" aria-live="polite" style={{ display: error ? 'block' : 'none' }}>
          {error}
        </div>
        
        <form className="login-form" onSubmit={handleSubmit} aria-busy={loading}>
          <div className="form-group">
            <label htmlFor="email"><FaUser /> Usuario</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Ingrese su correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password"><FaLock /> Contraseña</label>
            <div className="password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese su contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Recordarme
            </label>
            
            <Link href="/forgot-password" className="forgot-password">
              ¿Olvidó su contraseña?
            </Link>
          </div>
          
          <button type="submit" className="login-button" disabled={loading} aria-disabled={loading}>
            <FaSignInAlt /> {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          
          <div className="register-link">
            ¿No tienes una cuenta?{' '}
            <Link href="/register">Regístrate aquí</Link>
          </div>
        </form>
      </div>
      
      <style jsx global>{`
        :root {
          --primary: #4361ee;
          --primary-dark: #3a56d4;
          --gray: #e5e7eb;
          --gray-dark: #9ca3af;
          --error: #ef4444;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #4361ee, #7209b7);
        }
        
        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
          overflow: hidden;
        }
        
        .login-header {
          padding: 2.5rem 2rem;
          text-align: center;
          border-bottom: 1px solid var(--gray);
        }
        
        .login-icon {
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 1rem;
        }
        
        .login-header h1 {
          font-size: 1.75rem;
          color: #1f2937;
          margin: 0;
        }
        
        .login-form {
          padding: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4b5563;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--gray);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }
        
        .password-input {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-dark);
          cursor: pointer;
          padding: 0.25rem;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1.5rem 0;
          font-size: 0.875rem;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4b5563;
          cursor: pointer;
        }
        
        .remember-me input {
          width: auto;
          accent-color: var(--primary);
        }
        
        .forgot-password {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }
        
        .forgot-password:hover {
          text-decoration: underline;
        }
        
        .login-button {
          width: 100%;
          padding: 0.875rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background-color 0.2s;
        }
        
        .login-button:hover {
          background: var(--primary-dark);
        }
        
        .register-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .register-link a {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }
        
        .register-link a:hover {
          text-decoration: underline;
        }
        
        .error-message {
          background: #fee2e2;
          color: var(--error);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin: 0 2rem -1rem 2rem;
          font-size: 0.875rem;
          text-align: center;
        }
        
        @media (max-width: 480px) {
          .login-container {
            padding: 1rem;
          }
          
          .login-header {
            padding: 1.5rem 1rem;
          }
          
          .login-form {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}