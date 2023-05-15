function conexion(){
    const db = window.sqlitePlugin.openDatabase({
        name: 'gimnasio.db',
        location: 'default',
        androidDatabaseProvider: 'system'
      });
    return db;
}
function crearMetricas(){
  const db = conexion();
  db.transaction(function(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS `EJERCICIO_METRICA` (ID INTEGER NOT NULL,metrica TEXT NOT NULL,PRIMARY KEY(ID AUTOINCREMENT))');
  });
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO `EJERCICIO_METRICA` VALUES (1,"Peso y repeticiones")');
    tx.executeSql('INSERT INTO `EJERCICIO_METRICA` VALUES (2,"Tiempo y distancia")');
    tx.executeSql('INSERT INTO `EJERCICIO_METRICA` VALUES (3,"Tiempo y peso")');
    tx.executeSql('INSERT INTO `EJERCICIO_METRICA` VALUES (4,"Tiempo y repeticiones")');
  });
}
function crearTipos(){
  const db = conexion();
  db.transaction(function(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS `EJERCICIO_TIPO` (ID INTEGER,tipo TEXT NOT NULL,PRIMARY KEY(ID AUTOINCREMENT))');
  });
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (1,"Propio peso")');
    tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (2,"Barra")');
    tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (3,"Una mancuerna")');
    tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (4,"Dos mancuernas")');
    tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (5,"Máquina")');
    tx.executeSql('INSERT INTO `EJERCICIO_TIPO` VALUES (6,"Otro")');
  });
}
function crearCategorias(){
  const db = conexion();
  db.transaction(function(tx){
      tx.executeSql('CREATE TABLE IF NOT EXISTS `GRUPO_MUSCULAR` (ID INTEGER,nombre TEXT NOT NULL,dias_recuperacion INTEGER NOT NULL,color TEXT NOT NULL,imagen TEXT,PRIMARY KEY(ID AUTOINCREMENT))');
    });
  db.transaction(function(tx){
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (1,"Pecho",3,"00FF00","img/grupo_muscular/pecho.jpg")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (2,"Bíceps",2,"FF0000","img/grupo_muscular/biceps.jpg")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (3,"Espalda",3,"0000FF","img/grupo_muscular/espalda.jpg")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (4,"Piernas",3,"BAA204","img/grupo_muscular/pierna.jpg")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (5,"Hombros",2,"1D91AB","img/grupo_muscular/hombros.png")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (6,"Triceps",2,"C97600","img/grupo_muscular/biceps.jpg")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (7,"Abdominales",2,"9304CC","img/grupo_muscular/abs.jpg")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (8,"Cardio",1,"AB0325","img/grupo_muscular/cardio.png")');
      tx.executeSql('INSERT INTO `GRUPO_MUSCULAR` VALUES (9,"Otros",1,"9C9C9C","img/grupo_muscular/pecho.jpg")');
  });
}
function crearEjercicios(){
    const db = conexion();
    db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS `EJERCICIO` (ID INTEGER,nombre TEXT NOT NULL,favorito INTEGER NOT NULL DEFAULT 0,metrica INTEGER NOT NULL DEFAULT 1 REFERENCES EJERCICIO_METRICA(ID),tipo INTEGER NOT NULL DEFAULT 1 REFERENCES EJERCICIO_TIPO(ID),imagen TEXT,oculto INTEGER, grupo_muscular INTEGER NOT NULL REFERENCES GRUPO_MUSCULAR(ID), FOREIGN KEY(metrica) REFERENCES EJERCICIO_METRICA(ID) ON DELETE CASCADE ON UPDATE NO ACTION,FOREIGN KEY(tipo) REFERENCES EJERCICIO_TIPO(ID) ON DELETE CASCADE ON UPDATE NO ACTION, FOREIGN KEY(grupo_muscular) REFERENCES GRUPO_MUSCULAR(ID) ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY(ID AUTOINCREMENT))');
      });
    db.transaction(function(tx){
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (1,"Apertura abductores",0,1,2,"img/ejercicios/abductores.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (2,"Apertura aductores",0,1,2,"img/ejercicios/aductores.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (3,"Buenos días",0,1,2,"img/ejercicios/buenos_dias.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (4,"Sentadilla búlgara",0,1,2,"img/ejercicios/bulgara.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (5,"Sentadilla búlgara con kettlebell",0,1,2,"img/ejercicios/bulgara_kettlebell.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (6,"cable-cross-over.gif",0,1,2,"img/ejercicios/cable-cross-over.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (7,"Curl de bíceps",0,1,2,"img/ejercicios/curl_biceps.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (8,"Curl de bíceps alternado",0,1,2,"img/ejercicios/curl_biceps_alternado.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (9,"Curl de bíceps con barra EZ",0,1,2,"img/ejercicios/curl_biceps_barra_ez.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (10,"Curl de bíceps concentrado",0,1,2,"img/ejercicios/curl_biceps_concentrado.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (11,"Curl de bíceps con mancuernas",0,1,2,"img/ejercicios/curl_biceps_mancuerna.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (12,"Curl de bíceps inclinado",0,1,2,"img/ejercicios/curl_biceps_mancuerna_inclinado.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (13,"Curl de bíceps en máquina",0,1,2,"img/ejercicios/curl_biceps_maquina.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (14,"Curl de bíceps en polea",0,1,2,"img/ejercicios/curl_biceps_polea.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (15,"Curl femoral de pie",0,1,2,"img/ejercicios/curl_femoral_de_pie.png",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (16,"Curl femoral sentado",0,1,2,"img/ejercicios/curl_femoral_sentado.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (17,"Curl femoral tumbado",0,1,2,"img/ejercicios/curl_femoral_tumbado.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (18,"Curl martillo",0,1,2,"img/ejercicios/curl_martillo.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (19,"Curl martillo alternado",0,1,2,"img/ejercicios/curl_martillo_alternado.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (20,"Curl martillo inclinado",0,1,2,"img/ejercicios/curl_martillo_inclinado.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (21,"Curl martillo en polea",0,1,2,"img/ejercicios/curl_martillo_polea.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (22,"Curl predicador",0,1,2,"img/ejercicios/curl_predicador.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (23,"Curl predicador con barra EZ",0,1,2,"img/ejercicios/curl_predicador_barra_ez.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (24,"Curl predicador en polea",0,1,2,"img/ejercicios/curl_predicador_polea.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (25,"Curl zottman",0,1,2,"img/ejercicios/curl_zottman.gif",0,2)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (26,"Dominada chin-up",0,1,2,"img/ejercicios/dominada_chin_up.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (27,"Dominada pull-up",0,1,2,"img/ejercicios/dominada_pull_up.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (28,"Dominada pull-up asistida",0,1,2,"img/ejercicios/dominada_pull_up_asistida.png",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (29,"Dominada pull-up con peso",0,1,2,"img/ejercicios/dominada_pull_up_peso.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (30,"Elevaciones laterales con mancuerna",0,1,2,"img/ejercicios/elevaciones_laterales_mancuerna.gif",0,5)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (31,"Extensión de cuádriceps",0,1,2,"img/ejercicios/extension_cuadriceps.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (32,"Extensión de triceps con mancuerna",0,1,2,"img/ejercicios/extension_triceps_mancuerna.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (33,"Extensión de tríceps en polea",0,1,2,"img/ejercicios/extension_triceps_polea.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (34,"Flexiones",0,1,2,"img/ejercicios/flexion.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (35,"Flexiones inclinadas en banco",0,1,2,"img/ejercicios/flexion_banco.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (36,"Flexiones inclinadas en barras",0,1,2,"img/ejercicios/flexion_barra.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (37,"Flexiones declinadas",0,1,2,"img/ejercicios/flexion_declinada.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (38,"Flexiones diamante",0,1,2,"img/ejercicios/flexion_diamante.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (39,"Fly con mancuerna",0,1,2,"img/ejercicios/fly_mancuerna.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (40,"Fly en máquina",0,1,2,"img/ejercicios/fly_maquina.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (41,"Fly en polea",0,1,2,"img/ejercicios/fly_polea.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (42,"Fondos en banco",0,1,2,"img/ejercicios/fondos_banco.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (43,"Fondos en barras",0,1,2,"img/ejercicios/fondos_barras.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (44,"Frontales con mancuerna",0,1,2,"img/ejercicios/frontales_mancuernas.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (45,"Gemelo en máquina sentado",0,1,2,"img/ejercicios/gemelo.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (46,"Gemelo en máquina de pie",0,1,2,"img/ejercicios/maquina_gemelo.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (47,"Gemelo en prensa inclinada",0,1,2,"img/ejercicios/gemelo_prensa_inclinada.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (48,"Hex press",0,1,2,"img/ejercicios/hex_press.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (49,"Hip thrust",0,1,2,"img/ejercicios/hip_thrust_barra.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (50,"Hip thrust con mancuernas",0,1,2,"img/ejercicios/hip_thrust_mancuernas.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (51,"Hip thrust una pierna con mancuernas",0,1,2,"img/ejercicios/hip_thrust_mancuerna_una_pierna.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (52,"Jaca",0,1,2,"img/ejercicios/jaca.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (53,"Jaca reversa",0,1,2,"img/ejercicios/jaca_reversa.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (54,"Jalón a la cara",0,1,2,"img/ejercicios/jalon_cara_polea.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (55,"Jalón al pecho",0,1,2,"img/ejercicios/jalon_pecho.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (56,"Jalón al pecho agarre V",0,1,2,"img/ejercicios/jalon_pecho_agarre_v.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (57,"Jalón un brazo",0,1,2,"img/ejercicios/jalon_un_brazo.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (58,"Patada de burro",0,1,2,"img/ejercicios/patada_burro.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (59,"Patada de tríceps en polea",0,1,2,"img/ejercicios/patada_triceps_polea.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (60,"Pec deck",0,1,2,"img/ejercicios/pec_deck.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (61,"Peso muerto",0,1,2,"img/ejercicios/peso_muerto.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (62,"Peso muerto con mancuernas",0,1,2,"img/ejercicios/peso_muerto_mancuernas.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (63,"Peso muerto rumano",0,1,2,"img/ejercicios/peso_muerto_rumano.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (64,"Peso muerto con mancuernas",0,1,2,"img/ejercicios/peso_muerto_rumano_mancuernas.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (65,"Peso muerto sumo",0,1,2,"img/ejercicios/peso_muerto_sumo.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (66,"Prensa inclinada",0,1,2,"img/ejercicios/prensa_inclinada.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (67,"Prensa inclinada una pierna",0,1,2,"img/ejercicios/prensa_inclinada_una_pierna.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (68,"Press banca",0,1,2,"img/ejercicios/press_banca_barra.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (69,"Press banca inclinado",0,1,2,"img/ejercicios/press_banca_inclinado_barra.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (70,"Press banca agarre cerrado",0,1,2,"img/ejercicios/press_banca_barra_cerrado.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (71,"Press banca declinado con mancuernas",0,1,2,"img/ejercicios/press_banca_declinado_mancuernas.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (72,"Press banca inclinado con mancuernas",0,1,2,"img/ejercicios/press_banca_inclinado_mancuernas.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (73,"Press cubano con mancuernas",0,1,2,"img/ejercicios/press_cubano_mancuernas.gif",0,5)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (74,"Press militar",0,1,2,"img/ejercicios/press_militar_mancuerna.gif",0,5)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (75,"Press banca en máquina",0,1,2,"img/ejercicios/press_pecho.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (76,"Ranita",0,1,2,"img/ejercicios/ranita.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (77,"Remo con barra",0,1,2,"img/ejercicios/remo_barra.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (78,"Remo con barra T",0,1,2,"img/ejercicios/remo_barra_t.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (79,"Remo con mancuerna",0,1,2,"img/ejercicios/remo_mancuerna.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (80,"Remo en máquina",0,1,2,"img/ejercicios/remo_maquina.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (81,"Remo en polea",0,1,2,"img/ejercicios/remo_polea.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (82,"Remo en polea de pie",0,1,2,"img/ejercicios/remo_polea_depie.gif",0,3)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (83,"Sentadilla libre",0,1,2,"img/ejercicios/sentadilla_libre.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (84,"Sentadilla frontal",0,1,2,"img/ejercicios/sentadilla_frontal.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (85,"Sentadilla pistola",0,1,2,"img/ejercicios/sentadilla_pistola.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (86,"Sentadilla smith",0,1,2,"img/ejercicios/sentadilla_smith.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (87,"Sentadilla sumo con kettlebell",0,1,2,"img/ejercicios/sentadilla_sumo_kettlebell.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (88,"Sentadilla una pierna",0,1,2,"img/ejercicios/sentadilla_unilateral.gif",0,4)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (89,"Tríceps en polea con barra rígida",0,1,2,"img/ejercicios/triceps_polea_barra.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (90,"Tríceps en polea con barra EZ",0,1,2,"img/ejercicios/triceps_polea_barra_ez.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (91,"Tríceps en polea con barra V",0,1,2,"img/ejercicios/triceps_polea_barra_v.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (92,"Tríceps en polea con cuerda",0,1,2,"img/ejercicios/triceps_polea_cuerda.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (93,"Tríceps en polea con cuerda tras nuca",0,1,2,"img/ejercicios/triceps_polea_tras_nuca.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (94,"tuck-crunch.gif",0,1,2,"img/ejercicios/tuck-crunch.gif",0,1)');
        tx.executeSql('INSERT INTO `EJERCICIO` VALUES (95,"Zancada con mancuernas",0,1,2,"img/ejercicios/zancada_mancuernas.gif",0,4)');
      });
}
function getCategorias(condicion = ""){
  const db = conexion();
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