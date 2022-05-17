import { withRouter } from 'react-router';
import React, { Component } from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Spreadsheet from 'x-data-spreadsheet';
// @ts-ignore
import submissionController from '../../controllers/submission';
// @ts-ignore
import statusController from '../../controllers/status';
// @ts-ignore
import orgController from '../../controllers/organization';
import { compareSheet } from '../../tools/misc';
import {Coordinate} from '../../types/spreadsheetTypes/spreadSheetTypes';
import { digitToAlpha,
  generateCategoryMap, generateAttributeMap, 
  findWordInRow, findLastAttributeCol, 
  //@ts-ignore
  templateDownloader,templateCSVFormat, excelImportHandler, generateFullMap} from '../../tools/misc';
// @ts-ignore
import CreateAuditLog from '../AuditLog_Global';
import Button from '@material-ui/core/Button';
import Submission, { submissionSpreadsheetProps } from '../../types/submission';
import Status from '../../types/status';
import { SheetData } from '../../types/template';
import UnitOfMeasurementController from "../../controllers/UnitOfMeasurement";
import VarianceInsertionMenu from "../TemplateRouter/Template/InsertVarianceMenu/insertVarianceMenu"


const sheetOption = {
    mode: 'read', // edit | read
    showToolbar: false,
    showGrid: true,
    showContextmenu: false,
    view: {
      height: () => document.documentElement.clientHeight * 0.86,
      width: () => document.documentElement.clientWidth * 0.975,
    },
    row: {
      len: 100,
      height: 25,
    },
    col: {
      len: 26,
      width: 100,
      indexWidth: 60,
      minWidth: 60,
    },
    style: {
      bgcolor: '#ffffff',
      align: 'left',
      valign: 'middle',
      textwrap: false,
      strike: false,
      underline: false,
      color: '#0a0a0a',
      font: {
        name: 'Helvetica',
        size: 10,
        bold: false,
        italic: false,
      },
    },
  };


class UploadPreview extends Component<any>{

    sheet: Spreadsheet|any;
    id: string;
    currentCoord: Coordinate|{};
    categoryAndAttribute: {};
    submissionObject: Partial<Submission>;
    validationThreshold: number;
    prevVarianceSelection: string;
  
    edit: boolean;
    orginalValue: SheetData[];
    history: any;
  
    constructor(props:any) {
      super(props);
      this.sheet = null;
      this.id = '';
      //console.log(props);
      this.currentCoord = {};
      this.categoryAndAttribute = {};
      this.submissionObject = this.props.submission;
      this.edit = true;
      this.orginalValue = [];
      this.clearComponentChild = this.clearComponentChild.bind(this);
      this.insertOrg = this.insertOrg.bind(this);
      this.insertVariance = this.insertVariance.bind(this);
      this.getCurrentSheet = this.getCurrentSheet.bind(this);
      this.prevVarianceSelection = '';
      this.validationThreshold = 0.05;
      //@ts-ignore
      //this.history = this.props.history;
    }
  
  
    
  
    // After component mount, initailize spreadsheet and load data from DB
    componentDidMount() {
      console.log(this.submissionObject)
      if (this.sheet == null && this.submissionObject != undefined && this.submissionObject.workbookData!= undefined) {
        
         
          this.clearComponentChild();
          // @ts-ignore
          this.sheet = new Spreadsheet('#x-spreadsheet', sheetOption)
          //@ts-ignore
            .loadData(this.submissionObject.workbookData).reRender();
          //@ts-ignore
          this.sheet.on('cell-selected', (cell, row, col) => {
            this.currentCoord = { row, col };
          });
       
      }
    }

    insertVariance = (varianceSelection:string) => {

      const currSheetIndex = this.sheet.getCurrentSheetIndex();
  
      // split the attribute id pairs
      const selection = varianceSelection.split(' ');
      const currSheet = this.sheet.getData()[currSheetIndex];
      
      // Generate Mappings
      const categoryMap:any = generateCategoryMap(currSheet);
      const attributeMap:any = generateAttributeMap(currSheet);
  
      // Identify the col alphabit assignment
      const startCol = digitToAlpha(Number(attributeMap[selection[0]]) + 1);
      const endCol = digitToAlpha(Number(attributeMap[selection[1]]) + 1);
  
      // Search if the variance column exist
      const findResult = findWordInRow(currSheet, 9, 'Variance');
      const targetCol =  findResult > 0 ? Number(findResult): Number(findLastAttributeCol(currSheet) + 1);
  
      // Insert the variance column if it does not exist
      if (findResult < 0){
        this.sheet.insertColAt(targetCol);
        this.sheet.cellText(9, targetCol, 'Variance', currSheetIndex);
        this.sheet.insertColAt(targetCol + 1)
        this.sheet.cellText(9, targetCol + 1, 'Note', currSheetIndex);
      }
  
      const keys = Object.keys(categoryMap);
  
      // Insert the variance formula for each of the cells
      // e.g: =(A1-A2)/A2
      const targetColAlphabit = digitToAlpha(targetCol + 1);
      for (const attributeID of keys){
        const rowNum = Number(categoryMap[attributeID]) + 1;
        const text = '=' + '(' + startCol + rowNum + '-' + endCol + rowNum + ')/' + startCol + rowNum;
        this.sheet.cellText(rowNum - 1, targetCol, text, currSheetIndex);
        const cellCoord = targetColAlphabit.toLocaleLowerCase() + (rowNum);
        this.sheet.cellText(rowNum - 1, targetCol, text, currSheetIndex);
        this.sheet.cellText(rowNum - 1, targetCol + 1, '', currSheetIndex);
        this.sheet.addOtherGreaterThan(
          rowNum - 1, 
          rowNum - 1, 
          targetCol + 1, 
          targetCol + 1,
          `=${cellCoord}`,
          this.validationThreshold,  
          { bgcolor: "#FFEF00" }, 
          currSheetIndex
        )
      }
  
      // keep the previous varaince selection to incase user insert a new attribute
      this.prevVarianceSelection = varianceSelection;
      this.sheet.reRender()
    }

