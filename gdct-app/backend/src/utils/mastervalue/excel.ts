// Last Updated: Jul 29, 2021

import { SheetData, SheetDataCells } from "../../types/template";

export const lockSheet = (cols:number[], rows:number[], sheet:SheetData)=>{
  rows.forEach(rowNum => {
    if (sheet.rows[rowNum]){
      const cells = sheet.rows[rowNum].cells as SheetDataCells;
      Object.keys(cells).forEach(colNum=>{
        cells[parseInt(colNum)].editable = false;
      });
    }
  });

  // Go through all the columns
  Object.keys(sheet.rows).forEach(rowNum=>{
    const cells = sheet.rows[parseInt(rowNum)]?.cells;
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
export const findFirstAttributeCol = (sheet:SheetData)=>{
  const targetRow = sheet.rows[0];
  let col = -1;
  if (targetRow){
    const attributeRow = targetRow.cells as SheetDataCells;
    const attributeKeys = Object.keys(attributeRow);
    for (const key of attributeKeys){
      const i = parseInt(key)
      // return the col if entry in cell is a number
      if (attributeRow[i] && !isNaN(Number(attributeRow[i].text))){
        return Number(key);
      }
    }
  }
  return col;
}