import Excel from 'exceljs';
import {SheetDataStyle, SheetData} from '../types/template';
import { Options } from 'material-table';

export const isObjectEmpty = (object:any) => {
  for (let key in object) return false;
  return true;
};

export const DnDReorder = (list:any, startIndex:number, endIndex:number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const memoizeFunction = (f:any) => {
  return function (...fArgs: any[]) {
    const args = Array.prototype.slice.call(fArgs);
    // we've confirmed this isn't really influencing
    // speed positively
    f.memoize = f.memoize || {};

    // this is the section we're interested in
    //@ts-ignore
    return args in f.memoize ? f.memoize[args] : (f.memoize[args] = f.apply(this, args));
  };
};

export const calculateOptions = (itemCount:number) => {
  let length = itemCount;
  if (length > 100) length = 100;
  else if (length == 0) length = 1;
  const sizeOptions = [10, 25, 50, 100, itemCount];
  sizeOptions.sort((a, b) => a - b);
  return {
    actionsColumnIndex: -1,
    search: true,
    showTitle: false,
    maxBodyHeight: '400px',
    pageSizeOptions: sizeOptions,
    pageSize: length,
    addRowPosition: 'first',
  } as Options<any>;
};

export const urlParser = (orgId: number, categories: string[], attributes: string[]) => {
  let baseUrl = 'https://gdctrest.azurewebsites.net/mastervalues/all?organization=';
  let UrlWithOrg = baseUrl + orgId + '&categories=';
  categories.forEach(entry => {
    UrlWithOrg = UrlWithOrg + entry + ',';
  });

  let UrlWithCategories = UrlWithOrg.slice(0, -1) + '&attributes=';

  attributes.forEach(entry => {
    UrlWithCategories = UrlWithCategories + entry + ',';
  });
  // console.log(UrlWithCategories.slice(0, -1))
  return UrlWithCategories.slice(0, -1);
};

export const digitToAlpha = (num:number) => {
  let str = '';
  while (num > 0) {
    let m = num % 26;
    if (m == 0) {
      m = 26;
    }
    str = String.fromCharCode(m + 64) + str;
    num = (num - m) / 26;
  }
  return str;
};

export const Xspreadsheet2ExcelStyle = (cell:Excel.Cell, style:SheetDataStyle) => {
  // add font
  if (style.font) cell.font = style.font;

  // add alignment
  if (style.align) {
    const result = { vertical: 'middle' };
    Object.assign(result, {horizontal: style.align});
    if (style.textwrap) Object.assign(result, {wrapText: true});

    Object.assign(cell, {alignment: result});
  }

  // add fill
  if (style.bgcolor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + style.bgcolor.slice(1) },
    };
  }

  // add border
  if (style.border) {
    const currBorder = style.border;
    const border = {};
    if (currBorder.top) Object.assign(border, {top:{ style: currBorder.top[0], color: { argb: 'FF000000' } }});
    if (currBorder.left) Object.assign(border, {left:{ style: currBorder.left[0], color: { argb: 'FF000000' } }});

    if (currBorder.bottom)
      Object.assign(border, {bottom: { style: currBorder.bottom[0], color: { argb: 'FF000000' } }});

    if (currBorder.right) 
      Object.assign(border, {right: { style: currBorder.right[0], color: { argb: 'FF000000' } }});

    cell.border = border;
  }
};

