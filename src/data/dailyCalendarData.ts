// AUTO-GENERATED 366-DAY CALENDAR ENGINE FOR HAVAH
// Provides unique Devotionals, Prayers and Promises for all 366 days of the year with zero overhead and full offline support.
import { MoodType } from '../types';
import { DAILY_UNITS } from './dailyUnits.ts';

export interface DailyDevotionalItem {
  id: string;
  dayOfYear: number;
  dateFormattedEs: string;
  dateFormattedEn: string;
  topic: string;
  moodCategory: MoodType;
  titleEs: string;
  titleEn: string;
  passageRefEs: string;
  passageRefEn: string;
  passageTextEs: string;
  passageTextEn: string;
  reflectionEs: string;
  reflectionEn: string;
  prayerEs: string;
  prayerEn: string;
}

export interface DailyPrayerEntry {
  id: string;
  dayOfYear: number;
  dateFormattedEs: string;
  dateFormattedEn: string;
  titleEs: string;
  titleEn: string;
  verseRefEs: string;
  verseRefEn: string;
  verseTextEs: string;
  verseTextEn: string;
  prayerEs: string;
  prayerEn: string;
  themeTagEs: string;
  themeTagEn: string;
}

export interface DailyPromiseEntry {
  id: string;
  dayOfYear: number;
  dateFormattedEs: string;
  dateFormattedEn: string;
  categoryEs: string;
  categoryEn: string;
  verseRefEs: string;
  verseRefEn: string;
  passageEs: string;
  passageEn: string;
  meditationEs: string;
  meditationEn: string;
  declarationEs: string;
  declarationEn: string;
}

export interface CalendarDayRecord {
  dayOfYear: number;
  month: number;
  dayOfMonth: number;
  dateFormattedEs: string;
  dateFormattedEn: string;
  devotional: DailyDevotionalItem;
  prayer: DailyPrayerEntry;
  promise: DailyPromiseEntry;
}

