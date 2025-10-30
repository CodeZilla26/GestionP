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
    const { description, teamMembers = [] } = await request.json();
    
    if (!description) {
      return NextResponse.json({ ok: false, message: 'Descripción requerida' }, { status: 400 });
    }

    const teamInfo = teamMembers.length > 0 
      ? `\n\nEquipo disponible: ${teamMembers.map((m: any) => `${m.name} (${m.role}, skills: ${m.skills?.join(', ') || 'N/A'})`).join(', ')}`
      : '';

    const prompt = `Eres un experto en gestión de proyectos de software. Basándote en esta descripción de proyecto: "${description}"${teamInfo}

Genera sugerencias en formato JSON con esta estructura exacta:
{
  "name": "Nombre sugerido del proyecto",
  "technologies": ["tech1", "tech2", "tech3"],
  "priority": "baja|media|alta|urgente",
  "estimatedDuration": "número de días estimados",
  "suggestedAssignee": "nombre del mejor colaborador para liderar (si hay equipo disponible)",
  "reasoning": "breve explicación de las decisiones"
}

Considera:
- Tecnologías modernas y apropiadas para el tipo de proyecto
- Prioridad basada en palabras clave (urgente, crítico, etc.)
- Duración realista según complejidad
- Mejor colaborador según skills si hay equipo disponible

Responde SOLO con el JSON válido, sin texto adicional.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content?.trim();
    
    if (!response) {
      throw new Error('No response from AI');
    }

    // Intentar parsear el JSON
    try {
      const suggestions = JSON.parse(response);
      return NextResponse.json({ ok: true, suggestions });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return NextResponse.json({ 
        ok: false, 
        error: 'Error procesando respuesta de IA. Por favor, intenta de nuevo.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating project suggestions:', error);
    return NextResponse.json(
      { ok: false, message: 'No se pudieron generar sugerencias de proyecto' },
      { status: 500 }
    );
  }
}