// Created by Sheldon Su on 2021/03/25
export const excelJsStyle2Xspreadsheet = (style: Partial<Excel.Style>) => {
  const result = {};

  // Convert text alignment (only check horizontal)
  // since X-data-spreadsheet only supports horizontal text at this time.
  if (style.alignment && style.alignment.horizontal) Object.assign(result, {align: style.alignment.horizontal});

  // Convert border Style (color not included since it use microsoft colour index)
  if (style.border != {}) {
    const border = style.border;
    const resultBorder = {};
    if (border) {
      if (border.bottom) Object.assign(resultBorder, {bottom: [border.bottom.style, '#000']});

      if (border.left) Object.assign(resultBorder, {left: [border.left.style, '#000']});

      if (border.right) Object.assign(resultBorder, {right: [border.right.style, '#000']});

      if (border.top) Object.assign(resultBorder, {top: [border.top.style, '#000']});

      if (!isObjectEmpty(resultBorder)) Object.assign(result, {border: resultBorder});
    }
  }

  // Convert color fill
  // @ts-ignore
  if (style.fill && style.fill.fgColor && style.fill.fgColor.argb) {
    // @ts-ignore
    Object.assign(result, {bgcolor: '#' + style.fill.fgColor.argb.slice(2)});
  }

  // Convert Font
  if (style.font) {
    const font = style.font;
    const resultFont = {};

    if (font.bold) Object.assign(resultFont, {bold: true});

    if (font.italic) Object.assign(resultFont, {italic: true});

    if (font.size) Object.assign(resultFont, { size: font.size});

    if (font.name) Object.assign(resultFont, {name: font.name});

    if (font.family) Object.assign(resultFont, {family: font.family});

    if (!isObjectEmpty(resultFont)) Object.assign(result, {font: resultFont});
  }

  if (style.alignment && style.alignment.wrapText) Object.assign(result, {textwarp: true});

  return result;
};

// Convert from base 26 to base 10
export const alphaToNumber = (alpha:string) => {
  const string = alpha.toUpperCase();
  let result = 0;
  const strlen = string.length;
  for (let i = 0; i < string.length; i++) {
    const charAt = string[strlen - i - 1].charCodeAt(0) - 64;
    result += charAt * 26 ** i;
  }
  return result;
};

// This function is use to calculate the merged Array for x-data-spreadsheet
// Created By Sheldon Su on 2021/03/26
export const calculateMergeArray = (startCoord:string, endCoord:string) => {
  if (startCoord === endCoord) return [0, 0];

  const startRow = startCoord.match(/\d+/g);
  const endRow = endCoord.match(/\d+/g);

  if (startRow === null || endRow === null) throw new Error('Input format error');
  
  const matchStartCol = startCoord.match(/[a-zA-Z]+/g);
  const matchEndCol = endCoord.match(/[a-zA-Z]+/g);

  if (!matchEndCol || !matchStartCol ) throw new Error('Input format error');

  // Convert Col alphabit to base 10
  const startCol = alphaToNumber(matchStartCol[0]);
  const endCol = alphaToNumber(matchEndCol[0]);

  return [Number(endRow) - Number(startRow), endCol - startCol];
};

// This function is use to compare new data and edited data in excel sheet
// This function assumes that sheet structures did not change, only the value had changed
// Return old value and new value
export const compareSheet = (oldWorkBook:SheetData[], newNewWorkBook:SheetData[]) => {
  const oldValues = [];
  const newValues = [];
  const sheetLen = oldWorkBook.length;
  for (let i = 0; i < sheetLen; i++) {
    const oldSheet = oldWorkBook[i];
    const newSheet = newNewWorkBook[i];
    const sheetName = oldSheet.name;
    const rows = Object.keys(newSheet.rows).slice(0, -1);
    const maxRow = Number(rows[rows.length - 1]);
    for (let rowNum = 0; rowNum <= maxRow; rowNum++) {
      const oldRow = oldSheet.rows[String(rowNum)];
      const newRow = newSheet.rows[String(rowNum)];

      if (oldRow && newRow && newRow.cells) {
        const newCols = Object.keys(newRow.cells);
        // Iterate through the cols
        for (const index of newCols) {
          // check if cell is empty
          if (oldRow.cells){
            const oldCell = oldRow.cells[index];
            const newCell = newRow.cells[index];
            if (oldCell && newCell) {
              if (oldCell.text && newCell.text) {
                if (oldCell.text != newCell.text) {
                  oldValues.push({
                    sheetName: sheetName,
                    row: rowNum + 1,
                    col: index,
                    value: oldCell.text,
                  });
                  newValues.push({
                    sheetName: sheetName,
                    row: rowNum + 1,
                    col: index,
                    value: newCell.text,
                  });
                }
              } else if (oldCell.text) {
                oldValues.push({
                  sheetName: sheetName,
                  row: rowNum + 1,
                  col: index,
                  value: oldCell.text,
                });
                newValues.push({ sheetName: sheetName, row: rowNum + 1, col: index, value: 'empty' });
              } else if (newCell.text) {
                oldValues.push({ sheetName: sheetName, row: rowNum + 1, col: index, value: 'empty' });
                newValues.push({
                  sheetName: sheetName,
                  row: rowNum + 1,
                  col: index,
                  value: newCell.text,
                });
              }
            } else {
              oldValues.push({ sheetName: sheetName, row: rowNum + 1, col: index, value: 'empty' });
              newValues.push({
                sheetName: sheetName,
                row: rowNum + 1,
                col: index,
                value: newCell.text,
              });
            }
          }
        }
      }
    }
  }
  return { oldValues, newValues };
};

