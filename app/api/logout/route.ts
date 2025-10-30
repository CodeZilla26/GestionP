import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  // Borrar cookies de sesión
  response.cookies.set({ name: 'auth', value: '', maxAge: 0, path: '/' });
  response.cookies.set({ name: 'user_email', value: '', maxAge: 0, path: '/' });
  return response;
}
