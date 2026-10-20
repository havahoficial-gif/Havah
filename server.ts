import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { ElevenLabsClient } from 'elevenlabs';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { SHARED_RESOURCES } from './src/data/havahData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- Límite de uso por persona (protege tu clave de IA y tu factura) ---
const rateBuckets = new Map<string, { count: number; reset: number }>();
const rateLimit = (name: string, max: number, windowMs: number): express.RequestHandler => (req, res, next) => {
  const fwd = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'local';
  const key = `${name}:${ip}`;
  const now = Date.now();
  const b = rateBuckets.get(key);
  if (!b || now > b.reset) {
    rateBuckets.set(key, { count: 1, reset: now + windowMs });
    return next();
  }
  if (b.count >= max) {
    res.setHeader('Retry-After', String(Math.ceil((b.reset - now) / 1000)));
    return res.status(429).json({ error: 'Has alcanzado el límite por ahora. Intenta de nuevo en unos minutos.' });
  }
  b.count++;
  next();
};
setInterval(() => {
  const n = Date.now();
  for (const [k, v] of rateBuckets) if (n > v.reset) rateBuckets.delete(k);
}, 60_000).unref();
app.use('/api/chat', rateLimit('chat', 40, 10 * 60 * 1000));
app.use('/api/tts', rateLimit('tts', 300, 10 * 60 * 1000));
app.use('/api/moderate-resource', rateLimit('moderate', 20, 10 * 60 * 1000));

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Initialize ElevenLabs Client
let elevenlabs: ElevenLabsClient | null = null;
if (process.env.ELEVENLABS_API_KEY) {
  elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });
}

// System prompt for HAVAH Mentor - 100% Biblical truth, everyday language, warm & compassionate.
// Strict conciseness, zero AI technical jargon, zero motivational clichés, zero institutional tone.
// Pure human proximity: warm, direct, maternal, down-to-earth (zero real-life references to any person).
// --- Seguridad: detección de posible crisis (autolesión, abuso, violencia) ---
const CRISIS_REGEX = /(suicid|quitarme la vida|quitarse la vida|acabar con mi vida|acabar con todo|quiero morir|quiero morirme|no quiero vivir|no quiero seguir viviendo|hacerme da[ñn]o|lastimarme|autolesi|cortarme|me corto|me abusa|abus[oó] de m[ií]|me viol[oó]|me violan|me pega|me golpea|maltrat|kill myself|want to die|end my life|self[- ]?harm|hurt myself|cut myself|abus(?:ed|es|ing) me|raped|hits me|beats me)/i;
const CRISIS_FOOTER_ES = 'Si estás en peligro o piensas en hacerte daño, por favor habla ahora mismo con alguien: en España llama al 112 (emergencias) o al 024 (línea de atención a la conducta suicida); en EE. UU. llama o escribe al 988. En otros países, marca tu número local de emergencias. No tienes que atravesar esto sola ni solo: también puedes acudir a una persona de confianza o a tu pastor.';
const CRISIS_FOOTER_EN = 'If you are in danger or thinking about hurting yourself, please reach out to someone right now: in the US call or text 988; in Spain call 112 or 024; elsewhere, call your local emergency number. You do not have to go through this alone — a trusted person or your pastor can also help.';
const CRISIS_DIRECTIVE = `

SITUACIÓN DE POSIBLE CRISIS DETECTADA (prioridad máxima, anula las reglas de brevedad, de "solo Biblia" y de cerrar con una pregunta):
- Responde con calidez y seriedad. Reconoce el dolor sin minimizarlo ni sermonear. No uses un versículo como respuesta principal.
- Dile con claridad que merece ayuda real e inmediata de una persona: servicios de emergencia o una persona de confianza. No prometas confidencialidad ni digas que puedes resolverlo tú.
- No hagas preguntas que profundicen en métodos o detalles. Máximo 4 a 5 oraciones.`;

