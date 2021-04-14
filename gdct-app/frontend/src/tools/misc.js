export const isObjectEmpty = object => {
  for (let key in object) return false;
  return true;
};

export const DnDReorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const memoizeFunction = f => {
  return function () {
    const args = Array.prototype.slice.call(arguments);

    // we've confirmed this isn't really influencing
    // speed positively
    f.memoize = f.memoize || {};

    // this is the section we're interested in
    return args in f.memoize ? f.memoize[args] : (f.memoize[args] = f.apply(this, args));
  };
};

export const calculateOptions = (itemCount) => {
  let length = itemCount;
  if (length > 100) length = 100;
  else if (length == 0) length = 1;
  const sizeOptions = [10, 25, 50, 100, itemCount];
  sizeOptions.sort((a, b) => a - b);
  return {
    actionsColumnIndex: -1,
    search: true,
    showTitle: false,
    maxBodyHeight: "400px",
    pageSizeOptions: sizeOptions,
    pageSize: length,
    addRowPosition: "first"
  };
};

export const urlParser = (orgId, categories, attributes)=>{
  let baseUrl = "https://gdctrest.azurewebsites.net/mastervalues/all?organization=";
  let UrlWithOrg = baseUrl + orgId +"&categories=";
  categories.forEach((entry)=>{
    UrlWithOrg = UrlWithOrg + entry + ",";
  });
  
  let UrlWithCategories = UrlWithOrg.slice(0, -1) + "&attributes=";
  
  attributes.forEach((entry)=>{
    UrlWithCategories = UrlWithCategories + entry + ",";
  });
  return UrlWithCategories.slice(0, -1);
}

export const digitToAlpha = (num)=>{
  let str="";
  while (num > 0){
    let m = num % 26;
    if (m == 0){
        m = 26;
    }
    str = String.fromCharCode(m + 64) + str;
    num = (num - m) / 26;
  }
  return str;
}

export const Xspreadsheet2ExcelStyle = (cell, style)=>{

  // add font
  if (style.font) cell.font = style.font;

  // add alignment
  if (style.align){
    const result = {vertical: 'middle'}
    result.horizontal = style.align;
    if (style.textwrap) result.wrapText = true;

    cell.alignment = result
  }

  // add fill
  if (style.bgcolor){
    cell.fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FF' + style.bgcolor.slice(1)}
    };
  }

  // add border
  if (style.border){
    const currBorder = style.border;
    const border = {};
    if (currBorder.top) border.top = {style: currBorder.top[0], color: {argb:'FF000000'}};
    if (currBorder.left) border.left = {style: currBorder.left[0], color: {argb:'FF000000'}};
    if (currBorder.bottom) border.bottom = {style: currBorder.bottom[0], color: {argb:'FF000000'}};
    if (currBorder.right) border.right = {style: currBorder.right[0], color: {argb:'FF000000'}};
    cell.border = border
  }
}

// Created by Sheldon Su on 2021/03/25
export const excelJsStyle2Xspreadsheet = (style)=>{
  const result = {};

  // Convert text alignment (only check horizontal) 
  // since X-data-spreadsheet only supports horizontal text at this time.
  if (style.alignment && style.alignment.horizontal) result.align = style.alignment.horizontal;

  // Convert border Style (color not included since it use microsoft colour index)
  if (style.border != {}){
    const border = style.border;
    const resultBorder = {}
    if (border){

      if (border.bottom) resultBorder.bottom = [border.bottom.style, '#000'];

      if (border.left) resultBorder.left = [border.left.style, '#000'];

      if (border.right) resultBorder.right = [border.right.style, '#000'];

      if (border.top) resultBorder.top = [border.top.style, '#000'];

      if (!isObjectEmpty(resultBorder)) result.border = resultBorder;
    }
  }

  // Convert color fill
  if (style.fill && style.fill.fgColor && style.fill.fgColor.argb){
    result.bgcolor = '#' + style.fill.fgColor.argb.slice(2);
  }

  // Convert Font
  if (style.font){
    const font = style.font;
    const resultFont = {}

    if (font.bold) resultFont.bold = true;
    
    if (font.italic) resultFont.italic = true;

    if (font.size) resultFont.size = font.size;

    if (font.name) resultFont.name = font.name;

    if (font.family) resultFont.family = font.family;

    if(!isObjectEmpty(resultFont)) result.font = resultFont;
  }

  if (style.alignment && style.alignment.wrapText) result.textwrap = true;

  return result;
}

// Convert from base 26 to base 10
export const alphaToNumber = (alpha)=>{
  const string = alpha.toUpperCase()
  let result = 0;
  const strlen = string.length;
  for (let i = 0; i < string.length; i++){
    const charAt = string[strlen - i - 1].charCodeAt(0) - 64
    result += charAt * 26**(i)
  }
  return result
}

