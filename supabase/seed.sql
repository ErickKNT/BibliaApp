-- Datos iniciales de siembra (Seed) para BibliaApp
-- Traduccion: Reina-Valera 1909 (Dominio Publico)

insert into public.verses (book_name, book_order, chapter, verse_number, text, version, chapter_context, historical_context, global_order)
values
  -- Filipenses 4
  ('Filipenses', 50, 4, 10, 'Mas en gran manera me goce en el Senor de que ya al fin ha revivido vuestro cuidado de mi; de lo cual tambien estabais solícitos, pero os faltaba la oportunidad.', 'RVR09', 'FILIPENSES · CAP. 4', 'Contexto: Carta de gratitud desde prision en Roma', 29459),
  ('Filipenses', 50, 4, 11, 'No lo digo en razon de necesidad, pues he aprendido a contentarme con lo que tengo.', 'RVR09', 'FILIPENSES · CAP. 4', 'Contexto: El secreto del contentamiento cristiano', 29460),
  ('Filipenses', 50, 4, 12, 'Se estar humillado, y se tener abundancia; en todo y por todo estoy ensenado, asi para estar satisfecho como para tener hambre, asi para tener abundancia como para padecer necesidad.', 'RVR09', 'FILIPENSES · CAP. 4', 'Contexto: Fortaleza espiritual ante la precariedad', 29461),
  ('Filipenses', 50, 4, 13, 'Todo lo puedo en Cristo que me fortalece.', 'RVR09', 'FILIPENSES · CAP. 4', 'Contexto: Carta desde prision en Roma', 29462),
  ('Filipenses', 50, 4, 14, 'Sin embargo, bien hicisteis en participar conmigo en mi tribulacion.', 'RVR09', 'FILIPENSES · CAP. 4', 'Contexto: Solidaridad de la comunidad filipense', 29463),

  -- Juan 1
  ('Juan', 43, 1, 1, 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.', 'RVR09', 'JUAN · CAP. 1', 'Contexto: Prologo teologico de la encarnacion', 26046),
  ('Juan', 43, 1, 2, 'Este era en el principio con Dios.', 'RVR09', 'JUAN · CAP. 1', 'Contexto: Coexistencia eterna con el Padre', 26047),
  ('Juan', 43, 1, 3, 'Todas las cosas por el fueron hechas; y sin el nada de lo que es hecho, fue hecho.', 'RVR09', 'JUAN · CAP. 1', 'Contexto: La Palabra como agente de la creacion', 26048),
  ('Juan', 43, 1, 4, 'En el estaba la vida, y la vida era la luz de los hombres.', 'RVR09', 'JUAN · CAP. 1', 'Contexto: La vida verdadera y la revelacion divina', 26049),
  ('Juan', 43, 1, 5, 'Y la luz en las tinieblas resplandece; mas las tinieblas no la comprendieron.', 'RVR09', 'JUAN · CAP. 1', 'Contexto: La victoria de la luz sobre el cosmos', 26050),

  -- Salmos 23
  ('Salmos', 19, 23, 1, 'Jehova es mi pastor; nada me faltara.', 'RVR09', 'SALMOS · CAP. 23', 'Contexto: Salmo pastoral de David en el desierto', 14241),
  ('Salmos', 19, 23, 2, 'En lugares de delicados pastos me hara yacer: junto a aguas de reposo me pastoreara.', 'RVR09', 'SALMOS · CAP. 23', 'Contexto: Descanso y renovacion del alma', 14242),
  ('Salmos', 19, 23, 3, 'Confortara mi alma; guiárame por sendas de justicia por amor de su nombre.', 'RVR09', 'SALMOS · CAP. 23', 'Contexto: Direccion soberana y consuelo', 14243),
  ('Salmos', 19, 23, 4, 'Aunque ande en valle de sombra de muerte, no temere mal alguno; porque tu estaras conmigo: tu vara y tu cayado me infundiran aliento.', 'RVR09', 'SALMOS · CAP. 23', 'Contexto: Amparo incondicional en la afliccion', 14244),
  ('Salmos', 19, 23, 5, 'Aderezaras mesa delante de mi, en presencia de mis angustiadores: ungiste mi cabeza con aceite: mi copa esta rebosando.', 'RVR09', 'SALMOS · CAP. 23', 'Contexto: Banquete de honor y victoria divina', 14245),
  ('Salmos', 19, 23, 6, 'Ciertamente el bien y la misericordia me seguirán todos los dias de mi vida: y en la casa de Jehova morare por largos dias.', 'RVR09', 'SALMOS · CAP. 23', 'Contexto: Promesa de comunion eterna', 14246),

  -- Genesis 1
  ('Genesis', 1, 1, 1, 'En el principio crio Dios los cielos y la tierra.', 'RVR09', 'GENESIS · CAP. 1', 'Contexto: Relato de los origenes cosmicos', 1),
  ('Genesis', 1, 1, 2, 'Y la tierra estaba desordenada y vacia, y las tinieblas estaban sobre la haz del abismo, y el Espiritu de Dios se movia sobre la haz de las aguas.', 'RVR09', 'GENESIS · CAP. 1', 'Contexto: Estado primordial antes de la ordenacion divina', 2),
  ('Genesis', 1, 1, 3, 'Y dijo Dios: Sea la luz: y fue la luz.', 'RVR09', 'GENESIS · CAP. 1', 'Contexto: El poder creador de la palabra', 3)
on conflict (version, book_order, chapter, verse_number) do nothing;