// Created by Sheldon Su on 2021/04/1
// Generate category ID to row mapping
export const generateCategoryMap = (sheet:SheetData) => {
  // @ts-ignore
  const maxRowNum = Math.max(...Object.keys(sheet.rows).slice(0, -1));
  const categoryMap = {};

  // Go though each row's first cell
  for (let ri = 0; ri <= maxRowNum; ri++) {
    const targetRow = sheet.rows[String(ri)];
    if (targetRow && targetRow.cells) {
      const targetCells = targetRow.cells[0];
      if (targetCells && targetCells.text){
        if (targetCells && !isNaN(Number(targetCells.text)) && targetCells.text !== '') {
          // @ts-ignore
          categoryMap[targetCells.text] = ri;
        }
      }
    }
  }
  return categoryMap;
};

// Created by Sheldon Su on 2021/04/1
// Generate category ID to row mapping
export const generateFullMap = (sheet:SheetData) => {
  // @ts-ignore
  const maxRowNum = Math.max(...Object.keys(sheet.rows).slice(0, -1));
  const categoryMap = {};
  const attributeMap:any = generateAttributeMap(sheet);

  // Go though each row's first cell
  for (let ri = 0; ri <= maxRowNum; ri++) {
    const targetRow = sheet.rows[String(ri)];
    if (targetRow && targetRow.cells) {
      const targetCells = targetRow.cells[0];

     if (targetCells && targetCells.text){
        if (targetCells && !isNaN(Number(targetCells.text)) && targetCells.text !== '') {
          //@ts-ignore
          categoryMap[targetCells.text] = ri;
        } else if (targetCells && targetCells.text == '') {

          for (const id of Object.keys(attributeMap)) {

            const currCell = targetRow.cells[attributeMap[id]];
            if (currCell && currCell.text && currCell.text[0] == '=') {
              //@ts-ignore
              categoryMap[targetRow + id] = ri;
              break;
            }
          }
        }
      }
    }
  }
  return categoryMap;
};

// Created by Sheldon Su on 2021/04/12
// Generate attribute ID to Column mapping
export const generateAttributeMap = (sheet:SheetData) => {
  const targetRow = sheet.rows['0'];
  const attributeMap = {};
  if (targetRow) {
    const attributeRow = targetRow.cells;
    if (attributeRow){
      const attributeKeys = Object.keys(attributeRow);
      for (const key of attributeKeys) {
        // Record the col if entry in cell is a number
        if (attributeRow[key] && attributeRow[key].text !== undefined){
          // @ts-ignore Dont really know why there is an error
          if (!isNaN(Number(attributeRow[key].text))) {
          //@ts-ignore
          attributeMap[attributeRow[key].text] = key;
        }
        }
      }
    }
  }
  return attributeMap;
};

