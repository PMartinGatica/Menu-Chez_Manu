/**
 * CHEZ MANU - GOOGLE APPS SCRIPT
 * Sistema de gestión de menú con CRUD completo
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Crear un nuevo Google Sheet
 * 2. Ir a Extensiones > Apps Script
 * 3. Copiar todo este código
 * 4. Guardar y desplegar como aplicación web
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const SHEET_NAMES = {
  ENTREES: 'Entrées',
  PLATS: 'Plats Principaux',
  DESSERTS: 'Desserts',
  VINOS: 'Vinos'
};

const COLUMNS = {
  ID: 0,
  NOMBRE_ES: 1,
  NOMBRE_EN: 2,
  DESCRIPCION_ES: 3,
  DESCRIPCION_EN: 4,
  PRECIO: 5,
  CATEGORIA: 6,
  SUBCATEGORIA: 7,
  ACTIVO: 8,
  FECHA_ACTUALIZACION: 9
};

// ============================================
// INICIALIZACIÓN DE HOJAS
// ============================================

function inicializarHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.values(SHEET_NAMES).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);

      // Encabezados
      const headers = [
        'ID',
        'Nombre (ES)',
        'Nombre (EN)',
        'Descripción (ES)',
        'Descripción (EN)',
        'Precio',
        'Categoría',
        'Subcategoría',
        'Activo',
        'Última Actualización'
      ];

      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#8B0000');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);

      // Ajustar anchos de columna
      sheet.setColumnWidth(1, 80);  // ID
      sheet.setColumnWidth(2, 250); // Nombre ES
      sheet.setColumnWidth(3, 250); // Nombre EN
      sheet.setColumnWidth(4, 200); // Descripción ES
      sheet.setColumnWidth(5, 200); // Descripción EN
      sheet.setColumnWidth(6, 100); // Precio
      sheet.setColumnWidth(7, 120); // Categoría
      sheet.setColumnWidth(8, 120); // Subcategoría
      sheet.setColumnWidth(9, 80);  // Activo
      sheet.setColumnWidth(10, 150); // Fecha
    }
  });

  return 'Hojas inicializadas correctamente';
}

// ============================================
// POBLAR CON DATOS INICIALES
// ============================================

function poblarDatosIniciales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ENTRÉES
  const entreesSheet = ss.getSheetByName(SHEET_NAMES.ENTREES);
  const entreesData = [
    [1, 'Cojinova ahumada con pickles de salicornia', 'Smoked silverside with samphire', '', '', 29000, 'Entrées', 'Mar', true, new Date()],
    [2, 'Centolla con Vieiras marinadas en agua de mar', 'King Crab and Marinated scallops in seawater', '', '', 39000, 'Entrées', 'Mar', true, new Date()],
    [3, 'Carpaccio de peceto de cordero, hojas verdes, queso de oveja', 'Lamb Carpaccio', '', '', 25500, 'Entrées', 'Tierra', true, new Date()],
    [4, 'Terrine de porc de ma grand-mère, jamón crudo y quesos', "My grandmother's pork terrine, cured ham, and cheeses", '', '', 26000, 'Entrées', 'Tierra', true, new Date()]
  ];
  entreesSheet.getRange(2, 1, entreesData.length, entreesData[0].length).setValues(entreesData);

  // PLATS PRINCIPAUX
  const platsSheet = ss.getSheetByName(SHEET_NAMES.PLATS);
  const platsData = [
    [1, 'Merluza negra en agua de mar', 'black hake in seawater', '', '', 51500, 'Plats', 'La Mer', true, new Date()],
    [2, 'Vieiras Gratinadas del Atlántico Sur', 'Gratinated South Atlantic Scallops', '', '', 36200, 'Plats', 'La Mer', true, new Date()],
    [3, 'Risotto con hongos patagónicos', 'Patagonian mushroom risotto', '', '', 34000, 'Plats', 'La Mer', true, new Date()],
    [4, 'Duo de cordero "Chez Manu"', 'Lamb duo "Chez Manu"', '', '', 40500, 'Plats', 'La Terre', true, new Date()],
    [5, 'Codillo de cerdo Fueguino', 'Tierra del Fuego Pork Knuckle', '', '', 44000, 'Plats', 'La Terre', true, new Date()],
    [6, 'Solomillo de Cerdo con Mostaza Dillon', 'Pork Tenderloin With Dijon Mustard', '', '', 38000, 'Plats', 'La Terre', true, new Date()]
  ];
  platsSheet.getRange(2, 1, platsData.length, platsData[0].length).setValues(platsData);

  // DESSERTS
  const dessertsSheet = ss.getSheetByName(SHEET_NAMES.DESSERTS);
  const dessertsData = [
    [1, 'Crème brûlée "tradition"', 'Crème brûlée "tradition"', '(crema aromatizada de vainilla)', '', 10500, 'Desserts', '', true, new Date()],
    [2, 'Tarte TATIN de manzana y helado de vanilla', 'Tarte TATIN de manzana y helado de vanilla', '', '', 12000, 'Desserts', '', true, new Date()],
    [3, 'Pera épicée en infusión de calafate, helado de mascarpone', 'Spiced pear in calafate infusion', '', '', 10800, 'Desserts', '', true, new Date()],
    [4, 'Fuego sobre el glaciar', '"Fire over the Glacier"', '(helado recubierto en merengue, flambée)', '(ice cream coated in meringue, flambéed)', 9500, 'Desserts', '', true, new Date()],
    [5, 'Tarta de chocolate caliente y helado', 'Hot chocolate cake, and ice cream', '', '', 14000, 'Desserts', '', true, new Date()],
    [6, 'Copa de Helado artesanal', 'Copa de Helado artesanal', '', '', 7000, 'Desserts', '', true, new Date()]
  ];
  dessertsSheet.getRange(2, 1, dessertsData.length, dessertsData[0].length).setValues(dessertsData);

  // VINOS
  const vinosSheet = ss.getSheetByName(SHEET_NAMES.VINOS);
  const vinosData = [
    // BLANCOS ARGENTINOS - Chardonnay
    [1, 'Luca', '', '', '', 48000, 'Vinos', 'Blancos Argentinos - Chardonnay', true, new Date()],
    [2, 'Lagarde', '', '', '', 26000, 'Vinos', 'Blancos Argentinos - Chardonnay', true, new Date()],
    [3, 'Angelica Zapata', '', '', '', 56000, 'Vinos', 'Blancos Argentinos - Chardonnay', true, new Date()],
    [4, 'Escorihuela Gascón Gran Reserva', '', '', '', 44000, 'Vinos', 'Blancos Argentinos - Chardonnay', true, new Date()],

    // BLANCOS ARGENTINOS - Sauvignon Blanc
    [5, 'Luigi Bosca', '', '', '', 45000, 'Vinos', 'Blancos Argentinos - Sauvignon Blanc', true, new Date()],
    [6, 'Rutini', '', '', '', 35000, 'Vinos', 'Blancos Argentinos - Sauvignon Blanc', true, new Date()],
    [7, 'Pequeñas Producciones', '', '', '', 50000, 'Vinos', 'Blancos Argentinos - Sauvignon Blanc', true, new Date()],
    [8, 'Trumpeter', '', '', '', 18000, 'Vinos', 'Blancos Argentinos - Sauvignon Blanc', true, new Date()],

    // BLANCOS ARGENTINOS - Torrontés
    [9, 'Altaland', '', '', '', 23000, 'Vinos', 'Blancos Argentinos - Torrontés', true, new Date()],
    [10, 'Alta vista Olympe', '', '', '', 55000, 'Vinos', 'Blancos Argentinos - Torrontés', true, new Date()],

    // BLANCOS ARGENTINOS - Gewürztraminer
    [11, 'Rutini', '', '', '', 52000, 'Vinos', 'Blancos Argentinos - Gewürztraminer', true, new Date()],

    // ESPUMANTE ARGENTINO
    [12, 'La Posta Nature', '', '', '', 40000, 'Vinos', 'Espumante Argentino', true, new Date()],
    [13, 'Baron B Extra Brut', '', '', '', 55000, 'Vinos', 'Espumante Argentino', true, new Date()],

    // CHAMPAGNE
    [14, 'Veuve Clicquot Brut Yellow Label', '', '', '', 350000, 'Vinos', 'Champagne', true, new Date()],
    [15, 'Moet & Chandon Impérial Brut', '', '', '', 330000, 'Vinos', 'Champagne', true, new Date()],

    // TINTOS ARGENTINOS - Malbec
    [16, 'Rutini', '', '', '', 50000, 'Vinos', 'Tintos Argentinos - Malbec', true, new Date()],
    [17, 'Luca', '', '', '', 59000, 'Vinos', 'Tintos Argentinos - Malbec', true, new Date()],
    [18, 'Angelica Zapata Alta', '', '', '', 70000, 'Vinos', 'Tintos Argentinos - Malbec', true, new Date()],
    [19, 'Aruma', '', '', '', 60000, 'Vinos', 'Tintos Argentinos - Malbec', true, new Date()],

    // TINTOS ARGENTINOS - Pinot Noir
    [20, 'Rutini', '', '', '', 56000, 'Vinos', 'Tintos Argentinos - Pinot Noir', true, new Date()],
    [21, 'La Posta Glorieta', '', '', '', 27000, 'Vinos', 'Tintos Argentinos - Pinot Noir', true, new Date()],
    [22, 'Humberto Canale Old Vineyard', '', '', '', 58000, 'Vinos', 'Tintos Argentinos - Pinot Noir', true, new Date()],
    [23, 'Araucana Río de los Ciervos', '', '', '', 60000, 'Vinos', 'Tintos Argentinos - Pinot Noir', true, new Date()],

    // TINTOS ARGENTINOS - Cabernet Sauvignon
    [24, 'Trumpeter', '', '', '', 18000, 'Vinos', 'Tintos Argentinos - Cabernet Sauvignon', true, new Date()],
    [25, 'Piattelli Reserve', '', '', '', 34000, 'Vinos', 'Tintos Argentinos - Cabernet Sauvignon', true, new Date()],
    [26, 'Passion de los Andes - Collection -', '', '', '', 38000, 'Vinos', 'Tintos Argentinos - Cabernet Sauvignon', true, new Date()],

    // TINTOS ARGENTINOS - Syrah
    [27, 'Escorihuela Gascon', '', '', '', 33000, 'Vinos', 'Tintos Argentinos - Syrah', true, new Date()],
    [28, 'Altaland', '', '', '', 25000, 'Vinos', 'Tintos Argentinos - Syrah', true, new Date()],
    [29, 'Pequeñas Producciones', '', '', '', 54000, 'Vinos', 'Tintos Argentinos - Syrah', true, new Date()],

    // TINTOS ARGENTINOS - Merlot
    [30, 'Rutini', '', '', '', 32000, 'Vinos', 'Tintos Argentinos - Merlot', true, new Date()],
    [31, 'Humberto Canale Estate', '', '', '', 30000, 'Vinos', 'Tintos Argentinos - Merlot', true, new Date()],

    // TINTOS ARGENTINOS - Petit Verdot
    [32, 'Passion de los Andes', '', '', '', 32000, 'Vinos', 'Tintos Argentinos - Petit Verdot', true, new Date()],

    // TINTOS ARGENTINOS - Blends
    [33, 'Clos de los 7', '', '', '', 36000, 'Vinos', 'Tintos Argentinos - Blends', true, new Date()],
    [34, 'Luca Beso de Dante', '', '', '', 95000, 'Vinos', 'Tintos Argentinos - Blends', true, new Date()],
    [35, 'MEG Escorihuela Gascón', '', '', '', 120000, 'Vinos', 'Tintos Argentinos - Blends', true, new Date()]
  ];
  vinosSheet.getRange(2, 1, vinosData.length, vinosData[0].length).setValues(vinosData);

  return 'Datos iniciales cargados correctamente (incluye vinos)';
}

// ============================================
// FUNCIÓN PRINCIPAL - WEB APP
// ============================================

function doGet(e) {
  const params = e.parameter;
  const action = params.action;

  let response;

  try {
    switch(action) {
      case 'getMenu':
        response = getMenu();
        break;
      case 'getCategoria':
        response = getCategoria(params.categoria);
        break;
      default:
        response = { error: 'Acción no válida' };
    }
  } catch (error) {
    response = { error: error.toString() };
  }

  // Respuesta con headers CORS
  const output = ContentService.createTextOutput(JSON.stringify(response));
  output.setMimeType(ContentService.MimeType.JSON);

  return output;
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;

  let response;

  try {
    switch(action) {
      case 'addItem':
        response = addItem(params.data);
        break;
      case 'updateItem':
        response = updateItem(params.data);
        break;
      case 'deleteItem':
        response = deleteItem(params.data);
        break;
      case 'toggleActivo':
        response = toggleActivo(params.data);
        break;
      default:
        response = { error: 'Acción no válida' };
    }
  } catch (error) {
    response = { error: error.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// FUNCIONES CRUD
// ============================================

/**
 * Obtener todo el menú
 */
