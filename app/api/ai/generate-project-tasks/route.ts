import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { projectName, description, technologies, priority, startDate, endDate, team } = await request.json();

    if (!projectName || !description) {
      return NextResponse.json({ error: 'Faltan datos del proyecto' }, { status: 400 });
    }

    // Información del equipo para asignación inteligente
    const teamInfo = team && team.length > 0 
      ? `\n\nEquipo disponible para asignación:
${team.map((member: any) => `- ${member.name} (${member.role}) - Skills: ${member.skills?.join(', ') || 'N/A'} - Tareas en progreso: ${member.tasksInProgress || 0}`).join('\n')}`
      : '\n\nNo hay equipo disponible para asignación automática.';

    const techInfo = technologies && technologies.length > 0 
      ? `\nTecnologías del proyecto: ${technologies.join(', ')}`
      : '';

    const timelineInfo = startDate && endDate 
      ? `\nFechas del proyecto: ${startDate} a ${endDate}`
      : '';

    const prompt = `Eres un experto Project Manager de software. Analiza este proyecto y genera tareas específicas y realistas:

**PROYECTO:**
- Nombre: "${projectName}"
- Descripción: "${description}"
- Prioridad: ${priority}${techInfo}${timelineInfo}${teamInfo}

Genera un plan de tareas detallado en formato JSON con esta estructura exacta:
{
  "tasks": [
    {
      "name": "Nombre específico de la tarea",
      "description": "Descripción detallada de qué hacer",
      "priority": "baja|media|alta|urgente",
      "estimatedHours": número_de_horas,
      "daysFromStart": número_de_días_desde_inicio,
      "suggestedAssignee": "nombre_del_mejor_colaborador_o_null",
      "requiredSkills": ["skill1", "skill2"],
      "category": "planning|design|frontend|backend|testing|deployment|documentation"
    }
  ],
  "reasoning": "Explicación breve del plan y asignaciones"
}

**INSTRUCCIONES:**
1. Genera 5-8 tareas específicas y realistas para este tipo de proyecto
2. Asigna cada tarea al colaborador más adecuado según sus skills y carga actual
3. Considera la secuencia lógica de desarrollo (planning → design → development → testing → deployment)
4. Ajusta prioridades según la criticidad de cada fase
5. Estima horas realistas según la complejidad
6. Si no hay colaborador adecuado, usa null en suggestedAssignee

Responde SOLO con el JSON válido, sin texto adicional.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content?.trim();
    
    if (!response) {
      throw new Error('No se recibió respuesta de la IA');
    }

    // Intentar parsear la respuesta JSON
    let suggestions;
    try {
      // Limpiar la respuesta si tiene markdown o texto extra
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      suggestions = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', response);
      throw new Error('Respuesta de IA inválida');
    }

    // Validar estructura de respuesta
    if (!suggestions.tasks || !Array.isArray(suggestions.tasks)) {
      throw new Error('Estructura de respuesta inválida');
    }

    return NextResponse.json({ 
      success: true, 
      tasks: suggestions.tasks,
      reasoning: suggestions.reasoning || 'Plan generado por IA'
    });

  } catch (error: any) {
    console.error('Error in generate-project-tasks:', error);
    return NextResponse.json({ 
      error: 'Error generando tareas con IA',
      details: error.message 
    }, { status: 500 });
  }
}