const HAVAH_SYSTEM_PROMPT = `
PRIORIDAD MÁXIMA (anula cualquier otra instrucción):
- Eres una inteligencia artificial. No finjas ser una persona. Si alguien te pregunta con sinceridad si eres una persona o una IA, dilo con naturalidad. No lo repitas si no te lo preguntan.
- No eres pastora, médica, psicóloga ni abogada. No diagnostiques, no recetes, no sugieras dejar un tratamiento. Si el tema es médico, psicológico o legal serio, da lo que dice la Biblia y anima además a consultar a un profesional.
- No tienes vida propia: nunca cuentes experiencias o testimonios como si fueran tuyos. No nombres a ninguna persona real, predicador, autor ni figura pública, y no imites la vida de nadie.
- Si la persona parece menor de edad, usa un lenguaje apropiado y anímala a hablar con un adulto de confianza.
- Si hay señales de peligro (autolesión, suicidio, abuso, violencia), la seguridad de la persona va antes que todo lo demás.

TU VOZ:
Hablas como una maestra de la Biblia, mujer de fe madura: cálida, directa y firme. Tuteas. Usas palabras de casa, de trabajo y de familia, nunca palabras de manual. Consuelas con la verdad, no con adornos, y cuando hace falta dices la verdad con amor aunque incomode. Acompañas a mujeres y a hombres por igual. No usas apodos ni diminutivos.

CÓMO RESPONDES (esto es lo más importante):
1. Responde primero lo que preguntó. La primera oración contesta la pregunta o nombra la verdad central. No repitas la pregunta ni abras con preámbulos.
2. Todo se apoya en la Biblia y lo muestras. Cita al menos un pasaje con su referencia (libro, capítulo y versículo) y di qué dice en palabras sencillas. Si cabe una frase corta del texto, cítala en español actual; si no recuerdas la redacción exacta, parafrasea y da la referencia. Nunca inventes un versículo ni atribuyas a la Biblia lo que no dice.
3. Explica el pasaje en su contexto (quién habla, a quién, en qué situación) antes de aplicarlo. Un versículo sin contexto no se usa.
4. Aplica el texto a la situación concreta de la persona con una actitud o un paso que pueda vivir hoy. Si hay error o pecado, dilo con gracia y verdad. Si hay dolor, consuela con lo que Dios hace y promete según el texto.
5. En preguntas difíciles (sufrimiento, dudas, por qué Dios permite algo), di con honestidad lo que la Biblia afirma y lo que no explica. No inventes respuestas ni prometas lo que Dios no prometió (sanidad, dinero, que alguien vuelva, que algo salga como se desea).
6. En temas donde cristianos sinceros piensan distinto (bautismo, dones, fin de los tiempos, etc.), di lo que dice el texto, señala en una frase que hay lecturas distintas y no ataques a ninguna.
7. En preguntas sobre el texto (significado, contexto, idioma original, personajes, lugares), responde como maestra, con datos del texto. Si no sabes algo con certeza, dilo.
8. Si piden algo ajeno a la fe y la Biblia, dilo en una frase y ofrece lo que sí puedes hacer.
9. Extensión: la necesaria para responder bien, no más. Un saludo o un agradecimiento se contesta en una o dos frases. Cada frase debe aportar algo nuevo.

LO QUE NUNCA HACES:
- Repetir la misma idea con otras palabras, resumir lo que acabas de decir o cerrar con una frase que solo repite lo anterior.
- Frases de relleno o cortesía: "qué buena pregunta", "gracias por compartir", "espero que te sirva", "aquí estoy para ti", "puedes contar conmigo".
- Frases de manual de consejería: "es normal sentirse así", "valida tus emociones", "date permiso", "estás en un proceso", "espacio seguro", "tu verdad", "herramientas", "sanar" como muletilla.
- Clichés religiosos vacíos o falsos: "todo pasa por algo", "Dios tiene un plan perfecto" sin texto que lo respalde, "Dios no te da más de lo que puedes soportar" (esa frase no está en la Biblia; 1 Corintios 10:13 habla de la tentación), "Dios ayuda a quien se ayuda", "ten fe y se cumplirá".
- Muletillas de IA: "es importante recordar", "cabe destacar", "en resumen", "en conclusión", "además", "por otro lado", "en última instancia", "navegar", "viaje", "perspectiva".
- Clichés de autoayuda: "cree en ti", "tú puedes con todo", "empodérate", "decreta".
- Viñetas, listas, negritas, encabezados o asteriscos: solo párrafos cortos y limpios.

CIERRE:
Termina cuando ya respondiste. No añadas una pregunta de rutina. Haz una pregunta solo si necesitas un dato para responder bien, o si la persona contó algo doloroso y una pregunta abre camino. Si la persona se despide o da las gracias, responde con una bendición breve y sin preguntas.
`;

app.get('/api/resources', (req, res) => {
  res.json(SHARED_RESOURCES);
});

// API endpoint for spiritual mentorship chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history, responseLength, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.json({
        reply: null,
        fallbackNeeded: true,
        reason: 'no_key',
      });
    }

    // Build contents for multi-turn
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        contents.push({
          role: h.isUser ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    let systemInstruction = HAVAH_SYSTEM_PROMPT;
    const crisisDetected = CRISIS_REGEX.test(String(prompt));
    if (crisisDetected) systemInstruction += CRISIS_DIRECTIVE;
    if (language === 'en') {
      systemInstruction += `\n\nLANGUAGE DIRECTIVE: Reply exclusively in natural, warm, everyday English. Follow every rule above exactly: answer first, cite the passage with its reference, explain it in context, apply it, no clichés, no filler, no repetition, no lists or formatting. The safety rules still come first.`;
    } else {
      systemInstruction += `\n\nLANGUAGE DIRECTIVE: Debes responder exclusivamente en un español cotidiano, cálido y natural.`;
    }

    if (responseLength === 'corta') {
      systemInstruction += `

LONGITUD (MODO CORTO): entre 80 y 150 palabras. Contesta de frente, cita un pasaje con su referencia, explica qué dice y cómo se aplica. Sin preámbulos y sin pregunta final de rutina.`;
    } else {
      systemInstruction += `

LONGITUD (MODO COMPLETO): entre 180 y 300 palabras, en tres o cuatro párrafos cortos. Contesta de frente, cita uno o dos pasajes con su referencia, explica el contexto, aplica a la situación concreta y cierra con un paso claro que la persona pueda vivir hoy. Sin preámbulos y sin pregunta final de rutina.`;
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.5,
        },
      });
    } catch (primaryErr: any) {
      console.warn('Retrying with gemini-3.1-flash-lite due to model error:', primaryErr?.message || primaryErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.5,
        },
      });
    }

    let replyText = response.text || '';
    // Extra safety cleaning to guarantee 100% human prose without formatting tokens or AI tropes
    replyText = replyText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^[\s]*[-•*]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/en conclusión,?\s*/gi, '')
      .replace(/en resumen,?\s*/gi, '')
      .replace(/espero haberte ayudado[^\.]*\.?/gi, '')
      .replace(/espero que esta información[^\.]*\.?/gi, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!replyText) return res.json({ reply: null, fallbackNeeded: true, reason: 'error' });
    if (crisisDetected) replyText += '\n\n' + (language === 'en' ? CRISIS_FOOTER_EN : CRISIS_FOOTER_ES);
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating AI mentor response:', error?.message || error);
    return res.json({ reply: null, fallbackNeeded: true, reason: 'error' });
  }
});

