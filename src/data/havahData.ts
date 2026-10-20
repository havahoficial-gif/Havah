import {
  BibleBook,
  BibleVerse,
  Devotional,
  LivePrayerRoom,
  MoodConfig,
  PrayerCommunityItem,
  SeminarCourse,
  SharedResourceItem,
  StreakMilestone,
} from '../types';
import matData from '../../public/bible/books/MAT.json';

export const TOPICS_LIST = [
  'Ansiedad',
  'Perdón',
  'Identidad',
  'Oración',
  'Duelo',
  'Gracia',
  'Silencio',
  'Sabiduría',
  'Esperanza',
  'Fe',
  'Comunidad',
  'Soledad',
  'Sanidad',
  'Justicia',
  'Reposo',
  'Vocación',
  'Gratitud',
  'Amor',
  'Paciencia',
  'Alabanza',
  'Tentación',
  'Espíritu Santo',
  'Creación',
  'Cruz',
  'Eternidad',
];

export const MOODS: MoodConfig[] = [
  {
    id: 'peace',
    labelEs: 'En paz',
    labelEn: 'At peace',
    scriptureAnchorEs: 'Filipenses 4:7',
    scriptureAnchorEn: 'Philippians 4:7',
    colorHex: '#5E8B7E',
  },
  {
    id: 'gratitude',
    labelEs: 'Agradecida',
    labelEn: 'Grateful',
    scriptureAnchorEs: 'Salmos 103:1-2',
    scriptureAnchorEn: 'Psalm 103:1-2',
    colorHex: '#9E6845',
  },
  {
    id: 'anxious',
    labelEs: 'Con algo de ansiedad',
    labelEn: 'Anxious / Burdened',
    scriptureAnchorEs: '1 Pedro 5:7',
    scriptureAnchorEn: '1 Peter 5:7',
    colorHex: '#7A8398',
  },
  {
    id: 'tired',
    labelEs: 'Cansada del día',
    labelEn: 'Weary / Tired',
    scriptureAnchorEs: 'Mateo 11:28',
    scriptureAnchorEn: 'Matthew 11:28',
    colorHex: '#6B7280',
  },
  {
    id: 'grief',
    labelEs: 'Triste o en duelo',
    labelEn: 'Sad / Grieving',
    scriptureAnchorEs: 'Salmos 34:18',
    scriptureAnchorEn: 'Psalm 34:18',
    colorHex: '#7C6F8E',
  },
  {
    id: 'seeking',
    labelEs: 'Buscando dirección',
    labelEn: 'Seeking guidance',
    scriptureAnchorEs: 'Salmos 119:105',
    scriptureAnchorEn: 'Psalm 119:105',
    colorHex: '#4F779A',
  },
];

export const BIBLE_BOOKS: BibleBook[] = [
  // Antiguo Testamento
  { id: 'GEN', nameEs: 'Génesis', nameEn: 'Genesis', isOldTestament: true, chaptersCount: 50 },
  { id: 'EXO', nameEs: 'Éxodo', nameEn: 'Exodus', isOldTestament: true, chaptersCount: 40 },
  { id: 'LEV', nameEs: 'Levítico', nameEn: 'Leviticus', isOldTestament: true, chaptersCount: 27 },
  { id: 'NUM', nameEs: 'Números', nameEn: 'Numbers', isOldTestament: true, chaptersCount: 36 },
  { id: 'DEU', nameEs: 'Deuteronomio', nameEn: 'Deuteronomy', isOldTestament: true, chaptersCount: 34 },
  { id: 'JOS', nameEs: 'Josué', nameEn: 'Joshua', isOldTestament: true, chaptersCount: 24 },
  { id: 'JDG', nameEs: 'Jueces', nameEn: 'Judges', isOldTestament: true, chaptersCount: 21 },
  { id: 'RUT', nameEs: 'Rut', nameEn: 'Ruth', isOldTestament: true, chaptersCount: 4 },
  { id: '1SA', nameEs: '1 Samuel', nameEn: '1 Samuel', isOldTestament: true, chaptersCount: 31 },
  { id: '2SA', nameEs: '2 Samuel', nameEn: '2 Samuel', isOldTestament: true, chaptersCount: 24 },
  { id: '1KI', nameEs: '1 Reyes', nameEn: '1 Kings', isOldTestament: true, chaptersCount: 22 },
  { id: '2KI', nameEs: '2 Reyes', nameEn: '2 Kings', isOldTestament: true, chaptersCount: 25 },
  { id: '1CH', nameEs: '1 Crónicas', nameEn: '1 Chronicles', isOldTestament: true, chaptersCount: 29 },
  { id: '2CH', nameEs: '2 Crónicas', nameEn: '2 Chronicles', isOldTestament: true, chaptersCount: 36 },
  { id: 'EZR', nameEs: 'Esdras', nameEn: 'Ezra', isOldTestament: true, chaptersCount: 10 },
  { id: 'NEH', nameEs: 'Nehemías', nameEn: 'Nehemiah', isOldTestament: true, chaptersCount: 13 },
  { id: 'EST', nameEs: 'Ester', nameEn: 'Esther', isOldTestament: true, chaptersCount: 10 },
  { id: 'JOB', nameEs: 'Job', nameEn: 'Job', isOldTestament: true, chaptersCount: 42 },
  { id: 'PSA', nameEs: 'Salmos', nameEn: 'Psalms', isOldTestament: true, chaptersCount: 150 },
  { id: 'PRO', nameEs: 'Proverbios', nameEn: 'Proverbs', isOldTestament: true, chaptersCount: 31 },
  { id: 'ECC', nameEs: 'Eclesiastés', nameEn: 'Ecclesiastes', isOldTestament: true, chaptersCount: 12 },
  { id: 'SNG', nameEs: 'Cantares', nameEn: 'Song of Solomon', isOldTestament: true, chaptersCount: 8 },
  { id: 'ISA', nameEs: 'Isaías', nameEn: 'Isaiah', isOldTestament: true, chaptersCount: 66 },
  { id: 'JER', nameEs: 'Jeremías', nameEn: 'Jeremiah', isOldTestament: true, chaptersCount: 52 },
  { id: 'LAM', nameEs: 'Lamentaciones', nameEn: 'Lamentations', isOldTestament: true, chaptersCount: 5 },
  { id: 'EZK', nameEs: 'Ezequiel', nameEn: 'Ezekiel', isOldTestament: true, chaptersCount: 48 },
  { id: 'DAN', nameEs: 'Daniel', nameEn: 'Daniel', isOldTestament: true, chaptersCount: 12 },
  { id: 'HOS', nameEs: 'Oseas', nameEn: 'Hosea', isOldTestament: true, chaptersCount: 14 },
  { id: 'JOL', nameEs: 'Joel', nameEn: 'Joel', isOldTestament: true, chaptersCount: 3 },
  { id: 'AMO', nameEs: 'Amós', nameEn: 'Amos', isOldTestament: true, chaptersCount: 9 },
  { id: 'OBA', nameEs: 'Abdías', nameEn: 'Obadiah', isOldTestament: true, chaptersCount: 1 },
  { id: 'JON', nameEs: 'Jonás', nameEn: 'Jonah', isOldTestament: true, chaptersCount: 4 },
  { id: 'MIC', nameEs: 'Miqueas', nameEn: 'Micah', isOldTestament: true, chaptersCount: 7 },
  { id: 'NAM', nameEs: 'Nahúm', nameEn: 'Nahum', isOldTestament: true, chaptersCount: 3 },
  { id: 'HAB', nameEs: 'Habacuc', nameEn: 'Habakkuk', isOldTestament: true, chaptersCount: 3 },
  { id: 'ZEP', nameEs: 'Sofonías', nameEn: 'Zephaniah', isOldTestament: true, chaptersCount: 3 },
  { id: 'HAG', nameEs: 'Hageo', nameEn: 'Haggai', isOldTestament: true, chaptersCount: 2 },
  { id: 'ZEC', nameEs: 'Zacarías', nameEn: 'Zechariah', isOldTestament: true, chaptersCount: 14 },
  { id: 'MAL', nameEs: 'Malaquías', nameEn: 'Malachi', isOldTestament: true, chaptersCount: 4 },

  // Nuevo Testamento
  { id: 'MAT', nameEs: 'Mateo', nameEn: 'Matthew', isOldTestament: false, chaptersCount: 28 },
  { id: 'MRK', nameEs: 'Marcos', nameEn: 'Mark', isOldTestament: false, chaptersCount: 16 },
  { id: 'LUK', nameEs: 'Lucas', nameEn: 'Luke', isOldTestament: false, chaptersCount: 24 },
  { id: 'JHN', nameEs: 'Juan', nameEn: 'John', isOldTestament: false, chaptersCount: 21 },
  { id: 'ACT', nameEs: 'Hechos', nameEn: 'Acts', isOldTestament: false, chaptersCount: 28 },
  { id: 'ROM', nameEs: 'Romanos', nameEn: 'Romans', isOldTestament: false, chaptersCount: 16 },
  { id: '1CO', nameEs: '1 Corintios', nameEn: '1 Corinthians', isOldTestament: false, chaptersCount: 16 },
  { id: '2CO', nameEs: '2 Corintios', nameEn: '2 Corinthians', isOldTestament: false, chaptersCount: 13 },
  { id: 'GAL', nameEs: 'Gálatas', nameEn: 'Galatians', isOldTestament: false, chaptersCount: 6 },
  { id: 'EPH', nameEs: 'Efesios', nameEn: 'Ephesians', isOldTestament: false, chaptersCount: 6 },
  { id: 'PHP', nameEs: 'Filipenses', nameEn: 'Philippians', isOldTestament: false, chaptersCount: 4 },
  { id: 'COL', nameEs: 'Colosenses', nameEn: 'Colossians', isOldTestament: false, chaptersCount: 4 },
  { id: '1TH', nameEs: '1 Tesalonicenses', nameEn: '1 Thessalonians', isOldTestament: false, chaptersCount: 5 },
  { id: '2TH', nameEs: '2 Tesalonicenses', nameEn: '2 Thessalonians', isOldTestament: false, chaptersCount: 3 },
  { id: '1TI', nameEs: '1 Timoteo', nameEn: '1 Timothy', isOldTestament: false, chaptersCount: 6 },
  { id: '2TI', nameEs: '2 Timoteo', nameEn: '2 Timothy', isOldTestament: false, chaptersCount: 4 },
  { id: 'TIT', nameEs: 'Tito', nameEn: 'Titus', isOldTestament: false, chaptersCount: 3 },
  { id: 'PHM', nameEs: 'Filemón', nameEn: 'Philemon', isOldTestament: false, chaptersCount: 1 },
  { id: 'HEB', nameEs: 'Hebreos', nameEn: 'Hebrews', isOldTestament: false, chaptersCount: 13 },
  { id: 'JAS', nameEs: 'Santiago', nameEn: 'James', isOldTestament: false, chaptersCount: 5 },
  { id: '1PE', nameEs: '1 Pedro', nameEn: '1 Peter', isOldTestament: false, chaptersCount: 5 },
  { id: '2PE', nameEs: '2 Pedro', nameEn: '2 Peter', isOldTestament: false, chaptersCount: 3 },
  { id: '1JN', nameEs: '1 Juan', nameEn: '1 John', isOldTestament: false, chaptersCount: 5 },
  { id: '2JN', nameEs: '2 Juan', nameEn: '2 John', isOldTestament: false, chaptersCount: 1 },
  { id: '3JN', nameEs: '3 Juan', nameEn: '3 John', isOldTestament: false, chaptersCount: 1 },
  { id: 'JUD', nameEs: 'Judas', nameEn: 'Jude', isOldTestament: false, chaptersCount: 1 },
  { id: 'REV', nameEs: 'Apocalipsis', nameEn: 'Revelation', isOldTestament: false, chaptersCount: 22 },
];