function getMenu() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const menu = {
    entrees: [],
    plats: [],
    desserts: [],
    vinos: [],
    lastUpdate: new Date().toISOString()
  };

  // Leer Entrées
  const entreesSheet = ss.getSheetByName(SHEET_NAMES.ENTREES);
  if (entreesSheet) {
    const entreesData = entreesSheet.getDataRange().getValues();
    menu.entrees = parseSheetData(entreesData);
  }

  // Leer Plats
  const platsSheet = ss.getSheetByName(SHEET_NAMES.PLATS);
  if (platsSheet) {
    const platsData = platsSheet.getDataRange().getValues();
    menu.plats = parseSheetData(platsData);
  }

  // Leer Desserts
  const dessertsSheet = ss.getSheetByName(SHEET_NAMES.DESSERTS);
  if (dessertsSheet) {
    const dessertsData = dessertsSheet.getDataRange().getValues();
    menu.desserts = parseSheetData(dessertsData);
  }

  // Leer Vinos
  const vinosSheet = ss.getSheetByName(SHEET_NAMES.VINOS);
  if (vinosSheet) {
    const vinosData = vinosSheet.getDataRange().getValues();
    menu.vinos = parseSheetData(vinosData);
  }

  return menu;
}

/**
 * Obtener items por categoría
 */
