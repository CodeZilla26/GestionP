import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { ok: false, message: 'Content-Type inválido. Usa application/json' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null as any);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { ok: false, message: 'Cuerpo de la petición inválido' },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = body as {
      email?: unknown;
      password?: unknown;
      rememberMe?: unknown;
    };

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }
    const remember = typeof rememberMe === 'boolean' ? rememberMe : false;

    // Usar Firebase Auth en lugar del servidor Express
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Usuario'
      };
      
      console.log('Firebase login successful:', userData);

      // Setear cookie HttpOnly para sesión
      const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60 * 4; // 7 días o 4 horas
      const response = NextResponse.json({ ok: true, user: userData });
      const isProd = process.env.NODE_ENV === 'production';
      
      response.cookies.set({
        name: 'auth',
        value: 'session',
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge,
      });
      
      response.cookies.set({
        name: 'user_email',
        value: email,
        httpOnly: false,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge,
      });

      return response;
      
    } catch (firebaseError: any) {
      console.error('Firebase login error:', firebaseError);
      return NextResponse.json(
        { ok: false, message: 'Credenciales inválidas' }, 
        { status: 401 }
      );
    }
    
  } catch (e) {
    console.error('Login API error:', e);
    return NextResponse.json({ ok: false, message: 'Error del servidor' }, { status: 500 });
  }
}