// This function is use to calculate the merged Array for x-data-spreadsheet
// Created By Sheldon Su on 2021/03/26
export const calculateMergeArray = (startCoord, endCoord)=>{

  if (startCoord === endCoord) return [0, 0];

  const startRow = startCoord.match(/\d+/g);
  const endRow =  endCoord.match(/\d+/g);

  // Convert Col alphabit to base 10
  const startCol = alphaToNumber(startCoord.match(/[a-zA-Z]+/g)[0])
  const endCol = alphaToNumber(endCoord.match(/[a-zA-Z]+/g)[0])
  
  return [Number(endRow - startRow), endCol - startCol];
}

// This function is use to compare new data and edited data in excel sheet
// This function assumes that sheet structures did not change, only the value had changed
// Return old value and new value
export const compareSheet = (oldWorkBook, newNewWorkBook) => {
  const oldValues = [];
  const newValues = [];
  const sheetLen = oldWorkBook.length
  for(let i = 0; i < sheetLen; i++){
    const oldSheet = oldWorkBook[i];
    const newSheet = newNewWorkBook[i];
    const sheetName = oldSheet.name;
    const rows = Object.keys(oldSheet.rows).slice(0, -1);
    const maxRow = Number(rows[rows.length - 1]);
    for (let rowNum = 0; rowNum <= maxRow; rowNum++){
      const oldRow = oldSheet.rows[String(rowNum)];
      const newRow = newSheet.rows[String(rowNum)];

      if (oldRow && newRow){
        const oldCols = Object.keys(oldRow.cells);
        // Iterate through the cols
        for (const index of oldCols){
          // check if cell is empty
          const oldCell = oldRow.cells[index];
          const newCell = newRow.cells[index];
          if (oldCell && newCell){
            if (oldCell.text && newCell.text){
              if (oldCell.text != newCell.text){
                oldValues.push({ sheetName: sheetName, row:rowNum + 1, col:index, value: oldCell.text });
                newValues.push({ sheetName: sheetName, row:rowNum + 1, col:index, value: newCell.text });
              };
            } else if (oldCell.text){
              oldValues.push({ sheetName: sheetName, row:rowNum + 1, col:index, value: oldCell.text });
              newValues.push({ sheetName: sheetName, row:rowNum + 1, col:index, value: 'empty' });
            } else if (newCell.text) {
              oldValues.push({ sheetName: sheetName, row:rowNum + 1, col:index, value: 'empty' });
              newValues.push({ sheetName: sheetName, row:rowNum + 1, col:index, value: newCell.text });
            };
          };
        };
      };
    };
  };
  return {oldValues, newValues}
}

// Generate category ID to row mapping
export const generateCategoryMap = (sheet)=>{
  // @ts-ignore
  const maxRowNum = Math.max(...Object.keys(sheet.rows._).slice(0, -1))
  const categoryMap = {};

  // Go though each row's first cell
  for (let ri = 0; ri <= maxRowNum; ri++){
    const targetRow = sheet.rows._[ri];
    if (targetRow){
      const targetCells = targetRow.cells[0];
      if (targetCells && !isNaN(targetCells.text) && targetCells.text !== ""){
        categoryMap[targetCells.text] = ri;
      }
    }
  }
  return categoryMap;
}

// Generate attribute ID to Column mapping
export const generateAttributeMap = (sheet)=>{
  const targetRow = sheet.rows._[0];
  const attributeMap = {}
  if (targetRow){
    const attributeRow = targetRow.cells;
    const attributeKeys = Object.keys(attributeRow);
    for (const key of attributeKeys){
      // Record the col if entry in cell is a number
      if (attributeRow[key] && !isNaN(attributeRow[key].text)){
        attributeMap[attributeRow[key].text] = key;
      }
    }
  }
  return attributeMap;
}

export const findLastAttributeCol = (sheet)=>{
  const targetRow = sheet.rows._[0];
  let col = -1;
  if (targetRow){
    const attributeRow = targetRow.cells;
    const attributeKeys = Object.keys(attributeRow);
    for (const key of attributeKeys){
      // Record the col if entry in cell is a number
      if (attributeRow[key] && !isNaN(attributeRow[key].text)){
        col = Number(key);
      }
    }
  }
  return col;
}

export const findWordInRow = (sheet, row, text)=>{
  const targetRow = sheet.rows._[row];
  if (targetRow){
    const attributeRow = targetRow.cells;
    const attributeKeys = Object.keys(attributeRow);
    for (const key of attributeKeys){
      if (attributeRow[key] && attributeRow[key].text == text){
        return key;
      }
    }
  }
  return -1;
}