function getCategoria(categoria) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetName;

  switch(categoria.toLowerCase()) {
    case 'entrees':
      sheetName = SHEET_NAMES.ENTREES;
      break;
    case 'plats':
      sheetName = SHEET_NAMES.PLATS;
      break;
    case 'desserts':
      sheetName = SHEET_NAMES.DESSERTS;
      break;
    default:
      return { error: 'Categoría no válida' };
  }

  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return { error: 'Hoja no encontrada' };
  }

  const data = sheet.getDataRange().getValues();
  return parseSheetData(data);
}

/**
 * Agregar nuevo item
 */
function addItem(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(data.categoria);

  if (!sheet) {
    return { success: false, error: 'Categoría no válida' };
  }

  const lastRow = sheet.getLastRow();
  const newId = lastRow > 1 ? sheet.getRange(lastRow, COLUMNS.ID + 1).getValue() + 1 : 1;

  const newRow = [
    newId,
    data.nombreEs || '',
    data.nombreEn || '',
    data.descripcionEs || '',
    data.descripcionEn || '',
    data.precio || 0,
    data.categoria || '',
    data.subcategoria || '',
    data.activo !== false,
    new Date()
  ];

  sheet.appendRow(newRow);

  return {
    success: true,
    message: 'Item agregado correctamente',
    id: newId
  };
}

/**
 * Actualizar item existente
 */
function updateItem(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(data.categoria);

  if (!sheet) {
    return { success: false, error: 'Categoría no válida' };
  }

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  // Buscar el item por ID
  for (let i = 1; i < values.length; i++) {
    if (values[i][COLUMNS.ID] == data.id) {
      const rowNum = i + 1;

      // Actualizar los campos
      if (data.nombreEs !== undefined) sheet.getRange(rowNum, COLUMNS.NOMBRE_ES + 1).setValue(data.nombreEs);
      if (data.nombreEn !== undefined) sheet.getRange(rowNum, COLUMNS.NOMBRE_EN + 1).setValue(data.nombreEn);
      if (data.descripcionEs !== undefined) sheet.getRange(rowNum, COLUMNS.DESCRIPCION_ES + 1).setValue(data.descripcionEs);
      if (data.descripcionEn !== undefined) sheet.getRange(rowNum, COLUMNS.DESCRIPCION_EN + 1).setValue(data.descripcionEn);
      if (data.precio !== undefined) sheet.getRange(rowNum, COLUMNS.PRECIO + 1).setValue(data.precio);
      if (data.subcategoria !== undefined) sheet.getRange(rowNum, COLUMNS.SUBCATEGORIA + 1).setValue(data.subcategoria);
      if (data.activo !== undefined) sheet.getRange(rowNum, COLUMNS.ACTIVO + 1).setValue(data.activo);

      sheet.getRange(rowNum, COLUMNS.FECHA_ACTUALIZACION + 1).setValue(new Date());

      return {
        success: true,
        message: 'Item actualizado correctamente'
      };
    }
  }

  return { success: false, error: 'Item no encontrado' };
}

/**
 * Eliminar item (soft delete - marcar como inactivo)
 */
function deleteItem(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(data.categoria);

  if (!sheet) {
    return { success: false, error: 'Categoría no válida' };
  }

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][COLUMNS.ID] == data.id) {
      const rowNum = i + 1;

      if (data.hard === true) {
        // Hard delete - eliminar la fila
        sheet.deleteRow(rowNum);
      } else {
        // Soft delete - marcar como inactivo
        sheet.getRange(rowNum, COLUMNS.ACTIVO + 1).setValue(false);
        sheet.getRange(rowNum, COLUMNS.FECHA_ACTUALIZACION + 1).setValue(new Date());
      }

      return {
        success: true,
        message: 'Item eliminado correctamente'
      };
    }
  }

  return { success: false, error: 'Item no encontrado' };
}

