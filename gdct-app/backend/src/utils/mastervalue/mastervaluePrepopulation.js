import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';
import {findFirstAttributeCol, lockSheet} from './excel';


const masterValueRepository = Container.get(MasterValueRepository);


export const extractAttributeIds = (sheet)=>{
  const targetRow = sheet.rows[0];
  const attributeMap = {}
  if (targetRow){
    const attributeRow = targetRow.cells;
    for (const key in attributeRow){
      // Record the col if entry in cell is a number
      if (attributeRow[key] && !isNaN(attributeRow[key].text) && attributeRow[key].text !== ""){
        attributeMap[attributeRow[key].text] = key;
      }
    }
  }
  return attributeMap
}

export const extractCategoryIds = (sheet)=>{
  // @ts-ignore
  const maxRowNum = Math.max(...Object.keys(sheet.rows).slice(0, -1))
  const categoryMap = {};

  // Go though each row's first cell
  for (let ri = 0; ri <= maxRowNum; ri++){
    const targetRow = sheet.rows[ri];
    if (targetRow){
      const targetCells = targetRow.cells[0];
      if (targetCells && !isNaN(targetCells.text) && targetCells.text !== ""){
        categoryMap[targetCells.text] = ri;
      }
    }
  }
  return categoryMap;
}

// Last Updated: 2021/03/15 by Sheldon Su
// Insert a workbook, and it will populate the workbook with historical data from the database
export async function mastervaluePrepopulation(workbook, orgId){
  for(let i = 0; i < workbook.length; i++){
    let sheet = workbook[i];
    
    // Obtain the mapping for all the attribute and category id in the sheet 
    let categoryMap = extractCategoryIds(sheet);
    let attributeMap = extractAttributeIds(sheet);

    const categoryList = Object.keys(categoryMap);
    const attributeList = Object.keys(attributeMap);

    // Find the corresponding attributes in the DB, any of the mapping is empty, skip the DB query
    const res = categoryList.length > 0 && attributeList.length > 0 ? await masterValueRepository.batchFind(attributeList, categoryList, orgId) : [];
    // populate the sheet with master values according to the mappings
    const colMap = new Map();
    const colList = []
    for (const item in res) {
      let masterValueItem = res[item];
      let ri = categoryMap[masterValueItem.CategoryId];
      let ci = attributeMap[masterValueItem.AttributeId];
      sheet.rows[ri].cells[ci].text = masterValueItem.value;
      sheet.rows[ri].cells[ci].editable = false;

      if (!colMap.has(masterValueItem.CategoryId)){
        colMap.set(masterValueItem.CategoryId, 1);
        colList.push(ci);
      };
    }

    const firstAttributeCol = findFirstAttributeCol(sheet);
    for (let i = 0; i < firstAttributeCol; i++) colList.push(i);
    if (colList.length > 0) colList.push(1);
    lockSheet(colList, colList.length > 0 ? [9]: [], sheet);
  }

  return workbook;

}



