import { Devotional } from '../types';

export const DAILY_CONTENT_DATABASE: Devotional[] = [
  {
    id: 'day_001',
    titleEs: 'Descanso en la Gracia',
    titleEn: 'Resting in Grace',
    passageRefEs: 'Mateo 11:28',
    passageRefEn: 'Matthew 11:28',
    passageTextEs: 'Vengan a mí todos los que están cansados y cargados, y yo les daré descanso.',
    passageTextEn: '“Come to me, all you who labor and are heavily burdened, and I will give you rest.',
    reflectionEs: 'Hoy, Dios te invita a soltar la carga de querer controlarlo todo. Él te ama por quién eres, no por lo que haces. Respira hondo.',
    reflectionEn: 'Today, God invites you to release the burden of trying to control everything. He loves you for who you are, not what you do. Breathe deeply.',
    prayerEs: 'Señor, me acerco a ti hoy con mis cansancios. Enséñame a descansar en tu amor incondicional. Amén.',
    prayerEn: 'Lord, I come to You today with my weariness. Teach me to rest in Your unconditional love. Amen.',
    moodCategory: 'peace',
    topic: 'Reposo',
  },
  {
    id: 'day_002',
    titleEs: 'Confianza en el Mañana',
    titleEn: 'Trusting for Tomorrow',
    passageRefEs: 'Jeremías 29:11',
    passageRefEn: 'Jeremiah 29:11',
    passageTextEs: 'Yo conozco mis pensamientos acerca de ustedes, dice el Señor. Son pensamientos de paz y no de desgracia, para darles esperanza al final.',
    passageTextEn: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.',
    reflectionEs: 'Tu futuro no es un misterio para Dios. Él lo tiene bajo control. Camina hoy con la seguridad de Su cuidado.',
    reflectionEn: 'Your future is not a mystery to God. He has it under control. Walk today with the certainty of His care.',
    prayerEs: 'Padre, confío en tus planes para mi vida. Ayúdame a vivir este día con esperanza. Amén.',
    prayerEn: 'Father, I trust Your plans for my life. Help me to live this day with hope. Amen.',
    moodCategory: 'peace',
    topic: 'Esperanza',
  },
  // Más días serían añadidos aquí siguiendo este formato...
];

export const getDailyContent = (date: Date): Devotional => {
  // Simple algorithm to pick content based on day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Use modulo to cycle through the database
  return DAILY_CONTENT_DATABASE[dayOfYear % DAILY_CONTENT_DATABASE.length];
};
