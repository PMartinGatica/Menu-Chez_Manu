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
  DESSERTS: 'Desserts'
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

  return 'Datos iniciales cargados correctamente';
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