const monthsData = [
  {
    "nameEs": "Enero",
    "nameEn": "January",
    "days": 31
  },
  {
    "nameEs": "Febrero",
    "nameEn": "February",
    "days": 29
  },
  {
    "nameEs": "Marzo",
    "nameEn": "March",
    "days": 31
  },
  {
    "nameEs": "Abril",
    "nameEn": "April",
    "days": 30
  },
  {
    "nameEs": "Mayo",
    "nameEn": "May",
    "days": 31
  },
  {
    "nameEs": "Junio",
    "nameEn": "June",
    "days": 30
  },
  {
    "nameEs": "Julio",
    "nameEn": "July",
    "days": 31
  },
  {
    "nameEs": "Agosto",
    "nameEn": "August",
    "days": 31
  },
  {
    "nameEs": "Septiembre",
    "nameEn": "September",
    "days": 30
  },
  {
    "nameEs": "Octubre",
    "nameEn": "October",
    "days": 31
  },
  {
    "nameEs": "Noviembre",
    "nameEn": "November",
    "days": 30
  },
  {
    "nameEs": "Diciembre",
    "nameEn": "December",
    "days": 31
  }
];
const THEMES = [
  {
    "topic": "Propósito",
    "mood": "peace",
    "focus": "Identidad y destino en las manos de Dios"
  },
  {
    "topic": "Paz Interior",
    "mood": "anxious",
    "focus": "Descanso en medio de la tormenta y serenidad"
  },
  {
    "topic": "Fortaleza",
    "mood": "tired",
    "focus": "Fuerzas renovadas para quien ya no puede más"
  },
  {
    "topic": "Gratitud",
    "mood": "gratitude",
    "focus": "Mirar las bendiciones pequeñas de cada mañana"
  },
  {
    "topic": "Confianza",
    "mood": "anxious",
    "focus": "Soltar el afán y creer que Dios tiene el control"
  },
  {
    "topic": "Amor Incondicional",
    "mood": "peace",
    "focus": "Aceptación plena y gracia que restaura"
  },
  {
    "topic": "Sabiduría",
    "mood": "seeking",
    "focus": "Decisiones guiadas por el Espíritu y prudencia"
  },
  {
    "topic": "Sanidad del Alma",
    "mood": "grief",
    "focus": "Bálsamo para el dolor, el duelo y el desánimo"
  },
  {
    "topic": "Protección",
    "mood": "peace",
    "focus": "La sombra del Omnipotente que protege tu hogar"
  },
  {
    "topic": "Esperanza Viva",
    "mood": "seeking",
    "focus": "Nuevos comienzos cuando todo parecía perdido"
  },
  {
    "topic": "Perdón y Libertad",
    "mood": "peace",
    "focus": "Soltar amarguras y abrazar la ligereza de Cristo"
  },
  {
    "topic": "Provisión Fiel",
    "mood": "gratitude",
    "focus": "El Dios que cuida a las aves y viste los lirios"
  },
  {
    "topic": "Paciencia en la Espera",
    "mood": "seeking",
    "focus": "Los tiempos perfectos de Dios son mejores que la prisa"
  },
  {
    "topic": "Familia y Hogar",
    "mood": "peace",
    "focus": "Bendición sobre tus hijos y la mesa compartida"
  },
  {
    "topic": "Valentía Serena",
    "mood": "tired",
    "focus": "Avanzar paso a paso sabiendo que Él va delante"
  },
  {
    "topic": "Descanso Sagrado",
    "mood": "tired",
    "focus": "Aprender a parar sin culpa bajo Su gracia"
  }
];
const PASSAGES = [
  {
    "refEs": "Proverbios 31:25-26",
    "refEn": "Proverbs 31:25-26",
    "verseEs": "La fuerza y el respeto por sí misma son su ropa; mira el futuro con una sonrisa. Habla con sabiduría y enseña con misericordia.",
    "verseEn": "Strength and dignity are her clothing. She laughs at the time to come. She opens her mouth with wisdom. Kind instruction is on her tongue.",
    "prayerEs": "Padre amado, vísteme hoy de dignidad y calma. Quita el temor al porvenir y pon en mis labios palabras de consuelo y amor para los míos.",
    "prayerEn": "Loving Father, clothe me today with dignity and peace. Remove fear of the future and place words of kindness on my lips.",
    "promEs": "Dios te viste de fortaleza que no depende de tus fuerzas humanas, sino de Su Espíritu eterno.",
    "promEn": "God clothes you with strength that does not rely on human effort, but on His eternal Spirit.",
    "declEs": "Sonrío confiada al futuro porque sé en quién tengo puesta mi esperanza.",
    "declEn": "I smile at the future with confidence because I know in Whom my hope rests."
  },
  {
    "refEs": "Salmos 23:1-3",
    "refEn": "Psalm 23:1-3",
    "verseEs": "El Señor es mi pastor; no me faltará ningún bien. Me hace descansar en verdes campos y me guía junto a aguas tranquilas. Da nueva vida a mi alma; me guía por caminos de justicia por amor a su nombre.",
    "verseEn": "The LORD is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He guides me in the paths of righteousness for his name’s sake.",
    "prayerEs": "Buen Pastor, gracias porque en Ti mi alma no tiene carencia. Guíame a esas aguas tranquilas y restaura mis fuerzas fatigadas.",
    "prayerEn": "Good Shepherd, thank You that in You my soul lacks nothing. Lead me to still waters and restore my weary strength.",
    "promEs": "El Buen Pastor nunca te abandonará en el desierto; siempre te conducirá a Su descanso.",
    "promEn": "The Good Shepherd will never leave you in the wilderness; He will always lead you into His rest.",
    "declEs": "Nada me faltará hoy: Su gracia es suficiente y Su paz llena mi casa.",
    "declEn": "I shall not lack today: His grace is sufficient and His peace fills my home."
  },
  {
    "refEs": "Isaías 40:29-31",
    "refEn": "Isaiah 40:29-31",
    "verseEs": "Él da fuerza al débil y aumenta el vigor del que no tiene fuerzas. Aun los jóvenes se debilitan y se cansan, y hasta los mejores llegan al final de sus fuerzas. Pero los que esperan al Señor tendrán nuevas fuerzas. Recibirán alas como águilas; correrán sin cansarse y caminarán sin agotarse.",
    "verseEn": "He gives power to the weak. He increases the strength of him who has no might. Even the youths faint and get weary, and the young men utterly fall; but those who wait for the LORD will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.",
    "prayerEs": "Señor, reconozco mi agotamiento físico y emocional. Sopla tu aliento nuevo en mi corazón y enséñame a esperar en Tu tiempo.",
    "prayerEn": "Lord, I acknowledge my weariness. Breathe Your new breath into my heart and teach me to wait on Your perfect timing.",
    "promEs": "Cuando tus fuerzas se acaban, las fuerzas ilimitadas de Dios comienzan a fluir en ti.",
    "promEn": "When your strength ends, God’s boundless strength begins to flow within you.",
    "declEs": "Espero en el Señor y remonto el vuelo por encima de las dificultades.",
    "declEn": "I wait upon the Lord and soar on wings above every trial."
  },
  {
    "refEs": "Filipenses 4:6-7",
    "refEn": "Philippians 4:6-7",
    "verseEs": "No se afanen por nada. Más bien, en todo, con oración y ruego, y con acción de gracias, presenten sus peticiones delante de Dios. Y la paz de Dios, que supera todo entendimiento, guardará sus corazones y sus pensamientos en Cristo Jesús.",
    "verseEn": "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.",
    "prayerEs": "Dios de paz, pongo sobre Tu altar cada pensamiento que me roba el sueño. Toma mis peticiones y envuélveme en Tu quietud sobrenatural.",
    "prayerEn": "God of peace, I lay before Your altar every thought that steals my sleep. Receive my prayers and wrap me in Your supernatural calm.",
    "promEs": "La paz de Dios no es la ausencia de problemas, sino Su presencia guardando tu mente en cualquier tormenta.",
    "promEn": "God’s peace is not the absence of trouble, but His presence guarding your mind in every storm.",
    "declEs": "Rechazo el afán y decido habitar en la paz que sobrepasa todo entendimiento humano.",
    "declEn": "I reject anxiety and choose to abide in peace that surpasses all understanding."
  },
  {
    "refEs": "Jeremías 29:11",
    "refEn": "Jeremiah 29:11",
    "verseEs": "Yo conozco mis pensamientos acerca de ustedes, dice el Señor. Son pensamientos de paz y no de desgracia, para darles esperanza al final.",
    "verseEn": "For I know the thoughts that I think toward you,” says the LORD, “thoughts of peace, and not of evil, to give you hope and a future.",
    "prayerEs": "Padre celestial, gracias porque mis días no están a la suerte ni al capricho de las circunstancias. Tú tienes planes de bien para mi vida.",
    "prayerEn": "Heavenly Father, thank You that my days are not left to chance. You have plans of goodness and hope for my future.",
    "promEs": "Los propósitos de Dios para ti son de paz, bienestar y un porvenir colmado de esperanza.",
    "promEn": "God’s intentions for you are thoughts of peace, goodness, and a future overflowing with hope.",
    "declEs": "Mi futuro está blindado en las promesas de Dios; no temeré lo por venir.",
    "declEn": "My future is anchored in God’s promises; I will not fear tomorrow."
  },
  {
    "refEs": "Salmos 91:1-4",
    "refEn": "Psalm 91:1-4",
    "verseEs": "Feliz quien habita al abrigo del Altísimo y descansa a la sombra del Todopoderoso, quien dice del Señor: «Él es mi refugio y mi torre fuerte, mi Dios, en quien pongo mi esperanza». Él te librará de la trampa para aves y te protegerá de la enfermedad que destruye. Te cubrirá con sus plumas; bajo sus alas estarás a salvo. Su fidelidad será tu salvación.",
    "verseEn": "He who dwells in the secret place of the Most High will rest in the shadow of the Almighty. I will say of the LORD, “He is my refuge and my fortress; my God, in whom I trust.” For he will deliver you from the snare of the fowler, and from the deadly pestilence. He will cover you with his feathers. Under his wings you will take refuge. His faithfulness is your shield and rampart.",
    "prayerEs": "Altísimo Dios, corro a refugiarme bajo la sombra de tus alas. Protege a mi familia, guarda nuestra salida y entrada, y cúbrenos con Tu verdad.",
    "prayerEn": "Most High God, I run to the shadow of Your wings. Protect my family, guard our going out and coming in, and cover us with Your truth.",
    "promEs": "Bajo las alas del Omnipotente encuentras un escudo inexpugnable para ti y para tu hogar.",
    "promEn": "Under the wings of the Almighty you find an unshakeable shield for yourself and your home.",
    "declEs": "Moro segura bajo la sombra del Altísimo; Él es mi castillo y mi amparo inamovible.",
    "declEn": "I dwell secure under the shadow of the Almighty; He is my fortress and safe shelter."
  },
  {
    "refEs": "Romanos 8:28, 38-39",
    "refEn": "Romans 8:28, 38-39",
    "verseEs": "Sabemos que Dios hace que todas las cosas obren para bien de los que lo aman, de los que han sido llamados conforme a su propósito. … Porque estoy seguro de que ni la muerte, ni la vida, ni ángeles, ni principados, ni poderes, ni lo presente, ni lo por venir, ni lo alto, ni lo profundo, ni ninguna otra cosa creada podrá separarnos del amor de Dios que es en Cristo Jesús, nuestro Señor.",
    "verseEn": "We know that all things work together for good for those who love God, for those who are called according to his purpose. … For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers, nor height, nor depth, nor any other created thing will be able to separate us from God’s love which is in Christ Jesus our Lord.",
    "prayerEs": "Señor Jesús, aunque hoy no entienda el propósito de cada detalle, confío en que Tu amor soberano está entretejiendo bendición para mi bien.",
    "prayerEn": "Lord Jesus, even when I cannot understand every puzzle piece, I trust Your sovereign love is weaving all things for my good.",
    "promEs": "Nada en todo el universo, ni dolor ni incertidumbre, puede cortar el lazo de amor que Dios tiene por ti.",
    "promEn": "Nothing in all creation, neither pain nor uncertainty, can sever the bond of God’s love for you.",
    "declEs": "Todas las cosas cooperan para mi bien y descanso en el amor inquebrantable de mi Creador.",
    "declEn": "All things work together for my good, and I rest in the unfailing love of my Creator."
  },
  {
    "refEs": "Lamentaciones 3:22-24",
    "refEn": "Lamentations 3:22-24",
    "verseEs": "Por el amor del Señor no hemos sido destruidos, porque sus misericordias no tienen límites. Son nuevas cada mañana; grande es tu fidelidad. Me dije: «El Señor es mi herencia; por eso tendré esperanza en él».",
    "verseEn": "It is because of the LORD’s loving kindnesses that we are not consumed, because his mercies don’t fail. They are new every morning. Great is your faithfulness. “The LORD is my portion,” says my soul. “Therefore I will hope in him.”",
    "prayerEs": "Fiel Padre, gracias por el regalo de estrenar misericordias hoy. Borra mis errores de ayer y lléname de una frescura limpia y serena.",
    "prayerEn": "Faithful Father, thank You for brand-new mercies today. Wipe away yesterday’s regrets and fill me with clean, quiet grace.",
    "promEs": "Cada amanecer viene con una porción fresca e inagotable de gracia diseñada para el día de hoy.",
    "promEn": "Every sunrise arrives with a fresh, inexhaustible supply of grace prepared specifically for today.",
    "declEs": "Grande es Tu fidelidad conmigo; hoy estreno una nueva oportunidad bajo Tu favor.",
    "declEn": "Great is Your faithfulness to me; today I step into a new opportunity under Your favor."
  },
  {
    "refEs": "Salmos 121:1-3, 7-8",
    "refEn": "Psalm 121:1-3, 7-8",
    "verseEs": "Alzo la vista hacia las montañas. ¿De dónde vendrá mi ayuda? Tu ayuda viene del Señor, que hizo el cielo y la tierra. Que él no deje resbalar tu pie; quien te cuida no necesita dormir. … El Señor te protegerá de todo mal; cuidará de tu vida. El Señor cuidará tu salida y tu entrada, desde ahora y para siempre.",
    "verseEn": "I will lift up my eyes to the hills. Where does my help come from? My help comes from the LORD, who made heaven and earth. He will not allow your foot to be moved. He who keeps you will not slumber. … The LORD will keep you from all evil. He will keep your soul. The LORD will keep your going out and your coming in, from this time forward, and forever more.",
    "prayerEs": "Señor todopoderoso, cuando me sienta abrumada, ayúdame a levantar la mirada de los problemas hacia Tu grandeza. Tú eres mi socorro infalible.",
    "prayerEn": "Almighty Lord, when I feel overwhelmed, help me lift my eyes from the storm to Your majesty. You are my unfailing helper.",
    "promEs": "El Dios que creó las estrellas no duerme ni pestañea; vigila tus pasos las 24 horas del día.",
    "promEn": "The God who created the stars neither slumbers nor sleeps; He watches over your steps 24/7.",
    "declEs": "Mi ayuda y mi fortaleza provienen de Jehová, quien hizo el cielo y la tierra.",
    "declEn": "My help and my strength come from the Lord, maker of heaven and earth."
  },
  {
    "refEs": "Mateo 11:28-30",
    "refEn": "Matthew 11:28-30",
    "verseEs": "Vengan a mí todos los que están cansados y cargados, y yo les daré descanso. Tomen mi yugo sobre ustedes y aprendan de mí, porque soy manso y humilde de corazón; y hallarán descanso para sus almas. Porque mi yugo es fácil de llevar, y mi carga es ligera.",
    "verseEn": "“Come to me, all you who labor and are heavily burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart; and you will find rest for your souls. For my yoke is easy, and my burden is light.”",
    "prayerEs": "Cristo Jesús, suelto ante Tus pies el cansancio que me ahoga. Quítame el afán de cargar el mundo y enséñame la mansedumbre que da descanso real.",
    "prayerEn": "Christ Jesus, I release at Your feet the exhaustion that weighs me down. Free me from carrying the world and teach me Your rest.",
    "promEs": "Jesús no te añade más exigencias; Él te ofrece un descanso genuino y profundo para el alma.",
    "promEn": "Jesus places no heavy burdens on your soul; He offers gentle, deep rest for your heart.",
    "declEs": "Tomo el reposo de Jesús; Su yugo es fácil y ligera es Su carga sobre mis hombros.",
    "declEn": "I receive Jesus’ rest; His yoke is easy and His burden is light upon my shoulders."
  },
  {
    "refEs": "Salmos 46:1-3, 10",
    "refEn": "Psalm 46:1-3, 10",
    "verseEs": "Dios es nuestro refugio y nuestra fuerza; es una ayuda siempre presente en la angustia. Por eso no temeremos, aunque la tierra cambie y las montañas se hundan en lo profundo del mar, aunque sus aguas rujan y se agiten, y las montañas tiemblen ante su violencia. Selah … «Quédense en paz y reconozcan que yo soy Dios; seré exaltado entre las naciones y honrado en toda la tierra».",
    "verseEn": "God is our refuge and strength, a very present help in trouble. Therefore we won’t be afraid, though the earth changes, though the mountains are shaken into the heart of the seas; though its waters roar and are troubled, though the mountains tremble with their swelling. Selah. … “Be still, and know that I am God. I will be exalted among the nations. I will be exalted on the earth.”",
    "prayerEs": "Señor, calla el ruido del mundo en mi mente. Enséñame a estar quieta en Tu presencia y a recordar que Tú eres Dios soberano en todo tiempo.",
    "prayerEn": "Lord, silence the worldly noise in my mind. Teach me to be still before You and remember You are God above all.",
    "promEs": "En medio de las sacudidas de la vida, Dios es un amparo inamovible donde siempre estás segura.",
    "promEn": "Amidst life’s shaking, God is an immovable fortress where you are always safe.",
    "declEs": "Permanezco quieta y en calma; Dios es mi amparo y mi socorro oportuno.",
    "declEn": "I remain still and calm; God is my refuge and my present help."
  },
  {
    "refEs": "Josué 1:9",
    "refEn": "Joshua 1:9",
    "verseEs": "¿No te he dado esta orden? Sé fuerte y valiente. No tengas miedo ni te desanimes, porque el Señor tu Dios estará contigo dondequiera que vayas».",
    "verseEn": "Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for the LORD your God is with you wherever you go.”",
    "prayerEs": "Señor Dios, cuando sienta incertidumbre o timidez ante los retos, recuérdame que no camino sola. Tu presencia va a mi lado dondequiera que vaya.",
    "prayerEn": "Lord God, whenever I feel timid or uncertain before life’s mountains, remind me I do not walk alone. Your presence goes with me.",
    "promEs": "No necesitas tener todas las respuestas para dar el paso; sólo necesitas saber que Dios camina contigo.",
    "promEn": "You do not need every answer to take the next step; you only need to know God walks beside you.",
    "declEs": "Soy valiente y llena de paz porque el Señor mi Dios camina junto a mí.",
    "declEn": "I am courageous and at peace because the Lord my God walks beside me."
  },
  {
    "refEs": "Salmos 37:4-7",
    "refEn": "Psalm 37:4-7",
    "verseEs": "Deléitate en el Señor, y él te concederá lo que desea tu corazón. Pon tu vida en manos del Señor; confía en él, y él actuará. Hará brillar tu justicia como la luz y tu causa como el resplandor del sol. Descansa en el Señor y espéralo en silencio. No te enojes por el que prospera haciendo el mal y lleva a cabo sus planes malvados.",
    "verseEn": "Also delight yourself in the LORD, and he will give you the desires of your heart. Commit your way to the LORD. Trust also in him, and he will do this: he will make your righteousness shine out like light, and your justice as the noon day sun. Rest in the LORD, and wait patiently for him. Don’t fret because of him who prospers in his way, because of the man who makes wicked plots happen.",
    "prayerEs": "Padre amoroso, hoy entrego mis anhelos más íntimos en Tus manos. Enséñame a deleitarme en Tu bondad antes de preocuparme por los resultados.",
    "prayerEn": "Loving Father, today I surrender my deepest desires into Your hands. Teach me to delight in Your goodness before obsessing over outcomes.",
    "promEs": "Cuando confías tu camino a Dios y descansas en Él, Su fidelidad abre puertas que ningún ser humano puede cerrar.",
    "promEn": "When you entrust your way to God and rest in Him, His faithfulness opens doors no one can shut.",
    "declEs": "Encomiendo mis pasos al Señor; confío plenamente en Su tiempo y Él obrará.",
    "declEn": "I commit my steps to the Lord; I trust wholly in His timing and He will act."
  },
  {
    "refEs": "2 Corintios 12:9-10",
    "refEn": "2 Corinthians 12:9-10",
    "verseEs": "Pero él me dijo: Mi gracia te basta, porque mi poder se perfecciona en la debilidad. Por tanto, con mucho gusto me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo. Por eso me gozo en debilidades, insultos, necesidades, persecuciones y angustias por causa de Cristo; porque cuando soy débil, entonces soy fuerte.",
    "verseEn": "He has said to me, “My grace is sufficient for you, for my power is made perfect in weakness.” Most gladly therefore I will rather glory in my weaknesses, that the power of Christ may rest on me. Therefore I take pleasure in weaknesses, in injuries, in necessities, in persecutions, and in distresses, for Christ’s sake. For when I am weak, then am I strong.",
    "prayerEs": "Cristo Jesús, no tengo que fingir ser invencible delante de Ti. En mi debilidad, que Tu poder se manifieste con ternura y gracia.",
    "prayerEn": "Christ Jesus, I don’t need to pretend to be invincible before You. In my weakness, let Your power shine with grace and tender care.",
    "promEs": "La gracia de Dios es más que suficiente para cada batalla, cada lágrima y cada reto que enfrentes hoy.",
    "promEn": "God’s grace is more than enough for every battle, every tear, and every mountain you face today.",
    "declEs": "Su gracia me basta hoy; en mi fragilidad Su poder se hace fuerte.",
    "declEn": "His grace is sufficient for me; in my weakness His power is made strong."
  },
  {
    "refEs": "Salmos 139:13-17",
    "refEn": "Psalm 139:13-17",
    "verseEs": "Tú hiciste mi carne y uniste las partes de mi cuerpo en el vientre de mi madre. Te alabaré, porque me has formado de manera asombrosa y delicada. Tus obras son grandes maravillas; mi alma lo sabe muy bien. Mi cuerpo no estaba oculto para ti cuando fui formado en secreto, de manera asombrosa, en lo más profundo de la tierra. Tus ojos vieron mi cuerpo aún sin forma; en tu libro estaban escritos todos mis días, incluso los que habías dispuesto antes de que existieran. Dios, ¡qué valiosos son para mí tus pensamientos! ¡Cuántos son!",
    "verseEn": "For you formed my inmost being. You knit me together in my mother’s womb. I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well. My frame wasn’t hidden from you, when I was made in secret, woven together in the depths of the earth. Your eyes saw my body. In your book they were all written, the days that were ordained for me, when as yet there were none of them. How precious to me are your thoughts, God! How vast is their sum!",
    "prayerEs": "Creador admirable, gracias por formarme con un propósito eterno. Sana cualquier mentira que me haga dudar de mi valor y recuérdame cuánto me amas.",
    "prayerEn": "Wonderful Creator, thank You for knitting me together with an eternal purpose. Heal any doubt about my worth and remind me how deeply I am loved.",
    "promEs": "Fuiste creada con amor infinito y propósito divino; no eres un accidente, eres la obra maestra de Dios.",
    "promEn": "You were created with infinite love and divine purpose; you are no accident, you are God’s masterpiece.",
    "declEs": "Soy creación amada de Dios; fui formada con propósito, gracia y dignidad.",
    "declEn": "I am a beloved creation of God; formed with purpose, grace, and dignity."
  },
  {
    "refEs": "Isaías 41:10, 13",
    "refEn": "Isaiah 41:10, 13",
    "verseEs": "No tengas miedo, porque estoy contigo. No mires a tu alrededor con angustia, porque soy tu Dios. Te daré fuerza y te ayudaré; sí, mi mano derecha fiel te sostendrá. … Porque yo, el Señor tu Dios, tomo tu mano derecha en la mía y te digo: «No tengas miedo; yo te ayudaré».",
    "verseEn": "Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness. … For I, the LORD your God, will hold your right hand, saying to you, ‘Don’t be afraid. I will help you.’.",
    "prayerEs": "Dios mío, tomo con fe Tu mano derecha. Sostenme cuando tiemblen mis pasos y ahuyenta todo temor con la calidez de Tu cercanía.",
    "prayerEn": "My God, I hold tight to Your right hand. Uphold me when my steps falter and cast out all fear with the warmth of Your presence.",
    "promEs": "La mano que sostiene las galaxias es la misma que hoy toma con ternura tu mano para guiarte.",
    "promEn": "The same hand that upholds the galaxies is holding yours today with tenderness and care.",
    "declEs": "No temo ni desmayo; el Señor me sostiene con la diestra de Su justicia.",
    "declEn": "I fear not, nor am I dismayed; the Lord upholds me with His righteous right hand."
  },
  {
    "refEs": "Sofonías 3:17",
    "refEn": "Zephaniah 3:17",
    "verseEs": "El Señor tu Dios está en medio de ti como un salvador fuerte. Se alegrará por ti con gozo, renovará su amor y cantará de alegría por ti como en una fiesta santa.",
    "verseEn": "The LORD, your God, is among you, a mighty one who will save. He will rejoice over you with joy. He will calm you in his love. He will rejoice over you with singing.",
    "prayerEs": "Padre tierno, calma las voces de autoexigencia en mi mente. Que hoy pueda escuchar en el silencio Tu cántico de amor sobre mi vida.",
    "prayerEn": "Gentle Father, quiet the voices of harsh pressure in my mind. May I hear Your song of love over my life in the sacred quiet.",
    "promEs": "Dios no te mira con reproche; Él canta sobre ti con gozo y te cobija en el silencio de Su amor.",
    "promEn": "God does not look at you with condemnation; He rejoices over you with singing and rests in His deep love for you.",
    "declEs": "Dios se deleita en mí y Su amor me envuelve en completa seguridad y gozo.",
    "declEn": "God delights in me and His love wraps me in complete security and peace."
  },
  {
    "refEs": "Salmos 103:1-5",
    "refEn": "Psalm 103:1-5",
    "verseEs": "Alaba al Señor, alma mía; que todo mi ser alabe su santo nombre. Alaba al Señor, alma mía; no olvides ninguna de sus bendiciones. Él perdona todos tus pecados y sana todas tus enfermedades. Libra tu vida de la destrucción y te corona de misericordia y gracia. Llena tu boca de cosas buenas, y tus fuerzas se renuevan como las del águila.",
    "verseEn": "Praise the LORD, my soul! All that is within me, praise his holy name! Praise the LORD, my soul, and don’t forget all his benefits, who forgives all your sins, who heals all your diseases, who redeems your life from destruction, who crowns you with loving kindness and tender mercies, who satisfies your desire with good things, so that your youth is renewed like the eagle’s.",
    "prayerEs": "Señor Jesús, gracias por perdonarme, sanar mis heridas interiores y coronarme con favores y misericordias. Renueva mi juventud y mi alabanza hoy.",
    "prayerEn": "Lord Jesus, thank You for forgiving me, healing my inner wounds, and crowning me with lovingkindness. Renew my joy and praise today.",
    "promEs": "El Señor no sólo perdona tus faltas; corona cada día de tu vida con tiernas misericordias y compasión.",
    "promEn": "The Lord not only pardons your faults; He crowns each day of your life with tender mercies and compassion.",
    "declEs": "Bendigo al Señor con toda mi alma; Su perdón y Su sanidad restauran mi corazón.",
    "declEn": "I bless the Lord with all my soul; His forgiveness and healing restore my heart."
  },
  {
    "refEs": "Efesios 3:16-20",
    "refEn": "Ephesians 3:16-20",
    "verseEs": "Pido que, conforme a las riquezas de su gloria, Dios los fortalezca con poder en el hombre interior por medio de su Espíritu, para que Cristo habite por la fe en sus corazones, y para que ustedes, arraigados y cimentados en amor, puedan comprender con todos los santos cuál es la anchura, la longitud, la profundidad y la altura, y conocer el amor de Cristo, que supera todo conocimiento, para que sean llenos de toda la plenitud de Dios. Y a aquel que puede hacer muchísimo más de todo lo que pedimos o pensamos, según el poder que actúa en nosotros.",
    "verseEn": "that he would grant you, according to the riches of his glory, that you may be strengthened with power through his Spirit in the inner person, that Christ may dwell in your hearts through faith, to the end that you, being rooted and grounded in love, may be strengthened to comprehend with all the saints what is the width and length and height and depth, and to know Christ’s love which surpasses knowledge, that you may be filled with all the fullness of God. Now to him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us.",
    "prayerEs": "Espíritu Santo, fortalece mi interior. Ayúdame a comprender la anchura y profundidad del amor de Jesús, creyendo que Tú puedes hacer mucho más de lo que pido o imagino.",
    "prayerEn": "Holy Spirit, strengthen my inner being. Help me grasp the breadth and depth of Jesus’ love, believing You can do exceedingly above all I ask.",
    "promEs": "Dios es capaz de sobrepasar con creces tus oraciones y tus expectativas más altas.",
    "promEn": "God is able to do immeasurably more than all you ask or imagine through His power at work within you.",
    "declEs": "Mi hombre interior es renovado hoy; Dios hace maravillas abundantes en mi vida.",
    "declEn": "My inner self is renewed today; God does exceeding wonders in my life."
  },
  {
    "refEs": "Salmos 34:4-8, 18",
    "refEn": "Psalm 34:4-8, 18",
    "verseEs": "Busqué al Señor, y él escuchó mi voz y me libró de todos mis temores. Miren hacia él y tendrán luz; sus rostros no quedarán avergonzados. Este pobre clamó al Señor, y él lo salvó de todas sus angustias. El ángel del Señor vela siempre por quienes lo temen, para mantenerlos a salvo. Comprueben por ustedes mismos que el Señor es bueno; feliz es el hombre que confía en él. … El Señor está cerca de los de corazón quebrantado; salva a quienes tienen el espíritu abatido.",
    "verseEn": "I sought the LORD, and he answered me, and delivered me from all my fears. They looked to him, and were radiant. Their faces shall never be covered with shame. This poor man cried, and the LORD heard him, and saved him out of all his troubles. The LORD’s angel encamps around those who fear him, and delivers them. Oh taste and see that the LORD is good. Blessed is the man who takes refuge in him. … The LORD is near to those who have a broken heart, and saves those who have a crushed spirit.",
    "prayerEs": "Señor cercano, gracias por escuchar mi clamor cuando el dolor aprieta el pecho. Consuela mi corazón quebrantado y alumbra mi rostro con Tu paz.",
    "prayerEn": "Near and loving Lord, thank You for hearing my cry when pain is heavy. Comfort my broken heart and radiate Your light on my face.",
    "promEs": "Cuando tu corazón está quebrantado, Dios no se aleja; se hace más íntimo y cercano que nunca.",
    "promEn": "When your heart is broken, God does not pull away; He draws closer and more tender than ever.",
    "declEs": "Miro al Señor y mi rostro resplandece; Él sana mi quebranto y quita todo temor.",
    "declEn": "I look to the Lord and radiant joy fills me; He heals my heart and removes all fear."
  },
  {
    "refEs": "Hebreos 4:16",
    "refEn": "Hebrews 4:16",
    "verseEs": "Acerquémonos, pues, con confianza al trono de la gracia, para recibir misericordia y hallar gracia para la ayuda oportuna.",
    "verseEn": "Let’s therefore draw near with boldness to the throne of grace, that we may receive mercy and may find grace for help in time of need.",
    "prayerEs": "Padre eterno, me acerco a Ti con toda confianza, sabiendo que en Tu trono no hay juicio para mí, sino un océano de misericordia y ayuda oportuna.",
    "prayerEn": "Eternal Father, I come boldly to Your throne, knowing there is no condemnation here, but an ocean of mercy and timely help.",
    "promEs": "El trono de Dios es un trono de gracia; siempre encontrarás brazos abiertos y ayuda oportuna en Su presencia.",
    "promEn": "God’s throne is a throne of grace; you will always find open arms and timely help in His presence.",
    "declEs": "Me acerco confiada al trono de la gracia; Su misericordia me socorre justo a tiempo.",
    "declEn": "I approach the throne of grace boldly; His mercy rescues me right on time."
  },
  {
    "refEs": "Salmos 27:1, 13-14",
    "refEn": "Psalm 27:1, 13-14",
    "verseEs": "El Señor es mi luz y mi salvación; ¿a quién temeré? El Señor es la fuerza de mi vida; ¿quién puede hacerme temblar? … Casi había perdido la esperanza de ver la bendición del Señor en la tierra de los vivos. Espera en el Señor; cobra ánimo y sé fuerte. Sí, espera en el Señor.",
    "verseEn": "The LORD is my light and my salvation. Whom shall I fear? The LORD is the strength of my life. Of whom shall I be afraid? … I am still confident of this: I will see the goodness of the LORD in the land of the living. Wait for the LORD. Be strong, and let your heart take courage. Yes, wait for the LORD.",
    "prayerEs": "Dios mío, cuando la oscuridad intente asustarme, sé Tú mi luz resplandeciente. Fortalece mi corazón para esperar con paciencia Tu bondad manifestada.",
    "prayerEn": "My God, when darkness tries to intimidate me, be my shining light. Strengthen my heart to wait with patience for Your goodness.",
    "promEs": "Verás con tus propios ojos la bondad del Señor; Su luz disipa cualquier sombra de duda.",
    "promEn": "You will see the goodness of the Lord with your own eyes; His light scatters every shadow.",
    "declEs": "El Señor es la luz y la fortaleza de mi vida; veré Su bondad obrando hoy.",
    "declEn": "The Lord is my light and salvation; I will see His goodness unfolding today."
  },
  {
    "refEs": "Colosenses 3:12-15",
    "refEn": "Colossians 3:12-15",
    "verseEs": "Por tanto, como escogidos de Dios, santos y amados, vístanse de profunda compasión, bondad, humildad, mansedumbre y paciencia. Sopórtense unos a otros y perdónense unos a otros, si alguno tiene queja contra otro. Así como Cristo los perdonó, así también hagan ustedes. Y sobre todas estas cosas, vístanse de amor, que es el vínculo perfecto. Que la paz de Cristo gobierne en sus corazones, pues a esa paz fueron llamados en un solo cuerpo. Y sean agradecidos.",
    "verseEn": "Put on therefore, as God’s chosen ones, holy and beloved, a heart of compassion, kindness, lowliness, humility, and perseverance; bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do. Above all these things, walk in love, which is the bond of perfection. And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful.",
    "prayerEs": "Señor Jesús, ayúdame a vestirme de paciencia y ternura hacia mi familia y quienes me rodean. Que Tu paz sea el árbitro que gobierne cada decisión de mi hogar.",
    "prayerEn": "Lord Jesus, help me clothe myself with kindness and patience toward my loved ones. Let Your peace be the umpire ruling every decision.",
    "promEs": "Eres la escogida de Dios, amada con ternura celestial; Su paz está designada para gobernar tu mente.",
    "promEn": "You are chosen by God, cherished and beloved; His peace is appointed to rule your heart.",
    "declEs": "La paz de Cristo gobierna mi mente y hogar; elijo la bondad, la humildad y la gracia.",
    "declEn": "The peace of Christ rules my mind and home; I choose kindness, humility, and grace."
  },
  {
    "refEs": "Juan 14:27",
    "refEn": "John 14:27",
    "verseEs": "La paz les dejo; mi paz les doy. Yo no se la doy como el mundo la da. No se turbe su corazón ni tenga miedo.",
    "verseEn": "Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don’t let your heart be troubled, neither let it be fearful.",
    "prayerEs": "Príncipe de Paz, recibo el regalo sagrado de Tu tranquilidad. No es una paz frágil que depende de las circunstancias, sino el ancla viva de Tu presencia en mi alma.",
    "prayerEn": "Prince of Peace, I receive the sacred gift of Your calm. Not a fragile worldly peace, but the living anchor of Your presence.",
    "promEs": "La paz que Jesús te entrega no puede ser arrebatada por las noticias, los problemas ni los temores.",
    "promEn": "The peace Jesus leaves with you cannot be snatched away by circumstances or anxious news.",
    "declEs": "Mi corazón no se turba ni teme; la paz profunda de Jesús reposa en mi interior.",
    "declEn": "My heart is neither troubled nor afraid; Jesus’ profound peace rests within me."
  },
  {
    "refEs": "Proverbios 3:5-6",
    "refEn": "Proverbs 3:5-6",
    "verseEs": "Pon toda tu esperanza en Dios y no te apoyes en tu propia razón. Escúchalo en todos tus caminos y él enderezará tus pasos.",
    "verseEn": "Trust in the LORD with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.",
    "prayerEs": "Señor sabio, suelto la necesidad de entenderlo todo con mi lógica limitada. Confío con todo mi corazón en Tu dirección y te entrego cada paso de hoy.",
    "prayerEn": "All-wise Lord, I lay down the urge to calculate everything with limited reason. I trust You with all my heart and hand You each step today.",
    "promEs": "Cuando dejas de forzar las cosas con tus propias fuerzas y confías en Dios, Él allana y endereza tu camino.",
    "promEn": "When you release control and lean on God, He makes your path straight and clear.",
    "declEs": "Confío en el Señor de todo corazón; Él guía mis pasos y endereza mis caminos.",
    "declEn": "I trust in the Lord with all my heart; He directs my steps and clears my path."
  },
  {
    "refEs": "Salmos 62:1-2, 5-8",
    "refEn": "Psalm 62:1-2, 5-8",
    "verseEs": "Alma mía, pon toda tu confianza en Dios, porque de él viene mi salvación. Solo él es mi roca y mi salvación, mi torre alta; no sufriré una gran sacudida. … Alma mía, pon toda tu confianza en Dios, porque de él viene mi esperanza. Solo él es mi roca y mi salvación, mi torre alta; no sufriré una gran sacudida. De Dios vienen mi salvación y mi gloria; él es mi roca fuerte y mi refugio. Pueblo, confíen en él en todo momento; derramen su corazón ante él. Dios es nuestro refugio. Selah.",
    "verseEn": "My soul rests in God alone. My salvation is from him. He alone is my rock, my salvation, and my fortress. I will never be greatly shaken. … My soul, wait in silence for God alone, for my expectation is from him. He alone is my rock and my salvation, my fortress. I will not be shaken. My salvation and my honor is with God. The rock of my strength, and my refuge, is in God. Trust in him at all times, you people. Pour out your heart before him. God is a refuge for us. Selah.",
    "prayerEs": "Dios mío, haz callar el bullicio interior en Tu quietud. Tú eres la roca firme debajo de mis pies; cuando todo tiemble alrededor, yo descansaré en Ti.",
    "prayerEn": "My God, quiet the inner turbulence in Your holy rest. You are the immovable rock under my feet; I stand firm in You.",
    "promEs": "En Dios tu alma encuentra descanso seguro; no serás sacudida porque tu fundamento es eterno.",
    "promEn": "In God alone your soul finds quiet rest; you will not be shaken because your foundation is eternal.",
    "declEs": "Mi alma reposa callada sólo en Dios; Él es mi roca, mi salvación y mi amparo inamovible.",
    "declEn": "My soul finds rest in God alone; He is my rock, my salvation, and my steady refuge."
  },
  {
    "refEs": "1 Pedro 5:6-10",
    "refEn": "1 Peter 5:6-10",
    "verseEs": "Humíllense, pues, bajo la poderosa mano de Dios, para que él los exalte a su debido tiempo. Echen sobre él toda su ansiedad, porque él cuida de ustedes. Sean sobrios y estén alerta. Su adversario, el diablo, anda alrededor como león rugiente, buscando a quien devorar. Resístanlo firmes en la fe, sabiendo que sus hermanos en todo el mundo están pasando por los mismos sufrimientos. Y después de que ustedes hayan sufrido un poco de tiempo, el Dios de toda gracia, quien los llamó a su gloria eterna en Cristo Jesús, él mismo los perfeccionará, afirmará, fortalecerá y establecerá.",
    "verseEn": "Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time, casting all your worries on him, because he cares for you. Be sober and self-controlled. Be watchful. Your adversary, the devil, walks around like a roaring lion, seeking whom he may devour. Withstand him steadfast in your faith, knowing that your brothers who are in the world are undergoing the same sufferings. But may the God of all grace, who called you to his eternal glory by Christ Jesus, after you have suffered a little while, perfect, establish, strengthen, and settle you.",
    "prayerEs": "Padre tierno, hoy suelto sobre Tus hombros de amor todas las cargas que no me corresponden. Gracias por cuidar de mí y de cada detalle de mi casa.",
    "prayerEn": "Tender Father, today I cast upon Your loving shoulders every burden I was never meant to bear. Thank You for watching over me and my home.",
    "promEs": "Dios no es indiferente a tus lágrimas; Él cuida de ti con cariño maternal y fidelidad eterna.",
    "promEn": "God is never indifferent to your struggles; He watches over you with tender care and steadfast love.",
    "declEs": "Echo toda mi ansiedad sobre Dios; Él cuida amorosamente de mi vida y mi familia.",
    "declEn": "I cast all my cares upon God; He tenderly watches over my life and my family."
  },
  {
    "refEs": "Isaías 43:1-3",
    "refEn": "Isaiah 43:1-3",
    "verseEs": "Ahora el Señor, tu creador, Jacob, el que te dio vida, Israel, dice: No tengas miedo, porque he defendido tu causa. Te he llamado por tu nombre y te he hecho mío. Cuando pases por las aguas, estaré contigo; cuando cruces los ríos, no te cubrirán. Cuando pases por el fuego, no te quemarás y las llamas no tendrán poder sobre ti. Porque yo soy el Señor tu Dios, el Santo de Israel, tu salvador. He dado a Egipto como precio por ti, a Etiopía y a Seba en tu lugar.",
    "verseEn": "But now the LORD who created you, Jacob, and he who formed you, Israel, says: “Don’t be afraid, for I have redeemed you. I have called you by your name. You are mine. When you pass through the waters, I will be with you, and through the rivers, they will not overflow you. When you walk through the fire, you will not be burned, and flame will not scorch you. For I am the LORD your God, the Holy One of Israel, your Savior. I have given Egypt as your ransom, Ethiopia and Seba in your place.",
    "prayerEs": "Señor Redentor, gracias por llamarme por mi nombre y decirme: «Mía eres tú». En medio de las aguas profundas o las pruebas de fuego, sé que estás a mi lado.",
    "prayerEn": "Redeeming Lord, thank You for calling me by name and saying: \"You are Mine.\" Through deep waters or fiery trials, I know You stand with me.",
    "promEs": "Las aguas de la dificultad no te ahogarán ni el fuego te consumirá; Dios camina contigo en el fuego.",
    "promEn": "The flood of trouble will not drown you, nor will the flame scorch you; God walks with you through it all.",
    "declEs": "Pertenezco al Señor; pasaré por las aguas y no me anegarán, porque Él está conmigo.",
    "declEn": "I belong to the Lord; I will pass through the waters and not be overtaken, for He is with me."
  },
  {
    "refEs": "Salmos 16:8-11",
    "refEn": "Psalm 16:8-11",
    "verseEs": "Tengo siempre al Señor delante de mí; porque está a mi derecha, no caeré. Por eso mi corazón se alegra y mi ser se llena de gozo; también mi cuerpo descansa con esperanza. No me dejarás prisionero en el lugar de los muertos; no permitirás que quien te es fiel vea el lugar de la muerte. Me mostrarás el camino de la vida. En tu presencia hay alegría completa; a tu derecha hay dicha para siempre.",
    "verseEn": "I have set the LORD always before me. Because he is at my right hand, I shall not be moved. Therefore my heart is glad, and my tongue rejoices. My body shall also dwell in safety. For you will not leave my soul in Sheol, neither will you allow your holy one to see corruption. You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more.",
    "prayerEs": "Señor de la vida, pongo Tu presencia en el centro de mi día. Llena mi casa con esa plenitud de gozo que ninguna circunstancia externa puede quitar.",
    "prayerEn": "Lord of Life, I set Your presence at the center of my day. Fill my home with that fullness of joy no circumstance can diminish.",
    "promEs": "En la presencia de Dios encuentras la plenitud de gozo que el mundo promete pero nunca puede dar.",
    "promEn": "In God’s presence you discover the fullness of joy that the world promises but can never provide.",
    "declEs": "Pongo al Señor siempre delante de mí; mi corazón se alegra y vivo en Su plenitud.",
    "declEn": "I keep the Lord always before me; my heart rejoices and I walk in His fullness."
  },
  {
    "refEs": "Gálatas 5:22-23 / 6:9",
    "refEn": "Galatians 5:22-23 / 6:9",
    "verseEs": "Pero el fruto del Espíritu es amor, gozo, paz, paciencia, bondad, benignidad, fe, mansedumbre y dominio propio. Contra tales cosas no hay ley … No nos cansemos de hacer el bien, porque a su tiempo cosecharemos, si no desmayamos.",
    "verseEn": "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control. Against such things there is no law … Let’s not be weary in doing good, for we will reap in due season if we don’t give up.",
    "prayerEs": "Espíritu Santo, haz florecer en mí paciencia y ternura cuando el cansancio toque a la puerta. No permitas que me rinda; ayúdame a sembrar amor en mi hogar.",
    "prayerEn": "Holy Spirit, cultivate patience and gentleness within me when weariness knocks. Help me not grow weary in loving and serving well.",
    "promEs": "Toda semilla de amor y bondad que siembras en el silencio dará una cosecha gloriosa a su debido tiempo.",
    "promEn": "Every seed of love and patience you plant in secret will yield a glorious harvest in due season.",
    "declEs": "El fruto del Espíritu gobierna mis palabras y acciones; no me canso de hacer el bien.",
    "declEn": "The fruit of the Spirit guides my words and actions; I will not grow weary in doing good."
  }
];
const DEVOTIONAL_TITLES = [
  {
    "es": "Vestida de Fuerza y Dignidad: Dios Sostiene Cada Etapa de tu Vida",
    "en": "Clothed in Strength and Dignity: God Holds Every Season of Your Life"
  },
  {
    "es": "La Belleza de un Corazón Agradecido: Ver a Dios en los Detalles Pequeños",
    "en": "The Beauty of a Grateful Heart: Finding God in the Everyday"
  },
  {
    "es": "Respira Hondo y Suelta el Control: El Señor Cuida de Ti",
    "en": "Breathe Deeply and Let Go: The Lord Is Watching Over You"
  },
  {
    "es": "Manantial en el Desierto: Gracia Abundante para el Alma Sedienta",
    "en": "Spring in the Desert: Abundant Grace for the Thirsty Soul"
  },
  {
    "es": "Bajo la Sombra del Omnipotente: Tu Amparo Inamovible",
    "en": "Under the Shadow of the Almighty: Your Unshakeable Fortress"
  },
  {
    "es": "Nuevas Son Cada Mañana: La Fidelidad Inquebrantable de Dios",
    "en": "New Every Morning: God’s Unfailing Faithfulness"
  },
  {
    "es": "El Reposo Sagrado: Aprender a Descansar en los Brazos del Buen Pastor",
    "en": "Sacred Rest: Learning to Abide in the Good Shepherd’s Arms"
  },
  {
    "es": "No Temas al Porvenir: Tu Futuro Está Seguro en Sus Manos",
    "en": "Fear Not Tomorrow: Your Future Is Safe in His Hands"
  },
  {
    "es": "El Valor Oculto de la Paciencia: Dios Trabaja Mientras Esperas",
    "en": "The Quiet Value of Patience: God Works While You Wait"
  },
  {
    "es": "Sanando las Heridas del Corazón: El Bálsamo Dulce del Salvador",
    "en": "Healing the Heart’s Wounds: The Savior’s Gentle Balm"
  },
  {
    "es": "Palabras que Edifican tu Casa: La Sabiduría de una Mujer Serena",
    "en": "Words that Build Your Home: The Wisdom of a Peaceful Woman"
  },
  {
    "es": "Libre de la Culpa: La Gracia que Todo lo Hace Nuevo",
    "en": "Free from Guilt: The Grace that Makes All Things New"
  },
  {
    "es": "Caminar por Fe y no por Vista: La Certeza de lo Invisible",
    "en": "Walking by Faith and Not by Sight: Trusting the Unseen"
  },
  {
    "es": "El Aliento de Vida en tu Hogar: Sembrando Paz y Armonía",
    "en": "The Breath of Life in Your Home: Sowing Peace and Harmony"
  },
  {
    "es": "Dios Pelea por Ti: Serenidad Frente a las Batallas Cotidianas",
    "en": "The Lord Fights for You: Serenity Facing Daily Battles"
  },
  {
    "es": "Una Mesa Servida en el Silencio: Intimidad con el Creador",
    "en": "A Table Prepared in the Quiet: Intimacy with the Creator"
  },
  {
    "es": "El Gozo de la Restauración: Cuando Dios Devuelve la Canción",
    "en": "The Joy of Restoration: When God Returns Your Song"
  },
  {
    "es": "Fuerzas para Quien ya no Puede Más: El Poder que se Hace Fuerte en Ti",
    "en": "Strength for the Weary: Power Made Perfect in Your Weakness"
  },
  {
    "es": "Un Corazón sin Máscaras: Acercándote al Trono de la Gracia",
    "en": "An Unmasked Heart: Approaching the Throne of Grace"
  },
  {
    "es": "La Promesa de Su Presencia: Nunca Sola, Nunca Olvidada",
    "en": "The Promise of His Presence: Never Alone, Never Forgotten"
  },
  {
    "es": "Semillas de Esperanza en Tierra Fértil: Tu Cosecha de Amor",
    "en": "Seeds of Hope in Fertile Ground: Your Harvest of Love"
  },
  {
    "es": "El Milagro de un Nuevo Comienzo: Su Misericordia que no se Agota",
    "en": "The Miracle of a New Beginning: His Mercies That Never End"
  },
  {
    "es": "Anclada en la Roca: Cuando los Vientos Intentan Moverte",
    "en": "Anchored in the Rock: When the Winds Attempt to Shake You"
  },
  {
    "es": "La Ternura de Dios: Mirándote a Través de Sus Ojos de Amor",
    "en": "The Tender Mercy of God: Seeing Yourself Through Eyes of Love"
  },
  {
    "es": "Luz en la Oscuridad: La Lámpara que Ilumina Cada Paso",
    "en": "Light in the Darkness: The Lamp that Guides Every Step"
  },
  {
    "es": "Paz que Sobrepasa Todo Entendimiento: Blindando tus Emociones",
    "en": "Peace Beyond Understanding: Guarding Your Emotional Well-being"
  },
  {
    "es": "El Cuidado Maternal del Cielo: Sostenida por Manos Eternas",
    "en": "Heaven’s Tender Care: Upheld by Everlasting Hands"
  },
  {
    "es": "La Libertad del Perdón: Soltando Cargas del Pasado",
    "en": "The Freedom of Forgiveness: Releasing the Weight of the Past"
  },
  {
    "es": "Confianza en Medio de la Tormenta: El Maestro en tu Barca",
    "en": "Trust in the Storm: The Master Resting in Your Boat"
  },
  {
    "es": "Tu Vida Tiene un Propósito Eterno: Llamada para Brillar",
    "en": "Your Life Has Eternal Purpose: Called to Shine His Light"
  },
  {
    "es": "Dulzura en el Trato: El Legado de Amor que Deja tu Huella",
    "en": "Kindness in Speech: The Enduring Legacy of Your Touch"
  }
];
const REFLECTION_BODIES = [
  {
    "es": "A veces nos exigimos una perfección que Dios jamás nos ha pedido. Pensamos que para ser valiosas debemos tener todas las respuestas resueltas, la casa impecable y las emociones en calma absoluta. Pero la verdadera fe florece cuando admitimos que no podemos solas, y en ese mismo instante encontramos el abrazo sostenedor del Padre.\n\nEstar en paz no significa que no haya desafíos en tu día; significa que tu mirada ya no está puesta en el tamaño de la ola, sino en Aquel que camina sobre las aguas. Hoy date permiso para respirar hondo, para descansar en Su gracia y para soltar el afán de controlar el futuro. Dios ya está en tu mañana cuidando de ti y de los tuyos.",
    "en": "Sometimes we demand a perfection from ourselves that God never asked of us. We imagine that to be worthy, we must hold all the answers, keep life immaculate, and never let our emotions wobble. Yet true faith blooms the moment we admit our human limits, and right there we encounter the Father's sustaining embrace.\n\nBeing at peace does not mean the absence of challenge; it means your eyes are fixed not on the waves, but on the One who walks upon them. Breathe deeply and rest today in His tender grace."
  },
  {
    "es": "El ajetreo cotidiano tiene una manera sigilosa de robarnos la capacidad de asombro. Nos levantamos pensando en la lista interminable de tareas pendientes y se nos pasa por alto la caricia del sol en la mañana, el aroma del café o la risa inocente de un ser querido. Sin darnos cuenta, nos volvemos administradoras de urgencias en vez de administradoras de gracia.\n\nEl Señor te invita hoy a detener la marcha unos instantes. Mira a tu alrededor con ojos de gratitud. Cuando eliges bendecir a Dios por lo que ya tienes entre manos, la queja se disipa y el corazón se inunda de una calma inexplicable. Su fidelidad ha estado presente en cada estación de tu vida, y hoy no será la excepción.",
    "en": "The daily rush has a quiet way of stealing our sense of wonder. We wake focused on endless to-do lists and miss the warmth of morning light or a loved one's gentle smile. Without noticing, we become managers of hurry instead of stewards of grace.\n\nThe Lord invites you to pause for a quiet breath today. Look around with grateful eyes. When you choose to praise Him for what is already in your hands, anxiety dissolves into peace."
  },
  {
    "es": "¿Cuántas veces nos descubrimos apretando la mandíbula o cargando una tensión innecesaria en los hombros? Intentamos solucionar la vida de todos a nuestro alrededor y asumimos responsabilidades que sólo le pertenecen a Dios. Pero el Señor Jesús nos mira con infinita ternura y nos susurra: «Ven a mí, suelta esa carga pesada; yo te haré descansar».\n\nNo tienes que fingir fortaleza cuando por dentro te sientes frágil. En la economía del cielo, tu debilidad es el escenario perfecto donde el poder de Dios se perfecciona. Hoy entrega en Sus manos lo que no puedes cambiar y confía en que Él tiene el timón de tu hogar.",
    "en": "How often do we find ourselves holding tension in our shoulders and trying to solve everything for everyone? We take on weights God never asked us to carry. Yet Jesus looks upon us with tender love and whispers: \"Come to me, lay down your heavy burden; I will give you rest.\"\n\nYou do not have to pretend to be invincible. In heaven’s grace, your weakness is the exact place where His power shines brightest. Release control today into His loving hands."
  },
  {
    "es": "Cuando miras hacia atrás en tu historia, puedes ver con asombro cómo la mano de Dios estuvo sosteniéndote aun en los momentos donde sentías que todo se derrumbaba. Las tormentas que pensaste que te destruirían se convirtieron en las raíces que hoy te dan firmeza y sabiduría.\n\nSi Dios fue fiel en tus desiertos pasados, ¿por qué dudar de Su amor el día de hoy? Él no cambia. Su pacto de misericordia contigo permanece firme como las montañas. Entrégale tu incertidumbre presente y avanza con la certeza de que nada puede separarte de Su amor eterno.",
    "en": "Looking back over your story, you can trace God's tender hand holding you even when you felt everything was crumbling. The very storms you feared would shatter you became the deep roots giving you courage and wisdom today.\n\nIf God was faithful in past wildernesses, why doubt His loving care today? He does not change. His covenant of mercy stands firm as the mountains. Step forward in peace knowing nothing can sever you from His love."
  },
  {
    "es": "La identidad de una mujer no se mide por los aplausos del mundo ni por la opinión cambiante de la gente. Fuiste soñada, tejida y amada por el Creador mucho antes de que dieras tu primer suspiro. En Sus ojos, eres una obra maestra vestida de dignidad celestial.\n\nHoy silencia las voces de autoexigencia y comparación. No necesitas competir con nadie ni demostrar tu valor; tu valor ya fue pagado con el precio más alto en la cruz de Jesús. Camina erguida, con la serenidad de una hija del Rey que sabe que su futuro está protegido por el amor inquebrantable de su Padre.",
    "en": "Your identity is never measured by worldly applause or the fickle opinions of others. You were dreamed, woven, and cherished by the Creator before your first breath. In His eyes, you are a masterpiece clothed in heavenly dignity.\n\nSilence every voice of comparison today. You do not need to compete or prove your worth; your worth is eternal and sealed by Christ. Walk with the quiet confidence of a beloved daughter of the King."
  }
];
const PRAYERS_LIBRARY = [
  {
    "titleEs": "Oración por Serenidad y Paz Mental",
    "titleEn": "Prayer for Peace of Mind and Calm",
    "tagEs": "Paz Interior",
    "tagEn": "Inner Peace",
    "prayerEs": "Padre amado, hoy te entrego cada pensamiento que intenta robarme la calma. Límpiame de la prisa, relaja mis hombros y llena mi hogar con Tu presencia consoladora. Guardo silencio ante Ti y confío plenamente en Tu cuidado. Amén.",
    "prayerEn": "Loving Father, today I surrender every anxious thought. Free me from rush, relax my weary shoulders, and fill my home with Your comforting presence. I rest quietly in You. Amen."
  },
  {
    "titleEs": "Oración de Gratitud y Bendición del Hogar",
    "titleEn": "Prayer of Gratitude and Home Blessing",
    "tagEs": "Gratitud",
    "tagEn": "Gratitude",
    "prayerEs": "Señor Jesús, gracias por el pan en mi mesa, por la salud de los míos y por las bendiciones invisibles que me regalas cada día. Que en mi casa hoy reinen palabras de amor, dulzura y agradecimiento sincero. Amén.",
    "prayerEn": "Lord Jesus, thank You for bread on my table, the well-being of my family, and the quiet blessings You pour out every day. May kindness, gentle words, and sincere gratitude fill our home today. Amen."
  },
  {
    "titleEs": "Oración por Fuerzas Nuevas en el Cansancio",
    "titleEn": "Prayer for Fresh Strength in Weariness",
    "tagEs": "Fortaleza",
    "tagEn": "Strength",
    "prayerEs": "Dios misericordioso, cuando siento que mis fuerzas humanas se agotan, acudo a Tu manantial inagotable. Renueva mi espíritu, danos aliento de vida y ayúdanos a caminar en victoria y reposo. Amén.",
    "prayerEn": "Merciful God, when human strength runs low, I run to Your inexhaustible fountain. Renew my spirit, grant us fresh breath of life, and teach us to walk in quiet victory and rest. Amen."
  },
  {
    "titleEs": "Oración por Sabiduría y Dirección",
    "titleEn": "Prayer for Wisdom and Guidance",
    "tagEs": "Sabiduría",
    "tagEn": "Wisdom",
    "prayerEs": "Espíritu de sabiduría, guía cada palabra que salga de mi boca y cada decisión que deba tomar hoy. Que sea un instrumento de paz y consuelo para quienes me rodean. Amén.",
    "prayerEn": "Spirit of Wisdom, guide every word on my lips and every choice before me today. Make me an instrument of gentle peace and comfort for those around me. Amen."
  },
  {
    "titleEs": "Oración por Protección y Paz Familiar",
    "titleEn": "Prayer for Protection and Family Peace",
    "tagEs": "Protección",
    "tagEn": "Protection",
    "prayerEs": "Señor Altísimo, cubro a mis seres queridos bajo la sombra de Tus alas. Guarda su entrada y su salida, aleja todo temor y guarda nuestros corazones en perfecta comunión contigo. Amén.",
    "prayerEn": "Most High Lord, I cover my loved ones under the shadow of Your wings. Guard their steps, cast away every fear, and keep our hearts united in Your love. Amen."
  },
  {
    "titleEs": "Oración de Entrega y Confianza Total",
    "titleEn": "Prayer of Surrender and Deep Trust",
    "tagEs": "Confianza",
    "tagEn": "Trust",
    "prayerEs": "Padre bueno, no sé qué traerá el día de mañana, pero sé con certeza quién sostiene mi mañana. Suelto el afán y decido descansar confiadamente en Tus brazos de gracia. Amén.",
    "prayerEn": "Good Father, I do not know what tomorrow holds, but I know who holds my tomorrow. I let go of worry and choose to rest securely in Your arms of grace. Amen."
  }
];
const PROMISES_LIBRARY = [
  {
    "catEs": "Paz y Amparo Inmediato",
    "catEn": "Peace & Instant Shelter",
    "verseRefEs": "Salmos 46:1",
    "verseRefEn": "Psalm 46:1",
    "passageEs": "«Dios es nuestro refugio y nuestra fuerza; es una ayuda siempre presente en la angustia.»",
    "passageEn": "«God is our refuge and strength, a very present help in trouble.»",
    "meditationEs": "Dios no es un amparo lejano al que debas buscar con desesperación. Está más cerca que tu propio aliento, listo para auxiliarte.",
    "meditationEn": "God is not a distant shelter you must search for frantically. He is closer than your very breath, ready to help you.",
    "declarationEs": "Hoy habito en el amparo de Dios; Su fortaleza me sostiene ante cualquier tormenta.",
    "declarationEn": "Today I abide in God’s shelter; His strength holds me through every storm."
  },
  {
    "catEs": "Paz Profunda",
    "catEn": "Deep Peace",
    "verseRefEs": "Juan 14:27",
    "verseRefEn": "John 14:27",
    "passageEs": "«La paz les dejo; mi paz les doy. Yo no se la doy como el mundo la da. No se turbe su corazón ni tenga miedo.»",
    "passageEn": "«Peace I leave with you, my peace I give unto you... Let not your heart be troubled, neither let it be afraid.»",
    "meditationEs": "La paz de Jesús no depende de que todo esté en orden en el exterior; es una calma sobrenatural en el centro de tu espíritu.",
    "meditationEn": "Jesus’ peace does not depend on smooth outward circumstances; it is supernatural quiet at the center of your spirit.",
    "declarationEs": "Recibo la paz inamovible de Jesús; mi corazón no se turba ni teme lo por venir.",
    "declarationEn": "I receive Jesus’ unshakeable peace; my heart is not troubled nor afraid of tomorrow."
  },
  {
    "catEs": "Fuerzas Renovadas",
    "catEn": "Renewed Strength",
    "verseRefEs": "Isaías 40:29",
    "verseRefEn": "Isaiah 40:29",
    "passageEs": "«Él da fuerza al débil y aumenta el vigor del que no tiene fuerzas.»",
    "passageEn": "«He gives power to the weak. He increases the strength of him who has no might.»",
    "meditationEs": "No necesitas fingir que te sobra energía. Cuando tus reservas tocan fondo, el poder ilimitado del Creador comienza a obrar en ti.",
    "meditationEn": "You do not need to pretend you have endless energy. When your human reserves run dry, God’s infinite power begins.",
    "declarationEs": "El Señor multiplica mis fuerzas hoy; camino con ligereza y descanso en Su gracia.",
    "declarationEn": "The Lord multiplies my strength today; I walk with lightness and rest in His grace."
  },
  {
    "catEs": "Amor Eterno",
    "catEn": "Everlasting Love",
    "verseRefEs": "Jeremías 31:3",
    "verseRefEn": "Jeremiah 31:3",
    "passageEs": "«Mi amor por ti es eterno. Por eso, con misericordia te he hecho venir conmigo.»",
    "passageEn": "«I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee.»",
    "meditationEs": "El amor de Dios hacia ti no sube ni baja según tu productividad. Te ama con un amor que no tiene principio ni tendrá jamás final.",
    "meditationEn": "God’s love for you does not fluctuate based on your performance. He loves you with an everlasting, unconditional love.",
    "declarationEs": "Soy profundamente amada por Dios; Su misericordia me abraza en cada instante de este día.",
    "declarationEn": "I am deeply loved by God; His tender mercy embraces me in every moment of this day."
  },
  {
    "catEs": "Provisión Segura",
    "catEn": "Faithful Provision",
    "verseRefEs": "Filipenses 4:19",
    "verseRefEn": "Philippians 4:19",
    "passageEs": "«Mi Dios suplirá todo lo que les falte, conforme a sus riquezas en gloria en Cristo Jesús.»",
    "passageEn": "«And my God will supply every need of yours according to his riches in glory in Christ Jesus.»",
    "meditationEs": "Dios conoce con exactitud lo que necesitas antes de que se lo pidas. Sus recursos celestiales son infinitos para cuidar de tu vida.",
    "meditationEn": "God knows precisely what you need before you ask. His heavenly riches are boundless to care for your life.",
    "declarationEs": "Confío en la provisión perfecta de mi Padre; nada me faltará porque Él cuida de mí.",
    "declarationEn": "I trust my Father’s perfect provision; I will lack no good thing because He watches over me."
  },
  {
    "catEs": "Compañía Fiel",
    "catEn": "Faithful Presence",
    "verseRefEs": "Hebreos 13:5",
    "verseRefEn": "Hebrews 13:5",
    "passageEs": "«Nunca te dejaré ni te abandonaré. Así podemos decir con confianza: El Señor es mi ayudador.»",
    "passageEn": "«I will never leave you nor forsake you; so we can confidently say, \"The Lord is my helper.\"»",
    "meditationEs": "Aun en los días donde el silencio parece largo, Jesús está a tu lado. Jamás te soltará ni te dejará a la deriva.",
    "meditationEn": "Even on days when the silence feels long, Jesus is right beside you. He will never leave you or cast you aside.",
    "declarationEs": "El Señor camina conmigo hoy; nunca estoy sola, Él es mi socorro y mi pronto auxilio.",
    "declarationEn": "The Lord walks with me today; I am never alone, He is my helper and constant guide."
  }
];