export const VERSES_DATABASE: BibleVerse[] = [
  // Proverbios 31
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 10, textEs: 'Mujer fuerte, ¿quién la hallará? Porque su estima sobrepuja largamente á la de piedras preciosas.', textEn: 'Who can find a worthy woman? For her value is far above rubies.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 11, textEs: 'El corazón de su marido está en ella confiado, y no carecerá de despojo.', textEn: 'The heart of her husband trusts in her. He shall have no lack of gain.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 12, textEs: 'Darále ella bien y no mal, todos los días de su vida.', textEn: 'She does him good, and not harm, all the days of her life.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 13, textEs: 'Buscó lana y lino, y con voluntad labra de sus manos.', textEn: 'She seeks wool and flax, and works eagerly with her hands.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 17, textEs: 'Ciñe sus lomos de fortaleza, y esfuerza sus brazos.', textEn: 'She arms her waist with strength, and makes her arms strong.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 18, textEs: 'Ve que es buena su granjería: su candela no se apaga de noche.', textEn: 'She perceives that her merchandise is profitable. Her lamp doesn’t go out by night.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 20, textEs: 'Extiende sus manos a los pobres; es generosa con quienes pasan necesidad.', textEn: 'She opens her arms to the poor; yes, she extends her hands to the needy.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 25, textEs: 'La fuerza y el respeto por sí misma son su ropa; mira el futuro con una sonrisa.', textEn: 'Strength and dignity are her clothing. She laughs at the time to come.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 26, textEs: 'Abre su boca con sabiduría: y la ley de clemencia está en su lengua.', textEn: 'She opens her mouth with wisdom. Kind instruction is on her tongue.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 27, textEs: 'Cuida la vida de su familia y no come sin trabajar.', textEn: 'She looks well to the ways of her household, and doesn’t eat the bread of idleness.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 28, textEs: 'Levantáronse sus hijos, y llamáronla bienaventurada; y su marido también la alabó:', textEn: 'Her children arise up, and call her blessed; her husband also, and he praiseth her.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 30, textEs: 'Engañosa es la gracia, y vana la hermosura: la mujer que teme á Jehová, ésa será alabada.', textEn: 'Favour is deceitful, and beauty is vain: but a woman that feareth the Lord, she shall be praised.' },
  { bookId: 'PRO', bookNameEs: 'Proverbios', bookNameEn: 'Proverbs', chapter: 31, verseNumber: 31, textEs: 'Reconozcan lo que han hecho sus manos; que sus obras reciban alabanza en el lugar público.', textEn: 'Give her of the fruit of her hands! Let her works praise her in the gates!' },

  // Salmos 23
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 23, verseNumber: 1, textEs: 'Jehová es mi pastor; nada me faltará.', textEn: 'The LORD is my shepherd; I shall lack nothing.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 23, verseNumber: 2, textEs: 'En lugares de delicados pastos me hará descansar; junto á aguas de reposo me pastoreará.', textEn: 'He makes me lie down in green pastures. He leads me beside still waters.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 23, verseNumber: 3, textEs: 'Confortará mi alma; guiaráme por sendas de justicia por amor de su nombre.', textEn: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 23, verseNumber: 4, textEs: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno; porque tú estarás conmigo: tu vara y tu cayado me infundirán aliento.', textEn: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 23, verseNumber: 5, textEs: 'Aderezas mesa delante de mí en presencia de mis angustiadores: ungiste mi cabeza con aceite; mi copa está rebosando.', textEn: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 23, verseNumber: 6, textEs: 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida: y en la casa de Jehová moraré por largos días.', textEn: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord forever.' },

  // Salmos 91
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 91, verseNumber: 1, textEs: 'El que habita al abrigo del Altísimo, morará bajo la sombra del Omnipotente.', textEn: 'He who dwells in the secret place of the Most High will rest in the shadow of the Almighty.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 91, verseNumber: 2, textEs: 'Diré yo de Jehová: Esperanza mía, y castillo mío; mi Dios, en él confiaré.', textEn: 'I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 91, verseNumber: 4, textEs: 'Con sus plumas te cubrirá, y debajo de sus alas estarás seguro: escudo y adarga es su verdad.', textEn: 'He will cover you with his feathers. Under his wings you will take refuge. His faithfulness is your shield and rampart.' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 91, verseNumber: 5, textEs: 'No tendrás temor de espanto nocturno, ni de saeta que vuele de día;', textEn: 'You shall not be afraid of the terror by night, nor of the arrow that flies by day,' },
  { bookId: 'PSA', bookNameEs: 'Salmos', bookNameEn: 'Psalms', chapter: 91, verseNumber: 11, textEs: 'Pues que á sus ángeles mandará acerca de ti, que te guarden en todos tus caminos.', textEn: 'For he will put his angels in charge of you, to guard you in all your ways.' },

  // Mateo 4 (COMPLETO - 25 Versículos)
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 1, textEs: 'Entonces Jesús fue llevado por el Espíritu al desierto para ser tentado por el diablo.', textEn: 'Then Jesus was led up by the Spirit into the wilderness to be tempted by the devil.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 2, textEs: 'Y habiendo ayunado cuarenta días y cuarenta noches, tuvo hambre.', textEn: 'When he had fasted forty days and forty nights, he was hungry afterward.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 3, textEs: 'El tentador se acercó y le dijo: Si eres Hijo de Dios, manda que estas piedras se conviertan en pan.', textEn: 'The tempter came and said to him, “If you are the Son of God, command that these stones become bread.”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 4, textEs: 'Pero Jesús respondió: Está escrito: No solo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.', textEn: 'But he answered, “It is written, ‘Man shall not live by bread alone, but by every word that proceeds out of God’s mouth.’”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 5, textEs: 'Entonces el diablo lo llevó a la ciudad santa, lo puso en la parte más alta del templo,', textEn: 'Then the devil took him into the holy city. He set him on the pinnacle of the temple,' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 6, textEs: 'y le dijo: Si eres Hijo de Dios, échate abajo; porque escrito está: A sus ángeles mandará acerca de ti, y en sus manos te sostendrán, para que no tropieces con tu pie en piedra.', textEn: 'and said to him, “If you are the Son of God, throw yourself down, for it is written, ‘He will command his angels concerning you,’ and, ‘On their hands they will bear you up, so that you don’t dash your foot against a stone.’”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 7, textEs: 'Jesús le dijo: También está escrito: No pondrás a prueba al Señor tu Dios.', textEn: 'Jesus said to him, “Again, it is written, ‘You shall not test the Lord, your God.’”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 8, textEs: 'Otra vez el diablo lo llevó a un monte muy alto, y le mostró todos los reinos del mundo y su gloria.', textEn: 'Again, the devil took him to an exceedingly high mountain, and showed him all the kingdoms of the world and their glory.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 9, textEs: 'Y le dijo: Todo esto te daré, si te arrodillas y me adoras.', textEn: 'He said to him, “I will give you all of these things, if you will fall down and worship me.”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 10, textEs: 'Entonces Jesús le dijo: Vete, Satanás, porque escrito está: Al Señor tu Dios adorarás, y a él solo servirás.', textEn: 'Then Jesus said to him, “Get behind me, Satan! For it is written, ‘You shall worship the Lord your God, and you shall serve him only.’”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 11, textEs: 'Entonces el diablo lo dejó, y unos ángeles vinieron y le servían.', textEn: 'Then the devil left him, and behold, angels came and served him.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 12, textEs: 'Cuando Jesús oyó que Juan había sido encarcelado, se fue a Galilea.', textEn: 'Now when Jesus heard that John was delivered up, he withdrew into Galilee.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 13, textEs: 'Salió de Nazaret y fue a vivir a Capernaúm, junto al mar, en la región de Zabulón y Neftalí,', textEn: 'Leaving Nazareth, he came and lived in Capernaum, which is by the sea, in the region of Zebulun and Naphtali,' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 14, textEs: 'para que se cumpliera lo dicho por medio del profeta Isaías:', textEn: 'that it might be fulfilled which was spoken through Isaiah the prophet, saying,' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 15, textEs: 'Tierra de Zabulón y tierra de Neftalí, camino del mar, al otro lado del Jordán, Galilea de los gentiles;', textEn: '“The land of Zebulun and the land of Naphtali, toward the sea, beyond the Jordan, Galilee of the Gentiles,' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 16, textEs: 'el pueblo que estaba en oscuridad vio una gran luz. Sobre los que vivían en tierra de sombra de muerte, una luz resplandeció.', textEn: 'the people who sat in darkness saw a great light; to those who sat in the region and shadow of death, to them light has dawned.”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 17, textEs: 'Desde entonces Jesús comenzó a predicar y a decir: Arrepiéntanse, porque el reino de los cielos se ha acercado.', textEn: 'From that time, Jesus began to preach, and to say, “Repent! For the Kingdom of Heaven is at hand.”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 18, textEs: 'Mientras Jesús caminaba junto al mar de Galilea, vio a dos hermanos: Simón, llamado Pedro, y Andrés, su hermano. Estaban echando una red al mar, porque eran pescadores.', textEn: 'Walking by the sea of Galilee, he saw two brothers: Simon, who is called Peter, and Andrew, his brother, casting a net into the sea; for they were fishermen.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 19, textEs: 'Jesús les dijo: Síganme, y yo los haré pescadores de hombres.', textEn: 'He said to them, “Come after me, and I will make you fishers for men.”' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 20, textEs: 'Enseguida ellos dejaron las redes y lo siguieron.', textEn: 'They immediately left their nets and followed him.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 21, textEs: 'Al pasar de allí, vio a otros dos hermanos: Jacobo, hijo de Zebedeo, y Juan, su hermano. Estaban en la barca con Zebedeo, su padre, arreglando sus redes. Jesús los llamó.', textEn: 'Going on from there, he saw two other brothers, James the son of Zebedee, and John his brother, in the boat with Zebedee their father, mending their nets. He called them.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 22, textEs: 'Enseguida ellos dejaron la barca y a su padre, y lo siguieron.', textEn: 'They immediately left the boat and their father, and followed him.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 23, textEs: 'Jesús recorría toda Galilea, enseñando en las sinagogas, anunciando las buenas noticias del reino, y sanando toda enfermedad y toda dolencia entre el pueblo.', textEn: 'Jesus went about in all Galilee, teaching in their synagogues, preaching the Good News of the Kingdom, and healing every disease and every sickness among the people.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 24, textEs: 'Su fama se extendió por toda Siria. Le trajeron a todos los que sufrían de diferentes enfermedades y dolores: endemoniados, epilépticos y paralíticos. Y él los sanó.', textEn: 'The report about him went out into all Syria. They brought to him all who were sick, afflicted with various diseases and torments, possessed with demons, epileptics, and paralytics; and he healed them.' },
  { bookId: 'MAT', bookNameEs: 'Mateo', bookNameEn: 'Matthew', chapter: 4, verseNumber: 25, textEs: 'Lo siguieron grandes multitudes de Galilea, de Decápolis, de Jerusalén, de Judea y del otro lado del Jordán.', textEn: 'Great multitudes from Galilee, Decapolis, Jerusalem, Judea, and from beyond the Jordan followed him.' },

  // Filipenses 4
  { bookId: 'PHP', bookNameEs: 'Filipenses', bookNameEn: 'Philippians', chapter: 4, verseNumber: 4, textEs: 'Gozaos en el Señor siempre: otra vez digo: Que os gocéis.', textEn: 'Rejoice in the Lord always! Again I will say, “Rejoice!”' },
  { bookId: 'PHP', bookNameEs: 'Filipenses', bookNameEn: 'Philippians', chapter: 4, verseNumber: 6, textEs: 'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego, con hacimiento de gracias.', textEn: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.' },
  { bookId: 'PHP', bookNameEs: 'Filipenses', bookNameEn: 'Philippians', chapter: 4, verseNumber: 7, textEs: 'Y la paz de Dios, que sobrepuja todo entendimiento, guardará vuestros corazones y vuestros entendimientos en Cristo Jesús.', textEn: 'And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.' },
  { bookId: 'PHP', bookNameEs: 'Filipenses', bookNameEn: 'Philippians', chapter: 4, verseNumber: 8, textEs: 'Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable, todo lo que es de buen nombre; si hay virtud alguna, si alguna alabanza, en esto pensad.', textEn: 'Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; think on these things.' },
];

