/**
 * 
 * @returns {SQLitePlugin.Database} db
 */
function conexion(){
  if (window.cordova.platformId === 'browser')
  db = window.openDatabase('GimnasioDB', '1.0', 'Data', 2*1024*1024);
  else
  db = window.sqlitePlugin.openDatabase({name: 'gimnasiodb.db', location: 'default'});
  return db;
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @returns void
 */
async function crearTablas(db){
  db.transaction(function(tx){
    // Creo las tablas
    tx.executeSql('CREATE TABLE IF NOT EXISTS `CALENDARIO` (ID INTEGER,nombre TEXT NOT NULL UNIQUE,color TEXT NOT NULL,PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `GRUPO_MUSCULAR` (ID INTEGER,nombre TEXT NOT NULL,dias_recuperacion INTEGER NOT NULL,color TEXT NOT NULL,imagen TEXT,PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `MUSCULO` (ID INTEGER, nombre TEXT NOT NULL,grupo_muscular INTEGER NOT NULL, FOREIGN KEY(grupo_muscular) REFERENCES GRUPO_MUSCULAR(ID) ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `EJERCICIO_TIPO` (ID INTEGER,tipo TEXT NOT NULL,PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `EJERCICIO_METRICA` (ID INTEGER NOT NULL,metrica TEXT NOT NULL,PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `EJERCICIO` (ID INTEGER,nombre TEXT NOT NULL,favorito INTEGER NOT NULL DEFAULT 0,metrica INTEGER NOT NULL DEFAULT 1 REFERENCES EJERCICIO_METRICA(ID),tipo INTEGER NOT NULL DEFAULT 1 REFERENCES EJERCICIO_TIPO(ID),imagen TEXT,oculto INTEGER, grupo_muscular INTEGER NOT NULL REFERENCES GRUPO_MUSCULAR(ID), FOREIGN KEY(metrica) REFERENCES EJERCICIO_METRICA(ID) ON DELETE CASCADE ON UPDATE NO ACTION,FOREIGN KEY(tipo) REFERENCES EJERCICIO_TIPO(ID) ON DELETE CASCADE ON UPDATE NO ACTION, FOREIGN KEY(grupo_muscular) REFERENCES GRUPO_MUSCULAR(ID) ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `EJERCICIO_MUSCULO` (ejercicio_id INTEGER NOT NULL,musculo_id INTEGER NOT NULL,grupo_muscular_id INTEGER NOT NULL,FOREIGN KEY(grupo_muscular_id) REFERENCES MUSCULO(grupo_muscular_id) ON DELETE CASCADE ON UPDATE NO ACTION,FOREIGN KEY(musculo_id) REFERENCES MUSCULO(ID) ON DELETE CASCADE ON UPDATE NO ACTION,FOREIGN KEY(ejercicio_id) REFERENCES EJERCICIO(ID) ON DELETE CASCADE ON UPDATE NO ACTION,PRIMARY KEY(ejercicio_id,musculo_id,grupo_muscular_id))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `ENTRENAMIENTO` (ID INTEGER NOT NULL,comentario TEXT,fecha TEXT NOT NULL,calendario INTEGER NOT NULL,ejercicio INTEGER NOT NULL,FOREIGN KEY(calendario) REFERENCES CALENDARIO(ID) ON DELETE CASCADE ON UPDATE NO ACTION, FOREIGN KEY(ejercicio) REFERENCES EJERCICIO(ID) ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `SERIE_DIFICULTAD` (ID INTEGER,dificultad TEXT NOT NULL,PRIMARY KEY(ID AUTOINCREMENT))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS `SERIE` (ID INTEGER NOT NULL,numero INTEGER NOT NULL,dificultad INTEGER,valor1 TEXT NOT NULL,valor2 TEXT NOT NULL,entrenamiento INTEGER NOT NULL,FOREIGN KEY(entrenamiento)REFERENCES ENTRENAMIENTO(ID) ON DELETE CASCADE ON UPDATE NO ACTION,FOREIGN KEY(dificultad) REFERENCES SERIE_DIFICULTAD(ID) ON DELETE SET NULL ON UPDATE NO ACTION,PRIMARY KEY(ID AUTOINCREMENT))');
  });
  // Inserto los datos iniciales
  insertarCalendario(db, "Yo");
  await insertarCategorias(db);
  await insertarMusculos(db);
  await insertarTipos(db);
  await insertarMetricas(db);
  await insertarEjercicios(db);
  // await insertarEjerciciosMusculos(db);
  await insertarDificultades(db);
  let datosEntrenamiento = ["","20/05/2023",1,1]
  crearEntrenamiento(db,datosEntrenamiento);
  let datosSerie1 = [1,1,50,10,1]
  let datosSerie2 = [2,2,70,8,1]
  crearSerie(db,datosSerie1);
  crearSerie(db,datosSerie2);
}
// INSERCIÓN DE DATOS EN TABLAS

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} nombre
 * @returns void
 */