/**
 * Cambiar estado activo/inactivo
 */
function toggleActivo(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(data.categoria);

  if (!sheet) {
    return { success: false, error: 'Categoría no válida' };
  }

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][COLUMNS.ID] == data.id) {
      const rowNum = i + 1;
      const currentStatus = values[i][COLUMNS.ACTIVO];

      sheet.getRange(rowNum, COLUMNS.ACTIVO + 1).setValue(!currentStatus);
      sheet.getRange(rowNum, COLUMNS.FECHA_ACTUALIZACION + 1).setValue(new Date());

      return {
        success: true,
        message: 'Estado actualizado correctamente',
        newStatus: !currentStatus
      };
    }
  }

  return { success: false, error: 'Item no encontrado' };
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Parsear datos de la hoja a objetos JSON
 */
function parseSheetData(data) {
  const items = [];

  // Saltar la fila de encabezados (índice 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Solo incluir items activos
    if (row[COLUMNS.ACTIVO] === true || row[COLUMNS.ACTIVO] === 'TRUE' || row[COLUMNS.ACTIVO] === 1) {
      items.push({
        id: row[COLUMNS.ID],
        nombreEs: row[COLUMNS.NOMBRE_ES],
        nombreEn: row[COLUMNS.NOMBRE_EN],
        descripcionEs: row[COLUMNS.DESCRIPCION_ES],
        descripcionEn: row[COLUMNS.DESCRIPCION_EN],
        precio: row[COLUMNS.PRECIO],
        categoria: row[COLUMNS.CATEGORIA],
        subcategoria: row[COLUMNS.SUBCATEGORIA],
        activo: row[COLUMNS.ACTIVO],
        ultimaActualizacion: row[COLUMNS.FECHA_ACTUALIZACION]
      });
    }
  }

  return items;
}

/**
 * Obtener todas las filas (incluyendo inactivas) - para administración
 */
function getAllItems(categoria) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(categoria);

  if (!sheet) {
    return { error: 'Categoría no válida' };
  }

  const data = sheet.getDataRange().getValues();
  const items = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    items.push({
      id: row[COLUMNS.ID],
      nombreEs: row[COLUMNS.NOMBRE_ES],
      nombreEn: row[COLUMNS.NOMBRE_EN],
      descripcionEs: row[COLUMNS.DESCRIPCION_ES],
      descripcionEn: row[COLUMNS.DESCRIPCION_EN],
      precio: row[COLUMNS.PRECIO],
      categoria: row[COLUMNS.CATEGORIA],
      subcategoria: row[COLUMNS.SUBCATEGORIA],
      activo: row[COLUMNS.ACTIVO],
      ultimaActualizacion: row[COLUMNS.FECHA_ACTUALIZACION]
    });
  }

  return items;
}

// ============================================
// TRIGGERS AUTOMÁTICOS
// ============================================

/**
 * Crear trigger para actualización automática
 */
function crearTriggerActualizacion() {
  // Eliminar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Crear nuevo trigger
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
}

/**
 * Función que se ejecuta al editar
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // Solo actualizar fecha si se edita una celda de datos (no encabezados)
  if (range.getRow() > 1) {
    const fechaCol = COLUMNS.FECHA_ACTUALIZACION + 1;
    sheet.getRange(range.getRow(), fechaCol).setValue(new Date());
  }
}

// ============================================
// EXPORTACIÓN A PDF
// ============================================

/**
 * Generar PDF de toda la carta (para imprimir)
 * Esta función se ejecuta manualmente desde el menú personalizado
 */
function generarCartaCompletaPDF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const doc = DocumentApp.create('Carta Chez Manu - ' + new Date().toLocaleDateString());
  const body = doc.getBody();

  // Configurar el documento
  body.setMarginTop(50);
  body.setMarginBottom(50);
  body.setMarginLeft(70);
  body.setMarginRight(70);

  // Logo y Header
  const header = body.appendParagraph('Chez Manu');
  header.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  header.setFontSize(24);
  header.setBold(true);
  header.setFontFamily('Georgia');

  const subtitle = body.appendParagraph('Restaurant\nUshuaia - Tierra del Fuego');
  subtitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  subtitle.setFontSize(10);
  subtitle.setFontFamily('Georgia');
  subtitle.setItalic(true);

  body.appendHorizontalRule();
  body.appendParagraph(''); // Espacio

  // ENTRÉES
  agregarSeccionAlPDF(body, 'Nos Entrées', SHEET_NAMES.ENTREES, ss);

  // PLATS PRINCIPAUX
  agregarSeccionAlPDF(body, 'Nos Assiettes Principales', SHEET_NAMES.PLATS, ss);

  // DESSERTS
  agregarSeccionAlPDF(body, 'Nos desserts', SHEET_NAMES.DESSERTS, ss);

  // PÁGINA NUEVA PARA VINOS
  body.appendPageBreak();

  // VINOS
  agregarSeccionVinosAlPDF(body, ss);

  // Guardar y generar PDF
  doc.saveAndClose();

  // Obtener el PDF
  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs('application/pdf');
  const pdfFile = DriveApp.createFile(pdfBlob);
  pdfFile.setName('Carta_Chez_Manu_' + new Date().toISOString().split('T')[0] + '.pdf');

  // Eliminar el documento temporal
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  // Devolver el enlace del PDF
  return {
    success: true,
    message: 'PDF generado correctamente',
    pdfUrl: pdfFile.getUrl(),
    pdfId: pdfFile.getId()
  };
}

/**
 * Agregar una sección (Entrées, Plats, Desserts) al PDF
 */