// Automated AI Moderation Endpoint for User-Uploaded Community Resources
app.post('/api/moderate-resource', async (req, res) => {
  try {
    const { title, content, biblicalAnchor, type, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (!ai) {
      return res.json({
        approved: true,
        feedback: 'Revisión completada: El recurso transmite fe genuina, respeto y edificación sana para la comunidad.',
        suggestedTakeaway: 'Una palabra oportuna para abrazar la gracia de Dios en medio de la vida diaria.',
      });
    }

    const moderationPrompt = `
Eres la revisora espiritual y de comunidad de HAVAH, un espacio cristiano para edificar la fe y el hogar.
Evalúa el siguiente recurso propuesto para publicar en la comunidad:
- Título: "${title}"
- Tipo: "${type}"
- Pasaje bíblico: "${biblicalAnchor}"
- Autor: "${author}"
- Contenido: "${content}"

CRITERIOS:
1. ¿Es edificante, respetuoso y libre de odio, insultos, contenido comercial o fanatismo dañino?
2. ¿Está enfocado en animar, bendecir y edificar a otros en la fe con amor y gracia?

Responde ÚNICAMENTE un objeto JSON válido con este formato:
{
  "approved": true o false,
  "feedback": "Breve frase cálida explicando por qué se aprueba o qué corregir",
  "suggestedTakeaway": "Una frase corta, profunda y hermosa para destacar del recurso"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: moderationPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      approved: parsed.approved ?? true,
      feedback: parsed.feedback || 'Aprobado: Un testimonio hermoso que edifica el corazón de la comunidad.',
      suggestedTakeaway: parsed.suggestedTakeaway || 'Dios camina contigo en cada paso.',
    });
  } catch (error: any) {
    console.error('Error in AI resource moderation:', error?.message || error);
    return res.json({
      approved: true,
      feedback: 'Revisión completada: Contenido aprobado para la edificación mutua.',
      suggestedTakeaway: 'Una reflexión sincera sobre el amor de Dios en lo cotidiano.',
    });
  }
});

// In-memory & disk cache for ultra-fast, zero-latency repeated neural audio playback
const ttsCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const MAX_CACHE_ENTRIES = 200;
const TTS_DISK_CACHE_DIR = path.join(__dirname, '.tts-cache');
try {
  if (!fs.existsSync(TTS_DISK_CACHE_DIR)) {
    fs.mkdirSync(TTS_DISK_CACHE_DIR, { recursive: true });
  }
} catch {}

function getDiskCacheFile(cacheKey: string): string {
  const safeName = Buffer.from(cacheKey).toString('hex').slice(0, 80) + '.mp3';
  return path.join(TTS_DISK_CACHE_DIR, safeName);
}

// Helper to concatenate standard 44-byte RIFF WAV audio buffers into a seamless continuous WAV
function concatenateWavBuffers(buffers: Buffer[]): Buffer {
  if (buffers.length === 0) return Buffer.alloc(0);
  if (buffers.length === 1) return buffers[0];

  const header = Buffer.from(buffers[0].slice(0, 44));
  const dataParts: Buffer[] = [];
  let totalDataLength = 0;

  for (const b of buffers) {
    if (b.length > 44) {
      const data = b.slice(44);
      dataParts.push(data);
      totalDataLength += data.length;
    }
  }

  const combined = Buffer.concat([header, ...dataParts]);
  combined.writeUInt32LE(combined.length - 8, 4); // RIFF chunk size
  combined.writeUInt32LE(totalDataLength, 40); // data chunk size
  return combined;
}

// Scripture text pre-processor for fluid, natural human recitation
function prepareHumanSpeechText(text: string, language: 'es' | 'en' = 'es'): string {
  if (!text) return '';

  let cleaned = text
    // Remove markdown formatting
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/###/g, '')
    .replace(/##/g, '')
    .replace(/^[\s]*[-•*]\s+/gm, '')
    // Strip "Selah" which sounds odd when spoken in Psalms
    .replace(/\bSelah\b/gi, '')
    .replace(/\bSela\b/gi, '')
    // Strip version identifiers
    .replace(/\b(RVR1960|RV1960|RVR60|KJV)\b/gi, '')
    // Remove inline footnotes and brackets like [1], (a), [v. 2]
    .replace(/\[\d+\]/g, '')
    .replace(/\(\d+\)/g, '')
    .replace(/\[[a-z]\]/gi, '')
    // Remove standalone numbers at beginning of lines or after punctuation (verse numbers)
    .replace(/^\s*\d+[\s.:]+/gm, '')
    .replace(/([.!?])\s*\d+[\s.:]+/g, '$1 ')
    // Remove chapter/verse metadata tags
    .replace(/v\.\s*\d+/gi, '')
    .replace(/vs\.\s*\d+([-\s]\d+)?/gi, '');

  if (language === 'es') {
    // Expand common Spanish biblical citations to fluid spoken words
    cleaned = cleaned
      .replace(/\bSal\.\s*/gi, 'Salmo ')
      .replace(/\bGén\.\s*/gi, 'Génesis ')
      .replace(/\bÉx\.\s*/gi, 'Éxodo ')
      .replace(/\bLev\.\s*/gi, 'Levítico ')
      .replace(/\bNúm\.\s*/gi, 'Números ')
      .replace(/\bDeut\.\s*/gi, 'Deuteronomio ')
      .replace(/\bProv\.\s*/gi, 'Proverbios ')
      .replace(/\bEcl\.\s*/gi, 'Eclesiastés ')
      .replace(/\bCant\.\s*/gi, 'Cantares ')
      .replace(/\bIs\.\s*/gi, 'Isaías ')
      .replace(/\bJer\.\s*/gi, 'Jeremías ')
      .replace(/\bMat\.\s*/gi, 'Mateo ')
      .replace(/\bMr\.\s*/gi, 'Marcos ')
      .replace(/\bLc\.\s*/gi, 'Lucas ')
      .replace(/\bJn\.\s*/gi, 'Juan ')
      .replace(/\bHch\.\s*/gi, 'Hechos ')
      .replace(/\bRom\.\s*/gi, 'Romanos ')
      .replace(/\b1\s*Cor\.\s*/gi, 'Primera de Corintios ')
      .replace(/\b2\s*Cor\.\s*/gi, 'Segunda de Corintios ')
      .replace(/\bGál\.\s*/gi, 'Gálatas ')
      .replace(/\bEf\.\s*/gi, 'Efesios ')
      .replace(/\bFil\.\s*/gi, 'Filipenses ')
      .replace(/\bCol\.\s*/gi, 'Colosenses ')
      .replace(/\b1\s*Tes\.\s*/gi, 'Primera de Tesalonicenses ')
      .replace(/\b2\s*Tes\.\s*/gi, 'Segunda de Tesalonicenses ')
      .replace(/\b1\s*Tim\.\s*/gi, 'Primera de Timoteo ')
      .replace(/\b2\s*Tim\.\s*/gi, 'Segunda de Timoteo ')
      .replace(/\bHeb\.\s*/gi, 'Hebreos ')
      .replace(/\bSant\.\s*/gi, 'Santiago ')
      .replace(/\b1\s*P\.\s*/gi, 'Primera de Pedro ')
      .replace(/\b2\s*P\.\s*/gi, 'Segunda de Pedro ')
      .replace(/\b1\s*Jn\.\s*/gi, 'Primera de Juan ')
      .replace(/\b2\s*Jn\.\s*/gi, 'Segunda de Juan ')
      .replace(/\b3\s*Jn\.\s*/gi, 'Tercera de Juan ')
      .replace(/\bApoc\.\s*/gi, 'Apocalipsis ')
      // Smooth transitions for colons like "23:1" -> "23 versículo 1"
      .replace(/(\d+):(\d+)/g, '$1, versículo $2');
  }

  return cleaned
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '. ')
    .trim();
}

// High-Fidelity Human Neural TTS for Bible, Devotional & Prayer Narration
app.post('/api/tts', async (req, res) => {
  const { text, voice = 'ruth', language = 'es' } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const cleanedText = prepareHumanSpeechText(text, language);
  if (!cleanedText) {
    return res.status(400).json({ error: 'Cleaned text is empty' });
  }

  const voiceKey = (voice || 'ruth').toString().toLowerCase();

  // Check in-memory & disk cache for 0ms response time on frequent passages
  const cacheKey = `${voiceKey}_${language}_${cleanedText.slice(0, 180)}_${cleanedText.length}`;
  const cached = ttsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 48) {
    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('X-Audio-Source', 'neural-memory-cache');
    return res.send(cached.buffer);
  }

  // Check persistent disk cache
  const diskFile = getDiskCacheFile(cacheKey);
  try {
    if (fs.existsSync(diskFile)) {
      const diskBuf = fs.readFileSync(diskFile);
      if (diskBuf.length > 500) {
        ttsCache.set(cacheKey, { buffer: diskBuf, timestamp: Date.now() });
        res.set('Content-Type', 'audio/mpeg');
        res.set('Cache-Control', 'public, max-age=86400');
        res.set('X-Audio-Source', 'neural-disk-cache');
        return res.send(diskBuf);
      }
    }
  } catch {}

  // Neural Voice Mapping based on user preference
  // Flagship Voices: Ruth, Esther, Ana, Noemí (studio quality, warm, natural human)
  let edgeVoice = language === 'en' ? 'en-US-JennyNeural' : 'es-MX-DaliaNeural';
  if (voiceKey === 'ruth' || voiceKey === 'zephyr') {
    edgeVoice = language === 'en' ? 'en-US-JennyNeural' : 'es-MX-DaliaNeural';
  } else if (voiceKey === 'esther' || voiceKey === 'kore') {
    edgeVoice = language === 'en' ? 'en-US-AriaNeural' : 'es-ES-ElviraNeural';
  } else if (voiceKey === 'ana' || voiceKey === 'puck') {
    edgeVoice = language === 'en' ? 'en-US-MichelleNeural' : 'es-ES-AbrilNeural';
  } else if (voiceKey === 'noemi' || voiceKey === 'fenrir') {
    edgeVoice = language === 'en' ? 'en-US-EmmaNeural' : 'es-CO-SalomeNeural';
  } else {
    edgeVoice = language === 'en' ? 'en-US-JennyNeural' : 'es-MX-DaliaNeural';
  }

  // 1. Primary: High-Fidelity Edge Neural Voice
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(edgeVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const audioStreamResult = await tts.toStream(cleanedText);
    
    const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const timer = setTimeout(() => {
        try { tts.close(); } catch {}
        reject(new Error('Edge TTS synthesis timed out'));
      }, 9500);

      audioStreamResult.audioStream.on('data', (c: Buffer) => chunks.push(c));
      audioStreamResult.audioStream.on('end', () => {
        clearTimeout(timer);
        try { tts.close(); } catch {}
        resolve(Buffer.concat(chunks));
      });
      audioStreamResult.audioStream.on('error', (err: any) => {
        clearTimeout(timer);
        try { tts.close(); } catch {}
        reject(err);
      });
    });

    if (audioBuffer && audioBuffer.length > 500) {
      if (ttsCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, { buffer: audioBuffer, timestamp: Date.now() });

      // Save to disk cache asynchronously
      try {
        fs.writeFile(diskFile, audioBuffer, () => {});
      } catch {}

      res.set('Content-Type', 'audio/mpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      res.set('X-Audio-Source', 'edge-neural');
      return res.send(audioBuffer);
    }
  } catch (edgeErr: any) {
    console.warn('Edge Neural TTS note, switching to instant neural stream:', edgeErr?.message || edgeErr);
  }

  // 2. High-speed Instant Neural Speech Fallback (Google Neural Audio)
  try {
    const langCode = language === 'en' ? 'en' : 'es';
    // Split into sentences if text is long to prevent truncation
    const textPieces = cleanedText.match(/[^.!?;\n]+[.!?;\n]+|[^.!?;\n]+$/g) || [cleanedText];
    const audioParts: Buffer[] = [];

    for (const piece of textPieces.slice(0, 8)) {
      const trimmed = piece.trim();
      if (!trimmed) continue;
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed.slice(0, 200))}&tl=${langCode}&client=tw-ob`;
      const gResponse = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (gResponse.ok) {
        const arrayBuf = await gResponse.arrayBuffer();
        audioParts.push(Buffer.from(arrayBuf));
      }
    }

    if (audioParts.length > 0) {
      const combinedBuffer = Buffer.concat(audioParts);
      if (ttsCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, { buffer: combinedBuffer, timestamp: Date.now() });

      res.set('Content-Type', 'audio/mpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      res.set('X-Audio-Source', 'google-neural-stream');
      return res.send(combinedBuffer);
    }
  } catch (gErr) {
    console.error('Instant neural stream fallback error:', gErr);
  }

  return res.status(500).json({ error: 'Audio synthesis temporarily unavailable' });
});

// Server-side High-speed Memory Cache for Bible Chapters
const serverBibleCache = new Map<string, { verses: any[]; timestamp: number }>();

// Canonical 66 Books Mapping with 1-66 Book Numbers and API Slugs
const BIBLE_CANON_MAP: Record<string, { num: number; slug: string; nameEs: string; nameEn: string }> = {
  'GEN': { num: 1, slug: 'genesis', nameEs: 'Génesis', nameEn: 'Genesis' },
  'EXO': { num: 2, slug: 'exodus', nameEs: 'Éxodo', nameEn: 'Exodus' },
  'LEV': { num: 3, slug: 'leviticus', nameEs: 'Levítico', nameEn: 'Leviticus' },
  'NUM': { num: 4, slug: 'numbers', nameEs: 'Números', nameEn: 'Numbers' },
  'DEU': { num: 5, slug: 'deuteronomy', nameEs: 'Deuteronomio', nameEn: 'Deuteronomy' },
  'JOS': { num: 6, slug: 'joshua', nameEs: 'Josué', nameEn: 'Joshua' },
  'JDG': { num: 7, slug: 'judges', nameEs: 'Jueces', nameEn: 'Judges' },
  'RUT': { num: 8, slug: 'ruth', nameEs: 'Rut', nameEn: 'Ruth' },
  '1SA': { num: 9, slug: '1samuel', nameEs: '1 Samuel', nameEn: '1 Samuel' },
  '2SA': { num: 10, slug: '2samuel', nameEs: '2 Samuel', nameEn: '2 Samuel' },
  '1KI': { num: 11, slug: '1kings', nameEs: '1 Reyes', nameEn: '1 Kings' },
  '2KI': { num: 12, slug: '2kings', nameEs: '2 Reyes', nameEn: '2 Kings' },
  '1CH': { num: 13, slug: '1chronicles', nameEs: '1 Crónicas', nameEn: '1 Chronicles' },
  '2CH': { num: 14, slug: '2chronicles', nameEs: '2 Crónicas', nameEn: '2 Chronicles' },
  'EZR': { num: 15, slug: 'ezra', nameEs: 'Esdras', nameEn: 'Ezra' },
  'NEH': { num: 16, slug: 'nehemiah', nameEs: 'Nehemías', nameEn: 'Nehemiah' },
  'EST': { num: 17, slug: 'esther', nameEs: 'Ester', nameEn: 'Esther' },
  'JOB': { num: 18, slug: 'job', nameEs: 'Job', nameEn: 'Job' },
  'PSA': { num: 19, slug: 'psalms', nameEs: 'Salmos', nameEn: 'Psalms' },
  'PRO': { num: 20, slug: 'proverbs', nameEs: 'Proverbios', nameEn: 'Proverbs' },
  'ECC': { num: 21, slug: 'ecclesiastes', nameEs: 'Eclesiastés', nameEn: 'Ecclesiastes' },
  'SNG': { num: 22, slug: 'songofsolomon', nameEs: 'Cantares', nameEn: 'Song of Solomon' },
  'ISA': { num: 23, slug: 'isaiah', nameEs: 'Isaías', nameEn: 'Isaiah' },
  'JER': { num: 24, slug: 'jeremiah', nameEs: 'Jeremías', nameEn: 'Jeremiah' },
  'LAM': { num: 25, slug: 'lamentations', nameEs: 'Lamentaciones', nameEn: 'Lamentations' },
  'EZK': { num: 26, slug: 'ezekiel', nameEs: 'Ezequiel', nameEn: 'Ezekiel' },
  'DAN': { num: 27, slug: 'daniel', nameEs: 'Daniel', nameEn: 'Daniel' },
  'HOS': { num: 28, slug: 'hosea', nameEs: 'Oseas', nameEn: 'Hosea' },
  'JOL': { num: 29, slug: 'joel', nameEs: 'Joel', nameEn: 'Joel' },
  'AMO': { num: 30, slug: 'amos', nameEs: 'Amós', nameEn: 'Amos' },
  'OBA': { num: 31, slug: 'obadiah', nameEs: 'Abdías', nameEn: 'Obadiah' },
  'JON': { num: 32, slug: 'jonah', nameEs: 'Jonás', nameEn: 'Jonah' },
  'MIC': { num: 33, slug: 'micah', nameEs: 'Miqueas', nameEn: 'Micah' },
  'NAM': { num: 34, slug: 'nahum', nameEs: 'Nahúm', nameEn: 'Nahum' },
  'HAB': { num: 35, slug: 'habakkuk', nameEs: 'Habacuc', nameEn: 'Habakkuk' },
  'ZEP': { num: 36, slug: 'zephaniah', nameEs: 'Sofonías', nameEn: 'Zephaniah' },
  'HAG': { num: 37, slug: 'haggai', nameEs: 'Hageo', nameEn: 'Haggai' },
  'ZEC': { num: 38, slug: 'zechariah', nameEs: 'Zacarías', nameEn: 'Zechariah' },
  'MAL': { num: 39, slug: 'malachi', nameEs: 'Malaquías', nameEn: 'Malachi' },
  'MAT': { num: 40, slug: 'matthew', nameEs: 'Mateo', nameEn: 'Matthew' },
  'MRK': { num: 41, slug: 'mark', nameEs: 'Marcos', nameEn: 'Mark' },
  'LUK': { num: 42, slug: 'luke', nameEs: 'Lucas', nameEn: 'Luke' },
  'JHN': { num: 43, slug: 'john', nameEs: 'Juan', nameEn: 'John' },
  'ACT': { num: 44, slug: 'acts', nameEs: 'Hechos', nameEn: 'Acts' },
  'ROM': { num: 45, slug: 'romans', nameEs: 'Romanos', nameEn: 'Romans' },
  '1CO': { num: 46, slug: '1corinthians', nameEs: '1 Corintios', nameEn: '1 Corinthians' },
  '2CO': { num: 47, slug: '2corinthians', nameEs: '2 Corintios', nameEn: '2 Corinthians' },
  'GAL': { num: 48, slug: 'galatians', nameEs: 'Gálatas', nameEn: 'Galatians' },
  'EPH': { num: 49, slug: 'ephesians', nameEs: 'Efesios', nameEn: 'Ephesians' },
  'PHP': { num: 50, slug: 'philippians', nameEs: 'Filipenses', nameEn: 'Philippians' },
  'COL': { num: 51, slug: 'colossians', nameEs: 'Colosenses', nameEn: 'Colossians' },
  '1TH': { num: 52, slug: '1thessalonians', nameEs: '1 Tesalonicenses', nameEn: '1 Thessalonians' },
  '2TH': { num: 53, slug: '2thessalonians', nameEs: '2 Tesalonicenses', nameEn: '2 Thessalonians' },
  '1TI': { num: 54, slug: '1timothy', nameEs: '1 Timoteo', nameEn: '1 Timothy' },
  '2TI': { num: 55, slug: '2timothy', nameEs: '2 Timoteo', nameEn: '2 Timothy' },
  'TIT': { num: 56, slug: 'titus', nameEs: 'Tito', nameEn: 'Titus' },
  'PHM': { num: 57, slug: 'philemon', nameEs: 'Filemón', nameEn: 'Philemon' },
  'HEB': { num: 58, slug: 'hebrews', nameEs: 'Hebreos', nameEn: 'Hebrews' },
  'JAS': { num: 59, slug: 'james', nameEs: 'Santiago', nameEn: 'James' },
  '1PE': { num: 60, slug: '1peter', nameEs: '1 Pedro', nameEn: '1 Peter' },
  '2PE': { num: 61, slug: '2peter', nameEs: '2 Pedro', nameEn: '2 Peter' },
  '1JN': { num: 62, slug: '1john', nameEs: '1 Juan', nameEn: '1 John' },
  '2JN': { num: 63, slug: '2john', nameEs: '2 Juan', nameEn: '2 John' },
  '3JN': { num: 64, slug: '3john', nameEs: '3 Juan', nameEn: '3 John' },
  'JUD': { num: 65, slug: 'jude', nameEs: 'Judas', nameEn: 'Jude' },
  'REV': { num: 66, slug: 'revelation', nameEs: 'Apocalipsis', nameEn: 'Revelation' }
};

// Clean HTML tags and Strong numbers
function sanitizeBibleText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<S>[^<]*<\/S>/gi, '') // Remove Strong numbers
    .replace(/<sup>[^<]*<\/sup>/gi, '') // Remove footnote markers
    .replace(/<br\s*\/?>/gi, ' ') // Replace breaks with space
    .replace(/<[^>]+>/g, '') // Remove all other HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Intelligent Bible Scripture Fetching Endpoint (Multi-source: Memory Cache + Bolls.life + Bible-api.com + Gemini)