function insertarCalendario(db,nombre){
  let color = Math.floor(Math.random()*16777215).toString(16);
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO `CALENDARIO`(nombre,color) VALUES (?,?)',
    [nombre,color]);
  });
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @returns void
 */
async function insertarDificultades(db){
  const dificultades = await getDificultades(db);
  if(dificultades.rows.length == 0){
    db.transaction(function(tx){
      tx.executeSql('INSERT INTO `SERIE_DIFICULTAD`(dificultad) VALUES (?)',
      ["Calentamiento"]);
      tx.executeSql('INSERT INTO `SERIE_DIFICULTAD`(dificultad) VALUES (?)',
      ["Fácil"]);
      tx.executeSql('INSERT INTO `SERIE_DIFICULTAD`(dificultad) VALUES (?)',
      ["Normal"]);
      tx.executeSql('INSERT INTO `SERIE_DIFICULTAD`(dificultad) VALUES (?)',
      ["Difícil"]);
    });
  }
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @returns void
 */
async function insertarMetricas(db){
  const metricas = await getMetricas(db);
  if(metricas.rows.length == 0){
    db.transaction(function(tx){
      tx.executeSql('INSERT INTO `EJERCICIO_METRICA`(metrica) VALUES (?)',
      ["Peso y repeticiones"]);
      tx.executeSql('INSERT INTO `EJERCICIO_METRICA`(metrica) VALUES (?)',
      ["Tiempo y distancia"]);
      tx.executeSql('INSERT INTO `EJERCICIO_METRICA`(metrica) VALUES (?)',
      ["Tiempo y peso"]);
      tx.executeSql('INSERT INTO `EJERCICIO_METRICA`(metrica) VALUES (?)',
      ["Tiempo y repeticiones"]);
    });
  }
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @returns void
 */
async function insertarTipos(db){
  const tipos = await getTipos(db);
  if(tipos.rows.length == 0){
    db.transaction(function(tx){
      tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (1,"Propio peso")');
      tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (2,"Barra")');
      tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (3,"Una mancuerna")');
      tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (4,"Dos mancuernas")');
      tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (5,"Máquina")');
      tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (6,"Otro")');
    });
  }
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @returns void
 */
async function insertarCategorias(db){
  const grupos_musculares = await getCategorias(db);
  if(grupos_musculares.rows.length == 0){
    db.transaction(function(tx){
        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Pecho",3,"00FF00","img/grupo_muscular/pecho.jpg"]);

        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Brazos",2,"FF0000","img/grupo_muscular/brazos.jpg"]);

        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Espalda",3,"0000FF","img/grupo_muscular/espalda.jpg"]);

        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Piernas",3,"BAA204","img/grupo_muscular/pierna.jpg"]);

        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Hombros",2,"1D91AB","img/grupo_muscular/hombros.png"]);

        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Core",2,"9304CC","img/grupo_muscular/abs.jpg"]);

        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Cardio",1,"AB0325","img/grupo_muscular/cardio.png"]);

        tx.executeSql('INSERT INTO `GRUPO_MUSCULAR`(nombre,dias_recuperacion,color,imagen) VALUES (?,?,?,?)',
        ["Otros",1,"9C9C9C","img/grupo_muscular/pecho.jpg"]);
    })
  }
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @returns void
 */
async function insertarMusculos(db){
  const musculos = await getMusculos(db);
  if(musculos.rows.length == 0){
    db.transaction(function(tx){
      // Músculos de la pierna
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Cuádriceps",4]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Isquiotibiales",4]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Glúteos",4]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Gemelos",4]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Aductores",4]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Abductores",4]);
      // Músculos del pecho
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Mayor",1]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Medio",1]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Menor",1]);
      // Músculos de la espalda
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Dorsales",3]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Lumbares",3]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Trapecio",3]);
      // Músculos de los hombros
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Lateral",5]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Anterior",5]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Posterior",5]);
      // Músculos del brazo
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Bíceps",2]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Tríceps",2]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Antebrazo",2]);
      // Músculos de core
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Abdominales",6]);
      tx.executeSql('INSERT INTO `MUSCULO`(nombre,grupo_muscular) VALUES (?,?)',
      ["Oblicuos",6]);     
    });
  }
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @returns void
 */