    update(){
      console.log("UPDATING !!!!")
      this.clearComponentChild();
      // @ts-ignore
      this.sheet = new Spreadsheet('#x-spreadsheet', sheetOption)
      //@ts-ignore
        .loadData(this.submissionObject.workbookData).reRender();
      //@ts-ignore
      this.sheet.on('cell-selected', (cell, row, col) => {
        this.currentCoord = { row, col };
      });
    }
  
    // Clear the x-data-spreadsheet, or else ther is going to have duplicate sheet,
    // Don't ask me why, I have no idea =_=, this might be a async issue due to how react
    // render and mount the dom.
    // Last Update by Sheldon Su on 2021/04/29
    clearComponentChild() {
      const ele = document.getElementById('x-spreadsheet');
      if (ele) {
        while (ele.childNodes[0]) {
          ele.removeChild(ele.childNodes[0]);
        }
      }
    }
    componentWillUnmount() {
     
    }
  
  
  
    unitOfMeasure = async () => {
  
      const unitOfMeasureInfo = await UnitOfMeasurementController.fetch();
      console.log("unit of measureInfo");
      console.log(unitOfMeasureInfo);
      this.sheet.datas[this.sheet.getCurrentSheetIndex()].UnitValidation.validate(unitOfMeasureInfo);
      this.sheet.reRender();
    }
  
    validateSheet =  () => {
      this.sheet.datas[this.sheet.getCurrentSheetIndex()].resetCommentsandErrors();
      console.log(this.sheet.datas[this.sheet.getCurrentSheetIndex()].comments);
      this.sheet.reRender();
    }

     hasError = () =>{
      let error = false;
      console.log("XDDDDDDDDDDDDD")
      console.log(this.sheet.datas);
      for(var sheetNum in this.sheet.datas){
        
        this.sheet.datas[sheetNum].validateAll();
        this.sheet.reRender();
        
      }
      for(var sheetNum in this.sheet.datas){
        console.log(this.sheet.datas[sheetNum].comments);
        if(Object.keys(this.sheet.datas[sheetNum].comments).length > 0){
          error = true;
        }
      }
      
      return error;
    }
    getCurrentSheet(){
      return this.sheet.getData()[this.sheet.getCurrentSheetIndex()];
    }
    
  
    insertOrg = async (orgId:number) => {
      if (this.edit) {
        // Get org data
        const org = await orgController.fetchById(Number(orgId));
        if (!org) throw new Error('Organization not found')
        // Get reporting period data
        const reportPeriod = await submissionController.fetchSubmissionReportingPeriod(this.id);
        if (!reportPeriod) throw new Error('Reporting Period not found')
        const data = this.sheet.getData();
  
        // Iterate through each sheet to fill in information (start from the second sheet)
        for (let i = 1; i < data.length; i++) {
          const currSheet = data[i];
  
          // Identification sheet has different format
          if (currSheet.name.toLowerCase() === 'identification') {
            this.sheet.cellText(8, 3, org.id, i);
            this.sheet.cellText(9, 3, org.IFISNum, i);
            this.sheet.cellText(10, 3, reportPeriod.name, i);
            this.sheet.cellText(12, 3, org.name, i);
            this.sheet.cellText(13, 3, org.legalName, i);
          } else {
            this.sheet.cellText(3, 1, 'Facility ID: ' + org.id, i);
            this.sheet.cellText(2, 1, 'Hospital Name: ' + org.name, i);
          }
        }
        this.sheet.reRender();
      }
    };
  
    render(){
      
      return (
        <div>
          <div style={{display:'flex'}}>
            <Button variant="outlined" color="primary" onClick={() => {this.validateSheet()}}>
              Validate
            </Button>
  
            <Button variant="outlined" color="primary" onClick={() => {this.unitOfMeasure()}}>
              Unit of Measure Validation
            </Button>
            <VarianceInsertionMenu callback={this.insertVariance} getSheet={this.getCurrentSheet}/>
            {/* <Button variant="outlined" color="primary" onClick={()=>this.downloadCSV()}>
                  Download csv
                </Button> */} 
            
          </div>
          <div id="x-spreadsheet"></div>
        </div>
      )
    }
  }


export default UploadPreview;