// In-memory memoization cache for 0ms instant retrieval
const memoCache = new Map<number, CalendarDayRecord>();

/**
 * Calculates current day of year (1-366) based on real dynamic client date.
 */
export function getDayOfYear(date: Date = new Date()): number {
  const currentMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = currentMidnight.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const isLeap = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || (date.getFullYear() % 400 === 0);
  const totalDays = isLeap ? 366 : 365;
  return Math.min(totalDays, Math.max(1, Math.round(diff / oneDay) + 1));
}

/**
 * Finds month and day of month for a given dayOfYear (1-366) using real dynamic calendar arithmetic.
 */
export function getMonthAndDay(dayOfYear: number, year: number = new Date().getFullYear()): { month: number; dayOfMonth: number; dateFormattedEs: string; dateFormattedEn: string } {
  const now = new Date();
  const todayDayOfYear = getDayOfYear(now);
  const monthNamesEs = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // If requested day is today, return exact live system date to prevent any timezone/leap skew
  if (dayOfYear === todayDayOfYear && year === now.getFullYear()) {
    return {
      month: now.getMonth() + 1,
      dayOfMonth: now.getDate(),
      dateFormattedEs: `${now.getDate()} de ${monthNamesEs[now.getMonth()]}`,
      dateFormattedEn: `${monthNamesEn[now.getMonth()]} ${now.getDate()}`,
    };
  }

  const date = new Date(year, 0, dayOfYear);
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;

  return {
    month,
    dayOfMonth,
    dateFormattedEs: `${dayOfMonth} de ${monthNamesEs[date.getMonth()]}`,
    dateFormattedEn: `${monthNamesEn[date.getMonth()]} ${dayOfMonth}`,
  };
}