export function getVersesFor(bookId: string, chapter: number): BibleVerse[] & { isFallback?: boolean; isPartial?: boolean } {
  // 1. Mateo is fully bundled locally with all 28 chapters
  if (bookId === 'MAT') {
    const chIdx = chapter - 1;
    if (matData.chapters && matData.chapters[chIdx]) {
      const verses = matData.chapters[chIdx].map((v: any) => ({
        bookId: 'MAT',
        bookNameEs: 'Mateo',
        bookNameEn: 'Matthew',
        chapter,
        verseNumber: v.verseNumber,
        textEs: v.textEs,
        textEn: v.textEn,
      }));
      return verses as any;
    }
  }

  // 2. Check curated highlights database
  const exact = VERSES_DATABASE.filter(v => v.bookId === bookId && v.chapter === chapter);
  if (exact.length > 0) {
    const result: any = [...exact];
    return result;
  }

  // 3. Needs asynchronous retrieval from the 66 books index
  const emptyResult: any = [];
  emptyResult.isFallback = true;
  return emptyResult;
}

export const DEVOTIONALS: Devotional[] = [
  {
    id: 'dev_purpose',
    titleEs: 'Vestida de Fuerza y Dignidad: Dios Sostiene Cada Etapa de tu Vida',
    titleEn: 'Clothed in Strength and Dignity: God Holds Every Season of Your Life',
    passageRefEs: 'Proverbios 31:25-26 / Jeremías 29:11',
    passageRefEn: 'Proverbs 31:25-26 / Jeremiah 29:11',
    passageTextEs: 'La fuerza y el respeto por sí misma son su ropa; mira el futuro con una sonrisa. Habla con sabiduría y enseña con misericordia.',
    passageTextEn: 'Strength and dignity are her clothing. She laughs at the time to come. She openeth her mouth with wisdom.',
    reflectionEs: 'A veces nos angustiamos tanto intentando controlar lo que viene mañana, como si el futuro dependiera únicamente de nuestras fuerzas. Pero la Biblia dice que la mujer sabia sonríe a lo por venir, no porque no tenga pruebas o días difíciles, sino porque sabe muy bien en quién tiene puesta su confianza.\n\nEstar vestida de fuerza y dignidad no es ponerse una máscara de que todo está perfecto ni vivir fingiendo que no te duele nada. Es sentarte en paz, respirar hondo y recordar que el Señor ya preparó el camino para ti y para los tuyos. Hoy, suelta la necesidad de aprobación de la gente. Dios te ama tal y como eres, y Su gracia te acompaña en cada paso de tu casa.',
    reflectionEn: 'Look, dear heart: we often stress trying to control tomorrow, as if our days rested solely on our shoulders. Yet Scripture says the wise woman smiles at what is to come, not because she lacks trials, but because she knows exactly Who holds her life.\n\nTake a deep breath and rest knowing God is with you.',
    prayerEs: 'Padre amado, hoy te entrego mis miedos y mis dudas del mañana. Enséñame a sonreír con paz, a hablarle a mi familia con ternura y a recordar que mi verdadero valor viene de ti y no de la aprobación del mundo. Abraza mi casa con tu bendición. Amén.',
    prayerEn: 'Loving Father, today I place all my tomorrows into Your hands. Teach me to smile in peace, to speak to my loved ones with kindness, and to rest in Your unconditional love. Amen.',
    moodCategory: 'peace',
    topic: 'Propósito',
  },
  {
    id: 'dev_gratitude',
    titleEs: 'La Belleza de un Corazón Agradecido: Ver a Dios en los Detalles Pequeños',
    titleEn: 'The Beauty of a Grateful Heart: Finding God in the Everyday',
    passageRefEs: 'Salmos 103:1-5 / 1 Tesalonicenses 5:18',
    passageRefEn: 'Psalm 103:1-5 / 1 Thessalonians 5:18',
    passageTextEs: 'Bendice, alma mía, á Jehová, y no olvides ninguno de sus beneficios. El es quien perdona todas tus iniquidades, el que sana todas tus dolencias.',
    passageTextEn: 'Bless the Lord, O my soul, and forget not all his benefits: Who forgiveth all thine iniquities; who healeth all thy diseases.',
    reflectionEs: 'A veces el ajetreo del día nos roba la capacidad de asombro. Nos levantamos pensando en la lista interminable de cosas pendientes y se nos olvida dar gracias por el milagro de abrir los ojos, por el olor del café en la mañana, por el abrazo de un hijo o la risa alrededor de la mesa.\n\nLa gratitud no nace cuando todo sale perfecto; nace cuando decidimos fijar los ojos en la bondad del Señor incluso en medio del cansancio. Cuando le dices a tu alma «bendice al Señor y no olvides ninguno de sus favores», las quejas se disipan y el corazón se llena de una dulzura inexplicable.',
    reflectionEn: 'Daily busyness can easily steal our sense of wonder. Gratitude does not depend on a flawless day; it is a heart decision to notice God\'s tender mercy in the simple joys of home.',
    prayerEs: 'Señor Jesús, gracias por el regalo de este nuevo día, por el pan en mi mesa, por mi gente y por tu fidelidad que nunca falla. Limpia mis ojos para ver tus milagros cotidianos y guarda mi corazón de la queja. Amén.',
    prayerEn: 'Lord Jesus, thank You for the gift of today, for daily bread, for my family, and for Your unfailing kindness. Keep my eyes open to Your small miracles. Amen.',
    moodCategory: 'gratitude',
    topic: 'Gratitud',
  },
  {
    id: 'dev_anxious',
    titleEs: 'Respira Hondo y Suelta el Control: El Señor Cuida de Ti',
    titleEn: 'Breathe Deeply and Let Go: The Lord Is Watching Over You',
    passageRefEs: 'Filipenses 4:6-7 / 1 Pedro 5:7',
    passageRefEn: 'Philippians 4:6-7 / 1 Peter 5:7',
    passageTextEs: 'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego. Y la paz de Dios guardará vuestros corazones.',
    passageTextEn: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.',
    reflectionEs: '¿Cuántas veces nos descubrimos apretando la mandíbula o con el pecho apretado de pura preocupación? Queremos solucionarle la vida a todo el mundo y nos cargamos con pesos que Dios jamás nos pidió llevar sobre la espalda.\n\nDios no quiere que vivas con el alma acelerada. Pedro nos dice con mucha serenidad: «Echa toda tu ansiedad sobre Él, porque Él tiene cuidado de ti». No tienes que resolverlo todo hoy. Dios no está sorprendido ni asustado por tu situación; Él ya está trabajando a tu favor mientras aprendes a descansar.',
    reflectionEn: 'How often do we find ourselves carrying weights God never asked us to shoulder? Peter reminds us tenderly: "Cast all your anxiety on Him, because He cares for you." You don\'t have to fix everything today.',
    prayerEs: 'Padre bueno, aquí estoy con mi mente llena de pensamientos y mi corazón a veces cargado. Te entrego lo que no puedo cambiar ni apurar. Sopla tu paz en mi espíritu, relaja mis hombros y ayúdame a confiar plenamente en ti. Amén.',
    prayerEn: 'Good Father, here I am laying down all my anxious thoughts. Fill my spirit with Your deep peace, ease my worries, and teach me to rest in Your loving hands. Amen.',
    moodCategory: 'anxious',
    topic: 'Paz',
  },
];

export const COMMUNITY_PRAYERS: PrayerCommunityItem[] = [
  {
    id: 'pr_mariana',
    author: 'Mariana',
    titleEs: 'Buscando dirección laboral y nuevas puertas',
    titleEn: 'Job search and guidance',
    contentEs: 'Estoy en medio de un cambio de trabajo. Les pido que me acompañen en oración para no perder la calma y tomar decisiones con sabiduría.',
    contentEn: 'I am in the middle of a career change. Please pray with me to stay peaceful and make wise decisions.',
    topic: 'Peticiones',
    candlesLit: 18,
    timestampLabelEs: 'Hace 2 horas',
    timestampLabelEn: '2 hours ago',
    userIsStandingInTheGap: false,
    lastBlessingVerse: 'El Señor te protegerá de todo mal; cuidará de tu vida. (Salmos 121:7)',
  },
  {
    id: 'pr_anonima',
    author: 'Anónima',
    titleEs: 'Paz y madurez en una conversación familiar',
    titleEn: 'Peace and maturity in family talks',
    contentEs: 'Les pido oración por mi familia. Nos toca hablar de un tema delicado y quiero hacerlo desde el amor, la prudencia y la comprensión, no desde el enojo.',
    contentEn: 'Please pray for my family. We have a delicate talk ahead and I want to speak with grace, maturity, and kindness.',
    topic: 'Peticiones',
    candlesLit: 27,
    timestampLabelEs: 'Hace 4 horas',
    timestampLabelEn: '4 hours ago',
    userIsStandingInTheGap: true,
  },
  {
    id: 'pr_camila',
    author: 'Camila',
    titleEs: 'Acompañando a mi mamá en su salud',
    titleEn: 'Standing by my mother\'s health',
    contentEs: 'Acompáñenme orando por mi mamá. Está en tratamiento y deseo de todo corazón verla recuperada, con fuerzas y llena de ánimo.',
    contentEn: 'Join me in praying for my mother. She is in medical treatment and I long to see her fully restored, strong and joyful.',
    topic: 'Peticiones',
    candlesLit: 41,
    timestampLabelEs: 'Hace 5 horas',
    timestampLabelEn: '5 hours ago',
    userIsStandingInTheGap: false,
  },
  {
    id: 'pr_estudios',
    author: 'Valeria M.',
    titleEs: 'Círculo de lectura bíblica entre amigas',
    titleEn: 'Weekly Scripture Reading Circle',
    contentEs: 'Iniciamos un grupo para leer juntas y conversar de la vida real a la luz de la Palabra. ¡Bienvenidas todas las que quieran sumarse!',
    contentEn: 'We are starting a small group to read scripture and talk about real life. All sisters are warmly welcome!',
    topic: 'Estudios',
    candlesLit: 24,
    timestampLabelEs: 'Hace 6 horas',
    timestampLabelEn: '6 hours ago',
    userIsStandingInTheGap: false,
  },
  {
    id: 'pr_ayuno',
    author: 'Gabriela R.',
    titleEs: 'Tres días de ayuno y oración para ordenar el corazón',
    titleEn: 'Three Days of Fasting and Prayer for Clarity',
    contentEs: 'Esta semana decidí apartar tres días para bajarle al ruido, soltar las prisas y pedir dirección en un proyecto familiar. Quien quiera unirse, aquí estamos.',
    contentEn: 'This week I\'m dedicating 3 days to quiet the noise, surrender rush, and seek guidance for family decisions. Welcome to join!',
    topic: 'Ayuno',
    candlesLit: 35,
    timestampLabelEs: 'Ayer',
    timestampLabelEn: 'Yesterday',
    userIsStandingInTheGap: true,
  },
  {
    id: 'pr_solteras',
    author: 'Lucía T.',
    titleEs: 'Disfrutar esta etapa con alegría y sin prisas',
    titleEn: 'Embracing this season with joy and peace',
    contentEs: 'Pido sabiduría para vivir mi etapa actual con propósito, cuidando mi corazón, aprendiendo a esperar y confiando en los tiempos de Dios.',
    contentEn: 'Seeking wisdom to live my current season with joy and purpose, trusting God\'s timing without anxiety.',
    topic: 'Solteras',
    candlesLit: 19,
    timestampLabelEs: 'Ayer',
    timestampLabelEn: 'Yesterday',
    userIsStandingInTheGap: false,
  },
  {
    id: 'pr_casadas',
    author: 'Sofía D.',
    titleEs: 'Cuidar la complicidad y la ternura en el matrimonio',
    titleEn: 'Nurturing tenderness and partnership in marriage',
    contentEs: 'Oren por mi matrimonio. Entre el trabajo y las rutinas a veces descuidamos los momentos a solas; queremos renovar la paciencia, el perdón y el cariño.',
    contentEn: 'Please pray for my marriage. Amid busy routines, we want to renew our tenderness, patient forgiveness, and quality time together.',
    topic: 'Casadas',
    candlesLit: 52,
    timestampLabelEs: 'Hace 2 días',
    timestampLabelEn: '2 days ago',
    userIsStandingInTheGap: false,
  },
];

