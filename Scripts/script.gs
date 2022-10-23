
// REPLACE DB_ID TO LINK YOUR DATABASE WITH THE SCRIPT, AND GRANT AUTHORIZATION TO PERFORM ACTIONS ON DATABASE BY THE CODE BELOW.
// SUBSTITUIA O DB_ID PARA VINCULAR A DATABASE COM O SCRIPT E GARANTIR AUTORIZAÇÃO PARA REALIZAÇÕES NA DATABASE ATRAVÉS DO CÓDIGO ABAIXO. 
const DB_ID = "YOUR_DATABASE_SHEET_ID" 

const TABULEIROS_SHEET = SpreadsheetApp.openById(DB_ID).getSheetByName("Tabuleiros");
const SEMESTRES_SHEET = SpreadsheetApp.openById(DB_ID).getSheetByName("Semestres");
const CURSOS_SHEET = SpreadsheetApp.openById(DB_ID).getSheetByName("Cursos");

/**
 * Gera uma array aleatória com letras e números de comprimento especifico.
 * @param {number} m Número de caracteres da string aleatória a ser gerada
 * @return {string} Nova chave aleatória
 */
function randomStr(m) {
  var m = m || 15; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < m; i++) { s += r.charAt(Math.floor(Math.random() * r.length)); }
  return s;
}

/**
 * Formata uma array no padrão de string reconhecido pelo AppSheet.
 * @param {string[]} arr Array de Id's
 * @return {string} Array of Id's como string
 */
function arrayStr(arr) {
  var value = "";
  for (var i = 0; i < arr.length; i++) {
    value += arr[i];
    if (i < (arr.length - 1)) {
      value += " , ";
    }
  }
  return value;
}

/**
 * Adiciona os tabuleiros do curso, de acordo com todos os semestres que estão ativos no momento.
 * @param {string} curso Id do Curso
 * @param {string} instituicao Id da Instituição.
 */
function addNewCurso(curso, instituicao,) {

  // consulta todos os semestres existentes
  var semestres_sheet_values = SEMESTRES_SHEET.getSheetValues(2, 1, SEMESTRES_SHEET.getMaxRows(), SEMESTRES_SHEET.getMaxColumns());
  // filtra apenas os semestres ativos
  var semestres = semestres_sheet_values.filter(function (el) { return el[2]; }); 

  var values = []
  
  // percorre cada semestre, adicionando o curso atual em uma array.
  for (var i = 0; i < semestres.length; i++) {

    values.push([randomStr(8), instituicao, curso, semestres[i][0], "=VLOOKUP(C" + (i + 2) + ";Cursos!A:E;4;0)-(LEFT(VLOOKUP(D" + (i + 2) + ";Semestres!A:C;2;0);4)-YEAR(TODAY()))*2-SWITCH(VALUE(RIGHT(VLOOKUP(D" + (i + 2) + ";Semestres!A:C;2;0);1))-IF(MONTH(TODAY())>6;2;1);0;0;-1;-1;1;1)", "9e3fcv4a", "9e55cv44", "", "", "", true, "Não Iniciada", "",""]);
  }
  
  // insere a array na planilha
  TABULEIROS_SHEET.insertRowsBefore(2, values.length);
  TABULEIROS_SHEET.getRange(2, 1, values.length, values[0].length).setValues(values);

}

/**
 * Adiciona os tabuleiros do curso ativos.
 * @param {string} id Id do Semestre
 */
function newSemestre(id) {

  // pega todos as informações dos cursos
  cursos_sheet_values = CURSOS_SHEET.getSheetValues(2, 1, CURSOS_SHEET.getMaxRows(), CURSOS_SHEET.getMaxColumns());
  // filtra apenas os cursos ativos
  var cursos = cursos_sheet_values.filter(function (el) { return el[4]; });

  var values = []

  for (var i = 0; i < cursos.length; i++) {
    // adiciona em uma array a linha correspondente ao curso e ao semestre atual
    values.push([randomStr(8), cursos[i][1], cursos[i][0], id, "=VLOOKUP(C" + (i + 2) + ";Cursos!A:E;4;0)-(LEFT(VLOOKUP(D" + (i + 2) + ";Semestres!A:C;2;0);4)-YEAR(TODAY()))*2-SWITCH(VALUE(RIGHT(VLOOKUP(D" + (i + 2) + ";Semestres!A:C;2;0);1))-IF(MONTH(TODAY())>6;2;1);0;0;-1;-1;1;1)", "9e3fcv4a", "9e55cv44", "", "", "", true, "Não Iniciada", ""]);

  }

  //adiciona todos os tabuleiros do sesmestre criado a planilha.
  TABULEIROS_SHEET.insertRowsBefore(2, values.length);
  TABULEIROS_SHEET.getRange(2, 1, values.length, values[0].length).setValues(values);

}

/**
 * Encontra as linhas em que o tabuleiro que fez a requisição esta relacionado.
 * @param {string} tabuleiro_id Id do tabuleiro que fez a requisição
 * @param {string[][]} data Dados da planilha 'Tabuleiros'
 * @return {string[][]} Array de índices dos 'Tabuleiros' relacionados
 */
