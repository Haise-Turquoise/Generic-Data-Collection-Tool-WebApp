// Last Updated: Dec 21, 2020
// Input a sheet from google sheet api with its row and column number, and it will return the value inside the cell
// Currently it will only return a value if the value inside the cell is a number
export const getCellData = (sheetData, rowIndex, columnIndex) => {
    // Checks if the row exists
    if (sheetData.data[0].rowData.length <= rowIndex) {
      return undefined;
    }
    const row = sheetData.data[0].rowData[rowIndex];
  
    // Checks if the column exists
    if (row.values === undefined || row.values <= columnIndex) {
      return undefined;
    }
    const cell = row.values[columnIndex];
    // Checks if the cell is empty
    if (cell === undefined || cell.effectiveValue === undefined){
      return undefined;
    }
  
    // Logic can go in this loop to eliminate certain cell values
    if (!cell.effectiveValue.numberValue || cell.effectiveValue.numberValue === 0 /*|| !cell.formattedValue.match(/^\s\d+(,\d{3})*$/)*/){
      return undefined;
    }
  
    const value = cell.effectiveValue.numberValue;
    return { value: value };
};

/**
 * Maps column with `Column` - which represents the column header
 */
export const extractAttributeIds = sheetData => {
    const columns = {};
    const firstRow = sheetData.data[0].rowData[0].values;
  
    if (firstRow) {
      for (const column in firstRow) {
        const columnNumber = +column;
  
        if (columnNumber > 0) {
          const categoryData = getCellData(sheetData, 0, columnNumber);
  
          if (categoryData && categoryData.value) {
            columns[column] = categoryData.value;
          }
        }
      }
    }
  
    return columns;
  };
  
/**
 * Maps rows with COA data
 */
export const extractCategoryData = (sheetData) => {
// Initialize COAs
    const COAs = {};

    for (const row in sheetData.data[0].rowData) {
        // Checks each row in the sheet
        const rowNumber = +row;

        if (rowNumber > 0 ) {
        // Gets the value in column 0 of each row
            const COAIdData = getCellData(sheetData, rowNumber, 0);

            // If there is a value present, insert it into the COAs
            if (COAIdData && COAIdData.value) {
                COAs[row] = COAIdData.value;
            }
        }
    }

return COAs;
};


export const lockSheet = (cols, rows, sheet)=>{
  rows.forEach(rowNum => {
    if (sheet.rows[rowNum]){
      const cells = sheet.rows[rowNum].cells;
      Object.keys(cells).forEach(colNum=>{
        cells[colNum].editable = false;
      });
    }
  });

  // Go through all the columns
  Object.keys(sheet.rows).forEach(rowNum=>{
    const cells = sheet.rows[rowNum].cells;
    if (cells){
      cols.forEach(colNum=>{
        if (cells[colNum]){
          cells[colNum].editable = false;
        }else{
          cells[colNum] = {editable: false};
        }
      });
    }
  });

  return sheet;
}

// Created by Sheldon Su on 2021/04/10
// find the last Attribute Col in a sheet
export const findFirstAttributeCol = (sheet)=>{
  const targetRow = sheet.rows[0];
  let col = -1;
  if (targetRow){
    const attributeRow = targetRow.cells;
    const attributeKeys = Object.keys(attributeRow);
    for (const key of attributeKeys){
      // return the col if entry in cell is a number
      if (attributeRow[key] && !isNaN(attributeRow[key].text)){
        return Number(key);
      }
    }
  }
  return col;
}