async function insertarEjercicios(db){
  const ejercicios = await getEjercicios(db);
  if(ejercicios.rows.length == 0){
    db.transaction(function(tx){
      // INSERCIÓN DE EJERCICIOS DE PIERNA
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Apertura abductores",0,1,2,"img/ejercicios/abductores.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Apertura aductores",0,1,2,"img/ejercicios/aductores.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Buenos días",0,1,2,"img/ejercicios/buenos_dias.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla búlgara",0,1,2,"img/ejercicios/bulgara.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla búlgara con kettlebell",0,1,2,"img/ejercicios/bulgara_kettlebell.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl femoral de pie",0,1,2,"img/ejercicios/curl_femoral_de_pie.png",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl femoral sentado",0,1,2,"img/ejercicios/curl_femoral_sentado.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl femoral tumbado",0,1,2,"img/ejercicios/curl_femoral_tumbado.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Extensión de cuádriceps",0,1,2,"img/ejercicios/extension_cuadriceps.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Gemelo en máquina sentado",0,1,2,"img/ejercicios/gemelo.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Gemelo en máquina de pie",0,1,2,"img/ejercicios/maquina_gemelo.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Gemelo en prensa inclinada",0,1,2,"img/ejercicios/gemelo_prensa_inclinada.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Hip thrust",0,1,2,"img/ejercicios/hip_thrust_barra.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Hip thrust con mancuernas",0,1,2,"img/ejercicios/hip_thrust_mancuernas.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Hip thrust una pierna con mancuernas",0,1,2,"img/ejercicios/hip_thrust_mancuerna_una_pierna.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Jaca",0,1,2,"img/ejercicios/jaca.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Jaca reversa",0,1,2,"img/ejercicios/jaca_reversa.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Patada de burro",0,1,2,"img/ejercicios/patada_burro.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Peso muerto",0,1,2,"img/ejercicios/peso_muerto.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Peso muerto con mancuernas",0,1,2,"img/ejercicios/peso_muerto_mancuernas.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Peso muerto rumano",0,1,2,"img/ejercicios/peso_muerto_rumano.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Peso muerto con mancuernas",0,1,2,"img/ejercicios/peso_muerto_rumano_mancuernas.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Peso muerto sumo",0,1,2,"img/ejercicios/peso_muerto_sumo.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Prensa inclinada",0,1,2,"img/ejercicios/prensa_inclinada.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Prensa inclinada una pierna",0,1,2,"img/ejercicios/prensa_inclinada_una_pierna.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Ranita",0,1,2,"img/ejercicios/ranita.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla libre",0,1,2,"img/ejercicios/sentadilla_libre.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla frontal",0,1,2,"img/ejercicios/sentadilla_frontal.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla pistola",0,1,2,"img/ejercicios/sentadilla_pistola.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla smith",0,1,2,"img/ejercicios/sentadilla_smith.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla sumo con kettlebell",0,1,2,"img/ejercicios/sentadilla_sumo_kettlebell.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Sentadilla una pierna",0,1,2,"img/ejercicios/sentadilla_unilateral.gif",0,4]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Zancada con mancuernas",0,1,2,"img/ejercicios/zancada_mancuernas.gif",0,4]);
      
      // INSERCIÓN DE EJERCICIOS DE BRAZO
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["cable-cross-over.gif",0,1,2,"img/ejercicios/cable-cross-over.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps",0,1,2,"img/ejercicios/curl_biceps.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps alternado",0,1,2,"img/ejercicios/curl_biceps_alternado.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps con barra EZ",0,1,2,"img/ejercicios/curl_biceps_barra_ez.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps concentrado",0,1,2,"img/ejercicios/curl_biceps_concentrado.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps con mancuernas",0,1,2,"img/ejercicios/curl_biceps_mancuerna.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps inclinado",0,1,2,"img/ejercicios/curl_biceps_mancuerna_inclinado.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps en máquina",0,1,2,"img/ejercicios/curl_biceps_maquina.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl de bíceps en polea",0,1,2,"img/ejercicios/curl_biceps_polea.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl martillo",0,1,2,"img/ejercicios/curl_martillo.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl martillo alternado",0,1,2,"img/ejercicios/curl_martillo_alternado.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl martillo inclinado",0,1,2,"img/ejercicios/curl_martillo_inclinado.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl martillo en polea",0,1,2,"img/ejercicios/curl_martillo_polea.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl predicador",0,1,2,"img/ejercicios/curl_predicador.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl predicador con barra EZ",0,1,2,"img/ejercicios/curl_predicador_barra_ez.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl predicador en polea",0,1,2,"img/ejercicios/curl_predicador_polea.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Curl zottman",0,1,2,"img/ejercicios/curl_zottman.gif",0,2]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Dominada chin-up",0,1,2,"img/ejercicios/dominada_chin_up.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Dominada pull-up",0,1,2,"img/ejercicios/dominada_pull_up.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Dominada pull-up asistida",0,1,2,"img/ejercicios/dominada_pull_up_asistida.png",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Dominada pull-up con peso",0,1,2,"img/ejercicios/dominada_pull_up_peso.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Elevaciones laterales con mancuerna",0,1,2,"img/ejercicios/elevaciones_laterales_mancuerna.gif",0,5]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Extensión de triceps con mancuerna",0,1,2,"img/ejercicios/extension_triceps_mancuerna.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Extensión de tríceps en polea",0,1,2,"img/ejercicios/extension_triceps_polea.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Flexiones",0,1,2,"img/ejercicios/flexion.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Flexiones inclinadas en banco",0,1,2,"img/ejercicios/flexion_banco.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Flexiones inclinadas en barras",0,1,2,"img/ejercicios/flexion_barra.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Flexiones declinadas",0,1,2,"img/ejercicios/flexion_declinada.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Flexiones diamante",0,1,2,"img/ejercicios/flexion_diamante.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Fly con mancuerna",0,1,2,"img/ejercicios/fly_mancuerna.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Fly en máquina",0,1,2,"img/ejercicios/fly_maquina.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Fly en polea",0,1,2,"img/ejercicios/fly_polea.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Fondos en banco",0,1,2,"img/ejercicios/fondos_banco.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Fondos en barras",0,1,2,"img/ejercicios/fondos_barras.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Frontales con mancuerna",0,1,2,"img/ejercicios/frontales_mancuernas.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Hex press",0,1,2,"img/ejercicios/hex_press.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Jalón a la cara",0,1,2,"img/ejercicios/jalon_cara_polea.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Jalón al pecho",0,1,2,"img/ejercicios/jalon_pecho.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Jalón al pecho agarre V",0,1,2,"img/ejercicios/jalon_pecho_agarre_v.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Jalón un brazo",0,1,2,"img/ejercicios/jalon_un_brazo.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Patada de tríceps en polea",0,1,2,"img/ejercicios/patada_triceps_polea.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Pec deck",0,1,2,"img/ejercicios/pec_deck.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press banca",0,1,2,"img/ejercicios/press_banca_barra.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press banca inclinado",0,1,2,"img/ejercicios/press_banca_inclinado_barra.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press banca agarre cerrado",0,1,2,"img/ejercicios/press_banca_barra_cerrado.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press banca declinado con mancuernas",0,1,2,"img/ejercicios/press_banca_declinado_mancuernas.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press banca inclinado con mancuernas",0,1,2,"img/ejercicios/press_banca_inclinado_mancuernas.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press cubano con mancuernas",0,1,2,"img/ejercicios/press_cubano_mancuernas.gif",0,5]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press militar",0,1,2,"img/ejercicios/press_militar_mancuerna.gif",0,5]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Press banca en máquina",0,1,2,"img/ejercicios/press_pecho.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Remo con barra",0,1,2,"img/ejercicios/remo_barra.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Remo con barra T",0,1,2,"img/ejercicios/remo_barra_t.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Remo con mancuerna",0,1,2,"img/ejercicios/remo_mancuerna.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Remo en máquina",0,1,2,"img/ejercicios/remo_maquina.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Remo en polea",0,1,2,"img/ejercicios/remo_polea.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Remo en polea de pie",0,1,2,"img/ejercicios/remo_polea_depie.gif",0,3]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Tríceps en polea con barra rígida",0,1,2,"img/ejercicios/triceps_polea_barra.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Tríceps en polea con barra EZ",0,1,2,"img/ejercicios/triceps_polea_barra_ez.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Tríceps en polea con barra V",0,1,2,"img/ejercicios/triceps_polea_barra_v.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Tríceps en polea con cuerda",0,1,2,"img/ejercicios/triceps_polea_cuerda.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["Tríceps en polea con cuerda tras nuca",0,1,2,"img/ejercicios/triceps_polea_tras_nuca.gif",0,1]);
      tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto, grupo_muscular) VALUES (?,?,?,?,?,?,?)',
      ["tuck-crunch.gif",0,1,2,"img/ejercicios/tuck-crunch.gif",0,1]);
    });
  }
}