function agregarSeccionAlPDF(body, titulo, sheetName, ss) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  // Título de sección
  body.appendParagraph(''); // Espacio
  const sectionTitle = body.appendParagraph(titulo);
  sectionTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sectionTitle.setFontSize(18);
  sectionTitle.setForegroundColor('#8B0000');
  sectionTitle.setBold(true);
  sectionTitle.setItalic(true);
  body.appendParagraph(''); // Espacio

  // Agrupar por subcategoría
  const itemsPorSubcategoria = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const activo = row[COLUMNS.ACTIVO];

    if (activo) {
      const subcategoria = row[COLUMNS.SUBCATEGORIA] || 'General';
      if (!itemsPorSubcategoria[subcategoria]) {
        itemsPorSubcategoria[subcategoria] = [];
      }
      itemsPorSubcategoria[subcategoria].push(row);
    }
  }

  // Renderizar items por subcategoría
  for (const subcategoria in itemsPorSubcategoria) {
    if (subcategoria !== 'General' && subcategoria !== '') {
      const subTitle = body.appendParagraph(subcategoria);
      subTitle.setFontSize(14);
      subTitle.setForegroundColor('#4169E1');
      subTitle.setItalic(true);
      subTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      body.appendParagraph(''); // Espacio
    }

    itemsPorSubcategoria[subcategoria].forEach(row => {
      const nombreEs = row[COLUMNS.NOMBRE_ES];
      const nombreEn = row[COLUMNS.NOMBRE_EN];
      const descripcionEs = row[COLUMNS.DESCRIPCION_ES];
      const descripcionEn = row[COLUMNS.DESCRIPCION_EN];
      const precio = row[COLUMNS.PRECIO];

      // Nombre en español
      const itemName = body.appendParagraph(nombreEs);
      itemName.setFontSize(11);
      itemName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

      // Nombre en inglés
      if (nombreEn) {
        const itemNameEn = body.appendParagraph(nombreEn);
        itemNameEn.setFontSize(10);
        itemNameEn.setItalic(true);
        itemNameEn.setForegroundColor('#666666');
        itemNameEn.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      }

      // Descripciones
      if (descripcionEs) {
        const desc = body.appendParagraph(descripcionEs);
        desc.setFontSize(9);
        desc.setForegroundColor('#777777');
        desc.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      }

      if (descripcionEn) {
        const descEn = body.appendParagraph(descripcionEn);
        descEn.setFontSize(9);
        descEn.setItalic(true);
        descEn.setForegroundColor('#777777');
        descEn.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      }

      // Precio
      const itemPrice = body.appendParagraph('$' + precio.toLocaleString('es-AR'));
      itemPrice.setFontSize(11);
      itemPrice.setItalic(true);
      itemPrice.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

      body.appendParagraph(''); // Espacio entre items
    });
  }
}

/**
 * Agregar sección de vinos al PDF (organizada especialmente)
 */
function agregarSeccionVinosAlPDF(body, ss) {
  const sheet = ss.getSheetByName(SHEET_NAMES.VINOS);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  // Título principal
  const mainTitle = body.appendParagraph('Carta de Vinos');
  mainTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  mainTitle.setFontSize(20);
  mainTitle.setForegroundColor('#8B0000');
  mainTitle.setBold(true);
  body.appendParagraph(''); // Espacio

  // Agrupar vinos por categoría principal y subcategoría
  const vinosPorCategoria = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const activo = row[COLUMNS.ACTIVO];

    if (activo) {
      const subcategoria = row[COLUMNS.SUBCATEGORIA];
      if (!vinosPorCategoria[subcategoria]) {
        vinosPorCategoria[subcategoria] = [];
      }
      vinosPorCategoria[subcategoria].push(row);
    }
  }

  // Renderizar vinos por categoría
  let categoriaActual = '';

  for (const subcategoria in vinosPorCategoria) {
    // Detectar categoría principal (antes del guión)
    const partes = subcategoria.split(' - ');
    const categoriaPrincipal = partes[0];
    const varietal = partes[1] || '';

    // Si cambió la categoría principal, mostrar título
    if (categoriaPrincipal !== categoriaActual) {
      categoriaActual = categoriaPrincipal;
      body.appendParagraph(''); // Espacio
      const catTitle = body.appendParagraph(categoriaPrincipal.toUpperCase());
      catTitle.setFontSize(14);
      catTitle.setForegroundColor('#8B0000');
      catTitle.setBold(true);
      catTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      body.appendParagraph(''); // Espacio
    }

    // Mostrar varietal/tipo si existe
    if (varietal) {
      const varTitle = body.appendParagraph(varietal);
      varTitle.setFontSize(12);
      varTitle.setForegroundColor('#8B0000');
      varTitle.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      body.appendParagraph(''); // Espacio pequeño
    }

    // Listar vinos de esta categoría
    vinosPorCategoria[subcategoria].forEach(row => {
      const nombre = row[COLUMNS.NOMBRE_ES];
      const precio = row[COLUMNS.PRECIO];

      // Crear tabla de 2 columnas (nombre - precio)
      const table = body.appendTable();
      const tableRow = table.appendTableRow();

      const cellNombre = tableRow.appendTableCell(nombre);
      cellNombre.setPaddingLeft(0);
      cellNombre.setPaddingRight(10);
      cellNombre.getChild(0).asParagraph().setFontSize(10);

      const cellPrecio = tableRow.appendTableCell('$' + precio.toLocaleString('es-AR'));
      cellPrecio.setPaddingLeft(10);
      cellPrecio.getChild(0).asParagraph().setFontSize(10);
      cellPrecio.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);

      table.setBorderWidth(0);
    });

    body.appendParagraph(''); // Espacio
  }
}

// ============================================
// GENERAR PDFs INDIVIDUALES POR SECCIÓN
// ============================================

/**
 * Crear header con logo para PDFs individuales
 */
function crearHeaderPDF(body) {
  // Logo y Header
  const header = body.appendParagraph('Chez Manu');
  header.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  header.setFontSize(24);
  header.setBold(true);
  header.setFontFamily('Georgia');

  const subtitle = body.appendParagraph('RESTAURANT\n\nUshuaia\nTierra del Fuego');
  subtitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  subtitle.setFontSize(10);
  subtitle.setFontFamily('Georgia');

  body.appendParagraph(''); // Espacio
  body.appendParagraph(''); // Espacio
}