export const LIVE_PRAYER_ROOMS: LivePrayerRoom[] = [
  {
    id: 'room_midnight_vigil',
    titleEs: 'Devocional y Oración Comunitaria: Hogares en Paz',
    titleEn: 'Live Devotional & Family Prayer Circle',
    hostName: 'Hermana Abigail S.',
    descriptionEs: 'Videollamada HD en vivo para compartir la Palabra, orar por nuestras familias y sostenernos en la fe.',
    descriptionEn: 'A fresh, deeply encouraging live HD video space to share Scripture and pray in unity.',
    activeCount: 148,
    maxCapacity: 300,
    isLive: true,
    type: 'Videollamada en Vivo',
    scriptureFocus: 'Lamentaciones 2:19 / Proverbios 31:27',
  },
  {
    id: 'room_fasting_esther',
    titleEs: 'Círculo de Estudio Bíblico y Ayuno Comunitario',
    titleEn: 'Community Bible Study & Fasting Circle',
    hostName: 'Débora R. (Mentora)',
    descriptionEs: 'Estudio exegético interactivo en video HD y ruego sosegado, presentando peticiones en unidad.',
    descriptionEn: 'Interactive Bible study and gentle prayer circle bringing petitions before the Lord.',
    activeCount: 182,
    maxCapacity: 500,
    isLive: true,
    type: 'Estudio en Video',
    scriptureFocus: 'Ester 4:16 / Isaías 58:6-9',
  },
  {
    id: 'room_marriage_peace',
    titleEs: 'Videollamada de Matrimonios y Familia: Sanidad y Calma',
    titleEn: 'Live Marriage & Family Restoration Video Room',
    hostName: 'Ruth y Carlos V.',
    descriptionEs: 'Encuentro interactivo Zoom-HD sobre restauración de hogar, perdón real y paz en el matrimonio.',
    descriptionEn: 'Interactive HD room focusing on marriage restoration, forgiveness, and family peace.',
    activeCount: 164,
    maxCapacity: 400,
    isLive: true,
    type: 'Matrimonios HD',
    scriptureFocus: 'Efesios 4:31-32 / 1 Corintios 13:4-8',
  },
  {
    id: 'room_youth_faith',
    titleEs: 'Videollamada de Jóvenes: Fe, Futuro y Propósito',
    titleEn: 'Youth & Young Adults Live Purpose Room',
    hostName: 'Sofía M. y Priscila',
    descriptionEs: 'Espacio dinámico para resolver preguntas de vida real, identidad, universidad y trabajo con la Palabra.',
    descriptionEn: 'Dynamic space for young adults on identity, purpose, and walking in faith.',
    activeCount: 135,
    maxCapacity: 300,
    isLive: true,
    type: 'Jóvenes HD',
    scriptureFocus: '1 Timoteo 4:12 / Jeremías 29:11',
  },
  {
    id: 'room_rest_prov31',
    titleEs: 'Café de Sabiduría y Alabanza: Proverbios 31',
    titleEn: 'Wisdom & Faith Fellowship Coffee Chat',
    hostName: 'Priscila y Lidia',
    descriptionEs: 'Un espacio sereno para compartir reflexiones del día, alentarnos mutuamente y descansar en la gracia del Señor.',
    descriptionEn: 'A warm live fellowship room to share daily reflections and rest in God\'s grace.',
    activeCount: 106,
    maxCapacity: 250,
    isLive: true,
    type: 'Compañerismo HD',
    scriptureFocus: 'Proverbios 31:17,25',
  },
];

