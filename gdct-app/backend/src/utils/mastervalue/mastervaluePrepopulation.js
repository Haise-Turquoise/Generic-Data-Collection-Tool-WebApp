import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';
import OrgRepository from '../../repositories/Organization';
import { findFirstAttributeCol, lockSheet } from './excel';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';


const masterValueRepository = Container.get(MasterValueRepository);
const orgRepository = Container.get(OrgRepository);
const submissionPeriodRepository = Container.get(SubmissionPeriodRepository);


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

/*  
  Last Updated: 2021/05/10 by Sheldon Su
  Insert a workbook, and it will populate the workbook with historical data from the database and 
  oganization info for user and lock the sheets in the workbook
*/
export async function mastervaluePrepopulation(workbook, submission){
  
  const {orgId, submissionPeriodId } = submission;
  const reportingPeriodInfo = await submissionPeriodRepository.findById(submissionPeriodId);

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

    // iterate through the response array to fill in master values
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

    const orgInfo = await orgRepository.findById(orgId);
    
    // Add org info into the spreadsheet
    if (i > 0){
      const sheetRows = sheet.rows;
      if (sheet.name.toLowerCase() === 'identification'){
        // add objects if they are undefined
        if (!sheetRows[8]) sheetRows[8] = {cells:{3:{text:''}}};
        if (!sheetRows[9]) sheetRows[9] = {cells:{3:{text:''}}};
        if (!sheetRows[10]) sheetRows[10] = {cells:{3:{text:''}}};
        if (!sheetRows[12]) sheetRows[12] = {cells:{3:{text:''}}};
        if (!sheetRows[13]) sheetRows[13] = {cells:{3:{text:''}}};

        if (!sheetRows[8].cells[3]) sheetRows[8].cells[3] = {text:''};
        if (!sheetRows[9].cells[3]) sheetRows[9].cells[3] = {text:''};
        if (!sheetRows[10].cells[3]) sheetRows[10].cells[3] = {text:''};
        if (!sheetRows[12].cells[3]) sheetRows[12].cells[3] = {text:''};
        if (!sheetRows[13].cells[3]) sheetRows[13].cells[3] = {text:''};

        sheetRows[8].cells[3].text = orgInfo.id;
        sheetRows[9].cells[3].text = orgInfo.IFISNum;
        sheetRows[10].cells[3].text = reportingPeriodInfo.name;
        sheetRows[12].cells[3].text = orgInfo.name;
        sheetRows[13].cells[3].text = orgInfo.legalName;

      }else{

        // add objects if they are undefined
        if (!sheetRows[3]) sheetRows[3] = {cells:{1:{text:''}}};
        if (!sheetRows[2]) sheetRows[2] = {cells:{1:{text:''}}};

        if (!sheetRows[3].cells[1]) sheetRows[3].cells[1] = {text:''};
        if (!sheetRows[2].cells[1]) sheetRows[2].cells[1] = {text:''};

        sheetRows[3].cells[1].text = 'Facility ID: ' + orgInfo.id;
        sheetRows[2].cells[1].text = 'Hospital Name: ' + orgInfo.name;
      }
    }

    // find the coloumns that should be lock and lock them
    const firstAttributeCol = findFirstAttributeCol(sheet);
    for (let i = 0; i < firstAttributeCol; i++) colList.push(i);
    if (colList.length > 0) colList.push(1);
    lockSheet(colList, colList.length > 0 ? [9, 0]: [0], sheet);
  }

  return workbook;

}




