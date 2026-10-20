import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  BookOpen,
  RotateCcw,
  Search,
  Heart,
  HelpCircle,
  Coffee,
  X,
  Check,
  Volume2,
  Pause,
} from 'lucide-react';
import { ChatMessage, JournalEntry, Language } from '../types';
import { ThemeColors } from '../theme';
import { storage } from '../utils/storage';
import { speechEngine } from '../utils/speechEngine';

interface BibleChatScreenProps {
  language: Language;
  theme: ThemeColors;
  initialPrompt?: string;
}

export const BibleChatScreen: React.FC<BibleChatScreenProps> = React.memo(({
  language,
  theme,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTopicsDialog, setShowTopicsDialog] = useState(false);
  const [responseLength, setResponseLength] = useState<'corta' | 'larga'>('larga');
  const [savedJournalIndex, setSavedJournalIndex] = useState<number | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Stop speaking when unmounting
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      speechEngine.stop();
      setSpeakingMsgId(null);
    } else {
      speechEngine.stop();
      setSpeakingMsgId(msgId);
      speechEngine.speak({
        text,
        language,
        voice: 'kore', // Maternal/warm voice for the mentor
        onEnd: () => setSpeakingMsgId(null),
        onError: () => setSpeakingMsgId(null),
      });
    }
  };

  // Auto-scroll on new messages
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 19;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Naturalize response to sound 100% human, remove all AI markers, asterisks, bullets & cliches
  const sanitizeResponse = (text: string): string => {
    return text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove all stray asterisks
      .replace(/^[\s]*[-•*]\s+/gm, '') // Remove list bullets
      .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/hola mi corazón\.?/gi, 'Hola.')
      .replace(/mira,? corazón:?/gi, '')
      .replace(/mi corazón,?/gi, '')
      .replace(/amada hermana,?/gi, '')
      .replace(/en resumen,?\s*/gi, '')
      .replace(/en conclusión,?\s*/gi, '')
      .replace(/espero haberte ayudado[^\.]*\.?/gi, '')
      .replace(/espero que esta información[^\.]*\.?/gi, '')
      .replace(/qué alegría poder sentarnos[^\.]*\./gi, '')
      .replace(/qué alegría que conversemos[^\.]*\./gi, '')
      .replace(/qué gusto conversar[^\.]*\./gi, '')
      .replace(/[ \t]+/g, ' ') // collapse horizontal whitespace only
      .replace(/\n{3,}/g, '\n\n') // preserve natural paragraphs
      .trim();
  };

  // Fallback mentor answers - 100% Biblical truth, direct without beating around the bush,
  // compassionate, full of mercy, joy, and love; zero AI jargon, zero clichés, zero New Age, zero legalism.
  const mentorWisdom = (query: string): string => {
    const q = query.toLowerCase();

    if (responseLength === 'corta') {
      if (q.includes('mar rojo') || q.includes('abrio el mar') || q.includes('abrió el mar') || q.includes('evidencia') || q.includes('certeza') || q.includes('muchos años') || q.includes('pasaron años') || q.includes('realmente paso') || q.includes('literal') || q.includes('jonas') || q.includes('jonás') || q.includes('pez')) {
        return language === 'es'
          ? 'Mira, te lo digo directo y sin rodeos: los milagros en la Biblia son hechos reales donde Dios intervino con Su poder soberano porque humanamente no había otra salida. Y tener preguntas sobre eso no te hace menos creyente; David y Tomás también tuvieron dudas honestas y Jesús jamás los regañó. Dios es el Creador de la naturaleza y tiene el poder de abrir camino en el mar cuando hace falta. ¿Qué es lo que más te cuesta asimilar de estos relatos?'
          : 'I will be direct with you: biblical miracles are real historical moments where God stepped in with sovereign power when there was no human way out. Having honest questions does not mean your faith is weak; Thomas and David had doubts too and Jesus never turned them away. God created nature and He has the power to part any sea. What feels hardest for you to process about these stories?';
      }
      if (q.includes('mateo 4:23') || q.includes('mateo 4 versiculo 23') || q.includes('enseñando en las sinagogas')) {
        return language === 'es'
          ? 'Mateo 4:23 resume el corazón de Jesús en tres cosas claritas: enseñaba la verdad de Dios, predicaba el evangelio del Reino y sanaba toda enfermedad del pueblo. Jesús no se quedó encerrado esperando gente perfecta; salió a buscar a los necesitados para darles salud y esperanza real. ¿Sientes que hoy necesitas que Jesús toque alguna dolencia o carga en tu vida?'
          : 'Matthew 4:23 shows Jesus’ heart plainly: He taught God’s truth, preached the gospel of the kingdom, and healed every disease among the people. He did not wait for perfect people; He proactively sought the hurting. Is there a burden or pain in your life where you need His healing touch today?';
      }
      if (q.includes('adan') || q.includes('eva') || q.includes('cain') || q.includes('hijos') || q.includes('dos hombres') || q.includes('procrea')) {
        return language === 'es'
          ? 'La respuesta bíblica es directa y sin misterio: Génesis 5:4 enseña que después de Set, Adán y Eva vivieron muchos años y engendraron otros hijos e hijas. La historia popular solo recuerda a Caín y a Abel por la tragedia, pero la familia humana se multiplicó sobre la tierra a través de todos esos descendientes. ¿Te da paz ver que la misma Biblia lo responde con tanta claridad?'
          : 'The biblical answer is clear: Genesis 5:4 states that Adam and Eve lived many years and had other sons and daughters throughout their lifetime. Popular retellings only emphasize Cain and Abel, but humanity multiplied through their many descendants. Does it bring clarity seeing Scripture explains this so directly?';
      }
      if (q.includes('amen') || q.includes('quedó claro') || q.includes('quedo claro') || q.includes('gracias') || q.includes('paz para mi d') || q.includes('adios') || q.includes('chao') || q.includes('hasta luego')) {
        return language === 'es'
          ? '¡Amén! Me da muchísima alegría saber que te vas con paz en el corazón. Guarda esta palabra en tu alma, camina confiada y descansa sabiendo que el amor de Dios te cuida en cada paso. Aquí tienes tu rincón siempre que quieras volver a platicar. ¡Que el Señor te bendiga y te dé un reposo precioso!'
          : 'Amen! It brings joy to my heart knowing you leave with peace. Hold this truth close and rest knowing God’s love surrounds every step. This quiet refuge is always open whenever you want to talk again. May the Lord bless you with deep rest!';
      }
      if (q.includes('eshet') || q.includes('proverbios 31') || q.includes('mujer virtuosa') || q.includes('perfeccion')) {
        return language === 'es'
          ? 'Proverbios 31 nunca fue una lista pesada para que termines el día con culpa por no alcanzarlo todo. En el hebreo original es un poema de alabanza que el esposo y la familia cantaban para honrar la fuerza y el valor que la mujer ya tiene en Dios. Él no te pide perfección; te pide descansar en Su amor y en Su gracia. ¿Sientes que a veces te estás exigiendo de más?'
          : 'Proverbs 31 was never an exhausting checklist meant to induce guilt at bedtime. In Hebrew it is a hymn of praise honoring the strength and noble dignity a woman already holds in God. He never demands perfection; He asks you to rest in His grace. Do you feel you are putting too much pressure on yourself?';
      }
      if (q.includes('silencio') || q.includes('no responde') || q.includes('espera') || q.includes('orar')) {
        return language === 'es'
          ? 'El silencio de Dios no es rechazo ni castigo, te lo aseguro. David en los Salmos lloró muchas veces sintiendo ese mismo silencio, y Dios dejó esas oraciones en la Biblia para recordarnos que desahogarnos con sinceridad es parte de la fe real. En el silencio, Dios suele estar trabajando en lo que aún no vemos para cuidar de nosotros. ¿Qué es lo que más te pesa esperar en este momento?'
          : 'God’s silence is never rejection or abandonment. David cried out in the Psalms feeling that same silence, showing us honest tears belong in real faith. In quiet seasons, God is often working in hidden places to prepare our peace. What feels heaviest for you to wait on right now?';
      }
      if (q.includes('perdon') || q.includes('herida') || q.includes('familia') || q.includes('duele') || q.includes('rencor')) {
        return language === 'es'
          ? 'Perdonar en la familia duele hondo y toma tiempo, pero Jesús jamás nos pidió fingir que nada pasó ni dejar que nos sigan lastimando. El perdón bíblico es soltar el veneno de la amargura entregándole esa justicia a Dios, cuidando tu corazón con amor y límites sanos. ¿Lo que más te cuesta hoy es el dolor del recuerdo o el trato con esa persona?'
          : 'Forgiving family hurts deeply and takes time, but Jesus never asked us to pretend nothing happened or allow ongoing harm. Biblical forgiveness is releasing bitterness into God’s hands so your own soul stays free, while establishing firm, healthy boundaries. What feels hardest for you right now?';
      }
      if (q.includes('racha') || q.includes('no he orado') || q.includes('no leí') || q.includes('me alejé') || q.includes('descuidé') || q.includes('sin orar') || q.includes('fallé') || q.includes('fallarle')) {
        return language === 'es'
          ? '¡Suelta esa culpa ahora mismo! Dios no lleva una libreta de castigos ni te quiere menos porque tuviste días pesados o te venció el cansancio. La gracia de Dios es un abrazo de bienvenida: cuando el hijo pródigo regresó, el Padre salió corriendo a recibirlo con fiesta. Dios busca tu corazón sincero, no un récord de días cumplidos. ¿Qué es lo que más te ha quitado la paz en estos días?'
          : 'Release that guilt right now! God never keeps a scorecard of absences or loves you less because of exhaustion. Grace is an open-armed embrace: when the prodigal returned, the Father ran out to celebrate. God desires your sincere heart, not an unbroken streak. What has been weighing on your spirit lately?';
      }
      if (q.includes('descans') || q.includes('culpa') || q.includes('control') || q.includes('dormir') || q.includes('afán') || q.includes('ansied') || q.includes('miedo')) {
        return language === 'es'
          ? 'Aprender a parar y descansar es un acto de fe. Solemos creer que si no sostenemos todo nosotras, el mundo se derrumba; pero quien sostiene tu vida y tu hogar es el Señor. Jesús lo dijo claro: a cada día le basta su propio afán. Haz lo que hoy puedas con amor y deja que Dios cuide el resto esta noche. ¿Qué pendiente te está robando la tranquilidad para dormir?'
          : 'Learning to pause and rest is an act of real faith. We often carry our households as if everything depends on us, but God is the true sustainer. Jesus told us plainly: each day has enough trouble of its own. What worry is keeping you from sleeping peacefully tonight?';
      }
      return language === 'es'
        ? 'Te escucho con todo el cariño y sin juzgarte para nada. En la vida con Dios es de lo más normal tener dudas, cansancio y preguntas difíciles; Él no se asusta de lo que sentimos en el corazón. Cuéntame un poquito más, ¿qué es lo que más te preocupa o inquieta sobre esto?'
        : 'I hear you with warmth and no judgment. In walking with God, having honest questions and feeling tired is completely normal; He welcomes our real hearts. Tell me a bit more: what is weighing most on your thoughts about this?';
    }

    // Response length: larga (deep reflection, warm, frank, 100% biblical, human, no clichés)
    if (q.includes('mar rojo') || q.includes('abrio el mar') || q.includes('abrió el mar') || q.includes('evidencia') || q.includes('certeza') || q.includes('muchos años') || q.includes('pasaron años') || q.includes('realmente paso') || q.includes('literal') || q.includes('jonas') || q.includes('jonás') || q.includes('pez')) {
      return language === 'es'
        ? sanitizeResponse('Te entiendo de corazón. Cuando una lee estos relatos a la distancia de tantos años, la cabeza a veces se queda pensando con honestidad: «¿de verdad pasó esto así o será solo una metáfora bonita?». Y no tienes que sentirte culpable por pensarlo; la fe real no se trata de apagar el cerebro ni fingir que no tenemos preguntas.\n\nLa verdad es que en la Biblia los milagros nunca fueron trucos de magia ni fábulas inventadas. Fueron intervenciones directas del Dios vivo en la historia humana para rescatar a personas que no tenían ninguna salida. El pueblo de Israel quedó tan marcado por el cruce del Mar Rojo que hasta el día de hoy, más de tres mil años después, siguen celebrando la Pascua para recordar que Dios estuvo allí. No necesitamos un laboratorio para comprobar a Dios; Su soberanía sobre la naturaleza se ve en Su Palabra y en cómo transforma vidas.\n\nJesús nunca rechazó a Tomás cuando pidió ver las heridas, ni a David cuando dudó en los Salmos. La fe no es tener todas las respuestas resueltas, sino confiar en el Dios que hace milagros y cuida de ti. ¿Sientes que tener estas dudas te hace sentir culpa, o es simplemente una inquietud sincera que quieres entender mejor?')
        : 'I hear your heart so clearly. When reading events thousands of years later, it is completely natural for our minds to wonder if it truly happened. Biblical faith never asks us to shut down our intellect. Even Thomas and David wrestled with deep questions, and Jesus met them with gentle grace rather than rebuke. Biblical miracles were sovereign interventions of God in real history when human effort had run out. Faith is about trusting the God of miracles, not having a laboratory proof for every detail. Does having questions feel like a heavy burden, or an honest search for peace?';
    }

    if (q.includes('adan') || q.includes('eva') || q.includes('cain') || q.includes('hijos') || q.includes('dos hombres') || q.includes('procrea')) {
      return language === 'es'
        ? sanitizeResponse('Es una duda tan lógica y tiene una respuesta directa en la misma Biblia. Muchas veces en los relatos populares se menciona únicamente a Caín y a Abel por la tragedia de lo que pasó, y una se queda pensando con toda razón cómo fue posible que continuara la familia humana.\n\nPero cuando vas al texto bíblico con calma, Génesis 5:4 te lo aclara sin vueltas: después de Set, Adán y Eva vivieron cientos de años y engendraron otros hijos e hijas. En aquellos primeros tiempos de la creación, la humanidad se multiplicó de manera natural a través de los hijos e hijas de esa primera familia para poblar la tierra.\n\nMe encanta que leas la Palabra con atención y sin miedo a preguntar. Dios no dejó la Biblia para dejarnos confundidas, sino para que conozcamos Su verdad con sencillez y confianza. ¿Cómo te sientes al descubrir este detalle en el texto?')
        : 'That is such a reasonable and honest question. Popular stories usually focus only on Cain and Abel, leaving us wondering how humanity continued. Genesis 5:4 clarifies plainly that Adam and Eve lived many years and had other sons and daughters throughout their lives, multiplying humanity naturally. You never have to feel embarrassed for asking honest questions about Scripture.';
    }

    if (q.includes('amen') || q.includes('quedó claro') || q.includes('quedo claro') || q.includes('gracias') || q.includes('paz para mi d') || q.includes('adios') || q.includes('chao') || q.includes('hasta luego')) {
      return language === 'es'
        ? sanitizeResponse('¡Amén! Me da una paz enorme saber que pudimos charlar de esto con calma y que te vas con el corazón más tranquilo. Caminar en la fe es justamente eso: aprender a conversar con Dios y con Su Palabra con el alma abierta, sabiendo que Él nos conoce por nuestro nombre y cuida cada uno de nuestros pasos.\n\nDescansa esta noche sabiendo que estás en las manos del Padre y que tus preguntas siempre son bienvenidas aquí. Que la paz del Señor te abrace y renueve tus fuerzas por completo.')
        : 'Amen! It brings deep peace to my heart knowing this conversation brought you calm and clarity. Walking in faith is about journeying with God with an open soul, knowing He cherishes your steps. Rest peacefully knowing your honest heart is loved by the Lord.';
    }

    if (q.includes('eshet') || q.includes('proverbios 31') || q.includes('mujer virtuosa') || q.includes('perfeccion')) {
      return language === 'es'
        ? sanitizeResponse('Mira, te digo esto con todo el amor de mi corazón: a tantas mujeres se les ha enseñado Proverbios 31 como si fuera una lista agotadora de tareas que hay que cumplir a la perfección antes de dormir, dejándolas llenas de culpa y con la sensación de que nunca dan la talla.\n\nPero en la tradición bíblica original, ese pasaje era todo lo contrario: no era un manual de exigencias, era un canto de bendición. Los esposos lo recitaban los viernes de noche en la mesa de Shabat para honrar a sus esposas y recordarles que su valor y su dignidad ya estaban en el Señor. Dios jamás te ha pedido una perfección que te quite la paz ni que cargues el mundo en tus espaldas. Su gracia empieza justo donde terminan tus fuerzas.\n\n¿En qué cosas de tu rutina sientes que a veces te exiges más de lo que Dios mismo te está pidiendo?')
        : 'Proverbs 31 was never intended as an exhausting checklist of perfection, but a song of blessing honoring a woman’s dignity in the Lord. God never called you to carry the weight of perfection on your shoulders; His grace meets you right where your strength ends. Where do you feel you might be placing too heavy a burden on yourself?';
    }

    if (q.includes('silencio') || q.includes('no responde') || q.includes('espera') || q.includes('orar')) {
      return language === 'es'
        ? sanitizeResponse('Es tan duro sentir que oramos y que del otro lado solo hay silencio. Todas las personas que han buscado a Dios de verdad han pasado por ese desierto en algún momento de su vida, y duele en el alma.\n\nEn los Salmos, David le decía a Dios con lágrimas: «¿Hasta cuándo me vas a olvidar, Señor?». Dios dejó esas palabras en la Biblia para que supiéramos que dudar, llorar y no entender no nos hace personas sin fe; nos hace humanas. El silencio de Dios no es rechazo ni abandono; muchas veces es el lugar íntimo donde Él está cuidando detalles que aún no podemos ver y ayudando a nuestro corazón a reposar seguro en Sus brazos.\n\nNo necesitas oraciones impecables para que el Padre te escuche; un suspiro sincero ya llega a Su corazón. ¿Qué es lo que más te cuesta sostener en este tiempo de espera?')
        : 'Waiting through God’s silence is deeply difficult. Yet the Psalms are filled with raw cries asking where God is, showing us that weeping and questioning are part of a genuine walk with God. His silence is never abandonment; it is often where He tenderly holds us in the quiet. What feels hardest to carry in this quiet season?';
    }

    if (q.includes('perdon') || q.includes('herida') || q.includes('familia') || q.includes('duele') || q.includes('rencor')) {
      return language === 'es'
        ? sanitizeResponse('El perdón en la familia es de las cosas más complejas y dolorosas que existen. Nos han dicho muchas veces que perdonar es hacer como si nada hubiera pasado, pero Jesús nunca nos pidió fingir ni exponernos a que nos sigan lastimando.\n\nPerdonar es una decisión humilde de soltar las ganas de venganza y no dejar que la amargura nos pudra el alma por dentro, entregándole esa justicia a Dios. Y al mismo tiempo, puedes perdonar sinceramente y poner límites sanos y firmes con amor para cuidar tu paz. El perdón no borra lo que dolió, pero te libera a ti de seguir atada a esa herida.\n\n¿Sientes que lo más difícil hoy es el dolor que todavía revive al recordar, o saber cómo tratar con esa persona en el día a día?')
        : 'Forgiving family is one of the most tender, difficult things in life. Biblical forgiveness is not pretending harm never happened or enabling ongoing hurt. It is surrendering resentment into God’s hands so your own soul stays free, while establishing healthy, loving boundaries. What feels hardest for your heart right now?';
    }

    if (q.includes('racha') || q.includes('no he orado') || q.includes('no leí') || q.includes('me alejé') || q.includes('descuidé') || q.includes('sin orar') || q.includes('fallé') || q.includes('fallarle')) {
      return language === 'es'
        ? sanitizeResponse('Respira con calma y suelta toda esa carga de remordimiento que estás sintiendo. Muchas aplicaciones y discursos religiosos han convertido la relación con Dios en una lista estresante de tareas, donde si te saltas un día parece que se rompe una racha o que Dios se enoja contigo. Pero el Evangelio es exactamente lo opuesto.\n\nEn la Biblia, el Dios al que servimos nunca llevó un cuaderno de asistencia ni castigó la pausa. Cuando el hijo pródigo regresó sucio y cansado, el Padre no le preguntó por qué tardó tanto ni le quitó privilegios: corrió a abrazarlo, le puso un anillo en el dedo y celebró una fiesta. La gracia nunca te juzga por descansar, por haber estado enferma o por haber tenido semanas difíciles.\n\nCada vez que regresas a un rincón de oración, estás exactamente a tiempo. Dios no mide tu amor por días consecutivos, sino por la sinceridad de tu corazón cuando decides buscarlo. ¿Qué es lo que más te ha estado quitando las fuerzas en este tiempo?')
        : 'Take a quiet breath and release the burden of guilt you have been carrying. Modern apps often turn faith into a stressful checklist where missing a day feels like a penalty. Yet biblical grace is the opposite.\n\nGod never keeps a scorecard of absences. When the prodigal child returned, the Father did not demand an explanation; He ran, embraced them, and celebrated. Grace never punishes rest or weary seasons. Every time you return, you are met with open arms. What has been weighing on your heart lately?';
    }

    if (q.includes('descans') || q.includes('culpa') || q.includes('control') || q.includes('dormir') || q.includes('afán') || q.includes('ansied') || q.includes('miedo')) {
      return language === 'es'
        ? sanitizeResponse('Respira hondo un momento y suelta los hombros. Nosotras solemos cargar la casa, la familia, el trabajo y las expectativas de los demás como si el universo fuera a desplomarse si nos damos permiso de parar y descansar.\n\nEn la Biblia, el descanso es un regalo sagrado. Cuando Dios mandó reposar, lo hizo para recordarnos que somos Sus hijas amadas, no esclavas de los pendientes. Jesús nos dijo con una ternura infinita: «Vengan a mí los que están cansados y cargados, y yo les daré descanso». Esta noche dile a tu mente que ya hiciste lo que podías hoy con amor, y que el mañana está en las manos del Señor.\n\n¿Qué es lo que más te roba la tranquilidad cuando intentas apagar la mente para dormir?')
        : 'Take a gentle breath and release the tension. We often carry our households and worries as if everything depends on us, but God designed rest as a sacred gift of love. Jesus invites the weary to find true rest in Him. What burden has been making it hard for you to quiet your thoughts tonight?';
    }

    return language === 'es'
      ? sanitizeResponse('Aquí estoy para escucharte con todo mi cariño y sin ninguna pose religiosa. A veces nos hacen creer que la fe consiste en tener respuestas perfectas para todo y no dudar jamás, pero cuando miramos la Biblia con el corazón vemos que Dios siempre caminó con paciencia al lado de quienes tenían preguntas sinceras y temores reales.\n\nLa fe no es un manual de certezas frías; es aprender a confiar en el amor de Dios incluso cuando hay cosas que no logramos entender por completo. No tienes que fingir estar bien ni esconder lo que sientes.\n\nCuéntame, ¿qué es lo que más te está pesando o qué te gustaría que miremos juntas a la luz de la Palabra?')
      : 'I am here with warmth and no rigid poses. Faith is not a textbook of cold answers; it is walking with a loving God even when life holds deep questions. You never have to pretend to be fine here. Tell me, what is weighing on your spirit or what would you like to explore together in God’s Word?';
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      text: textToSend.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    let failReason = 'error';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          history: messages.slice(-4),
          responseLength: responseLength,
          language: language,
        }),
      });

      if (response.status === 429) failReason = 'rate_limited';
      if (response.ok) {
        const data = await response.json();
        if (data && data.fallbackNeeded && data.reason) failReason = data.reason;
        if (data && data.reply && !data.fallbackNeeded) {
          const botMsg: ChatMessage = {
            id: `bot_${Date.now()}`,
            text: sanitizeResponse(data.reply),
            isUser: false,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      // Fallback to local wisdom below
    }

    // Sin respuesta real de la IA: se dice con claridad, sin inventar una respuesta enlatada.
    const isLocalDev = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    const replyText =
      failReason === 'rate_limited'
        ? (language === 'es'
            ? 'Has hecho muchas preguntas seguidas. Espera unos minutos y vuelve a intentarlo.'
            : 'You have asked many questions in a row. Please wait a few minutes and try again.')
        : failReason === 'no_key' && isLocalDev
        ? (language === 'es'
            ? 'El Diálogo necesita la clave de Gemini. Abre el archivo .env en tu carpeta Havah-PC, escribe GEMINI_API_KEY="tu clave", guarda y vuelve a abrir ABRIR-HAVAH.bat.'
            : 'The chat needs the Gemini key. Open the .env file in your Havah-PC folder, write GEMINI_API_KEY="your key", save it and open ABRIR-HAVAH.bat again.')
        : (language === 'es'
            ? 'No pude responder en este momento. Inténtalo de nuevo en unos minutos.'
            : 'I could not answer right now. Please try again in a few minutes.');
    const botMsg: ChatMessage = {
      id: `bot_${Date.now()}`,
      text: sanitizeResponse(replyText),
      isUser: false,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleAmenClosure = () => {
    handleSendMessage(
      language === 'es'
        ? 'Amén, ahora lo entiendo mucho mejor y me voy con el corazón en paz. ¡Muchas gracias!'
        : 'Amen, I understand this much better now and leave with peace in my heart. Thank you so much!'
    );
  };

  const handlePeaceClosure = () => {
    handleSendMessage(
      language === 'es'
        ? 'Me llevo esta paz para mi día.'
        : 'I carry this peace with me for my day.'
    );
  };

  const handleSaveToJournal = (text: string, index: number) => {
    const entries = storage.getJournalEntries();
    const newEntry: JournalEntry = {
      id: Date.now(),
      title: language === 'es' ? 'Enseñanza: Paz y Sabiduría' : 'Teaching: Peace & Wisdom',
      content: text,
      moodId: 'peace',
      scriptureRef: language === 'es' ? 'Reflexión Bíblica' : 'Scripture Reflection',
      timestamp: Date.now(),
    };
    storage.saveJournalEntries([newEntry, ...entries]);
    setSavedJournalIndex(index);
    setTimeout(() => {
      setSavedJournalIndex(null);
    }, 3500);
  };


  const topicGroups = [
    {
      group: language === 'es' ? 'Investigación Bíblica a Fondo' : 'Deep Scripture Study',
      topics: [
        {
          title: language === 'es' ? 'Contexto bíblico para hoy' : 'Scripture context for today',
          desc: language === 'es' ? 'Comprende el mensaje bíblico de forma sencilla y directa' : 'Understand the biblical message simply and directly',
          prompt: language === 'es' ? '¿Cómo entender este pasaje bíblico en su contexto real y aplicarlo hoy a mi vida?' : 'How do I understand this passage in its real context and apply it to my life today?',
        },
        {
          title: language === 'es' ? 'Proverbios 31: «Eshet Jáyil» en hebreo' : 'Proverbs 31: «Eshet Chayil»',
          desc: language === 'es' ? 'Desmitificando el peso de la perfección y la autoexigencia' : 'Dismantling perfectionism with biblical grace',
          prompt: language === 'es' ? '¿Qué significa realmente «Eshet Jáyil» en el hebreo original de Proverbios 31 y cómo quita la carga del perfeccionismo?' : 'What does «Eshet Chayil» really mean in Hebrew?',
        },
      ],
    },
    {
      group: language === 'es' ? 'Dudas y Preguntas Difíciles' : 'Tough Faith Questions',
      topics: [
        {
          title: language === 'es' ? '¿Por qué el silencio de Dios al orar?' : 'Why God\'s silence in prayer?',
          desc: language === 'es' ? 'Entender los tiempos de Dios sin perder la paz interior' : 'Understanding God\'s timing with peace',
          prompt: language === 'es' ? 'A veces oro con todo mi corazón y siento silencio o incertidumbre. ¿Cómo entender los tiempos de Dios y mantener la calma?' : 'How do I handle feeling silence when I pray?',
        },
        {
          title: language === 'es' ? 'Perdonar en la familia cuando aún duele' : 'Forgiving family when it still hurts',
          desc: language === 'es' ? 'El verdadero sentido bíblico de desatar una herida' : 'Biblical truth of releasing a hurt',
          prompt: language === 'es' ? '¿Qué enseña Jesús sobre el perdón en las relaciones familiares cuando la herida todavía duele y cuesta sanar?' : 'What does Jesus teach about forgiving family?',
        },
      ],
    },
    {
      group: language === 'es' ? 'Vida Real, Familia y Descanso' : 'Daily Life, Family & Rest',
      topics: [
        {
          title: language === 'es' ? 'Soltar el control y la culpa cotidiana' : 'Letting go of control & guilt',
          desc: language === 'es' ? 'Aprender a parar y descansar de verdad sin remordimiento' : 'Learning to pause without guilt',
          prompt: language === 'es' ? 'Me cuesta mucho soltar el control y descansar sin sentir culpa por los pendientes. ¿Qué consejo de paz me das?' : 'I struggle to release control and rest without guilt. What counsel of peace can you share with me?',
        },
        {
          title: language === 'es' ? 'Paz mental para apagar las alarmas' : 'Mental peace before sleep',
          desc: language === 'es' ? 'Entregar las cargas antes de dormir esta noche' : 'Surrendering worries before bedtime',
          prompt: language === 'es' ? 'Siento mi mente sobrecargada esta noche. Regálame una reflexión y una oración breve para entregar mis cargas e irme a dormir en paz.' : 'I feel overwhelmed tonight. Share a reflection and prayer for peaceful rest.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-3.5 pb-20 flex flex-col h-[calc(100vh-130px)] min-h-[580px]">
      {/* Box 1: Header bar (Liquid Glass - Proportional Size) */}
      <div
        className="rounded-3xl p-4 border shadow-lg flex items-center justify-between backdrop-blur-2xl liquid-glass shrink-0"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
            style={{
              backgroundColor: theme.accentBg,
              border: `1.5px solid ${theme.accentBorder}`,
            }}
          >
            <Heart className="w-5 h-5" style={{ color: theme.accent }} />
          </div>
          <div>
            <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
              {language === 'es' ? 'Hablemos • De Corazón a Corazón' : 'Let\'s Talk • Heart to Heart'}
            </h3>
            <p className="text-[11px] font-bold" style={{ color: theme.accent }}>
              {language === 'es' ? 'Verdad Bíblica • Amor, gracia y vida real' : 'Biblical truth • Love, grace & real life'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTopicsDialog(true)}
            className="px-3.5 py-1.5 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.accent,
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Explorar temas' : 'Topics'}</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-2 rounded-2xl hover:opacity-80 transition-colors cursor-pointer hover:scale-105"
              style={{ color: theme.textMuted }}
              title={language === 'es' ? 'Reiniciar diálogo' : 'Reset chat'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Box 2: Middle Box (Harmonious Proportional Height & Standard Font Sizes) */}
      <div
        className="flex-1 overflow-y-auto p-5 sm:p-6 rounded-3xl border space-y-5 shadow-xl backdrop-blur-2xl liquid-glass flex flex-col justify-between"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="space-y-5">
          <p className="text-[11px] leading-snug text-center opacity-75" style={{ color: theme.textMuted }}>
            {language === 'es'
              ? 'Estás conversando con una inteligencia artificial. Sus respuestas pueden tener errores y no sustituyen a un pastor, médico o psicólogo. Si estás en peligro, llama al 112 (en España también al 024; en EE. UU., al 988).'
              : 'You are chatting with an AI. Its replies may contain mistakes and are not a substitute for a pastor, doctor or therapist. If you are in danger, call your local emergency number (112 or 024 in Spain; 988 in the US).'}
          </p>
          {messages.length === 0 ? (
            <div className="space-y-5">
              {/* Proportional Welcome Box */}
              <div
                className="p-5 sm:p-6 rounded-3xl border space-y-3 shadow-md liquid-glass-subtle relative overflow-hidden"
                style={{
                  backgroundColor: theme.accentBg,
                  borderColor: theme.accentBorder,
                }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-xs" style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000' : '#fff' }}>
                  <Heart className="w-3 h-3" />
                  <span>{language === 'es' ? 'Hablemos • De Corazón a Corazón' : 'Let\'s Talk • Heart to Heart'}</span>
                </div>
                <h4 className="font-serif-scripture font-bold text-xl sm:text-2xl leading-snug" style={{ color: theme.accent }}>
                  {language === 'es' ? 'Verdad Bíblica • Amor, gracia y vida real' : 'Biblical Truth • Love, Grace & Real Life'}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.text, opacity: 0.95 }}>
                  {language === 'es'
                    ? 'Un rincón cercano y de corazón abierto para hablar de la vida, resolver dudas honestas sobre la Biblia y soltar las cargas con paz. Sin rodeos, sin poses religiosas y con la verdad de Dios llena de amor y misericordia.'
                    : 'A warm, safe space to talk through real life, explore honest biblical questions, and release daily burdens with peace, love, and grace.'}
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: theme.accent }}>
                    {language === 'es' ? 'Sugerencias para reflexionar juntas:' : 'Suggestions to explore together:'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topicGroups.flatMap((g) => g.topics).map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(t.prompt)}
                      className="p-3.5 sm:p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-98 liquid-glass-subtle group"
                      style={{
                        borderColor: theme.cardBorder,
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs group-hover:scale-105 transition-transform" style={{ backgroundColor: theme.accentBg, border: `1px solid ${theme.accentBorder}` }}>
                        <Search className="w-4 h-4" style={{ color: theme.accent }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight" style={{ color: theme.text }}>
                          {t.title}
                        </p>
                        <p className="text-[11px] mt-1 leading-normal" style={{ color: theme.textMuted }}>
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {messages.map((msg, idx) => {
                const lastUserMsg = [...messages].reverse().find((m) => m.isUser);
                const isAlreadyClosed = lastUserMsg && /am[eé]n|paz para mi|muchas gracias|hasta luego|adi[oó]s|chao|me voy en paz/i.test(lastUserMsg.text);
                const isLastMsg = idx === messages.length - 1;
                const showClosurePrompt = !msg.isUser && isLastMsg && messages.length >= 6 && !isAlreadyClosed;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-4.5 rounded-3xl border text-xs sm:text-sm leading-relaxed shadow-md backdrop-blur-xl ${
                        msg.isUser ? 'rounded-br-xs' : 'rounded-bl-xs liquid-glass-subtle'
                      }`}
                      style={{
                        backgroundColor: msg.isUser ? theme.accent : theme.cardVariant,
                        borderColor: msg.isUser ? theme.accent : theme.cardBorder,
                        color: msg.isUser ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.text,
                      }}
                    >
                      {!msg.isUser && (
                        <div className="flex items-center justify-between mb-2 pb-1 border-b border-black/5 dark:border-white/5">
                          <p
                            className="text-[11px] font-bold flex items-center gap-1.5"
                            style={{ color: theme.accent }}
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>{language === 'es' ? 'Consejería en la Fe' : 'Faith Counselor'}</span>
                          </p>
                          <button
                            onClick={() => handleSaveToJournal(msg.text, idx)}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: savedJournalIndex === idx ? (theme.isDark ? '#064e3b' : '#dcfce7') : 'transparent',
                              borderColor: savedJournalIndex === idx ? '#10b981' : theme.cardBorder,
                              color: savedJournalIndex === idx ? (theme.isDark ? '#34d399' : '#15803d') : theme.textMuted,
                            }}
                            title={language === 'es' ? 'Guardar en mi diario' : 'Save to journal'}
                          >
                            {savedJournalIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <BookOpen className="w-3 h-3" />}
                            <span>
                              {savedJournalIndex === idx
                                ? (language === 'es' ? '¡Guardado!' : 'Saved!')
                                : (language === 'es' ? 'Guardar en diario' : 'Save')}
                            </span>
                          </button>
                          <button
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 ml-1.5"
                            style={{
                              backgroundColor: speakingMsgId === msg.id ? theme.accentBg : 'transparent',
                              borderColor: speakingMsgId === msg.id ? theme.accentBorder : theme.cardBorder,
                              color: speakingMsgId === msg.id ? theme.accent : theme.textMuted,
                            }}
                            title={language === 'es' ? 'Escuchar con voz humana' : 'Listen with human voice'}
                          >
                            {speakingMsgId === msg.id ? <Pause className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
                            <span>{speakingMsgId === msg.id ? (language === 'es' ? 'Escuchando...' : 'Listening...') : (language === 'es' ? 'Escuchar' : 'Listen')}</span>
                          </button>
                        </div>
                      )}

                      <p className="font-serif-scripture whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                        {msg.text}
                      </p>

                      {/* Conversational closure bar when topic has been explored after multiple exchanges */}
                      {showClosurePrompt && (
                        <div className="pt-3 mt-3 border-t space-y-2 border-black/5 dark:border-white/5 animate-fade-in">
                          <p className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: theme.textMuted }}>
                            <span>🕊️</span>
                            <span>
                              {language === 'es'
                                ? '¿Sientes que este tema te trajo paz y claridad?'
                                : 'Has this conversation brought you peace and clarity?'}
                            </span>
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={handleAmenClosure}
                              className="text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-all"
                              style={{
                                backgroundColor: theme.accentBg,
                                borderColor: theme.accentBorder,
                                color: theme.accent,
                              }}
                            >
                              <span>{language === 'es' ? 'Amén, me quedó claro' : 'Amen, it is clear'}</span>
                            </button>

                            <button
                              onClick={handlePeaceClosure}
                              className="text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-all"
                              style={{
                                backgroundColor: theme.cardVariant,
                                borderColor: theme.cardBorder,
                                color: theme.text,
                              }}
                            >
                              <span>{language === 'es' ? 'Paz para mi día' : 'Peace for my day'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Farewell gentle note when conversation has reached peaceful closure */}
                      {!msg.isUser && isLastMsg && isAlreadyClosed && (
                        <div className="pt-3 mt-3 border-t flex items-center justify-between text-[11px] border-black/5 dark:border-white/5 animate-fade-in" style={{ color: theme.textMuted }}>
                          <span>{language === 'es' ? 'Conversación concluida en paz y bendición' : 'Conversation closed in peace'}</span>
                          <button
                            onClick={() => {
                              setMessages([]);
                              setSavedJournalIndex(null);
                            }}
                            className="underline font-semibold cursor-pointer hover:opacity-80 transition-opacity ml-2"
                            style={{ color: theme.accent }}
                          >
                            {language === 'es' ? 'Iniciar nueva charla' : 'Start new chat'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 shadow-sm liquid-glass-subtle"
                    style={{
                      borderColor: theme.cardBorder,
                      color: theme.accent,
                      backgroundColor: theme.cardVariant,
                    }}
                  >
                    <Heart className="w-4 h-4 shrink-0 opacity-80" style={{ color: theme.accent }} />
                    <span className="italic font-serif-scripture">
                      {language === 'es'
                        ? 'Pensando y orando con calma para responderte...'
                        : 'Reflecting and praying with care for you...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Dynamic Length Toggle (Concise / Detailed Study) with pure theme harmony */}
      <div className="flex justify-center gap-2 shrink-0 px-2 py-1">
        <button
          onClick={() => setResponseLength('corta')}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
          style={{
            backgroundColor: responseLength === 'corta' ? theme.accentBg : theme.cardVariant,
            borderColor: responseLength === 'corta' ? theme.accentBorder : 'transparent',
            color: responseLength === 'corta' ? theme.accent : theme.textMuted,
          }}
          title={language === 'es' ? 'Respuestas breves, concretas y conversación dinámica' : 'Short, direct answers and conversational chatting'}
        >
          <span>💬</span>
          <span>{language === 'es' ? 'Charla Corta (Concreta)' : 'Short Chat (Direct)'}</span>
        </button>

        <button
          onClick={() => setResponseLength('larga')}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
          style={{
            backgroundColor: responseLength === 'larga' ? theme.accentBg : theme.cardVariant,
            borderColor: responseLength === 'larga' ? theme.accentBorder : 'transparent',
            color: responseLength === 'larga' ? theme.accent : theme.textMuted,
          }}
          title={language === 'es' ? 'Reflexión bíblica profunda y preguntas para encaminar tu corazón' : 'Deeper biblical reflection with guiding questions'}
        >
          <span>{language === 'es' ? 'Reflexión Profunda' : 'Deep Reflection'}</span>
        </button>
      </div>

      {/* Box 3: Bottom Chat Input Bar (Proportional & Elegant) */}
      <div
        className="rounded-3xl p-3 border shadow-xl flex items-center gap-2 backdrop-blur-2xl liquid-glass shrink-0"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputValue);
          }}
          placeholder={
            language === 'es'
              ? 'Pregúntame una duda, pasaje o cómo te sientes hoy...'
              : 'Ask a question, scripture or how you feel...'
          }
          className="flex-1 px-4 py-2.5 text-xs rounded-2xl outline-none liquid-glass-subtle shadow-inner"
          style={{
            borderColor: theme.cardBorder,
            color: theme.text,
          }}
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim()}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer hover:opacity-90 shadow-md active:scale-95 disabled:opacity-40 shrink-0"
          style={{
            backgroundColor: theme.accent,
            color: theme.isDark ? '#000000' : '#FFFFFF',
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Topics Dialog */}
      {showTopicsDialog && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
            theme.isDark ? 'bg-black/75' : 'bg-purple-950/20'
          }`}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl transition-all max-h-[85vh] flex flex-col relative overflow-hidden backdrop-blur-2xl liquid-glass"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Dynamic Atmosphere Background */}
            {theme.isDark ? (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <img
                  src="/night-space.jpg"
                  alt="Night Space"
                  className="w-full h-full object-cover opacity-35 mix-blend-screen scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021]/80 via-transparent to-[#0B1021]/90" />
              </div>
            ) : (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-300/30 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-fuchsia-300/25 blur-3xl" />
              </div>
            )}

            <div className="relative z-10 flex flex-col max-h-[75vh]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: theme.cardBorder }}>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" style={{ color: theme.accent }} />
                  <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                    {language === 'es' ? 'Temas para Profundizar' : 'Topics to Explore'}
                  </h3>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-1"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.accent,
                      border: `1px solid ${theme.accentBorder}`,
                    }}
                  >
                    {theme.isDark ? (language === 'es' ? 'Noche' : 'Night') : (language === 'es' ? 'Día' : 'Day')}
                  </span>
                </div>
                <button
                  onClick={() => setShowTopicsDialog(false)}
                  className="p-1 rounded-full hover:bg-purple-100/50 dark:hover:bg-white/10 cursor-pointer"
                  style={{ color: theme.textMuted }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                  {topicGroups.map((group, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
                        {group.group}
                      </h4>
                      <div className="space-y-2">
                        {group.topics.map((t, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setShowTopicsDialog(false);
                              handleSendMessage(t.prompt);
                            }}
                            className="p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] active:scale-98 shadow-sm liquid-glass-subtle"
                            style={{
                              borderColor: theme.cardBorder,
                            }}
                          >
                            <p className="text-xs font-bold mb-0.5" style={{ color: theme.text }}>
                              {t.title}
                            </p>
                            <p className="text-[11px]" style={{ color: theme.textMuted }}>
                              {t.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t mt-2 flex justify-end" style={{ borderColor: theme.cardBorder }}>
                  <button
                    onClick={() => setShowTopicsDialog(false)}
                    className="px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer shadow-md active:scale-95"
                    style={{
                      backgroundColor: theme.accent,
                      color: theme.isDark ? '#000000' : '#FFFFFF',
                    }}
                  >
                    {language === 'es' ? 'Cerrar' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
});

export default BibleChatScreen;