export const SHARED_RESOURCES: SharedResourceItem[] = [
  {
    id: 'res_1',
    titleEs: 'Guía de Calma Nocturna: Cerrar el Día en Paz y Soltar el Afán',
    titleEn: 'Nighttime Calm Guide: Ending the Day in Peace and Surrendering Worry',
    type: 'PDF',
    durationEs: 'Guía breve de 8 minutos',
    durationEn: 'Short 8-minute guide',
    descriptionEs: 'Siéntate un ratito, respira hondo y suelta lo que hoy no pudiste resolver. Dios no duerme para que tú puedas descansar tranquila.',
    descriptionEn: 'Take a quiet moment, dear sister. Breathe deeply and release the worries you could not fix today. God watches so you can truly rest.',
    biblicalAnchor: 'Salmos 4:8 / Lucas 2:29-32',
    fullContentEs: `MIRA, CORAZÓN, HABLEMOS DE MUJER A MUJER ANTES DE APAGAR LA LUZ:

I. SUELTA LO QUE QUEDÓ PENDIENTE:
Sé sincera contigo misma: hoy hiciste lo mejor que pudiste con las fuerzas que tenías. Esa lista mental interminable de cosas pendientes no se va a solucionar desvelándote en la almohada ni repasando preocupaciones a las dos de la mañana. Respira despacio, afloja los hombros y entrégaselo todo al Señor. Él ya está en el día de mañana esperándote con misericordias nuevas.

II. UN SALMO PARA ABRIGAR EL ALMA:
«En paz me acostaré, y asimismo dormiré; porque solo tú, Señor, me haces vivir confiada» (Salmos 4:8).
El Creador de los cielos y de la tierra no se cansa ni duerme. Puedes cerrar los ojos con la certeza de que tu casa, tus hijos, tu matrimonio y tu salud están guardados en las manos más seguras del universo.

III. BENDICIÓN SOBRE TU HOGAR:
Agradece por tu cama, por el calor de tu hogar, y declara paz sobre cada habitación. Dios es bueno, te ama profundamente y esta noche te abraza con Su gracia. Duerme en paz.`,
    fullContentEn: `DEAREST SISTER, LET’S HAVE A HEART-TO-HEART BEFORE TURNING OFF THE LIGHTS:

I. RELEASE WHAT REMAINS UNDONE:
Be honest with yourself: you did the absolute best you could today with the strength you had. That endless mental list of things to do will not get solved by tossing and turning, reviewing worries at two in the morning. Breathe slowly, soften your shoulders, and hand it all over to the Lord. He is already in tomorrow, waiting for you with brand-new mercies.

II. A PSALM TO SHELTER YOUR SOUL:
«I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety» (Psalm 4:8).
The Creator of the heavens and the earth never grows weary nor sleeps. You can close your eyes with the certainty that your home, your children, your marriage, and your health are guarded in the safest hands in the universe.

III. BLESSING OVER YOUR HOME:
Give thanks for your bed, for the warmth of your home, and declare peace over every room. God is good, He loves you deeply, and tonight He embraces you with His grace. Sleep in peace.`,
    practicalStepsEs: [
      'Deja el teléfono lejos de la mesita de noche 20 minutos antes de dormir.',
      'Tómate un té caliente o un vaso de agua despacio, dando gracias por tres cosas sencillas que pasaron hoy.',
      'Anota en un papelito lo que te preocupa y di en voz baja: «Señor, esto es tuyo, yo me voy a descansar».',
    ],
    practicalStepsEn: [
      'Put your phone away from your bedside table 20 minutes before sleeping.',
      'Enjoy a warm tea or glass of water slowly, thanking God for three simple blessings today.',
      'Write down what worries you on a slip of paper and whisper: "Lord, this is Yours, I am going to rest now."',
    ],
    imageUrl: '/evening_peace_journal_1791710465851.jpg',
  },
  {
    id: 'res_2',
    titleEs: 'Pausa Serena con el Salmo 23: El Buen Pastor Cuida de Ti',
    titleEn: 'Peaceful Pause with Psalm 23: The Good Shepherd Cares for You',
    type: 'Audio',
    durationEs: '18 min de audio sereno',
    durationEn: '18 min peaceful audio',
    descriptionEs: 'Una conversación del alma para bajar las revoluciones, soltar la prisa y recordar que cuando caminas con Dios, nada te falta.',
    descriptionEn: 'A heart-to-heart reflection to slow down, release the haste, and remember that when you walk with God, you truly lack nothing.',
    biblicalAnchor: 'Salmos 23:1-6 / Juan 10:11-14',
    fullContentEs: `CAMINEMOS DESPACIO POR EL SALMO 23:

1. «El Señor es mi pastor; nada me faltará»
A veces corremos todo el día con el miedo de que no nos va a alcanzar el tiempo, las fuerzas o los recursos. Pero el Señor es tu Pastor personal. Él sabe de qué cosas tienes necesidad antes de que se las pidas. No te faltará la gracia para hoy ni la provisión para mañana.

2. «En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará»
Fíjate en cómo trata Dios a sus ovejas: no nos corretea a latigazos ni nos empuja con prisas angustiosas. Te invita a detenerte junto a aguas mansas, a refrescar el alma y respirar. Si te sientes agotada, no es debilidad: es una invitación a recostarte en Su presencia.

3. «Aunque ande en valle de sombra de muerte, no temeré mal alguno»
Los momentos duros duelen, claro que sí. Pero el valle es un lugar de paso, no tu destino final. No estás sola en medio de la niebla; Su vara y Su cayado te dan aliento.

4. «Unges mi cabeza con aceite; mi copa está rebosando»
El favor de Dios sobre tu vida no depende de que seas perfecta. Eres amada, cuidada y bendecida para ser de bendición a los que amas.`,
    fullContentEn: `LET US WALK SLOWLY THROUGH PSALM 23:

1. «The Lord is my shepherd; I shall not want»
Sometimes we rush all day, fearing we will run out of time, strength, or resources. But the Lord is your personal Shepherd. He knows exactly what you need before you even ask. You will not lack grace for today or provision for tomorrow.

2. «He leadeth me beside the still waters; he restoreth my soul»
Look at how God treats His sheep: He does not chase us with whips or push us with frantic haste. He invites you to pause beside still waters, to refresh your soul and simply breathe. If you feel weary, it is not weakness; it is an invitation to lean back into His presence.

3. «Though I walk through the valley of the shadow of death, I will fear no evil»
Hard times hurt—that is true. But the valley is a place of passage, not your final destination. You are never walking alone in the fog; His rod and His staff bring you comfort.

4. «Thou anointest my head with oil; my cup runneth over»
God’s favor on your life does not depend on you being perfect. You are unconditionally loved, held, and blessed to be a blessing to those you love.`,
    practicalStepsEs: [
      'Ponte cómoda, apóyate en el sillón y cierra los ojos un instante.',
      'Inhala despacio diciendo: «El Señor es mi pastor»; exhala diciendo: «Nada me faltará».',
      'Permítete disfrutar de la quietud sin sentir que deberías estar haciendo otra cosa.',
    ],
    practicalStepsEn: [
      'Get comfortable, relax on your couch, and close your eyes for a moment.',
      'Inhale slowly saying: "The Lord is my shepherd"; exhale saying: "I shall not want."',
      'Allow yourself to fully enjoy the stillness without feeling like you ought to be doing chores.',
    ],
    imageUrl: '/green_pastures_psalm_1791710483327.jpg',
  },
  {
    id: 'res_3',
    titleEs: 'Guía de Ayuno con Sentido: 3 Días para Pausar y Escuchar con el Corazón',
    titleEn: 'Fasting with Purpose: 3 Days to Pause and Listen with the Heart',
    type: 'Ayuno',
    durationEs: 'Guía práctica de 3 días',
    durationEn: '3-Day practical guide',
    descriptionEs: 'El ayuno no es pasar hambre con cara triste ni hacer poses religiosas. Es apagar el ruido del mundo para escuchar la voz de Dios y orar por tu gente.',
    descriptionEn: 'Fasting is not gloomy starvation or a religious performance. It is quieting the world to hear God and pray for your loved ones.',
    biblicalAnchor: 'Isaías 58:6-12 / Ester 4:16 / Mateo 6:16-18',
    fullContentEs: `EL VERDADERO AYUNO QUE NACE DEL AMOR (Isaías 58):

Mi amor, hablemos claro: Dios no necesita que pasemos hambre con cara amargada para convencernos de que nos ama. El ayuno bíblico es un regalo: es decidir voluntariamente bajarle el volumen a la comida, a las redes sociales y al corre-corre cotidiano para abrir un espacio de intimidad profunda con nuestro Padre.

DÍA 1: AYUNAR DE LA QUEJA Y CUIDAR LA BOCA (Isaías 58:1-8)
No tiene ningún sentido dejar de comer si nos la pasamos de mal humor, criticando o contestándole feo a la familia. El ayuno que a Dios le agrada empieza en la lengua: menos queja, cero murmuración y palabras cargadas de dulzura y paciencia en la casa.
Práctica: Toma suficiente agua, ten tu Biblia a mano y cada vez que sientas ganas de quejarte, di una palabra de bendición.

DÍA 2: PONER EL CORAZÓN POR TU GENTE (Ester 4:1-17)
Ester no ayunó para lucirse; ayunó porque amaba a su pueblo. Este día es para interceder con amor maternal y de amiga: por tus hijos, por tu pareja, por esa persona de la familia que está herida o alejada.
Práctica: Escríbeles una nota de cariño o haz una oración sincera bendiciendo el futuro de cada uno con nombre y apellido.

DÍA 3: GOZO Y FUERZAS RENOVADAS (Isaías 58:9-12)
Dios promete que cuando nos desprendemos del egoísmo, «nacerá tu luz como el alba, y tu salvación se dejará ver pronto; y serás como huerto de riego». Sal de este tiempo con una sonrisa, el corazón liviano y lista para repartir amor.
Práctica: Rompe el ayuno con una comidita rica, suave y en gratitud alrededor de tu mesa.`,
    fullContentEn: `TRUE FASTING BORN OF LOVE (Isaiah 58):

My dear, let’s be honest: God does not need us to be hungry with a sour face to convince us He loves us. Biblical fasting is a gift: a voluntary decision to turn down the volume on food, social media, and the daily rush to create space for profound intimacy with our Father.

DAY 1: FASTING FROM COMPLAINT (Isaiah 58:1-8)
It makes no sense to stop eating if we spend the day grumpy, criticizing, or speaking harshly to our families. Fasting that pleases God begins with the tongue: less complaining, zero murmuring, and words filled with sweetness and patience at home.
Practice: Drink plenty of water, keep your Bible close, and every time you feel like complaining, speak a word of blessing instead.

DAY 2: PRAYING FROM THE HEART FOR YOUR PEOPLE (Esther 4:1-17)
Esther did not fast for show; she fasted because she loved her people. This day is to intercede with the heart of a mother or friend: for your children, your spouse, or that family member who is hurting or distant.
Practice: Write them a loving note or offer a sincere prayer blessing their future, mentioning each one by name.

DAY 3: RENEWED JOY AND STRENGTH (Isaiah 58:9-12)
God promises that when we let go of selfishness, «your light will rise in the darkness, and your night will become like the noonday; you will be like a well-watered garden». Come out of this time with a smile, a lighter heart, and ready to share love.
Practice: Break your fast with a gentle, nourishing meal, eating with gratitude around your table.`,
    practicalStepsEs: [
      'Elige tu ayuno con sensatez y cuidando tu salud (puede ser de comidas pesadas, redes o unas horas de la mañana).',
      'Péinate, arréglate y sonríe: el ayuno se vive en secreto con el Padre, con gozo y naturalidad.',
      'Cada vez que sientas apetito, tómalo como un recordatorio dulce para hablar dos minutitos con Jesús.',
    ],
    practicalStepsEn: [
      'Choose your fast wisely, caring for your health (such as skipping heavy meals, social media, or fasting for just the morning hours).',
      'Brush your hair, get ready, and smile: fasting is lived in secret with the Father, with joy and naturalness.',
      'Whenever you feel hunger, take it as a sweet reminder to spend two minutes talking with Jesus.',
    ],
    imageUrl: '/kitchen_fasting_purpose_1791710501041.jpg',
  },
  {
    id: 'res_4',
    titleEs: 'Mujer Real, Fe Real: Proverbios 31 sin Culpa ni Presiones',
    titleEn: 'Real Woman, Real Faith: Proverbs 31 Without Guilt',
    type: 'Video',
    videoDuration: '4:20 min',
    durationEs: 'Cápsula en video de 4 min',
    durationEn: '4-min video reflection',
    descriptionEs: 'Quitémonos la idea de que tenemos que ser superheroínas perfectas que nunca se cansan. Proverbios 31 es una carta de amor que celebra a la mujer sabia.',
    descriptionEn: 'Let go of the pressure to be an unattainable superhero. Proverbs 31 is a celebration of wisdom, love, and grace.',
    biblicalAnchor: 'Proverbios 31:10-31',
    sisterTakeawayEs: 'Dios no busca mujeres perfectas que nunca se cansan; busca corazones sinceros que se dejen abrazar por Su gracia.',
    sisterTakeawayEn: 'God does not seek perfect women who never tire; He seeks sincere hearts willing to embrace His grace.',
    shareableQuote: '«Fuerza y dignidad son su vestidura; y se ríe de lo por venir» — Proverbios 31:25',
    fullContentEs: `UNA MIRADA DESDE EL CORAZÓN A PROVERBIOS 31:

Por años nos vendieron a la mujer de Proverbios 31 como una mujer inalcanzable que cosía a medianoche, compraba viñas antes del desayuno, tenía la casa reluciente y jamás derramaba una lágrima de cansancio. ¡Qué mentira tan pesada nos hemos puesto encima!

El rey Lemuel no escribió ese poema para hacernos sentir culpables ni para ponernos una lista de exigencias imposibles. Lo escribió para honrar y aplaudir a una mujer de carne y hueso que camina con Dios en la realidad de sus días.

1. FUERZA Y DIGNIDAD SON SU VESTIDURA (v. 25):
Tu valor no lo determinan los logros externos, las apariencias ni el aplauso de las redes. Tu dignidad te la dio Dios el día en que te formó con amor.

2. «Y SE RÍE DE LO POR VENIR»:
No se ríe porque no haya problemas económicos o desafíos con los hijos; se ríe porque aprendió a soltar la angustia en Aquel que tiene el control de todo.

3. LA LEY DE LA CLEMENCIA EN SU LENGUA (v. 26):
La mayor fortaleza en nuestro hogar no son los gritos ni la rigidez, sino la ternura, la sonrisa y las palabras que construyen y sanan los corazones de los que amamos.

4. SU LÁMPARA NO SE APAGA DE NOCHE:
No significa que no duermas; significa que tu casa está llena de la luz de Cristo, de calidez y de oración. Puedes descansar tranquila sabiendo que Dios cuida de los tuyos.`,
    fullContentEn: `PROVERBS 31 FROM A GRACE-FILLED HEART:

Proverbs 31 was never a checklist of impossible demands. It is a song of praise celebrating a real woman who trusts God in the midst of daily life.

1. STRENGTH AND DIGNITY ARE HER CLOTHING:
Your worth comes from God's boundless love, not from performance.

2. SHE REJOICES IN TIME TO COME:
Looking at tomorrow with peace because God holds the future.

3. KINDNESS IN HER WORDS:
The greatest power in our homes is love, patience, and encouraging words.

4. HER LAMP DOES NOT GO OUT:
Her home is warmed by Christ's presence and peace.`,
    practicalStepsEs: [
      'Deja de compararte con lo que ves en las redes: tu hogar y tu proceso son únicos y hermosos para Dios.',
      'Hoy mírate al espejo con ternura y dale gracias al Señor por la mujer que está formando en ti.',
      'Sirve a tu familia desde el disfrute y el amor, no desde la obligación o la culpa.',
    ],
    practicalStepsEn: [
      'Stop comparing yourself to social media: your home and journey are unique and beautiful to God.',
      'Look in the mirror with tenderness today and thank the Lord for the woman He is shaping in you.',
      'Serve your family from joy and love, never from obligation or guilt.',
    ],
    imageUrl: '/proverbs_working_woman_1791710521117.jpg',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-book-on-the-sofa-41584-large.mp4',
  },
  {
    id: 'res_5',
    titleEs: 'Sanar el Corazón Herido: Cuando Perdonar Cuesta pero Libera',
    titleEn: 'Healing the Wounded Heart: When Forgiving Is Hard but Sets You Free',
    type: 'Guía',
    durationEs: 'Guía del corazón de 12 min',
    durationEn: '12-minute heart guide',
    descriptionEs: 'Perdonar no es decir que lo que te hicieron estuvo bien ni fingir que no te dolió. Es decidir no quedarte atada al dolor del pasado.',
    descriptionEn: 'Forgiveness does not mean pretending it didn\'t hurt. It is a holy decision to untie yourself from past pain.',
    biblicalAnchor: 'Colosenses 3:12-14 / Salmos 34:18 / Efesios 4:31-32',
    fullContentEs: `HABLEMOS DE CORAZÓN A CORAZÓN SOBRE EL PERDÓN:

Sé lo que duele una decepción, una traición o una palabra dura dicha por alguien a quien amabas con todo el corazón. A veces pensamos que perdonar es justificar la ofensa o convertirnos en tapetes para que nos vuelvan a lastimar. Pero Jesús jamás nos pidió eso.

I. EL PERDÓN ES PARA TU LIBERTAD:
Cuando guardas rencor, la persona que te hirió sigue viviendo gratis en tu mente y amargándote los días. El perdón es la llave que abre la celda de tu propio corazón. Perdonar es decirle a Dios: «Señor, esto me dolió en el alma, pero no voy a dejar que destruya mi presente ni mi futuro; te entrego a esta persona para que seas Tú el Juez justo».

II. DIOS ESTÁ CERCA DE LAS QUEBRANTADAS:
«Cercano está el Señor a los quebrantados de corazón, y salva a los contritos de espíritu» (Salmos 34:18). No tienes que tragar lágrimas a solas. Jesús conoce cada herida, cada desvelo y cada suspiro.

III. VESTIRSE DE MISERICORDIA:
No puedes sanar una herida vieja echándole veneno de amargura. Pídele al Señor Su amor sobrenatural para mirar con ojos de compasión y seguir caminando con el corazón limpio y liviano.`,
    fullContentEn: `HEART REFLECTION ON FORGIVENESS:

I. FORGIVENESS IS FOR YOUR FREEDOM:
Holding resentment lets past hurt occupy your peace. Forgiveness gives the grievance to God so you can breathe freely.

II. GOD IS CLOSE TO THE BROKENHEARTED:
«The Lord is nigh unto them that are of a broken heart» (Psalm 34:18). You never cry alone.

III. CLOTHED IN MERCY:
Ask God for His supernatural grace to walk forward with a tender, unburdened heart.`,
    practicalStepsEs: [
      'Permítete llorar y desahogarte en la presencia de Dios: no escondas el dolor.',
      'Escribe en una hoja lo que te lastimó y luego rómpela o quémala diciendo: «Elijo perdonar y soltar esto hoy».',
      'Pide bendición y paz para esa persona; es el remedio más eficaz contra la amargura.',
    ],
    practicalStepsEn: [
      'Allow yourself to weep and pour out your heart before God: do not hide your pain.',
      'Write what hurt you on paper and tear or burn it saying: "I choose to forgive and release this today."',
      'Ask for blessing and peace upon that person; it is the most effective remedy against bitterness.',
    ],
    imageUrl: '/healing_forgiveness_hug_1791710541738.jpg',
  },
  {
    id: 'res_6',
    titleEs: 'Calma en el Pecho y Paz en la Mente: Descansar en la Palabra',
    titleEn: 'Quiet Strength & Peace of Mind: Resting in His Word',
    type: 'Audio',
    durationEs: '15 min de calma y oración',
    durationEn: '15 min gentle scripture prayer',
    descriptionEs: 'Para esos días en que el pecho se siente abrumado y la prisa no cesa. Dios no te dio espíritu de temor, sino de amor, poder y dominio propio.',
    descriptionEn: 'For days when your chest feels heavy and haste overtakes you. God gave you a spirit of love, power, and calm.',
    biblicalAnchor: 'Filipenses 4:6-7 / 2 Timoteo 1:7 / Salmos 94:19',
    fullContentEs: `CUANDO EL ALMA NECESITA BAJAR EL RUIDO EN SU PRESENCIA:

Mi querida hermana, hablemos un momento con el corazón en la mano y la Palabra por delante. ¿Cuántas veces nos descubrimos respirando cortito, corriendo mentalmente de un pendiente a otro, sintiendo que el pecho se aprieta? 

1. NO TE EXIJAS SER UNA ROCA INMUTABLE:
Sentir cansancio o abrumo no es falta de fe. Somos de carne y hueso. Hasta el rey David exclamaba en el Salmo 94:19: «En la multitud de mis pensamientos dentro de mí, tus consolaciones alegraban mi alma». Jesús conoce tus latidos y no te juzga; te invita a sentarte a Su lado con Su Palabra.

2. EL SANTO EJERCICIO DE ORAR Y SOLTAR:
Dios diseñó tu cuerpo con sabiduría. Al meditar en Sus promesas y respirar profundo, le mandas una señal a tu interior de que estás segura en Sus manos. Afloja las manos, respira profundo y entrégale cada carga en oración.

3. UNA PROMESA PARA ABRIGAR TU DÍA:
«No se afanen por nada. Más bien, en todo, con oración y ruego, y con acción de gracias, presenten sus peticiones delante de Dios. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús» (Filipenses 4:6-7).`,
    fullContentEn: `WHEN YOUR SOUL NEEDS TO LOWER THE NOISE IN HIS PRESENCE:

My dear sister, let us talk for a moment with our hearts wide open and God's Word before us. How many times do we catch ourselves breathing shallowly, rushing mentally from one task to another, feeling our chests tighten with silent anxiety?

1. DO NOT DEMAND OF YOURSELF TO BE AN UNMOVABLE ROCK:
Feeling weary or overwhelmed is not a sign of lacking faith. We are made of flesh and bone. Even King David cried out in Psalm 94:19: «In the multitude of my thoughts within me thy comforts delight my soul». Jesus knows your heartbeat, your thoughts, and your quiet tears. He does not judge you; He invites you to sit beside Him with His Word.

2. THE HOLY PRACTICE OF PRAYER AND SURRENDER:
God designed your body and mind with infinite wisdom. As you meditate on His promises and take slow, deep breaths, you send a signal to your inner self that you are completely safe in His hands. Loosen your grip, relax your shoulders, and surrender every heavy burden to Him in prayer.

3. A PROMISE TO SHIELD YOUR DAY:
«Be careful for nothing; but in everything by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus» (Philippians 4:6-7).`,
    practicalStepsEs: [
      'Toma un vaso de agua fresca despacio, sorbo a sorbo, recordando que Dios cuida de ti.',
      'Pon la mano sobre tu pecho, siente el latido y di en voz alta: «Dios está conmigo, mi vida está en Sus manos».',
      'Lee Filipenses 4:6-7 tres veces con calma, permitiendo que Su paz inunde tu hogar.',
    ],
    practicalStepsEn: [
      'Drink a glass of fresh water slowly, sip by sip, remembering God cares for you.',
      'Place your hand on your chest, feel your heartbeat and say aloud: "God is with me, my life is in His hands."',
      'Read Philippians 4:6-7 three times calmly, letting His peace flood your home.',
    ],
    imageUrl: '/peace_in_storm_1791710564138.jpg',
  },
  {
    id: 'res_7',
    titleEs: 'Orar por los Hijos: Poner su Futuro en las Manos de Dios sin Miedo',
    titleEn: 'Praying for Our Children: Placing Their Future in God\'s Hands',
    type: 'Video',
    videoDuration: '5:45 min',
    durationEs: 'Cápsula en video de 5 min',
    durationEn: '5-min video reflection',
    descriptionEs: 'El mayor regalo que una madre puede darle a sus hijos no es el control asfixiante, sino un cerco diario de rodillas y bendición que los acompañe dondequiera que vayan.',
    descriptionEn: 'The greatest gift for children is not anxious hovering, but a daily covering of prayer and blessing.',
    biblicalAnchor: 'Salmos 127:3-5 / Lamentaciones 2:19 / Isaías 54:13',
    sisterTakeawayEs: 'Nuestros hijos están más seguros en las manos de Dios que en nuestros intentos desesperados de controlarlo todo.',
    sisterTakeawayEn: 'Our children are safer in God\'s hands than in our desperate attempts to control everything.',
    shareableQuote: '«Derrama como agua tu corazón ante la presencia del Señor; alza tus manos a él por la vida de tus pequeñitos» — Lamentaciones 2:19',
    fullContentEs: `EL CERCO DE ORACIÓN DE UNA MADRE:

Si hay algo que nos quita el sueño a las mamás, es el bienestar y el futuro de nuestros hijos. Este mundo a veces da miedo con sus influencias, pero déjame recordarte una verdad eterna: Dios los ama infinitamente más de lo que tú o yo seríamos capaces de amarlos.

I. DERRAMA TU CORAZÓN COMO AGUA:
«Levántate, da voces en la noche, al comenzar las vigilias; derrama como agua tu corazón ante la presencia del Señor; alza tus manos a él por la vida de tus pequeñitos» (Lamentaciones 2:19). Tu oración tiene poder. Aunque ellos no te vean, cada palabra que dices en secreto construye un muro de protección espiritual a su alrededor.

II. SUELTA LA TENTACIÓN DEL CONTROL ASFIXIANTE:
No podemos estar presentes en cada salón de clases, en cada esquina ni en cada conversación que tienen en el teléfono. Pero el Espíritu Santo sí está allí. Cuando oras por ellos, estás encomendando sus pasos al mejor Guía.

III. DECLARA BENDICIÓN SOBRE ELLOS:
Todos los hijos serán enseñados por el Señor, y grande será su paz (Isaías 54:13). Que lo último que escuchen al salir de casa no sea un grito ni un regaño, sino: «Dios te bendiga, mi amor, el Señor guarde tus pasos».`,
    fullContentEn: `A MOTHER'S SACRED COVERING OF PRAYER:

If there is one thing that steals sleep from mothers, it is the well-being, safety, and future of our children. This world can feel daunting with its surrounding influences, but let me remind you of an eternal, comforting truth: God loves your children infinitely more than you or I ever could.

I. POUR OUT YOUR HEART LIKE WATER:
«Arise, cry out in the night: in the beginning of the watches pour out thine heart like water before the face of the Lord: lift up thy hands toward him for the life of thy young children» (Lamentations 2:19). Your quiet prayers carry immense power. Even when your children do not see you, every word you speak in secret builds a fortress of spiritual protection around their lives.

II. RELEASE THE TEMPTATION OF ANXIOUS HOVERING:
We cannot be present in every classroom, on every street corner, or in every conversation they have on their phones. But the Holy Spirit is right there with them. When you pray for them, you are entrusting their steps to the faithful Guide.

III. DECLARE DAILY BLESSING OVER THEM:
«And all thy children shall be taught of the Lord; and great shall be the peace of thy children» (Isaiah 54:13). May the last thing they hear when leaving home not be a harsh word or a scold, but: "God bless you, my love; may the Lord guard your steps."`,
    practicalStepsEs: [
      'Acércate a su cama cuando duerman (o míralos con cariño si son grandes) y ora bendición sobre su mente, ojos y pies.',
      'Sustituye la queja sobre sus conductas por una petición constante de sabiduría a Dios.',
      'Diles todos los días una palabra de afirmación que les recuerde lo valiosos que son.',
    ],
    practicalStepsEn: [
      'Approach their beds while they sleep (or look upon them with love if grown) and pray blessing over their minds, eyes, and steps.',
      'Replace complaints about behavior with a constant petition for wisdom to God.',
      'Speak an encouraging word of affirmation to them every day.',
    ],
    imageUrl: '/mother_praying_child_1791710588081.jpg',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-morning-sunlight-entering-through-a-window-41566-large.mp4',
  },
  {
    id: 'res_8',
    titleEs: 'Cómo Leer y Disfrutar la Biblia desde Cero: Sin Prisas ni Miedo a Equivocarte',
    titleEn: 'How to Read & Delight in Scripture: Simple, Unhurried & Without Fear',
    type: 'Guía',
    durationEs: 'Guía esencial de 10 min',
    durationEn: '10-minute essential guide',
    descriptionEs: 'La Biblia no es un libro aburrido ni un examen para teólogos expertos. Es la carta de amor de un Padre que quiere hablarte al corazón mientras te tomas tu café.',
    descriptionEn: 'The Bible is not a dry textbook or an exam. It is a love letter from your Father speaking directly to your daily life.',
    biblicalAnchor: 'Salmos 119:105 / 2 Timoteo 3:16-17 / Juan 6:63',
    fullContentEs: `CÓMO ENAMORARTE DE LA PALABRA DE DIOS:

A muchas mujeres les da pena admitir que a veces abren la Biblia y no entienden nada, o que empiezan por Génesis con todo el entusiasmo y se quedan atascadas en Levítico contando leyes de ofrendas. ¡Tranquila! A todas nos ha pasado.

1. NO EMPIECES POR LO MÁS COMPLICADO:
Si estás comenzando o quieres renovar tu hábito, empieza por el Evangelio de Juan para conocer el corazón de Jesús, o por los Salmos y Proverbios para encontrar consuelo y sabiduría diaria. Es como empezar a probar un manjar delicioso bocado a bocado.

2. LEE CON UN CUADERNO Y UN LÁPIZ:
La Biblia no se lee como una novela para acabarla rápido; se mastica despacio. Lee solo tres o cuatro versículos al día. Hazte tres preguntas sencillas:
- ¿Qué me dice este pasaje sobre quién es Dios?
- ¿Qué me promete o de qué me advierte?
- ¿Cómo puedo aplicar esto hoy con mi familia o en mi trabajo?

3. LÁMPARA ES A MIS PIES TU PALABRA:
El Salmista dice que la Palabra es lumbrera a nuestros pies, no un faro gigante que ilumina los próximos diez años. Alumbra solo el paso que vas a dar hoy. Lee poquito, reflexiona mucho y habla con Dios sobre lo que leíste.`,
    fullContentEn: `HOW TO FALL IN LOVE WITH GOD'S WORD:

Many women feel embarrassed to admit that sometimes they open the Bible and feel lost, or that they start Genesis with great enthusiasm only to get stuck in Leviticus tracking lists of offerings. Take a gentle breath! Every single one of us has been there.

1. DO NOT START WITH THE MOST COMPLICATED BOOKS:
If you are starting out or wanting to refresh your daily habit, begin with the Gospel of John to encounter the warm heart of Jesus, or the Psalms and Proverbs for daily comfort and practical wisdom. It is like tasting a delicious feast slowly, bite by bite.

2. READ WITH A NOTEBOOK AND A PEN:
The Bible is not a dry textbook or a novel to finish quickly; it is savored slowly. Read just three or four verses a day and ask yourself three simple questions:
- What does this passage reveal about who God is?
- What promise can I rest in, or what loving warning does He give?
- How can I live this out today in my home or work?

3. A LAMP UNTO MY FEET IS THY WORD:
The Psalmist says God's Word is a lamp unto our feet, not a giant floodlight illuminating the next ten years. It illuminates only the exact step you are taking today. Read a little, reflect deeply, and talk with God about what you read.`,
    practicalStepsEs: [
      'Elige una hora agradable del día: las mañanas con tu té o unos minutos antes de acostarte.',
      'Pide en oración antes de abrirla: «Espíritu Santo, háblame a mí hoy con amor».',
      'Subraya ese versículo que te tocó el corazón y llévalo contigo en la mente durante el día.',
    ],
    practicalStepsEn: [
      'Choose a pleasant time of day: mornings with tea or a few moments before sleep.',
      'Pray before opening it: "Holy Spirit, speak to my heart with love today."',
      'Underline the verse that touched your heart and carry it in your mind throughout the day.',
    ],
    imageUrl: '/delight_reading_bible_1791710614304.jpg',
  },
];