// Created by Sheldon Su on 2021/04/10
// find the last Attribute Col in a sheet
export const findLastAttributeCol = (sheet:SheetData) => {
  const targetRow = sheet.rows['0'];
  let col = -1;
  if (targetRow) {
    const attributeRow = targetRow.cells;
    if (attributeRow){
      const attributeKeys = Object.keys(attributeRow);
      for (const key of attributeKeys) {
        // Record the col if entry in cell is a number
        //@ts-ignore Don't really know why the following line has error
        if (attributeRow[key] && !isNaN(Number(attributeRow[key].text))) {
          col = Number(key);
        }
      }
    }
  }
  return col;
};

// Created by Sheldon Su on 2021/04/10
// find the index of a given word in a row, if not found, return -1
export const findWordInRow = (sheet:SheetData, row:number, text:string) => {
  const targetRow = sheet.rows[String(row)];
  if (targetRow) {
    const attributeRow = targetRow.cells;
    if(attributeRow){
      const attributeKeys = Object.keys(attributeRow);
      for (const key of attributeKeys) {
        if (attributeRow[key] && attributeRow[key].text === text) {
          return key;
        }
      }
    }
  }
  return -1;
};

/*
 * Create by Sheldon Su 2021/04/21
 * This function handles download template feature, it convert Json array
 * from x-data-spreadsheet to xlsx. Note that the page that calls this
 * function must have a empty <a> tag with id 'download'.
 */
