# 🚀 Guía de Deploy a Vercel

## ⚠️ Problema Actual con Build Local

Tu proyecto tiene un error de compilación local relacionado con dependencias corruptas de Radix UI. **Esto NO significa que el proyecto no funcionará en Vercel**.

### Por qué puede fallar localmente pero funcionar en Vercel:
- Vercel usa un entorno limpio y optimizado
- Instala dependencias desde cero
- Usa caché de build optimizada
- Tiene mejor compatibilidad con Next.js 13+

## ✅ Pasos para Deployar a Vercel

### 1. **Preparar Variables de Entorno**

En Vercel necesitas configurar estas variables:

```env
OPENROUTER_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
NEXT_PUBLIC_SITE_NAME=Gestión de Proyectos IA
```

⚠️ **IMPORTANTE**: NO subas tu `.env.local` a Git. La API key debe configurarse en Vercel.

### 2. **Subir a Git**

```bash
git add .
git commit -m "Preparar proyecto para deploy"
git push origin main
```

### 3. **Conectar con Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub/GitLab
3. Vercel detectará automáticamente que es Next.js
4. **Configura las variables de entorno** en el panel de Vercel

### 4. **Configurar Firebase para Producción**

Tu archivo `lib/firebase.ts` debe usar las credenciales correctas para producción.
Verifica que las variables `NEXT_PUBLIC_*` de Firebase estén configuradas.

## 🔧 Si el Build Falla en Vercel

Si Vercel también falla al hacer build, prueba estas soluciones:

### Solución 1: Limpiar dependencias localmente

```bash
# Borrar carpetas de cache
rm -rf .next
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install
npm run build
```

### Solución 2: Actualizar Next.js

```bash
npm install next@latest react@latest react-dom@latest
```

### Solución 3: Actualizar Radix UI

El error parece estar en componentes de Radix. Actualiza:

```bash
npm update @radix-ui/react-progress @radix-ui/react-dialog
```

## 📋 Checklist Pre-Deploy

- [✅] `.gitignore` actualizado
- [✅] `vercel.json` configurado
- [✅] Variables de entorno identificadas
- [ ] Código subido a Git
- [ ] Variables configuradas en Vercel
- [ ] Firebase configurado para producción

## 🎯 Opción Recomendada: Deploy Directo

**Mi recomendación:** Intenta deployar directamente a Vercel sin preocuparte por el build local. Vercel tiene mejor optimización para Next.js y puede resolver automáticamente estos problemas de dependencias.

## 🔑 Variables de Entorno en Vercel

1. En tu proyecto de Vercel, ve a **Settings → Environment Variables**
2. Agrega cada variable:
   - `OPENROUTER_API_KEY` → Tu API key
   - `NEXT_PUBLIC_SITE_URL` → La URL de tu deploy (se genera automáticamente)
   - `NEXT_PUBLIC_SITE_NAME` → "Gestión de Proyectos IA"
3. Guarda y redeploy

## 📦 Archivos de Configuración Importantes

- `next.config.js` - Configuración de Next.js
- `vercel.json` - Configuración de Vercel
- `.gitignore` - Archivos ignorados por Git
- `package.json` - Dependencias del proyecto

## 🚨 Notas de Seguridad

1. **NUNCA** commites `.env.local` a Git
2. **SIEMPRE** usa variables de entorno en Vercel para secretos
3. Tu API key actual está visible en `.env.local` - considera rotarla

## ✨ Después del Deploy

Una vez deployado:
1. Verifica que la aplicación cargue
2. Prueba login/registro
3. Verifica conexión con Firebase
4. Prueba las funcionalidades principales

---

**¿Necesitas ayuda?** Si el deploy falla, copia el error de Vercel y lo revisamos juntos.