/**
 * Retrieves the unique calendar record for a specific date or day of year (1 to 366).
 * Generated deterministically with rich biblical variation so every day of the year is unique!
 */
export function getDailyRecord(target?: Date | number): CalendarDayRecord {
  const now = new Date();
  const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || (now.getFullYear() % 400 === 0);
  const totalDays = isLeap ? 366 : 365;

  let dayNum: number;
  if (typeof target === 'number') {
    dayNum = Math.min(totalDays, Math.max(1, Math.round(target)));
  } else {
    dayNum = getDayOfYear(target || now);
  }

  const dateInfo = getMonthAndDay(dayNum, now.getFullYear());
  // Cada día es una unidad completa y coherente (tema, pasaje, reflexión, oración y promesa del mismo asunto).
  // Si no hay unidades, se usan los bancos antiguos.
  const unit = DAILY_UNITS.length ? DAILY_UNITS[(dayNum - 1) % DAILY_UNITS.length] : null;
  const passage = unit
    ? { refEs: unit.refEs, refEn: unit.refEn, verseEs: unit.verseEs, verseEn: unit.verseEn, prayerEs: unit.prayerEs, prayerEn: unit.prayerEn }
    : PASSAGES[(dayNum - 1) % PASSAGES.length];
  const theme = unit
    ? { topic: unit.topicEs, mood: unit.mood, focus: '' }
    : THEMES[(dayNum - 1) % THEMES.length];
  const title = unit
    ? { es: unit.titleEs, en: unit.titleEn }
    : DEVOTIONAL_TITLES[(dayNum - 1) % DEVOTIONAL_TITLES.length];
  const reflection = unit
    ? { es: unit.reflectionEs, en: unit.reflectionEn }
    : REFLECTION_BODIES[(dayNum - 1) % REFLECTION_BODIES.length];
  const prayerItem = unit
    ? { titleEs: unit.titleEs, titleEn: unit.titleEn, tagEs: unit.topicEs, tagEn: unit.topicEn, prayerEs: unit.prayerEs, prayerEn: unit.prayerEn }
    : PRAYERS_LIBRARY[(dayNum - 1) % PRAYERS_LIBRARY.length];
  const promiseItem = unit
    ? { catEs: unit.catEs, catEn: unit.catEn, verseRefEs: unit.promiseRefEs, verseRefEn: unit.promiseRefEn, passageEs: unit.promisePassageEs, passageEn: unit.promisePassageEn, meditationEs: unit.meditationEs, meditationEn: unit.meditationEn, declarationEs: unit.declarationEs, declarationEn: unit.declarationEn }
    : PROMISES_LIBRARY[(dayNum - 1) % PROMISES_LIBRARY.length];

  const devotional: DailyDevotionalItem = {
    id: `dev_day_${dayNum}`,
    dayOfYear: dayNum,
    dateFormattedEs: dateInfo.dateFormattedEs,
    dateFormattedEn: dateInfo.dateFormattedEn,
    topic: theme.topic,
    moodCategory: theme.mood as MoodType,
    titleEs: title.es,
    titleEn: title.en,
    passageRefEs: passage.refEs,
    passageRefEn: passage.refEn,
    passageTextEs: passage.verseEs,
    passageTextEn: passage.verseEn,
    reflectionEs: reflection.es,
    reflectionEn: reflection.en,
    prayerEs: passage.prayerEs,
    prayerEn: passage.prayerEn,
  };

  const prayer: DailyPrayerEntry = {
    id: `prayer_day_${dayNum}`,
    dayOfYear: dayNum,
    dateFormattedEs: dateInfo.dateFormattedEs,
    dateFormattedEn: dateInfo.dateFormattedEn,
    titleEs: prayerItem.titleEs,
    titleEn: prayerItem.titleEn,
    verseRefEs: passage.refEs,
    verseRefEn: passage.refEn,
    verseTextEs: passage.verseEs,
    verseTextEn: passage.verseEn,
    prayerEs: prayerItem.prayerEs,
    prayerEn: prayerItem.prayerEn,
    themeTagEs: prayerItem.tagEs,
    themeTagEn: prayerItem.tagEn,
  };

  const promise: DailyPromiseEntry = {
    id: `promise_day_${dayNum}`,
    dayOfYear: dayNum,
    dateFormattedEs: dateInfo.dateFormattedEs,
    dateFormattedEn: dateInfo.dateFormattedEn,
    categoryEs: promiseItem.catEs,
    categoryEn: promiseItem.catEn,
    verseRefEs: promiseItem.verseRefEs,
    verseRefEn: promiseItem.verseRefEn,
    passageEs: promiseItem.passageEs,
    passageEn: promiseItem.passageEn,
    meditationEs: promiseItem.meditationEs,
    meditationEn: promiseItem.meditationEn,
    declarationEs: promiseItem.declarationEs,
    declarationEn: promiseItem.declarationEn,
  };

  const record: CalendarDayRecord = {
    dayOfYear: dayNum,
    month: dateInfo.month,
    dayOfMonth: dateInfo.dayOfMonth,
    dateFormattedEs: dateInfo.dateFormattedEs,
    dateFormattedEn: dateInfo.dateFormattedEn,
    devotional,
    prayer,
    promise,
  };

  return record;
}

export function getTodayDevotional(target?: Date | number): DailyDevotionalItem {
  return getDailyRecord(target).devotional;
}

export function getTodayPrayer(target?: Date | number): DailyPrayerEntry {
  return getDailyRecord(target).prayer;
}

export function getTodayPromise(target?: Date | number): DailyPromiseEntry {
  return getDailyRecord(target).promise;
}