/**
 * Generar PDF: Nos Entrées
 */
function generarPDFEntrees() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.ENTREES);
  if (!sheet) return { success: false, error: 'Hoja de Entrées no encontrada' };

  const doc = DocumentApp.create('Nos Entrées - ' + new Date().toLocaleDateString());
  const body = doc.getBody();

  // Configurar márgenes
  body.setMarginTop(80);
  body.setMarginBottom(80);
  body.setMarginLeft(80);
  body.setMarginRight(80);

  // Header con logo
  crearHeaderPDF(body);

  // Título de sección en rojo
  const sectionTitle = body.appendParagraph('Nos Entrées');
  sectionTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sectionTitle.setFontSize(18);
  sectionTitle.setForegroundColor('#8B0000');
  sectionTitle.setBold(false);
  sectionTitle.setItalic(true);
  sectionTitle.setFontFamily('Georgia');

  body.appendParagraph(''); // Espacio
  body.appendParagraph(''); // Espacio

  // Obtener items activos
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const activo = row[COLUMNS.ACTIVO];

    if (activo) {
      const nombreEs = row[COLUMNS.NOMBRE_ES];
      const nombreEn = row[COLUMNS.NOMBRE_EN];
      const precio = row[COLUMNS.PRECIO];

      // Nombre en español (centrado)
      const itemName = body.appendParagraph(nombreEs);
      itemName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemName.setFontSize(11);
      itemName.setFontFamily('Georgia');

      // Nombre en inglés (centrado, itálico, gris)
      if (nombreEn) {
        const itemNameEn = body.appendParagraph(nombreEn);
        itemNameEn.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        itemNameEn.setFontSize(10);
        itemNameEn.setItalic(true);
        itemNameEn.setFontFamily('Georgia');
      }

      // Precio (centrado, itálico)
      const itemPrice = body.appendParagraph('$' + precio.toLocaleString('es-AR'));
      itemPrice.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemPrice.setFontSize(11);
      itemPrice.setItalic(true);
      itemPrice.setFontFamily('Georgia');

      body.appendParagraph(''); // Espacio
      body.appendParagraph(''); // Espacio adicional
    }
  }

  // Guardar y generar PDF
  doc.saveAndClose();
  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs('application/pdf');
  const pdfFile = DriveApp.createFile(pdfBlob);
  pdfFile.setName('Nos_Entrees_' + new Date().toISOString().split('T')[0] + '.pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  return {
    success: true,
    message: 'PDF de Entrées generado correctamente',
    pdfUrl: pdfFile.getUrl(),
    pdfId: pdfFile.getId()
  };
}

/**
 * Generar PDF: Nos Assiettes Principales
 */
function generarPDFPlats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PLATS);
  if (!sheet) return { success: false, error: 'Hoja de Plats no encontrada' };

  const doc = DocumentApp.create('Nos Assiettes Principales - ' + new Date().toLocaleDateString());
  const body = doc.getBody();

  // Configurar márgenes
  body.setMarginTop(80);
  body.setMarginBottom(80);
  body.setMarginLeft(80);
  body.setMarginRight(80);

  // Header con logo
  crearHeaderPDF(body);

  // Título de sección en rojo
  const sectionTitle = body.appendParagraph('Nos Assiettes Principales');
  sectionTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sectionTitle.setFontSize(18);
  sectionTitle.setForegroundColor('#8B0000');
  sectionTitle.setBold(false);
  sectionTitle.setItalic(true);
  sectionTitle.setFontFamily('Georgia');

  body.appendParagraph(''); // Espacio
  body.appendParagraph(''); // Espacio

  // Obtener items y agrupar por subcategoría
  const data = sheet.getDataRange().getValues();
  const itemsPorSubcategoria = { 'La Mer': [], 'La Terre': [] };

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const activo = row[COLUMNS.ACTIVO];
    const subcategoria = row[COLUMNS.SUBCATEGORIA];

    if (activo && itemsPorSubcategoria[subcategoria]) {
      itemsPorSubcategoria[subcategoria].push(row);
    }
  }

  // Renderizar La Mer
  if (itemsPorSubcategoria['La Mer'].length > 0) {
    const subTitle = body.appendParagraph('La Mer');
    subTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    subTitle.setFontSize(14);
    subTitle.setForegroundColor('#4169E1');
    subTitle.setItalic(true);
    subTitle.setFontFamily('Georgia');
    body.appendParagraph(''); // Espacio

    itemsPorSubcategoria['La Mer'].forEach(row => {
      const nombreEs = row[COLUMNS.NOMBRE_ES];
      const nombreEn = row[COLUMNS.NOMBRE_EN];
      const precio = row[COLUMNS.PRECIO];

      const itemName = body.appendParagraph(nombreEs);
      itemName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemName.setFontSize(11);
      itemName.setFontFamily('Georgia');

      if (nombreEn) {
        const itemNameEn = body.appendParagraph(nombreEn);
        itemNameEn.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        itemNameEn.setFontSize(10);
        itemNameEn.setItalic(true);
        itemNameEn.setFontFamily('Georgia');
      }

      const itemPrice = body.appendParagraph('$' + precio.toLocaleString('es-AR'));
      itemPrice.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemPrice.setFontSize(11);
      itemPrice.setItalic(true);
      itemPrice.setFontFamily('Georgia');

      body.appendParagraph(''); // Espacio
      body.appendParagraph(''); // Espacio adicional
    });
  }

  // Renderizar La Terre
  if (itemsPorSubcategoria['La Terre'].length > 0) {
    const subTitle = body.appendParagraph('La Terre');
    subTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    subTitle.setFontSize(14);
    subTitle.setForegroundColor('#8B0000');
    subTitle.setItalic(true);
    subTitle.setFontFamily('Georgia');
    body.appendParagraph(''); // Espacio

    itemsPorSubcategoria['La Terre'].forEach(row => {
      const nombreEs = row[COLUMNS.NOMBRE_ES];
      const nombreEn = row[COLUMNS.NOMBRE_EN];
      const precio = row[COLUMNS.PRECIO];

      const itemName = body.appendParagraph(nombreEs);
      itemName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemName.setFontSize(11);
      itemName.setFontFamily('Georgia');

      if (nombreEn) {
        const itemNameEn = body.appendParagraph(nombreEn);
        itemNameEn.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        itemNameEn.setFontSize(10);
        itemNameEn.setItalic(true);
        itemNameEn.setFontFamily('Georgia');
      }

      const itemPrice = body.appendParagraph('$' + precio.toLocaleString('es-AR'));
      itemPrice.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemPrice.setFontSize(11);
      itemPrice.setItalic(true);
      itemPrice.setFontFamily('Georgia');

      body.appendParagraph(''); // Espacio
      body.appendParagraph(''); // Espacio adicional
    });
  }

  // Guardar y generar PDF
  doc.saveAndClose();
  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs('application/pdf');
  const pdfFile = DriveApp.createFile(pdfBlob);
  pdfFile.setName('Nos_Assiettes_Principales_' + new Date().toISOString().split('T')[0] + '.pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  return {
    success: true,
    message: 'PDF de Plats generado correctamente',
    pdfUrl: pdfFile.getUrl(),
    pdfId: pdfFile.getId()
  };
}

