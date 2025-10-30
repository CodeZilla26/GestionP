import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Gestión de Proyectos IA",
  },
});

export async function POST(request: NextRequest) {
  try {
    const { description, projects = [], teamMembers = [] } = await request.json();
    
    if (!description) {
      return NextResponse.json({ ok: false, message: 'Descripción requerida' }, { status: 400 });
    }

    const projectInfo = projects.length > 0 
      ? `\n\nProyectos disponibles: ${projects.map((p: any) => `${p.name} (${p.technologies?.join(', ') || 'N/A'})`).join(', ')}`
      : '';
    
    const teamInfo = teamMembers.length > 0 
      ? `\n\nEquipo disponible: ${teamMembers.map((m: any) => `${m.name} (${m.role}, carga actual: ${m.tasksInProgress || 0} tareas)`).join(', ')}`
      : '';

    const prompt = `Eres un experto en gestión de tareas de desarrollo. Basándote en esta descripción de tarea: "${description}"${projectInfo}${teamInfo}

Genera sugerencias en formato JSON con esta estructura exacta:
{
  "suggestedProject": "nombre del proyecto más apropiado (si hay proyectos disponibles)",
  "priority": "baja|media|alta",
  "estimatedHours": "número de horas estimadas",
  "suggestedAssignee": "nombre del mejor colaborador (si hay equipo disponible)",
  "deadline": "fecha sugerida en formato YYYY-MM-DD (desde hoy)",
  "reasoning": "breve explicación de las decisiones"
}

Considera:
- Proyecto más relevante según tecnologías y contexto
- Prioridad basada en palabras clave (crítico, urgente, etc.)
- Horas realistas según complejidad (2-80 horas)
- Colaborador con menor carga de trabajo
- Deadline basado en prioridad y complejidad

Responde SOLO con el JSON válido, sin texto adicional.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    const response = completion.choices[0].message.content?.trim();
    
    if (!response) {
      throw new Error('No response from AI');
    }

    try {
      const suggestions = JSON.parse(response);
      return NextResponse.json({ ok: true, suggestions });
    } catch (parseError) {
      console.warn('Error parsing AI response, using fallback:', parseError);
      const suggestions = {
        suggestedProject: extractValue(response, 'suggestedProject') || null,
        priority: extractValue(response, 'priority') || 'media',
        estimatedHours: extractValue(response, 'estimatedHours') || '8',
        suggestedAssignee: extractValue(response, 'suggestedAssignee') || null,
        deadline: calculateDeadline(8),
        reasoning: extractValue(response, 'reasoning') || 'Sugerencias generadas automáticamente'
      };
      return NextResponse.json({ ok: true, suggestions });
    }
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return NextResponse.json(
      { ok: false, message: 'No se pudieron generar sugerencias de tarea' },
      { status: 500 }
    );
  }
}

// Funciones auxiliares
function extractValue(text: string, key: string): string | null {
  const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, 'i');
  const match = text.match(regex);
  return match ? match[1] : null;
}

function calculateDeadline(hours: number): string {
  const days = Math.ceil(hours / 8);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