// OBTENER DATOS DE TABLAS

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} condicion
 * @returns Promise
 */
function getCalendario(db,condicion = ""){
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM CALENDARIO ' + condicion, [], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} condicion
 * @returns Promise
 */
function getDificultades(db,condicion = ""){
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM SERIE_DIFICULTAD ' + condicion, [], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} condicion
 * @returns Promise
 */
function getMusculos(db,condicion = ""){
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM MUSCULO ' + condicion, [], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

function getEntrenamientos(db,calendario,fecha){
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM ENTRENAMIENTO WHERE calendario = ? AND fecha = ?', [calendario,fecha], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

function getEntrenamiento(db,id){
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM ENTRENAMIENTO WHERE ID = ?', [id], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

function getSeries(db,ejercicio){
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM SERIE WHERE entrenamiento = ?', [ejercicio], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} condicion
 * @returns Promise
 */
function getMetricas(db,condicion = ""){
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM EJERCICIO_METRICA ' + condicion, [], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} condicion
 * @returns Promise
 */
function getTipos(db,condicion = ""){
  // const db = conexion();
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM EJERCICIO_TIPO ' + condicion, [], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}
/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} condicion 
 * @returns Promise
 */
function getCategorias(db,condicion = ""){
  // const db = conexion();
  return new Promise(function(resolve,reject){
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM GRUPO_MUSCULAR ' + condicion, [], function(tx, rs) {
        resolve(rs);
      },function(err){
        reject(err);
      });
    });
  });
}
/**
 * 
 * @param {SQLitePlugin.Database} db 
 * @param {string} condicion
 * @returns Promise
 */
function getEjercicios(db,condicion = ""){
  // const db = conexion();
  return new Promise(function(resolve,reject){
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM EJERCICIO ' + condicion, [], function(tx,rs){
        resolve(rs);
      },function(error){
        reject(error);
      });
    });
  });
}

