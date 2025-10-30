# 🚀 Sistema de Gestión de Proyectos con IA

Una aplicación moderna de gestión de proyectos construida con **Next.js** y **Firebase**, potenciada por **Inteligencia Artificial** para automatizar la creación de proyectos y tareas.

## ✨ Características

### 🤖 **IA Integrada**
- **Generación automática de proyectos** con nombres, tecnologías y fechas sugeridas
- **Creación inteligente de tareas** basada en descripción del proyecto
- **Asignación automática** de colaboradores según skills y disponibilidad
- **Estimación de tiempos** y prioridades automáticas

### 📊 **Gestión Completa**
- **Proyectos:** Crear, editar, eliminar y seguimiento de progreso
- **Tareas:** Gestión completa con estados, prioridades y asignaciones
- **Equipo:** Administración de colaboradores y skills
- **Dashboard:** Métricas en tiempo real y analytics
- **Notificaciones:** Sistema de alertas inteligentes

### 🔥 **Tecnologías**
- **Frontend:** Next.js 13, React, TypeScript, Tailwind CSS
- **Backend:** Firebase (Firestore + Authentication)
- **IA:** OpenRouter + DeepSeek
- **UI:** Radix UI + shadcn/ui
- **Iconos:** Lucide React

## 🏗️ **Arquitectura**

```
🔥 Firebase (Cloud)
├── 🔐 Authentication (login/logout)
├── 📊 Firestore (proyectos, tareas, equipo, usuarios)
└── 📈 Analytics

⚡ Next.js (Frontend + API Routes)
├── 🎨 React Components (UI)
├── 🤖 API Routes (/api/ai/*)
├── 🔌 Firebase SDK
└── 🎯 TypeScript
```

## 🚀 **Instalación y Uso**

### **1. Clonar repositorio**
```bash
git clone [tu-repo]
cd practicas
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Crear `.env.local`:
```env
# OpenRouter (IA)
OPENROUTER_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_OPENROUTER_SITE_URL=http://localhost:3000
NEXT_PUBLIC_OPENROUTER_AI_GATEWAY=true
```

### **4. Configurar Firebase**
- Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilitar **Authentication** (Email/Password)
- Habilitar **Firestore Database**
- Actualizar configuración en `lib/firebase.ts`

### **5. Ejecutar aplicación**
```bash
npm run dev
```

### **6. Crear primer usuario**
- Ve a `http://localhost:3000/register`
- Crea tu cuenta de administrador
- Inicia sesión en `http://localhost:3000/login`

## 📱 **Funcionalidades Principales**

### **🏠 Dashboard**
- Métricas de proyectos, tareas y equipo
- Gráficos de progreso y productividad
- Notificaciones recientes

### **📋 Proyectos**
- **Crear con IA:** Describe tu proyecto y la IA sugiere nombre, tecnologías, fechas
- **Tareas automáticas:** Genera tareas específicas para cada proyecto
- **Seguimiento:** Estados, progreso, asignaciones

### **✅ Tareas**
- **Sugerencias IA:** Autocompletado inteligente de campos
- **Gestión completa:** Estados, prioridades, tiempos estimados
- **Asignación inteligente:** Basada en skills del equipo

### **👥 Equipo**
- Gestión de colaboradores
- Skills y especialidades
- Carga de trabajo y disponibilidad

### **🔔 Notificaciones**
- Alertas en tiempo real
- Recordatorios de tareas
- Updates de proyectos

## 🤖 **IA Features**

### **Generación de Proyectos**
```typescript
// Ejemplo de uso
const suggestions = await API.generateProjectSuggestions(
  "Crear una tienda online para venta de productos artesanales",
  team
);
// Resultado: nombre, tecnologías, fechas, asignaciones sugeridas
```

### **Creación Automática de Tareas**
```typescript
// La IA analiza el proyecto y genera tareas específicas
const tasks = await API.generateProjectTasks(projectData, team);
// Resultado: tareas detalladas con asignaciones inteligentes
```

## 📦 **Scripts Disponibles**

```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run start    # Ejecutar build
npm run lint     # Linting
```

## 🔧 **Configuración Avanzada**

### **Firebase Rules (Firestore)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Firebase Rules (Authentication)**
- Habilitar Email/Password
- Configurar dominios autorizados
- Opcional: Habilitar proveedores adicionales (Google, GitHub)

## 🎯 **Roadmap**

- [ ] **Reportes avanzados** con exportación PDF
- [ ] **Integración con calendarios** (Google Calendar, Outlook)
- [ ] **Chat en tiempo real** entre colaboradores
- [ ] **Aplicación móvil** (React Native)
- [ ] **Integración con Git** para seguimiento de código
- [ ] **Templates de proyectos** predefinidos

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 **Agradecimientos**

- **OpenRouter** por la API de IA
- **Firebase** por la infraestructura backend
- **Vercel** por el hosting
- **shadcn/ui** por los componentes UI

---

**¡Construido con ❤️ y mucha ☕!**