export const SEMINAR_COURSES: SeminarCourse[] = [
  {
    id: 'sem_nocturne',
    imageUrl: '/evening_rest_peace_1791710641075.jpg',
    titleEs: 'El Arte de Soltar y Descansar: Cuando el Alma Aprende a Parar',
    titleEn: 'The Art of Resting and Letting Go: When the Soul Learns to Pause',
    subtitleEs: 'Aprender a respirar, soltar el control de todo y confiar en que Dios cuida de tu casa',
    subtitleEn: 'Learning to breathe, surrender control, and trust God with your household',
    levelEs: 'Seminario del Corazón',
    levelEn: 'Heart Seminary',
    hoursEstimated: 12,
    lessonCount: 4,
    topics: ['Reposo', 'Silencio', 'Oración', 'Fe', 'Ansiedad'],
    descriptionEs: 'Un curso íntimo, profundo y lleno de ternura para aprender a desarmar la prisa, apagar la culpa de descansar y vivir bajo el ritmo suave de la gracia de Jesús.',
    descriptionEn: 'An intimate, deeply encouraging course on dismantling haste, releasing rest guilt, and living in Christ\'s gentle pace.',
    bibliography: [
      'Heschel, Abraham Joshua. El Shabat: Su significado para el hombre moderno.',
      'Nouwen, Henri. El camino del corazón: Soledad, silencio y oración.',
      'Reflexiones bíblicas sobre la paz en el hogar y el reposo del alma.',
    ],
    lessons: [
      {
        id: 'nl_1',
        order: 1,
        titleEs: 'El Cansancio no es Pecado: Aprender a Parar sin Culpa',
        titleEn: 'Weariness Is Not a Sin: Pausing Without Guilt',
        focusEs: 'Entender que el descanso fue creado por Dios en el Génesis. Parar no es perder tiempo; es declarar con humildad que el mundo lo sostiene Dios y no nosotras.',
        focusEn: 'Understanding that rest was instituted by God in Genesis. Pausing is an act of trust.',
        scriptures: ['Génesis 2:1-3', 'Éxodo 20:8-11', 'Marcos 6:31'],
        practiceEs: 'Aparta esta tarde 20 minutos para tomarte un café o té a solas con Dios, sin el teléfono y sin pensar en pendientes.',
        practiceEn: 'Set aside 20 quiet minutes with coffee or tea, no phone, simply resting in God\'s presence.',
        finalPromptEs: '¿Qué cosas sientes que se caerían si tú te detienes a descansar? ¿Puedes confiárselas a Dios hoy?',
        finalPromptEn: 'What do you fear would fall apart if you pause? Can you entrust it to God today?',
      },
      {
        id: 'nl_2',
        order: 2,
        titleEs: 'Desarmar el Afán Mental en la Noche',
        titleEn: 'Dismantling Mental Rush at Night',
        focusEs: 'Cómo aprender a dejar las cargas en las manos de Jesús al acostarnos, apagando la conversación interna de la preocupación.',
        focusEn: 'How to release worries to Jesus at bedtime, quieting anxious internal chatter.',
        scriptures: ['Salmos 127:1-2', 'Filipenses 4:6-7', '1 Pedro 5:7'],
        practiceEs: 'Escribe en un papel las 3 cosas que más te preocupan, ponlas dentro de tu Biblia y di: «Señor, cuídalas Tú mientras duermo».',
        practiceEn: 'Write your 3 biggest worries on paper, place it inside your Bible, and trust God to watch over them.',
        finalPromptEs: '¿Qué preocupación de tus hijos o de tu familia necesitas entregarle a Dios con las manos abiertas?',
        finalPromptEn: 'What family concern do you need to surrender into God\'s open hands?',
      },
      {
        id: 'nl_3',
        order: 3,
        titleEs: 'El Yugo Fácil: Caminar al Ritmo de Jesús',
        titleEn: 'The Easy Yoke: Walking at Jesus\'s Pace',
        focusEs: 'Jesús nos prometió descanso para nuestras almas, no más cargas religiosas. Aprender a discernir lo que Dios nos pide de lo que la gente nos exige.',
        focusEn: 'Jesus promised rest for our souls, not religious burdens. Discerning God\'s voice from human expectations.',
        scriptures: ['Mateo 11:28-30', 'Lucas 10:38-42'],
        practiceEs: 'Elige una sola actividad de tu semana que te robe la paz y no sea esencial, y atrévete a decir «no» con amor.',
        practiceEn: 'Choose one non-essential activity draining your peace and gently say "no" in love.',
        finalPromptEs: '¿En qué áreas de tu vida estás viviendo como Marta (afanada) cuando Jesús te invita a ser como María a Sus pies?',
        finalPromptEn: 'Where are you living anxiously like Martha when Jesus invites you to sit at His feet like Mary?',
      },
      {
        id: 'nl_4',
        order: 4,
        titleEs: 'Un Hogar que Respira Paz',
        titleEn: 'A Home That Breathes Peace',
        focusEs: 'Cómo el descanso interior de una mujer transforma la atmósfera de toda la casa, llevando calma y ternura a quienes la rodean.',
        focusEn: 'How an inner soul rest transforms the atmosphere of an entire home.',
        scriptures: ['Proverbios 14:1', 'Isaías 32:17-18'],
        practiceEs: 'Pon una música suave de alabanza o silencio en la casa al atardecer y recibe a tu gente con una sonrisa cálida.',
        practiceEn: 'Play gentle praise or embrace quiet at dusk, welcoming your loved ones with a warm smile.',
        finalPromptEs: '¿Cómo cambia el ambiente de tu casa cuando estás tranquila y descansada en Dios?',
        finalPromptEn: 'How does the atmosphere in your home change when you are rested in God?',
      },
    ],
  },
  {
    id: 'sem_family',
    titleEs: 'Edificar el Hogar en Gracia: Cero Perfección, Mucho Perdón',
    titleEn: 'Building Home with Grace: Zero Perfection, Abundant Forgiveness',
    subtitleEs: 'Consejos del corazón para el matrimonio, los hijos y la convivencia diaria con Dios en el centro',
    subtitleEn: 'Heart wisdom for marriage, children, and everyday family life with God at the center',
    levelEs: 'Vida y Familia',
    levelEn: 'Life & Family',
    hoursEstimated: 16,
    lessonCount: 4,
    topics: ['Sabiduría', 'Paciencia', 'Amor', 'Comunidad', 'Gracia'],
    descriptionEs: 'La familia no se sostiene con perfección de revista, sino con abrazos largos, perdón rápido y mucho amor de Dios en la cocina y la sala.',
    descriptionEn: 'Families thrive not on staged magazine perfection, but on warm hugs, prompt forgiveness, and God\'s grace in daily life.',
    bibliography: [
      'Proverbios de Salomón: La sabiduría para el hogar.',
      'Efesios 4 y 5: Caminar en amor y mutua sumisión.',
      'Reflexiones prácticas de matrimonio y crianza con propósito.',
    ],
    lessons: [
      {
        id: 'fl_1',
        order: 1,
        titleEs: 'La Ley de la Ternura en la Boca',
        titleEn: 'The Law of Kindness on Your Tongue',
        focusEs: 'El poder que tienen nuestras palabras para bendecir o herir en casa. Aprender a respirar antes de hablar cuando hay tensión.',
        focusEn: 'The power of our words to build or wound. Breathing before speaking in tense moments.',
        scriptures: ['Proverbios 15:1', 'Proverbios 31:26', 'Santiago 1:19'],
        practiceEs: 'Hoy proponte no levantar la voz en todo el día; responde con tono suave y mira a los ojos a tu gente con cariño.',
        practiceEn: 'Today consciously speak softly, making warm eye contact with your family.',
        finalPromptEs: '¿Qué palabras de aliento le hacen falta escuchar a tu esposo, a tus hijos o a tus seres queridos hoy?',
        finalPromptEn: 'What words of encouragement do your spouse or children need to hear today?',
      },
      {
        id: 'fl_2',
        order: 2,
        titleEs: 'El Milagro de Perdonar Rápido',
        titleEn: 'The Miracle of Forgiving Promptly',
        focusEs: 'No irnos a dormir con enojo en el corazón. Cómo el perdón diario mantiene limpios los canales del amor en el matrimonio y la familia.',
        focusEn: 'Not letting the sun go down on anger. How daily forgiveness keeps love flowing.',
        scriptures: ['Efesios 4:26-32', 'Colosenses 3:12-14'],
        practiceEs: 'Si hay una pequeña molestia guardada de estos días, da el primer paso: acércate, dale un abrazo y di «te amo, estemos en paz».',
        practiceEn: 'Take the first step to clear small resentments: give a hug and say "I love you, let\'s be at peace".',
        finalPromptEs: '¿A quién necesitas perdonar hoy para que tu corazón vuelva a estar liviano y lleno de gozo?',
        finalPromptEn: 'Who do you need to forgive today so your heart feels light and joyful again?',
      },
      {
        id: 'fl_3',
        order: 3,
        titleEs: 'Hijos en las Manos del Padre: Guiar sin Asfixiar',
        titleEn: 'Children in the Father\'s Hands: Guiding with Love',
        focusEs: 'La mejor herencia para los hijos no son las exigencias de perfección, sino ver a mamá orando, amando y confiando en Dios por ellos.',
        focusEn: 'The greatest legacy for children is watching a mother pray, love, and trust God for them.',
        scriptures: ['Deuteronomio 6:6-9', 'Proverbios 22:6', 'Salmos 127:3-5'],
        practiceEs: 'Dedícale 10 minutos exclusivos a cada hijo hoy, escuchándolos con el corazón sin darles sermones.',
        practiceEn: 'Give 10 undivided minutes to your children today, listening with genuine love without lecturing.',
        finalPromptEs: '¿Qué sueño o preocupación sobre el futuro de tus hijos estás lista para entregar en las manos de Dios?',
        finalPromptEn: 'What dream or worry about your children are you ready to place in God\'s hands?',
      },
      {
        id: 'fl_4',
        order: 4,
        titleEs: 'La Mesa Compartida: El Lugar de los Recuerdos',
        titleEn: 'The Shared Table: Gathering in Love',
        focusEs: 'Hacer de la mesa de comer un santuario de risa, agradecimiento y comunión sincera en medio de los días ocupados.',
        focusEn: 'Making the dining table a sanctuary of laughter, gratitude, and warm fellowship.',
        scriptures: ['Hechos 2:46-47', 'Salmos 128:1-4'],
        practiceEs: 'Prepara una cena sencilla, enciende una velita en el centro de la mesa y pregunten: «¿Por qué damos gracias hoy?».',
        practiceEn: 'Prepare a simple meal, light a candle on the table, and ask: "What are we thankful for today?"',
        finalPromptEs: '¿Cómo puedes hacer de tu mesa un lugar donde todos en tu casa deseen sentarse y compartir?',
        finalPromptEn: 'How can you make your table a place where everyone loves to sit and linger?',
      },
    ],
    imageUrl: '/seminar_family_grace.jpg',
  },
  {
    id: 'sem_identity',
    titleEs: 'Descansar en Quién Eres: Amada por Dios sin Tener que Demostrar Nada',
    titleEn: 'Resting in Who You Are: Deeply Loved by God with Nothing to Prove',
    subtitleEs: 'Sanar la necesidad de complacer a todos y afirmar tu valor en la mirada del Padre',
    subtitleEn: 'Healing the need to please everyone and anchoring your worth in the Father\'s eyes',
    levelEs: 'Crecimiento Personal',
    levelEn: 'Personal Growth',
    hoursEstimated: 14,
    lessonCount: 4,
    topics: ['Identidad', 'Esperanza', 'Sanidad', 'Gratitud', 'Alabanza'],
    descriptionEs: 'Un recorrido liberador para soltar las expectativas de los demás, sanar comparaciones y caminar con la seguridad de saberte hija amada de Dios.',
    descriptionEn: 'A liberating journey to let go of external expectations, heal comparison, and walk with the joyful security of God\'s daughter.',
    bibliography: [
      'Salmo 139: Formada admirablemente por Dios.',
      'Romanos 8: Nada puede separarnos del amor de Cristo.',
      'Estudios bíblicos sobre la gracia y la identidad en el Nuevo Testamento.',
    ],
    lessons: [
      {
        id: 'il_1',
        order: 1,
        titleEs: 'Dejar de Complacer a Todo el Mundo',
        titleEn: 'Freedom from People-Pleasing',
        focusEs: 'Aprender que no naciste para cumplir las expectativas de todos, sino para caminar en obediencia humilde y libre ante Dios.',
        focusEn: 'Learning that your worth is not tied to pleasing everyone, but to walking in God\'s grace.',
        scriptures: ['Gálatas 1:10', 'Proverbios 29:25', '1 Tesalonicenses 2:4'],
        practiceEs: 'Identifica una situación donde sueles decir «sí» por miedo a defraudar, y pide sabiduría a Dios para poner un límite sano.',
        practiceEn: 'Identify where you say "yes" out of fear of letting others down, and ask God for wisdom to set healthy boundaries.',
        finalPromptEs: '¿Qué opiniones humanas han tenido demasiado peso en tu corazón últimamente?',
        finalPromptEn: 'Whose human opinions have been weighing too heavily on your heart lately?',
      },
      {
        id: 'il_2',
        order: 2,
        titleEs: 'Formada con Amor y Detalle',
        titleEn: 'Fearfully and Wonderfully Made',
        focusEs: 'El Salmo 139 como bálsamo para el alma: Dios conoce tus días, tus lágrimas, tus dones y tu historia completa, y te ama con pasión infinita.',
        focusEn: 'Psalm 139 as a balm: God knows your story, your tears, and loves you with infinite tenderness.',
        scriptures: ['Salmos 139:1-18', 'Jeremías 1:5', 'Efesios 2:10'],
        practiceEs: 'Lee en voz alta el Salmo 139:14 poniendo tu propio nombre y dale gracias a Dios por la forma en que te creó.',
        practiceEn: 'Read Psalm 139:14 aloud inserting your name, thanking God for how He lovingly formed you.',
        finalPromptEs: '¿Qué parte de tu historia o de tu carácter necesitas abrazar con gratitud en lugar de juzgarte?',
        finalPromptEn: 'What part of your story or character do you need to embrace with gratitude instead of self-judgment?',
      },
      {
        id: 'il_3',
        order: 3,
        titleEs: 'Apagar la Voz de la Comparación',
        titleEn: 'Silencing the Comparison Trap',
        focusEs: 'La comparación es la ladrona del gozo. Dios no tiene dos hijas iguales; tu camino, tu ritmo y tus frutos tienen un propósito único y especial.',
        focusEn: 'Comparison steals joy. God has no duplicate daughters; your pace and fruit have a unique purpose.',
        scriptures: ['2 Corintios 10:12', 'Gálatas 6:4-5', '1 Corintios 12:12-27'],
        practiceEs: 'Haz una lista de 5 bendiciones y dones específicos que Dios ha puesto en tu vida y en tu casa, y celébralos hoy.',
        practiceEn: 'List 5 specific blessings and gifts God has placed in your life, and celebrate them today.',
        finalPromptEs: '¿En qué momentos sientes la tentación de compararte con otras mujeres y cómo puedes volver la mirada a Jesús?',
        finalPromptEn: 'When are you tempted to compare yourself, and how can you turn your gaze back to Jesus?',
      },
      {
        id: 'il_4',
        order: 4,
        titleEs: 'Caminar con la Cabeza en Alto y el Corazón en Paz',
        titleEn: 'Walking with Quiet Dignity and a Peaceful Heart',
        focusEs: 'La verdadera madurez espiritual no es la rigidez, sino la alegría serena de quien se sabe perdonada, redimida y guiada por el buen Padre.',
        focusEn: 'True spiritual maturity is the serene joy of knowing you are forgiven, redeemed, and held by a good Father.',
        scriptures: ['Romanos 8:31-39', 'Sofonías 3:17', 'Filipenses 4:4-7'],
        practiceEs: 'Comienza tu mañana sonriendo y diciendo: «Señor, hoy camino contigo. Tu amor me basta».',
        practiceEn: 'Start your morning smiling and whispering: "Lord, today I walk with You. Your love is enough".',
        finalPromptEs: '¿Cómo vivirías hoy si estuvieras 100% segura de que nada puede separarte del amor de Dios?',
        finalPromptEn: 'How would you live today if you were 100% certain that nothing can separate you from God\'s love?',
      },
    ],
    imageUrl: '/beloved_daughter_joy_1791710671396.jpg',
  },
];