/**
 * Generar PDF: Nos desserts
 */
function generarPDFDesserts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.DESSERTS);
  if (!sheet) return { success: false, error: 'Hoja de Desserts no encontrada' };

  const doc = DocumentApp.create('Nos desserts - ' + new Date().toLocaleDateString());
  const body = doc.getBody();

  // Configurar márgenes
  body.setMarginTop(80);
  body.setMarginBottom(80);
  body.setMarginLeft(80);
  body.setMarginRight(80);

  // Header con logo
  crearHeaderPDF(body);

  // Título de sección en rojo
  const sectionTitle = body.appendParagraph('Nos desserts');
  sectionTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sectionTitle.setFontSize(18);
  sectionTitle.setForegroundColor('#8B0000');
  sectionTitle.setBold(false);
  sectionTitle.setItalic(true);
  sectionTitle.setFontFamily('Georgia');

  body.appendParagraph(''); // Espacio
  body.appendParagraph(''); // Espacio

  // Obtener items activos
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const activo = row[COLUMNS.ACTIVO];

    if (activo) {
      const nombreEs = row[COLUMNS.NOMBRE_ES];
      const descripcionEs = row[COLUMNS.DESCRIPCION_ES];
      const nombreEn = row[COLUMNS.NOMBRE_EN];
      const descripcionEn = row[COLUMNS.DESCRIPCION_EN];
      const precio = row[COLUMNS.PRECIO];

      // Nombre en español (centrado)
      const itemName = body.appendParagraph(nombreEs);
      itemName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemName.setFontSize(11);
      itemName.setFontFamily('Georgia');

      // Descripción en español (si existe)
      if (descripcionEs) {
        const desc = body.appendParagraph(descripcionEs);
        desc.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        desc.setFontSize(10);
        desc.setFontFamily('Georgia');
      }

      // Nombre en inglés (centrado, itálico, gris)
      if (nombreEn) {
        const itemNameEn = body.appendParagraph(nombreEn);
        itemNameEn.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        itemNameEn.setFontSize(10);
        itemNameEn.setItalic(true);
        itemNameEn.setFontFamily('Georgia');
      }

      // Descripción en inglés (si existe)
      if (descripcionEn) {
        const descEn = body.appendParagraph(descripcionEn);
        descEn.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        descEn.setFontSize(9);
        descEn.setItalic(true);
        descEn.setFontFamily('Georgia');
      }

      // Precio (centrado, itálico)
      const itemPrice = body.appendParagraph('$' + precio.toLocaleString('es-AR'));
      itemPrice.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      itemPrice.setFontSize(11);
      itemPrice.setItalic(true);
      itemPrice.setFontFamily('Georgia');

      body.appendParagraph(''); // Espacio
      body.appendParagraph(''); // Espacio adicional
    }
  }

  // Guardar y generar PDF
  doc.saveAndClose();
  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs('application/pdf');
  const pdfFile = DriveApp.createFile(pdfBlob);
  pdfFile.setName('Nos_desserts_' + new Date().toISOString().split('T')[0] + '.pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  return {
    success: true,
    message: 'PDF de Desserts generado correctamente',
    pdfUrl: pdfFile.getUrl(),
    pdfId: pdfFile.getId()
  };
}

/**
 * Generar PDF: Carta de Vinos
 */