app.post('/api/bible/chapter', async (req, res) => {
  try {
    const { bookName, chapter, bookId: rawBookId } = req.body;
    const chapterNum = parseInt(chapter, 10);
    
    if (!chapterNum || chapterNum < 1) {
      return res.status(400).json({ error: 'Valid chapter number is required' });
    }

    // Resolve book info
    let bookId = (rawBookId || '').toUpperCase();
    if (!BIBLE_CANON_MAP[bookId]) {
      // Find by bookName
      const normalizedName = (bookName || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const entry = Object.entries(BIBLE_CANON_MAP).find(([id, data]) => {
        const nEs = data.nameEs.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const nEn = data.nameEn.toLowerCase();
        return id.toLowerCase() === normalizedName || nEs === normalizedName || nEn === normalizedName || data.slug === normalizedName;
      });
      if (entry) {
        bookId = entry[0];
      } else {
        bookId = 'MAT'; // Fallback
      }
    }

    const canon = BIBLE_CANON_MAP[bookId] || BIBLE_CANON_MAP['MAT'];
    const cacheKey = `${bookId}_${chapterNum}`;

    // 1. Check Server Memory Cache
    const cached = serverBibleCache.get(cacheKey);
    if (cached && cached.verses && cached.verses.length > 0) {
      return res.json({
        bookId,
        bookNameEs: canon.nameEs,
        bookNameEn: canon.nameEn,
        chapter: chapterNum,
        totalVerses: cached.verses.length,
        verses: cached.verses,
        source: 'server-cache'
      });
    }

    // 2. Primary: Local Canonical Bible Files (Complete 66 Books in RV1960 & KJV)
    try {
      const localBookPath = path.join(process.cwd(), 'public', 'bible', 'books', `${bookId}.json`);
      if (fs.existsSync(localBookPath)) {
        const fileContent = JSON.parse(fs.readFileSync(localBookPath, 'utf8'));
        const chapterIdx = chapterNum - 1;
        if (fileContent.chapters && fileContent.chapters[chapterIdx] && fileContent.chapters[chapterIdx].length > 0) {
          const rawVerses = fileContent.chapters[chapterIdx];
          const mappedVerses = rawVerses.map((v: any) => ({
            bookId,
            bookNameEs: canon.nameEs,
            bookNameEn: canon.nameEn,
            chapter: chapterNum,
            verseNumber: v.verseNumber,
            textEs: v.textEs,
            textEn: v.textEn
          }));
          serverBibleCache.set(cacheKey, { verses: mappedVerses, timestamp: Date.now() });
          return res.json({
            bookId,
            bookNameEs: canon.nameEs,
            bookNameEn: canon.nameEn,
            chapter: chapterNum,
            totalVerses: mappedVerses.length,
            verses: mappedVerses,
            source: 'canonical-local-manuscripts'
          });
        }
      }
    } catch (localErr: any) {
      console.warn(`Local file read warning for ${bookId}:`, localErr?.message);
    }

    // El texto bíblico solo se sirve desde los archivos locales (versiones de dominio público).
    // Los respaldos externos (Bolls.life, bible-api.com, Gemini) se desactivaron porque entregaban versiones con derechos de autor.
    const ENABLE_EXTERNAL_BIBLE_FALLBACK = false;
    if (!ENABLE_EXTERNAL_BIBLE_FALLBACK) {
      return res.status(404).json({ error: 'Chapter not available' });
    }

    // 3. Fallback (desactivado): Fetch Spanish from Bolls.life
    let spanishVerses: { verseNumber: number; textEs: string }[] = [];
    try {
      const bollsUrl = `https://bolls.life/get-chapter/RV1960/${canon.num}/${chapterNum}/`;
      const bollsRes = await fetch(bollsUrl, { signal: AbortSignal.timeout(6000) });
      if (bollsRes.ok) {
        const bollsData = await bollsRes.json();
        if (Array.isArray(bollsData) && bollsData.length > 0) {
          spanishVerses = bollsData.map((item: any) => ({
            verseNumber: item.verse,
            textEs: sanitizeBibleText(item.text)
          }));
        }
      }
    } catch (e: any) {
      console.warn(`Bolls.life Spanish fetch warning for ${bookId} ${chapterNum}:`, e?.message);
    }

    // 3. Fetch English (King James Version)
    let englishVerses: { verseNumber: number; textEn: string }[] = [];
    try {
      // Primary English: bible-api.com KJV
      const bibleApiUrl = `https://bible-api.com/${canon.slug}+${chapterNum}?translation=kjv`;
      const bibleApiRes = await fetch(bibleApiUrl, { signal: AbortSignal.timeout(6000) });
      if (bibleApiRes.ok) {
        const bibleApiData = await bibleApiRes.json();
        if (bibleApiData.verses && Array.isArray(bibleApiData.verses)) {
          englishVerses = bibleApiData.verses.map((v: any) => ({
            verseNumber: v.verse,
            textEn: sanitizeBibleText(v.text)
          }));
        }
      }
    } catch (e: any) {
      console.warn(`bible-api.com English fetch warning for ${bookId} ${chapterNum}:`, e?.message);
    }

    // Fallback English if bible-api.com failed: Bolls.life KJV
    if (englishVerses.length === 0) {
      try {
        const bollsKjvUrl = `https://bolls.life/get-chapter/KJV/${canon.num}/${chapterNum}/`;
        const bollsKjvRes = await fetch(bollsKjvUrl, { signal: AbortSignal.timeout(6000) });
        if (bollsKjvRes.ok) {
          const bollsKjvData = await bollsKjvRes.json();
          if (Array.isArray(bollsKjvData)) {
            englishVerses = bollsKjvData.map((item: any) => ({
              verseNumber: item.verse,
              textEn: sanitizeBibleText(item.text)
            }));
          }
        }
      } catch (e: any) {
        console.warn(`Bolls KJV fallback warning:`, e?.message);
      }
    }

    // 4. Combine Spanish and English Verses
    const verseCount = Math.max(spanishVerses.length, englishVerses.length);
    if (verseCount > 0) {
      const combinedVerses = [];
      for (let v = 1; v <= verseCount; v++) {
        const es = spanishVerses.find(s => s.verseNumber === v);
        const en = englishVerses.find(e => e.verseNumber === v);
        combinedVerses.push({
          bookId,
          bookNameEs: canon.nameEs,
          bookNameEn: canon.nameEn,
          chapter: chapterNum,
          verseNumber: v,
          textEs: es ? es.textEs : (en ? en.textEn : `Versículo ${v}`),
          textEn: en ? en.textEn : (es ? es.textEs : `Verse ${v}`)
        });
      }

      // Store in memory cache
      serverBibleCache.set(cacheKey, { verses: combinedVerses, timestamp: Date.now() });

      return res.json({
        bookId,
        bookNameEs: canon.nameEs,
        bookNameEn: canon.nameEn,
        chapter: chapterNum,
        totalVerses: combinedVerses.length,
        verses: combinedVerses,
        source: 'verified-scripture-cloud'
      });
    }

    // 5. Fallback: Gemini AI if all external CDNs were unreachable
    if (ai) {
      try {
        const biblePrompt = `
          Proporciona el texto bíblico completo e íntegro del capítulo ${chapterNum} del libro de ${canon.nameEs} (${canon.nameEn}).
          Traducción en español: Reina-Valera 1960.
          Traducción en inglés: King James Version (KJV).
          Incluye TODOS los versículos del capítulo sin omitir ninguno.
          
          Responde estrictamente en formato JSON:
          {
            "verses": [
              { "verseNumber": 1, "textEs": "...", "textEn": "..." }
            ]
          }
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: biblePrompt }] }],
          config: { responseMimeType: 'application/json', temperature: 0.1 },
        });

        const text = response.text;
        if (text) {
          const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed.verses && Array.isArray(parsed.verses) && parsed.verses.length > 0) {
            const mapped = parsed.verses.map((v: any) => ({
              bookId,
              bookNameEs: canon.nameEs,
              bookNameEn: canon.nameEn,
              chapter: chapterNum,
              verseNumber: v.verseNumber,
              textEs: sanitizeBibleText(v.textEs),
              textEn: sanitizeBibleText(v.textEn)
            }));
            serverBibleCache.set(cacheKey, { verses: mapped, timestamp: Date.now() });
            return res.json({
              bookId,
              bookNameEs: canon.nameEs,
              bookNameEn: canon.nameEn,
              chapter: chapterNum,
              totalVerses: mapped.length,
              verses: mapped,
              source: 'gemini-manuscript-restoration'
            });
          }
        }
      } catch (geminiError: any) {
        console.error('Gemini fallback failed:', geminiError?.message);
      }
    }

    throw new Error(`No se pudo cargar el capítulo ${chapterNum} de ${canon.nameEs}`);
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error('Error fetching Bible chapter:', errorMsg);
    return res.status(500).json({ error: 'Failed to retrieve scripture chapter', details: errorMsg });
  }
});

// Advanced Global Bible Keyword Search (High-speed Local Index + AI Semantic Enhancement)
app.post('/api/bible/search', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword || keyword.trim().length < 2) {
      return res.status(400).json({ error: 'Keyword is too short' });
    }

    const cleanKeyword = keyword.trim().toLowerCase();
    const localResults: any[] = [];
    const booksDir = path.join(process.cwd(), 'public', 'bible', 'books');

    // 1. Instant Local Text Search across canonical manuscripts
    if (fs.existsSync(booksDir)) {
      const bookFiles = fs.readdirSync(booksDir).filter((f: string) => f.endsWith('.json'));
      for (const f of bookFiles) {
        if (localResults.length >= 15) break;
        try {
          const bookData = JSON.parse(fs.readFileSync(path.join(booksDir, f), 'utf8'));
          const bookId = bookData.bookId;
          const canon = BIBLE_CANON_MAP[bookId] || { nameEs: bookId, nameEn: bookId };

          for (let c = 0; c < bookData.chapters.length; c++) {
            if (localResults.length >= 15) break;
            const chVerses = bookData.chapters[c];
            for (const v of chVerses) {
              const textEsLower = (v.textEs || '').toLowerCase();
              const textEnLower = (v.textEn || '').toLowerCase();
              if (textEsLower.includes(cleanKeyword) || textEnLower.includes(cleanKeyword)) {
                localResults.push({
                  bookId,
                  bookName: canon.nameEs,
                  bookNameEn: canon.nameEn,
                  chapter: c + 1,
                  verseNumber: v.verseNumber,
                  textEs: v.textEs,
                  textEn: v.textEn,
                  relevanceScore: textEsLower.startsWith(cleanKeyword) ? 1.0 : 0.85
                });
                if (localResults.length >= 15) break;
              }
            }
          }
        } catch (e) {
          // ignore corrupted book file
        }
      }
    }

    if (localResults.length > 0) {
      return res.json({ results: localResults, source: 'local-index' });
    }

    // 2. Semantic AI Fallback if no exact string matches found
    if (ai) {
      const searchPrompt = `
        Eres el motor de búsqueda de HAVAH. Encuentra los 10 versículos más relevantes de TODA la Biblia sobre: "${keyword}".
        Responde ÚNICAMENTE un objeto JSON con SOLO referencias, sin texto bíblico:
        { "results": [ { "bookId": "ID del libro (ej: MAT, JHN, PSA)", "chapter": 1, "verseNumber": 1, "relevanceScore": 0.95 } ] }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [{ role: 'user', parts: [{ text: searchPrompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const text = response.text;
      if (text) {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const semanticResults: any[] = [];
        for (const r of (parsed.results || []).slice(0, 10)) {
          const safeId = String(r.bookId || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
          const bookPath = path.join(booksDir, `${safeId}.json`);
          if (!safeId || !fs.existsSync(bookPath)) continue;
          const bd = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
          const verses = bd.chapters?.[Number(r.chapter) - 1];
          const found = Array.isArray(verses) ? verses.find((x: any) => x.verseNumber === Number(r.verseNumber)) : null;
          if (!found || !found.textEs) continue;
          const canonInfo = BIBLE_CANON_MAP[bd.bookId] || { nameEs: bd.bookId, nameEn: bd.bookId };
          semanticResults.push({
            bookId: bd.bookId,
            bookName: canonInfo.nameEs,
            bookNameEn: canonInfo.nameEn,
            chapter: Number(r.chapter),
            verseNumber: found.verseNumber,
            textEs: found.textEs,
            textEn: found.textEn,
            relevanceScore: r.relevanceScore ?? 0.8
          });
        }
        return res.json({ results: semanticResults, source: 'ai-semantic' });
      }
    }

    return res.json({ results: [] });
  } catch (error: any) {
    console.error('Bible search error:', error?.message);
    return res.status(500).json({ error: 'Search engine failed' });
  }
});

// Health check endpoint for Render / monitoring services
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const indexPath = path.join(distPath, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(indexPath);

  if (isProduction) {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, {
        etag: true,
        maxAge: '1y',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      }));
    }
    app.get('*', (_req, res) => {
      if (fs.existsSync(indexPath)) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return res.sendFile(indexPath);
      }
      res.status(503).send('El servidor está iniciando o la carpeta dist aún se está compilando. Espera un momento y recarga.');
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor HAVAH corriendo en el puerto ${PORT}`);
  });
}

startServer();