export const STREAK_MILESTONES: StreakMilestone[] = [
  { daysRequired: 3, titleEs: 'Primeros Pasos de Paz', titleEn: 'First Steps of Peace', descriptionEs: '3 momentos apartando un tiempo sagrado de calma para tu corazón con Dios.', descriptionEn: '3 moments taking an unhurried, quiet pause with God.', badgeIconName: 'flame' },
  { daysRequired: 7, titleEs: 'Semana de Gracia', titleEn: 'A Week of Grace', descriptionEs: '7 pausas cuidando tu espíritu en la lectura reposada y la oración sin prisas.', descriptionEn: '7 gentle pauses nurturing your spirit in scripture and prayer.', badgeIconName: 'candle' },
  { daysRequired: 14, titleEs: 'Calma en lo Cotidiano', titleEn: 'Quiet Everyday Peace', descriptionEs: '14 encuentros aprendiendo a soltar las prisas y descansar bajo Su favor.', descriptionEn: '14 encounters learning to release rush and rest under His favor.', badgeIconName: 'lamp' },
  { daysRequired: 30, titleEs: 'Refugio de Madurez', titleEn: 'A Sanctuary of Maturity', descriptionEs: '30 días construyendo un espacio interior de sosiego, gracia y madurez espiritual.', descriptionEn: '30 days building an inner space of quiet spiritual maturity.', badgeIconName: 'altar' },
  { daysRequired: 50, titleEs: 'Firmeza y Serenidad', titleEn: 'Steadfast and Serene', descriptionEs: '50 pausas siendo testimonio de una fe honesta, descansada en Dios y sin poses.', descriptionEn: '50 pauses reflecting an honest, restful faith in God without pretense.', badgeIconName: 'star' },
  { daysRequired: 100, titleEs: 'Vida Anclada en la Palabra', titleEn: 'Life Anchored in Scripture', descriptionEs: '100 encuentros en Su presencia. La sabiduría y la paz del Padre fluyen naturalmente en tus días.', descriptionEn: '100 encounters in His presence. God\'s wisdom and peace flow naturally through your days.', badgeIconName: 'sun' },
];