export const templateDownloader = (workBookName:string, sheetData:SheetData[]) => {
  let workbook = new Excel.Workbook();
  workbook.modified = new Date();

  // Force full calculation on load
  workbook.calcProperties.fullCalcOnLoad = true;

  sheetData.forEach(sheet => {
    const currSheet = workbook.addWorksheet(sheet.name);
    const styleArray = sheet.styles;
    const rows = Object.keys(sheet.rows).slice(0, -1);
    const maxRow = Number(rows[rows.length - 1]);
    for (let rowNum = 0; rowNum <= maxRow; rowNum++) {
      const row = sheet.rows[String(rowNum)];
      const rowData = [];

      // Create Array for formulas
      const formulaArray = [];
      if (row && row.cells) {
        const cols = Object.keys(row.cells);
        // Iterate through the cols
        for (const index of cols) {
          // check if cell is empty
          if (!isObjectEmpty(row.cells[index])) {
            const col = Number(index) + 1;
            if (row.cells[index].text) {
              // Check for formulas
              const text = row.cells[index].text;
              const fValue = row.cells[index].formulaValue;
              if (text && text[0] !== '=' && !fValue) {
                rowData[col] = isNaN(Number(text)) ? text : Number(text);
              } else {
                const result = row.cells[index].formulaValue;
                formulaArray.push({ col, text, result });
              }
            }
          }
        }
      }

      const newRow = currSheet.addRow(rowData);

      // handle formulas
      formulaArray.forEach(formula => {
        // @ts-ignore
        newRow.getCell(formula.col).value = {
          formula: formula?.text?.slice(1),
          result: formula.result,
        };
      });

      if (row && row.height) newRow.height = row.height;
    }

    // Iterate the sheet to add styles
    const rowArray = Object.keys(sheet.rows).slice(0, -1);
    for (const rowNum of rowArray) {
      // @ts-ignore
      const colArray = Object.keys(sheet.rows[rowNum].cells);
      for (const colNum of colArray) {
        // @ts-ignore
        const targetCell = sheet.rows[rowNum].cells[colNum];
        if (targetCell.style !== undefined) {
          const coord = digitToAlpha(Number(colNum) + 1) + (Number(rowNum) + 1);
          const cell = currSheet.getCell(coord);
          Xspreadsheet2ExcelStyle(cell, styleArray[targetCell.style]);
        }
      }
    }

    // adjust col width
    const colNums = Object.keys(sheet.cols).slice(0, -1);
    for (const keys of colNums) {
      const colNum = Number(keys);
      const targetCol = currSheet.getColumn(colNum + 1);
      if (sheet.cols[keys].width) {
        targetCol.width = sheet.cols[keys].width / 9;
      }
    }

    // create merge cells
    for (const merges of sheet.merges) {
      currSheet.mergeCells(merges);
    }

    const categoryIdRow = currSheet.getRow(1);
    const attributeIdRow = currSheet.getColumn(1);
    categoryIdRow.hidden = true;
    attributeIdRow.hidden = true;
  });

  //Generate download file
  workbook.xlsx.writeBuffer().then(wbData => {
    let blob = new Blob([wbData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    let link = window.URL.createObjectURL(blob);
    let targetEle = document.getElementById('download');
    if (!targetEle) throw new Error("tag with id='dowload' not found")

    // @ts-ignore
    targetEle.href = link;
    // @ts-ignore
    targetEle.download = workBookName;
    targetEle.click();
  });
};

/*
 * Create by Sheldon Su 2021/04/21
 * This is the function for handling the import
 * It reads the file from client's computer and converts it into Json array that
 * x-data-spreadsheet can understand. At the end we are saving this Json array
 * to our DB.
 * Note that since reader.onload is async, you have to pass in a data handler function to
 * retreive your data.
 */
export const excelImportHandler = (event:React.ChangeEvent<HTMLInputElement>, dataHandler:Function) => {
  //set up a event listner
  let reader = new FileReader();
  const element = event.target;
  const file = element.files![0];

  reader.readAsArrayBuffer(file);

  // Setting up a onload event handler, this event handler will only fire
  // when it completed a sucessful read.
  reader.onload = async () => {
    // Get the file data from event
    const data = reader.result;

    const dataArr:SheetData[] = [];
    const workBook = new Excel.Workbook();
    // @ts-ignore
    await workBook.xlsx.load(data);

    // Iterate over sheets
    workBook.eachSheet((targetSheet) => {
      const styleMap = new Map();
      const mergeMap = new Map();

      // @ts-ignore
      const merges = targetSheet._merges;

      let sheetData:SheetData = { 
        name: targetSheet.name, 
        validations:[],
        autofilter:{},
        ConditionFormatter:[],
        freeze:'A1',
        rows: {}, 
        cols: {}, 
        styles: [],
        merges: [] 
      };

      // convert merged cells
      Object.keys(merges).forEach(mergeObject => {
        sheetData.merges.push(merges[mergeObject].range);
        const merge = merges[mergeObject].range.split(':');
        mergeMap.set(merge[0], merge[1]);
      });

      // Iterate through each row
      targetSheet.eachRow({ includeEmpty: true }, (targetRow, rowNum) => {
        let currRow = { cells: {} };

        // Check and fill the height parameter
        if (targetRow.height) Object.assign(currRow, {height:targetRow.height});

        // Iterate through each cell in a row
        targetRow.eachCell({ includeEmpty: true }, (targetCell, colNum) => {
          let currCell = {};
          // @ts-ignore
          if (!(targetCell.isMerged && targetCell._mergeCount === 0)) {
            const endCoord = mergeMap.get(targetCell.address);
            // Check if the cell is the starting point of merge
            if (endCoord) Object.assign(currCell, {merge: calculateMergeArray(targetCell.address, endCoord)})

            // Check if there are formulas and copy the value of the cell
            if (targetCell.formula) {
              Object.assign(currCell, {text: '=' + targetCell.formula})
            } else {
              if (targetCell.value) Object.assign(currCell, {text: String(targetCell.value)});
            }

            const currCellStyle = targetCell.style;
            // Check if there is style related to this cell.
            if (!isObjectEmpty(currCellStyle)) {
              const currStyle = excelJsStyle2Xspreadsheet(currCellStyle);

              // Compare object using Json
              // Since json cannot be compared, we need to convert it to Json string first
              let jsonReference = JSON.stringify(currStyle);

              if (styleMap.has(jsonReference)) {
                Object.assign(currCell, {style: styleMap.get(jsonReference)});
              } else {
                styleMap.set(jsonReference, sheetData.styles.length);
                sheetData.styles.push(currStyle);
                Object.assign(currCell, {style: styleMap.get(jsonReference)});
              }
            }
          }
          // @ts-ignore
          currRow.cells[String(colNum - 1)] = currCell;
        });
        // @ts-ignore
        sheetData.rows[rowNum - 1] = currRow;
      });

      // Read Column width
      for (let i = 1; i <= targetSheet.columnCount; i++) {
        let targetCol = targetSheet.getColumn(i);
        if (targetCol.width) {
          sheetData.cols[i - 1] = { width: targetCol.width * 9 };
        }
      }
      dataArr.push(sheetData);
    });

    // return the formatted workbook
    dataHandler(dataArr);
  };
};

// check for duplicates in a material-table column
export const checkDuplicates = (rowData:any, tableData:any, field:string) => {
  // field of element being edited -- null if not editing
  let current:any = null;
  console.log(rowData);
  if (rowData.tableData) {
    if (rowData.tableData.editing === 'delete') {
      return true;
    } else if (rowData.tableData.editing === 'update') {
      current = tableData.find((el:any) => el._id === rowData._id)[field];
    }
  } else if (rowData._id) {
    // this case runs while submitting a change
    return true;
  }
  const vals = tableData.map((el:any) => el[field])
  const duplicate = vals.find((val:any) => val === rowData[field] && val !== current)
  return duplicate ? `Duplicate ${field} not allowed` : true
}

export const checkDuplicateSet = (rowData:any, tableData:any) => {
  //If there is one or more, then duplicates exist
  let counter:number = 0;
  if (rowData.tableData) {
    if (rowData.tableData.editing === 'delete') {
      return true;
    } else if (rowData.tableData.editing === 'update') {
      tableData.forEach( (item:any) => 
        {
          if (item.name === rowData.name && item.templateTypeId === rowData.templateTypeId
            && (rowData.id !== item.id || !item.id)) {
              counter++;
          }
          
        }
      )
      return (counter >= 1) ? `Duplicate (Name, Sheet Type) not allowed` : true
    }
  } else if (rowData._id) {
    // this case runs while submitting a change
    return true;
  } else {
    tableData.forEach( (item:any) => 
        {
          if (item.name === rowData.name && item.templateTypeId === rowData.templateTypeId) {
              counter++;
          }
          
        }
      )
      return (counter >= 1) ? `Duplicate (Name, Sheet Type) not allowed` : true
  }

  return (counter >= 1) ? `Duplicate (Name, Sheet Type) not allowed` : true
}

// add a row using a controller in material-table
export const controllerAddRow = async (Controller:any, setState:Function, data:any) => {
  try {
    const newData = await Controller.create(data)
    if (!newData) {
      return undefined
    }
    // prev may be undefined
    setState((prev:any) => prev ? prev.concat(newData) : prev)
    return newData
  } catch (e) {
    console.log('an error has occurred')
    return undefined
  }
}

// edit a row using a controller in material-table
export const controllerEditRow = async (Controller:any, setState:Function, data:any) => {
  try {
    // res has type AxiosResponse
    const res = await Controller.update(data)
    if (res.status !== 200) {
      return false
    }
    setState((prev:any) => {
      if (prev) {
        const copy = [...prev]
        const index = prev.findIndex((el:any) => el._id === data._id)
        if (index >= 0) {
          copy[index] = data
        }
        return copy
      }
      return prev
    })
  } catch (e) {
    console.log('an error has occurred')
    return false
  } finally {
    return true
  }
}

// delete a row using a controller in material-table
export const controllerDeleteRow = async (Controller:any, setState:Function, _id:String) => {
  try {
    // res has type AxiosResponse
    const res = await Controller.delete(_id)
    if (res.status !== 200) {
      return false
    }
    setState((prev:any) => prev ? prev.filter((el:any) => el._id !== _id) : prev)
  } catch (e) {
    console.log('an error has occurred')
    return false
  } finally {
    return true
  }
}
