import Excel from 'exceljs';

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
  console.log(cell.fill, style);
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

// Created by Sheldon Su on 2021/04/1
// Generate category ID to row mapping
export const generateCategoryMap = (sheet)=>{
  // @ts-ignore
  const maxRowNum = Math.max(...Object.keys(sheet.rows._))
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

// Created by Sheldon Su on 2021/04/12
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

// Created by Sheldon Su on 2021/04/10
// find the last Attribute Col in a sheet
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

// Created by Sheldon Su on 2021/04/10
// find the index of a given word in a row, if not found, return -1
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

// Create by Sheldon Su 2021/04/21
// This function handles download template feature, it convert Json array
// from x-data-spreadsheet to xlsx
export const templateDownloader = (workBookName, sheetData)=>{
  console.log(workBookName, sheetData)

  let workbook = new Excel.Workbook();
  workbook.modified = new Date();

  // Force full calculation on load
  workbook.calcProperties.fullCalcOnLoad = true;

  sheetData.forEach(sheet=>{
    const currSheet = workbook.addWorksheet(sheet.name);
    const styleArray = sheet.styles;
    const rows = Object.keys(sheet.rows).slice(0, -1);
    const maxRow = Number(rows[rows.length - 1]);
    for (let rowNum = 0; rowNum <= maxRow; rowNum++){
      const row = sheet.rows[String(rowNum)]
      const rowData = [];

      // Create Array for formulas 
      const formulaArray = []
      if (row){
        const cols = Object.keys(row.cells)
        // Iterate through the cols
        for (const index of cols){
          // check if cell is empty
          if (!isObjectEmpty(row.cells[index])){
            const col = Number(index) + 1;
            if (row.cells[index].text){
              // Check for formulas
              const text = row.cells[index].text;
              const fValue = row.cells[index].formulaValue;
              if (text[0] !== '=' && !fValue){
                rowData[col] = isNaN(text) ? text : Number(text);
              }else{
                const result = row.cells[index].formulaValue;
                formulaArray.push({col, text, result});
              }
            };
          }
        };
      }

      const newRow = currSheet.addRow(rowData);

      // handle formulas
      formulaArray.forEach(formula=>{
        // @ts-ignore
        newRow.getCell(formula.col).value = {formula: formula.text.slice(1), result: formula.result};
      })

      if (row && row.height) newRow.height = row.height;
    };

    // Iterate the sheet to add styles
    const rowArray = Object.keys(sheet.rows).slice(0, -1);
    for (const rowNum of rowArray){
      const colArray = Object.keys(sheet.rows[rowNum].cells);
      for (const colNum of colArray){
        const targetCell = sheet.rows[rowNum].cells[colNum];
        if (targetCell.style !== undefined){ 
          const coord = digitToAlpha(Number(colNum) + 1) + (Number(rowNum)+1);
          const cell = currSheet.getCell(coord);
          Xspreadsheet2ExcelStyle(cell, styleArray[targetCell.style]);
        }
      }
    }

    // adjust col width
    const colNums = Object.keys(sheet.cols).slice(0, -1)
    for (const keys of colNums){
      const colNum = Number(keys);
      const targetCol = currSheet.getColumn(colNum + 1)
      targetCol.width = sheet.cols[keys].width/9
    }

    // create merge cells
    for (const merges of sheet.merges){
      currSheet.mergeCells(merges);
    }
  });

  //Generate download file
  workbook.xlsx.writeBuffer().then(wbData=>{
    let blob = new Blob([wbData], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    let link = window.URL.createObjectURL(blob);
    let targetEle = document.getElementById('download');
    
    // @ts-ignore
    targetEle.href = link;
    // @ts-ignore
    targetEle.download = workBookName;
    targetEle.click();
  })
}

// Create by Sheldon Su 2021/04/21
// This is the function for handling the import
// It reads the file from client's computer and converts it into Json array that
// x-data-spreadsheet can understand. At the end we are saving this Json array 
// to our DB.
// Note that since reader.onload is async, you have to pass in a data handler function to
// retreive your data.
export const excelImportHandler = (event, dataHandler) => {
  //set up a event listner
  let reader = new FileReader();

  const file = event.target.files[0];

  reader.readAsArrayBuffer(file);
  
  // Setting up a onload event handler, this event handler will only fire
  // when it completed a sucessful read.
  reader.onload = async () => {
    // Get the file data from event
    const data = reader.result;

    const dataArr = [];
    const workBook = new Excel.Workbook();
    // @ts-ignore
    await workBook.xlsx.load(data)

    // Iterate over sheets
    workBook.eachSheet((targetSheet, sheetId)=>{

      const styleMap = new Map();
      const mergeMap = new Map();

      // @ts-ignore
      const merges = targetSheet._merges
      let sheetData = { name: targetSheet.name, rows: {}, cols: {}, styles:[], merges:[]};

      // convert merged cells
      Object.keys(merges).forEach(mergeObject=>{
        sheetData.merges.push(merges[mergeObject].range);
        const merge = merges[mergeObject].range.split(':');
        mergeMap.set(merge[0], merge[1]);
      });

      // Iterate through each row
      targetSheet.eachRow({ includeEmpty: true }, (targetRow, rowNum)=>{
        let currRow = { cells: {}};

        // Check and fill the height parameter
        if (targetRow.height) currRow.height = targetRow.height;

        // Iterate through each cell in a row
        targetRow.eachCell({ includeEmpty: true }, (targetCell, colNum)=>{
          let currCell = {};
          // @ts-ignore
          if (!(targetCell.isMerged && targetCell._mergeCount === 0)){

            const endCoord = mergeMap.get(targetCell.address)
            if(endCoord) currCell.merge = calculateMergeArray(targetCell.address, endCoord);

            // Check if there are formulas and copy the value of the cell
            if (targetCell.formula){
              currCell.text = '=' + targetCell.formula;
            }else{
              if(targetCell.value)currCell.text = String(targetCell.value);
            }

            const currCellStyle = targetCell.style;
            // Check if there is style related to this cell.
            if (!isObjectEmpty(currCellStyle)){
        
              const currStyle = excelJsStyle2Xspreadsheet(currCellStyle);

              // Compare object using Json
              let jsonReference = JSON.stringify(currStyle);

              if (styleMap.has(jsonReference)){
                currCell.style = styleMap.get(jsonReference);
                
              }else{
                styleMap.set(jsonReference, sheetData.styles.length);
                sheetData.styles.push(currStyle);
                currCell.style = currCell.style = styleMap.get(jsonReference);
              }
            }
          }
          currRow.cells[colNum - 1] = currCell;
        });
        sheetData.rows[rowNum - 1] = currRow;
      });
      
      // Read Column width
      for(let i = 1; i <= targetSheet.columnCount; i++){
        let targetCol = targetSheet.getColumn(i);
        if(targetCol.width){
          sheetData.cols[i - 1] = { width: targetCol.width * 9 }
        }
      }
      dataArr.push(sheetData);
    });
    
    // return the formatted workbook
    dataHandler(dataArr);
  };
}