function findIndexes(tabuleiro_id, data) {

  // el[8] == array[index][8] - ISTO É A MESMA COISA 
  // console.log(this);

  var output = [];

  // percorre cada linha dos tabuleiros 
  for (var i = 1; i < data.length; i++) {

    // verifica se o campo tabuleiros vinculados é diferente de vazio.
    if (data[i][8] != "") {

      var related_ids = data[i][8].split(" , ");

      if (related_ids.includes(tabuleiro_id)) {
        output.push(i);
      }

    }
  }

  return output;
}

/**
 * Compara os tabuleiros vinculados, atualizando todas as linhas relacionadas (incluíndo as que foram removidas dos tabuleiros sincronizados)
 * @param {string[][]} data Dados da planilha 'Tabuleiros'
 * @param {string[]} indexes Array de índices dos 'Tabuleiros' relacionados,
 * @param {string[]} new_tabuleiros_vinculados Array de Id's dos tabuleiros atualizados
 */
function compareTabuleirosVinculados(data, indexes, new_tabuleiros_vinculados) {

  for (var i = 0; i < indexes.length; i++) { // LINHAS EXATAS
    var related_ids = data[indexes[i]][8].split(" , "); //RELATED TABULEIROS da Linha XX    --- indexes TO INDEX
    var output = [];
    var cur_id = data[indexes[i]][0]
    var rows_to_add = [];

    // console.warn("ROW: " + (indexes[i] + 1) + " - " + "ID: " + cur_id)
    // console.warn("NIDS: " + new_tabuleiros_vinculados);
    // console.warn("CUR: " + related_ids);
    // console.log("REMOVENDO - - - - ")

    // CODE TO REMOVE
    for (var j = 0; j < related_ids.length; j++) {

      // console.log("NIDS[" + new_tabuleiros_vinculados + "] includes CUR[" + related_ids[j] + "] ? " + (new_tabuleiros_vinculados.includes(related_ids[j])))

      if (new_tabuleiros_vinculados.includes(related_ids[j])) {
        console.log("Persisistindo " + related_ids[j])
        output.push(related_ids[j]);
      } else {
        console.log("Removendo " + related_ids[j])
      }
    }

    // console.log("NEW_CUR: " + output);
    // console.log("ADICIONANDO - - - - ")

    // CODE TO ADD
    for (var k = 0; k < new_tabuleiros_vinculados.length; k++) {

      if (related_ids.includes(new_tabuleiros_vinculados[k])) {
        // console.log("Persisistindo " + new_tabuleiros_vinculados[k])
      } else {
        // console.log("Adicionando: " + new_tabuleiros_vinculados[k])
        rows_to_add.push((indexes[i] + 1));
        output.push(new_tabuleiros_vinculados[k]);
      }
    }

    // console.log("NEW_CUR: " + output);
    // console.log("\n\n\n\output: "+ output + "\nID: " + cur_id + "\noutput.includes(cur_id) ? " + (output.includes(cur_id)))

    if (output.includes(cur_id)) {
      // REALIZA O UPDATE DOS DADOS APENAS DOS TABULEIROS RELACIONADOS AO EVOCADOR DA FUNÇÃO
      TABULEIROS_SHEET.getRange((indexes[i] + 1), 9).setValue(arrayStr(output));
      // console.info("Atualizando referências na linha: " + (indexes[i] + 1))

    } else {
      //  SE O ID EXCLUIDO, FOR IGUAL AO ID ATUAL, ESTA LINHA PRECISA TER OS TABULEIROS ATUALIZADOS EXCLUIDOS
      TABULEIROS_SHEET.getRange(indexes[i] + 1, 9).clearContent();
      // console.info("Removendo referência da linha: " + (indexes[i] + 1))
    }
  }
}

/**
 * Sincroniza os tabuleiros vinculados, replicando a informação de quais tabuleiros estão vinculado, atualizando todas as ocorrencias relacionadas.
 * @param {string} tabuleiro_id Id do tabuleiro que fez a requisição
 * @param {string[]} new_tabuleiros_vinculados Ids dos tabuleiros relacionados  
 */
function syncTabuleirosVinculados(tabuleiro_id, new_tabuleiros_vinculados) {

  var rows_to_update = [];

  // verifica se o tabuleiro atual, esta relacionado com ele mesmo, se não o adiciona ao conjunto.
  new_tabuleiros_vinculados.includes(tabuleiro_id) ? "" : new_tabuleiros_vinculados.push(tabuleiro_id);

  var data = TABULEIROS_SHEET.getSheetValues(1, 1, ss.getMaxRows(), ss.getMaxColumns());

  // percorre a lista de tabuleiros vinculados, buscando apenas as linhas onde estão os id's dos tabuleiros_vinculados
  for (var i = 0; i < new_tabuleiros_vinculados.length; i++) {
    var search_function = (element) => element[0] == new_tabuleiros_vinculados[i];
    rows_to_update.push(data.findIndex(search_function) + 1);
  }

  // para cada linha a ser atualizada, atualize o valor dos tabuleiros relacionados
  for (var j = 0; j < rows_to_update.length; j++) {
    ss.getRange(rows_to_update[j], 9).setValue(arrayStr(new_tabuleiros_vinculados));
  }

  var indexes = findIndexes(tabuleiro_id, data); // Encontra as linhas em que o Tabuleiro Solicitante aparece -> utilizado para sincronizar remoções.
  compareTabuleirosVinculados(data, indexes, new_tabuleiros_vinculados) // compara a nova array de elementos com as linhas relacionadas. 

}