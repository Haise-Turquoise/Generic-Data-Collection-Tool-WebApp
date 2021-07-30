import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';
import OrgRepository from '../../repositories/Organization';
import { findFirstAttributeCol, lockSheet } from './excel';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';
import { SheetData } from '../../types/template';
import { SubmissionDoc } from '../../types/submission';


const masterValueRepository = Container.get(MasterValueRepository);
const orgRepository = Container.get(OrgRepository);
const submissionPeriodRepository = Container.get(SubmissionPeriodRepository);


export const extractAttributeIds = (sheet:SheetData):{[index:string]:number}=>{
  const targetRow = sheet.rows[0];
  const attributeMap = {}
  if (targetRow){
    const attributeRow = targetRow.cells;
    for (const key in attributeRow){
      // Record the col if entry in cell is a number
      if (attributeRow[key] && !isNaN(Number(attributeRow[key].text)) && attributeRow[key].text !== ""){
        //@ts-ignore
        attributeMap[attributeRow[key].text] = key;
      }
    }
  }
  return attributeMap
}

export const extractCategoryIds = (sheet:SheetData):{[index:string]:number}=>{
  // @ts-ignore
  const maxRowNum = Math.max(...Object.keys(sheet.rows).slice(0, -1))
  const categoryMap = {};

  // Go though each row's first cell
  for (let ri = 0; ri <= maxRowNum; ri++){
    const targetRow = sheet.rows[ri];
    if (targetRow){
      if (targetRow.cells){
        const targetCells = targetRow.cells[0];
        if (targetCells && !isNaN(Number(targetCells.text)) && targetCells.text !== ""){
          //@ts-ignore
          categoryMap[targetCells.text] = ri;
        }
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
export async function mastervaluePrepopulation(workbook:SheetData[], submission:SubmissionDoc){
  
  const { orgId, submissionPeriodId } = submission;
  // Find the reporting period info
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
      let ri = categoryMap[masterValueItem.categoryId];
      let ci = attributeMap[masterValueItem.attributeId];
      //@ts-ignore
      if (!sheet.rows[ri].cells[ci]) sheet.rows[ri].cells[ci] = {};
      //@ts-ignore
      sheet.rows[ri].cells[ci].text = masterValueItem.value;
      //@ts-ignore
      sheet.rows[ri].cells[ci].editable = false;

      if (!colMap.has(masterValueItem.categoryId)){ 
        colMap.set(masterValueItem.categoryId, 1);
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
        //@ts-ignore
        if (!sheetRows[8].cells[3]) sheetRows[8].cells[3] = {text:''};
        //@ts-ignore
        if (!sheetRows[9].cells[3]) sheetRows[9].cells[3] = {text:''};
        //@ts-ignore
        if (!sheetRows[10].cells[3]) sheetRows[10].cells[3] = {text:''};
        //@ts-ignore
        if (!sheetRows[12].cells[3]) sheetRows[12].cells[3] = {text:''};
        //@ts-ignore
        if (!sheetRows[13].cells[3]) sheetRows[13].cells[3] = {text:''};

        //@ts-ignore
        sheetRows[8].cells[3].text = orgInfo.id;
        //@ts-ignore
        sheetRows[9].cells[3].text = orgInfo.IFISNum;
        //@ts-ignore
        sheetRows[10].cells[3].text = reportingPeriodInfo.name;
        //@ts-ignore
        sheetRows[12].cells[3].text = orgInfo.name;
        //@ts-ignore
        sheetRows[13].cells[3].text = orgInfo.legalName;

      }else{

        // add objects if they are undefined
        if (!sheetRows[4]) sheetRows[4] = {cells:{1:{text:''}}};
        if (!sheetRows[3]) sheetRows[3] = {cells:{1:{text:''}}};
        if (!sheetRows[2]) sheetRows[2] = {cells:{1:{text:''}}};
        //@ts-ignore
        if (!sheetRows[4].cells[1]) sheetRows[4].cells[1] = {text:''};
        //@ts-ignore
        if (!sheetRows[3].cells[1]) sheetRows[3].cells[1] = {text:''};
        //@ts-ignore
        if (!sheetRows[2].cells[1]) sheetRows[2].cells[1] = {text:''};

        //@ts-ignore
        sheetRows[4].cells[1].text = 'Reporting Period: ' + reportingPeriodInfo.name;
        //@ts-ignore
        sheetRows[3].cells[1].text = 'Facility ID: ' + orgInfo.id;
        //@ts-ignore
        sheetRows[2].cells[1].text = 'Hospital Name: ' + orgInfo.name;
      }
    }

    // find the coloumns that should be lock and lock them
    const firstAttributeCol = findFirstAttributeCol(sheet);
    for (let i = 0; i < firstAttributeCol; i++) colList.push(i);
    if (colList.length > 0) colList.push(1);
    lockSheet(colList, colList.length > 0 ? [9, 0]: [0], sheet);

    // Hide the 1st row and col if it has any attributeIDs and categoryIDs
    // This is to insure that the submitter and approver cannot change the
    // IDs.
    if ( attributeList.length > 0 || categoryList.length > 0){

      // Handles the cases where the field may be undefined
      if (!sheet.cols[0]) sheet.cols[0] = {};
      if (!sheet.rows[0]) sheet.rows[0] = {};

      // Set hide to true
      sheet.cols[0].hide = true;
      sheet.rows[0].hide = true;

    }
  }

  return workbook;
}