/**
 * 
 * @param {SQLitePlugin.Database} db
 * @param {number} ejercicio
 * @returns void
 */
function ocultarEjercicio(db, ejercicio){
  db.transaction(function(tx){
    tx.executeSql('UPDATE EJERCICIO SET oculto = 1 WHERE ID = ?', [ejercicio]);
  })
}

/**
 * 
 * @param {SQLitePlugin.Database} db
 * @param {number} ejercicio
 * @returns void
 */
function mostrarEjercicio(db, ejercicio){
  db.transaction(function(tx){
    tx.executeSql('UPDATE EJERCICIO SET oculto = 0 WHERE ID = ?', [ejercicio]);
  })
}

/**
 * 
 * @param {SQLitePlugin.Database} db
 * @param {number} ejercicio
 * @returns void
 */
function aFavoritoEjercicio(db, ejercicio){
  db.transaction(function(tx){
    tx.executeSql('UPDATE EJERCICIO SET favorito = 1 WHERE ID = ?', [ejercicio]);
  })
}

/**
 * 
 * @param {SQLitePlugin.Database} db
 * @param {number} ejercicio
 * @returns void
 */
function qFavoritoEjercicio(db, ejercicio){
  db.transaction(function(tx){
    tx.executeSql('UPDATE EJERCICIO SET favorito = 0 WHERE ID = ?', [ejercicio]);
  })
}

// BORRADO DE DATOS EN TABLAS

/**
 * 
 * @param {SQLitePlugin.Database} db
 * @param {number} ejercicio
 * @returns void
 */
function borrarEjercicio(db, ejercicio){
  db.transaction(function(tx){
    tx.executeSql('DELETE FROM EJERCICIO WHERE ID = ?', [ejercicio]);
  })
}


function actualizarEjercicio(db,datos){
  db.transaction(function(tx){
    tx.executeSql('UPDATE EJERCICIO SET nombre=?,tipo=?,metrica=?,grupo_muscular=? WHERE ID=?',
    [datos[1],datos[2],datos[3],datos[4],datos[0]])
  })
}

function crearEjercicio(db,datos){
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO `EJERCICIO`(nombre,favorito,metrica,tipo,imagen,oculto,grupo_muscular) VALUES (?,?,?,?,?,?,?)',
    [datos[0],0,datos[2],datos[1],"img/ejercicios/noimg.png",0,datos[3]]);
  })
}
function crearEntrenamiento(db,datos){
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO ENTRENAMIENTO(comentario,fecha,calendario,ejercicio) values(?,?,?,?)',
    [datos[0],datos[1],datos[2],datos[3]]);
  })
}
function crearSerie(db,datos){
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO SERIE(numero,dificultad,valor1,valor2,entrenamiento) VALUES(?,?,?,?,?)',
    [datos[0],datos[1],datos[2],datos[3],datos[4]]);
  })
}