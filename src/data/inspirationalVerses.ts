export interface InspirationalVerse {
  id: number;
  bookOrder: number;
  chapter: number;
  verseNumber: number;
  reference: string;
  texts: {
    RVR1960: string;
    NVI: string;
    NTV: string;
    [key: string]: string;
  };
}

export const INSPIRATIONAL_VERSES: InspirationalVerse[] = [
  {
    id: 1,
    bookOrder: 43,
    chapter: 3,
    verseNumber: 16,
    reference: 'Juan 3:16',
    texts: {
      RVR1960: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
      NVI: 'Porque tanto amó Dios al mundo que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.',
      NTV: 'Pues Dios amó tanto al mundo que dio a su único Hijo, para que todo el que crea en él no se pierda, sino que tenga vida eterna.',
    },
  },
  {
    id: 2,
    bookOrder: 50,
    chapter: 4,
    verseNumber: 13,
    reference: 'Filipenses 4:13',
    texts: {
      RVR1960: 'Todo lo puedo en Cristo que me fortalece.',
      NVI: 'Cristo me da fuerzas para enfrentarme a toda clase de situaciones.',
      NTV: 'Pues todo lo puedo hacer por medio de Cristo, quien me da las fuerzas.',
    },
  },
  {
    id: 3,
    bookOrder: 19,
    chapter: 23,
    verseNumber: 1,
    reference: 'Salmos 23:1',
    texts: {
      RVR1960: 'Jehová es mi pastor; nada me faltará.',
      NVI: 'El Señor es mi pastor, nada me falta;',
      NTV: 'El Señor es mi pastor; tengo todo lo que necesito.',
    },
  },
  {
    id: 4,
    bookOrder: 20,
    chapter: 3,
    verseNumber: 5,
    reference: 'Proverbios 3:5',
    texts: {
      RVR1960: 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia.',
      NVI: 'Confía en el Señor de todo corazón, y no en tu propia inteligencia.',
      NTV: 'Confía en el Señor con todo tu corazón; no dependas de tu propio entendimiento.',
    },
  },
  {
    id: 5,
    bookOrder: 24,
    chapter: 29,
    verseNumber: 11,
    reference: 'Jeremías 29:11',
    texts: {
      RVR1960: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
      NVI: 'Porque yo sé muy bien los planes que tengo para ustedes —afirma el Señor—, planes de bienestar y no de calamidad, a fin de darles un futuro y una esperanza.',
      NTV: 'Pues yo sé los planes que tengo para ustedes —dice el Señor—. Son planes para lo bueno y no para lo malo, para darles un futuro y una esperanza.',
    },
  },
  {
    id: 6,
    bookOrder: 23,
    chapter: 40,
    verseNumber: 31,
    reference: 'Isaías 40:31',
    texts: {
      RVR1960: 'pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.',
      NVI: 'pero los que confían en el Señor renovarán sus fuerzas; volarán como las águilas: correrán y no se fatigarán, caminarán y no se cansarán.',
      NTV: 'pero los que confían en el Señor encontrarán nuevas fuerzas; volarán alto, como con alas de águila. Correrán y no se cansarán; caminarán y no desmayarán.',
    },
  },
  {
    id: 7,
    bookOrder: 45,
    chapter: 8,
    verseNumber: 28,
    reference: 'Romanos 8:28',
    texts: {
      RVR1960: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
      NVI: 'Ahora bien, sabemos que Dios dispone todas las cosas para el bien de quienes lo aman, los que han sido llamados de acuerdo con su propósito.',
      NTV: 'Y sabemos que Dios hace que todas las cosas cooperen para el bien de quienes lo aman y son llamados según el propósito que él tiene para ellos.',
    },
  },
  {
    id: 8,
    bookOrder: 6,
    chapter: 1,
    verseNumber: 9,
    reference: 'Josué 1:9',
    texts: {
      RVR1960: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.',
      NVI: 'Ya te lo he ordenado: ¡Sé fuerte y valiente! ¡No tengas miedo ni te desanimes! Porque el Señor tu Dios te acompañará dondequiera que vayas.',
      NTV: 'Mi mandato es: “¡Sé fuerte y valiente! No tengas miedo ni te desanimes, porque el Señor tu Dios está contigo dondequiera que vayas”.',
    },
  },
  {
    id: 9,
    bookOrder: 40,
    chapter: 11,
    verseNumber: 28,
    reference: 'Mateo 11:28',
    texts: {
      RVR1960: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
      NVI: 'Vengan a mí todos ustedes que están cansados y agobiados, y yo les daré descanso.',
      NTV: 'Luego dijo Jesús: “Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré descanso”.',
    },
  },
  {
    id: 10,
    bookOrder: 19,
    chapter: 119,
    verseNumber: 105,
    reference: 'Salmos 119:105',
    texts: {
      RVR1960: 'Lámpara es a mis pies tu palabra, Y lumbrera a mi camino.',
      NVI: 'Tu palabra es una lámpara a mis pies; es una luz en mi sendero.',
      NTV: 'Tu palabra es una lámpara que guía mis pies y una luz para mi camino.',
    },
  },
  {
    id: 11,
    bookOrder: 19,
    chapter: 46,
    verseNumber: 1,
    reference: 'Salmos 46:1',
    texts: {
      RVR1960: 'Dios es nuestro amparo y fortaleza, Nuestro pronto auxilio en las tribulaciones.',
      NVI: 'Dios es nuestro amparo y nuestra fortaleza, nuestra ayuda segura en momentos de angustia.',
      NTV: 'Dios es nuestro refugio y nuestra fuerza, siempre está dispuesto a ayudar en tiempos de dificultad.',
    },
  },
  {
    id: 12,
    bookOrder: 55,
    chapter: 1,
    verseNumber: 7,
    reference: '2 Timoteo 1:7',
    texts: {
      RVR1960: 'Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.',
      NVI: 'Pues Dios no nos ha dado un espíritu de timidez, sino de poder, de amor y de autodisciplina.',
      NTV: 'Pues Dios no nos ha dado un espíritu de temor y timidez sino de poder, de amor y de autodisciplina.',
    },
  },
  {
    id: 13,
    bookOrder: 40,
    chapter: 6,
    verseNumber: 33,
    reference: 'Mateo 6:33',
    texts: {
      RVR1960: 'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.',
      NVI: 'Más bien, busquen primeramente el reino de Dios y su justicia, y todas estas cosas les serán añadidas.',
      NTV: 'Busquen el reino de Dios por encima de todo lo demás y lleven una vida justa, y él les dará todo lo que necesiten.',
    },
  },
  {
    id: 14,
    bookOrder: 19,
    chapter: 91,
    verseNumber: 1,
    reference: 'Salmos 91:1',
    texts: {
      RVR1960: 'El que habita al abrigo del Altísimo Morará bajo la sombra del Omnipotente.',
      NVI: 'El que habita al abrigo del Altísimo se acoge a la sombra del Todopoderoso.',
      NTV: 'Los que viven al amparo del Altísimo encontrarán descanso a la sombra del Todopoderoso.',
    },
  },
  {
    id: 15,
    bookOrder: 23,
    chapter: 41,
    verseNumber: 10,
    reference: 'Isaías 41:10',
    texts: {
      RVR1960: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
      NVI: 'Así que no temas, porque yo estoy contigo; no te angusties, porque yo soy tu Dios. Te fortaleceré y te ayudaré; te sostendré con mi diestra victoriosa.',
      NTV: 'No tengas miedo, porque yo estoy contigo; no te desalientes, porque yo soy tu Dios. Te daré fuerzas y te ayudaré; te sostendré con mi mano derecha victoriosa.',
    },
  },
  {
    id: 16,
    bookOrder: 58,
    chapter: 11,
    verseNumber: 1,
    reference: 'Hebreos 11:1',
    texts: {
      RVR1960: 'Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.',
      NVI: 'Ahora bien, la fe es la garantía de lo que se espera, la certeza de lo que no se ve.',
      NTV: 'La fe demuestra la realidad de lo que esperamos; es la evidencia de las cosas que no podemos ver.',
    },
  },
  {
    id: 17,
    bookOrder: 45,
    chapter: 12,
    verseNumber: 2,
    reference: 'Romanos 12:2',
    texts: {
      RVR1960: 'No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta.',
      NVI: 'No se amolden al mundo actual, sino sean transformados mediante la renovación de su mente. Así podrán comprobar cuál es la voluntad de Dios, buena, agradable y perfecta.',
      NTV: 'No imiten las conductas ni las costumbres de este mundo, más bien dejen que Dios los transforme en personas nuevas al cambiarles la manera de pensar.',
    },
  },
  {
    id: 18,
    bookOrder: 46,
    chapter: 13,
    verseNumber: 4,
    reference: '1 Corintios 13:4',
    texts: {
      RVR1960: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece;',
      NVI: 'El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.',
      NTV: 'El amor es paciente y bondadoso. El amor no es celoso ni jactancioso ni orgulloso',
    },
  },
  {
    id: 19,
    bookOrder: 49,
    chapter: 2,
    verseNumber: 8,
    reference: 'Efesios 2:8',
    texts: {
      RVR1960: 'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios;',
      NVI: 'Porque por gracia ustedes han sido salvados mediante la fe; esto no procede de ustedes, sino que es el regalo de Dios,',
      NTV: 'Dios los salvó por su gracia cuando creyeron. Ustedes no tienen ningún mérito en eso; es un regalo de Dios.',
    },
  },
  {
    id: 20,
    bookOrder: 59,
    chapter: 1,
    verseNumber: 5,
    reference: 'Santiago 1:5',
    texts: {
      RVR1960: 'Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada.',
      NVI: 'Si a alguno de ustedes le falta sabiduría, pídasela a Dios, y él se la dará, pues Dios da a todos generosamente sin menospreciar a nadie.',
      NTV: 'Si necesitan sabiduría, pídansela a nuestro generoso Dios, y él se la dará; no los reprenderá por pedirla.',
    },
  },
  {
    id: 21,
    bookOrder: 43,
    chapter: 14,
    verseNumber: 6,
    reference: 'Juan 14:6',
    texts: {
      RVR1960: 'Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.',
      NVI: '—Yo soy el camino, la verdad y la vida —le contestó Jesús—. Nadie llega al Padre sino por mí.',
      NTV: 'Jesús le contestó: —Yo soy el camino, la verdad y la vida; nadie puede ir al Padre si no es por medio de mí.',
    },
  },
  {
    id: 22,
    bookOrder: 60,
    chapter: 5,
    verseNumber: 7,
    reference: '1 Pedro 5:7',
    texts: {
      RVR1960: 'echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.',
      NVI: 'Depositen en él toda ansiedad, porque él cuida de ustedes.',
      NTV: 'Pongan todas sus preocupaciones y ansiedades en las manos de Dios, porque él cuida de ustedes.',
    },
  },
  {
    id: 23,
    bookOrder: 19,
    chapter: 37,
    verseNumber: 4,
    reference: 'Salmos 37:4',
    texts: {
      RVR1960: 'Deléitate asimismo en Jehová, Y él te concederá las peticiones de tu corazón.',
      NVI: 'Deléitate en el Señor, y él te concederá los deseos de tu corazón.',
      NTV: 'Deléitate en el Señor, y él te concederá los deseos de tu corazón.',
    },
  },
  {
    id: 24,
    bookOrder: 19,
    chapter: 121,
    verseNumber: 2,
    reference: 'Salmos 121:2',
    texts: {
      RVR1960: 'Mi socorro viene de Jehová, Que hizo los cielos y la tierra.',
      NVI: 'Mi ayuda proviene del Señor, creador del cielo y de la tierra.',
      NTV: '¡Mi ayuda viene del Señor, quien hizo el cielo y la tierra!',
    },
  },
  {
    id: 25,
    bookOrder: 20,
    chapter: 16,
    verseNumber: 3,
    reference: 'Proverbios 16:3',
    texts: {
      RVR1960: 'Encomienda a Jehová tus obras, Y tus pensamientos serán afirmados.',
      NVI: 'Pon en manos del Señor todas tus obras, y tus proyectos se cumplirán.',
      NTV: 'Pon todo lo que hagas en manos del Señor, y tus planes tendrán éxito.',
    },
  },
];

/**
 * Obtiene un versiculo aleatorio del repositorio curado, evitando repetir el actual si se pasa excludeId.
 */
export function getRandomInspirationalVerse(excludeId?: number): InspirationalVerse {
  const available = excludeId
    ? INSPIRATIONAL_VERSES.filter((v) => v.id !== excludeId)
    : INSPIRATIONAL_VERSES;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] || INSPIRATIONAL_VERSES[0];
}

/**
 * Obtiene el texto adaptado a la version solicitada, con respaldo automatico a RVR1960.
 */
export function getInspirationalVerseText(
  verse: InspirationalVerse,
  version: string = 'RVR1960'
): { text: string; reference: string } {
  const versionText = verse.texts[version] || verse.texts['RVR1960'] || verse.texts['NVI'] || '';
  return {
    text: versionText,
    reference: verse.reference,
  };
}