function generarPDFVinos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.VINOS);
  if (!sheet) return { success: false, error: 'Hoja de Vinos no encontrada' };

  const doc = DocumentApp.create('Carta de Vinos - ' + new Date().toLocaleDateString());
  const body = doc.getBody();

  // Configurar márgenes
  body.setMarginTop(60);
  body.setMarginBottom(60);
  body.setMarginLeft(70);
  body.setMarginRight(70);

  // Header con logo
  crearHeaderPDF(body);

  // Título principal
  const mainTitle = body.appendParagraph('Carta de Vinos');
  mainTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  mainTitle.setFontSize(18);
  mainTitle.setForegroundColor('#8B0000');
  mainTitle.setBold(false);
  mainTitle.setItalic(true);
  mainTitle.setFontFamily('Georgia');
  body.appendParagraph(''); // Espacio

  // Obtener vinos y agrupar
  const data = sheet.getDataRange().getValues();
  const vinosPorCategoria = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const activo = row[COLUMNS.ACTIVO];

    if (activo) {
      const subcategoria = row[COLUMNS.SUBCATEGORIA];
      if (!vinosPorCategoria[subcategoria]) {
        vinosPorCategoria[subcategoria] = [];
      }
      vinosPorCategoria[subcategoria].push(row);
    }
  }

  // Renderizar por categoría
  let categoriaActual = '';

  for (const subcategoria in vinosPorCategoria) {
    const partes = subcategoria.split(' - ');
    const categoriaPrincipal = partes[0];
    const varietal = partes[1] || '';

    // Título de categoría principal (BLANCOS ARGENTINOS, etc.)
    if (categoriaPrincipal !== categoriaActual) {
      categoriaActual = categoriaPrincipal;
      body.appendParagraph(''); // Espacio
      const catTitle = body.appendParagraph(categoriaPrincipal.toUpperCase());
      catTitle.setFontSize(14);
      catTitle.setForegroundColor('#8B0000');
      catTitle.setBold(true);
      catTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      catTitle.setFontFamily('Georgia');
      body.appendParagraph(''); // Espacio
    }

    // Título de varietal/tipo (Chardonnay, Malbec, etc.)
    if (varietal) {
      const varTitle = body.appendParagraph(varietal);
      varTitle.setFontSize(12);
      varTitle.setForegroundColor('#8B0000');
      varTitle.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      varTitle.setFontFamily('Georgia');
    }

    // Listar vinos
    vinosPorCategoria[subcategoria].forEach(row => {
      const nombre = row[COLUMNS.NOMBRE_ES];
      const precio = row[COLUMNS.PRECIO];

      // Usar tabla para alinear nombre y precio
      const table = body.appendTable();
      const tableRow = table.appendTableRow();

      const cellNombre = tableRow.appendTableCell(nombre);
      cellNombre.setPaddingLeft(0);
      cellNombre.setPaddingRight(20);
      cellNombre.getChild(0).asParagraph().setFontSize(10);
      cellNombre.getChild(0).asParagraph().setFontFamily('Georgia');

      const cellPrecio = tableRow.appendTableCell('$ ' + precio.toLocaleString('es-AR'));
      cellPrecio.setPaddingLeft(20);
      cellPrecio.getChild(0).asParagraph().setFontSize(10);
      cellPrecio.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      cellPrecio.getChild(0).asParagraph().setFontFamily('Georgia');

      table.setBorderWidth(0);
    });

    body.appendParagraph(''); // Espacio
  }

  // Guardar y generar PDF
  doc.saveAndClose();
  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs('application/pdf');
  const pdfFile = DriveApp.createFile(pdfBlob);
  pdfFile.setName('Carta_de_Vinos_' + new Date().toISOString().split('T')[0] + '.pdf');
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  return {
    success: true,
    message: 'PDF de Vinos generado correctamente',
    pdfUrl: pdfFile.getUrl(),
    pdfId: pdfFile.getId()
  };
}

/**
 * Crear menú personalizado en Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📄 Chez Manu')
    .addItem('🖨️ PDF: Nos Entrées', 'generarPDFEntreesConMensaje')
    .addItem('🖨️ PDF: Nos Assiettes Principales', 'generarPDFPlatsConMensaje')
    .addItem('🖨️ PDF: Nos desserts', 'generarPDFDessertsConMensaje')
    .addItem('🍷 PDF: Carta de Vinos', 'generarPDFVinosConMensaje')
    .addSeparator()
    .addItem('📄 PDF: Carta Completa', 'generarCartaPDFConMensaje')
    .addSeparator()
    .addItem('🔄 Inicializar Hojas', 'inicializarHojas')
    .addItem('📊 Poblar Datos Iniciales', 'poblarDatosIniciales')
    .addToUi();
}

/**
 * Wrappers con mensajes para cada PDF individual
 */
function generarPDFEntreesConMensaje() {
  const ui = SpreadsheetApp.getUi();
  try {
    const resultado = generarPDFEntrees();
    if (resultado.success) {
      ui.alert('✅ PDF Generado',
               'PDF "Nos Entrées" generado exitosamente.\\n\\nEnlace: ' + resultado.pdfUrl,
               ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert('❌ Error', 'Error al generar PDF: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function generarPDFPlatsConMensaje() {
  const ui = SpreadsheetApp.getUi();
  try {
    const resultado = generarPDFPlats();
    if (resultado.success) {
      ui.alert('✅ PDF Generado',
               'PDF "Nos Assiettes Principales" generado exitosamente.\\n\\nEnlace: ' + resultado.pdfUrl,
               ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert('❌ Error', 'Error al generar PDF: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function generarPDFDessertsConMensaje() {
  const ui = SpreadsheetApp.getUi();
  try {
    const resultado = generarPDFDesserts();
    if (resultado.success) {
      ui.alert('✅ PDF Generado',
               'PDF "Nos desserts" generado exitosamente.\\n\\nEnlace: ' + resultado.pdfUrl,
               ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert('❌ Error', 'Error al generar PDF: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function generarPDFVinosConMensaje() {
  const ui = SpreadsheetApp.getUi();
  try {
    const resultado = generarPDFVinos();
    if (resultado.success) {
      ui.alert('✅ PDF Generado',
               'PDF "Carta de Vinos" generado exitosamente.\\n\\nEnlace: ' + resultado.pdfUrl,
               ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert('❌ Error', 'Error al generar PDF: ' + error.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Wrapper para generar PDF completo con mensaje al usuario
 */
function generarCartaPDFConMensaje() {
  const ui = SpreadsheetApp.getUi();

  ui.alert('Generando PDF...',
           'Por favor espera mientras se genera la carta completa en PDF.',
           ui.ButtonSet.OK);

  try {
    const resultado = generarCartaCompletaPDF();

    if (resultado.success) {
      ui.alert('✅ PDF Generado',
               'La carta ha sido generada exitosamente.\\n\\n' +
               'Puedes encontrarla en tu Google Drive con el nombre:\\n' +
               '"Carta_Chez_Manu_[fecha].pdf"\\n\\n' +
               'Enlace: ' + resultado.pdfUrl,
               ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert('❌ Error',
             'Ocurrió un error al generar el PDF: ' + error.toString(),
             ui.ButtonSet.OK);
  }
}
