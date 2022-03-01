import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
//@ts-ignore
import templateController from '../../../controllers/template';
import CategoryInsertMenu from './CategoryInsertionMenu';
import AttributeInsertMenu from './AttributeInsertionMenu';
//@ts-ignore
import spreadSheetController from '../../../controllers/spreadSheet';
import PopulationSelectionMenu from './PopulationSelectionMenu';
//@ts-ignore
import OrgController from '../../../controllers/organization';
import VarianceInsertionMenu from './InsertVarianceMenu'
import Button from '@material-ui/core/Button';
import { digitToAlpha,
  generateCategoryMap, generateAttributeMap, 
  findWordInRow, findLastAttributeCol, 
  //@ts-ignore
  templateDownloader, excelImportHandler, generateFullMap} from '../../../tools/misc';
//@ts-ignore
import appConfigController from '../../../controllers/AppConfig';
//@ts-ignore
import { ObjectId } from 'mongoose';
import {PreviewData, Coordinate, SpreadSheetProps, CategorySelection, IdMapping, OrgPreviewData} from '../../../types/spreadsheetTypes/spreadSheetTypes';
import { MasterValue } from '../../../types/mastervalue';
import Template, { SheetData } from '../../../types/template';
import AppConfig from '../../../types/appconfig';
import columnNameController from "../../../controllers/columnName";
import UnitOfMeasurementController from "../../../controllers/UnitOfMeasurement";
import Attribute from "../../../types/attrubute";
import UpdatePeriod from "./UpdatePeriod";
import { CodeSharp } from "@material-ui/icons";
import swal from 'sweetalert2'

// Sheet style Option
const sheetOption = {
  mode: 'edit', // edit | read
  showToolbar: true,
  showGrid: true,
  showContextmenu: true,
  view: {
    height: () => document.documentElement.clientHeight*0.7488,
    width: () => document.documentElement.clientWidth*0.975,
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
      name: 'Calibri',
      size: 11,
      bold: false,
      italic: false,
    },
  },
}

// We use compoenent instead of hooks since hooks will cause undefined behavior

class SpreadSheet extends Component<SpreadSheetProps, {hasSheet: boolean}>{

  id: ObjectId;
  workBookName: string;
  currentCoord: Coordinate;
  insertedPreview: (PreviewData|OrgPreviewData)[];
  prevVarianceSelection: string;
  validationThreshold: number;
  attrbuteRow: number;
  backButton:Function;
  sheet: any;

  constructor(props:SpreadSheetProps) {
    super(props);
    this.sheet = null;
    this.id = this.props.templateID;
    this.backButton = this.props.backButton;
    this.openUploadMenu = this.openUploadMenu.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.insertCategory = this.insertCategory.bind(this);
    this.insertAttribute = this.insertAttribute.bind(this);
    this.enablePreview = this.enablePreview.bind(this);
    this.disablePreview = this.disablePreview.bind(this);
    this.fileImportHandler = this.fileImportHandler.bind(this);
    this.downloadTemplate = this.downloadTemplate.bind(this);
    this.insertVariance = this.insertVariance.bind(this);
    this.getCurrentSheet = this.getCurrentSheet.bind(this);
    this.lineNumberInsertion = this.lineNumberInsertion.bind(this);
    this.getBasePeriod = this.getBasePeriod.bind(this);
    this.updatePeriod = this.updatePeriod.bind(this);
    this.workBookName = this.props.name;
    this.currentCoord = {row:0, col:0};
    this.insertedPreview = [];
    this.prevVarianceSelection = '';
    this.validationThreshold = 0.05;
    this.attrbuteRow = 9;
    this.state = {
      hasSheet: false
    }
  }

  // After component mount, initailize spreadsheet and load data from DB
  componentDidMount(){
    const userRole = localStorage.getItem('currentRole');
    if (userRole ==='Template Approver'){
      sheetOption.mode = 'read';
    }else{
      sheetOption.mode = 'edit';
    }
    templateController.fetchTemplate(this.id).then((template:Template | null)=>{
      const data = template?.templateData;
      // @ts-ignore
      this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(data).reRender();
      this.setState({hasSheet: true})
      // This event listner handles user close the tab without saving
      window.addEventListener('beforeunload', this.handleSave as EventListener);
      this.sheet.on('cell-selected',(cell:object, row:number, col:number)=>{
        this.currentCoord = {row, col};
      })
    });

    // fetch Validation Threshold
    appConfigController.fetchValidationThreshold().then((data:AppConfig | null)=>{
      // default value is 0.05
      if (data) {
        this.validationThreshold = data.value?Number(data.value): 0.05;
      }
    })

    appConfigController.fetchAttributeRow().then((data:AppConfig | null)=>{
      if (data) {
        this.attrbuteRow = data.value? Number(data.value) - 1: 9
      } 
    })

  }
  
  // This handles user navigate to different page without saving
  componentWillUnmount(){
    window.removeEventListener('beforeunload', this.handleSave);
    this.saveTemplate();
  }

  // Prevent default action when save
  handleSave(e:Event){
    e.preventDefault();
    this.saveTemplate();
  }

  // Save function
  saveTemplate = () =>{
    if (this.sheet){
      this.disablePreview();
      const workBookData = this.sheet.getData();
      console.log(workBookData);
      templateController.sheetUpdate(this.id, workBookData);
    }
  }

  // This function is responsible for inserting category selections
  insertCategory = (inputs:CategorySelection, rowNum:number=-1) =>{
    const currentIndex = this.sheet.getCurrentSheetIndex();

    const insertRow = rowNum > -1? rowNum - 1:this.currentCoord.row;
    let unitCol = this.sheet.datas[currentIndex].findInputColOnRow(9, "Unit of Measure");
    let varianceCol = this.sheet.datas[currentIndex].findInputColOnRow(9, "Variance");

    // Key is category ID, currentIndex is the index of the current sheet
    for (let key in inputs){
      let dataArr = inputs[key];
      this.sheet.insertRowAt(insertRow);
      this.sheet.cellText(insertRow, 0, key, currentIndex);
      this.sheet.cellText(insertRow, 1, dataArr[0], currentIndex);
      if (unitCol) this.sheet.cellText(insertRow, unitCol, dataArr[1], currentIndex);
    }
    this.lineNumberInsertion();
    if (varianceCol && this.prevVarianceSelection) {
      this.insertVariance(this.prevVarianceSelection);
    }else{
      this.sheet.reRender();
    }

  }
  
  // Callback funtion for variance insertion
  // the input of this function will be two attribute ids seperate by a space
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

  // This function handles download template feature, it convert Json array
  // from x-data-spreadsheet to xlsx
  downloadTemplate(sheetData:SheetData[]){
    templateDownloader(this.workBookName, sheetData);
  }

  // This function handles enable preview feature
  async enablePreview(orgID:number){
    const orgInfo = await OrgController.fetchById(orgID);
    if (!orgInfo) {
      return;
    }
    const currentSheetIndex = this.sheet.getCurrentSheetIndex();

    // Generate mappings
    const categoryMapping = this.sheet.datas[currentSheetIndex].rowLookUpTable(0);
    const attributeMapping = this.sheet.datas[currentSheetIndex].colLookUpTable(0);

    const categories = Object.keys(categoryMapping);
    const attributes = Object.keys(attributeMapping);

    const productOfLength = categories.length* attributes.length;
    console.log(orgID, categories, attributes);
    // Get the master values from DB
    const masterValueData:MasterValue[] = productOfLength > 0 ? await spreadSheetController.fetchByOrgID(orgID, categories, attributes):[];
    console.log(masterValueData)
    // Insert mastervalue preview
    masterValueData.forEach(element => {
      const COAID = element["categoryId"];
      const attributeId = element["attributeId"];
      const value = element['value'];
      this.sheet.cellText(categoryMapping[COAID], attributeMapping[attributeId], value, currentSheetIndex);
      this.insertedPreview.push({COAID, attributeId, currentSheetIndex});
    });

    // Insert org info
    const sheetName = this.sheet.datas[currentSheetIndex].name;

    // Since org info is located differently in some sheets, we need to check for sheet names
    if (sheetName.toLowerCase() !== 'identification'){
      this.sheet.cellText(3, 1, 'Facility ID: ' + orgInfo.id, currentSheetIndex);
      this.sheet.cellText(2, 1, 'Hospital Name: ' + orgInfo.name, currentSheetIndex);

      this.insertedPreview.push({row:3, col:1, originalValue:'Facility ID:' ,currentSheetIndex});
      this.insertedPreview.push({row:2, col:1, originalValue:'Hospital Name:' ,currentSheetIndex});

    }else{
      this.sheet.cellText(8, 3, orgInfo.id, currentSheetIndex);
      this.sheet.cellText(9, 3, orgInfo.IFISNum, currentSheetIndex);
      this.sheet.cellText(12, 3, orgInfo.name, currentSheetIndex);
      this.sheet.cellText(13, 3, orgInfo.legalName, currentSheetIndex);

      this.insertedPreview.push({row:8, col:3, originalValue:'' ,currentSheetIndex});
      this.insertedPreview.push({row:9, col:3, originalValue:'' ,currentSheetIndex});
      this.insertedPreview.push({row:12, col:3, originalValue:'' ,currentSheetIndex});
      this.insertedPreview.push({row:13, col:3, originalValue:'' ,currentSheetIndex});
    }

    this.sheet.reRender();
  }

  getCurrentSheet(){
    return this.sheet.getData()[this.sheet.getCurrentSheetIndex()];
  }
  
  // This function handles disable preview feature
  disablePreview(){
    const categoryMapping:IdMapping[] = [];
    const attributeMapping:IdMapping[] = [];

    // Generate look up table for all the sheets 
    this.sheet.datas.forEach((dataProxy: { rowLookUpTable: (arg0: number) => object; colLookUpTable: (arg0: number) => object; }) => {
      categoryMapping.push(dataProxy.rowLookUpTable(0) as IdMapping);
      attributeMapping.push(dataProxy.colLookUpTable(0) as IdMapping);
    });

    // delete the previews for all the sheets
    // Coord is the object in the inserted preview array
    this.insertedPreview.forEach(coord=>{
      if ('COAID' in coord){
        let {COAID, attributeId, currentSheetIndex} = coord;
        this.sheet.cellText(categoryMapping[currentSheetIndex][COAID], attributeMapping[currentSheetIndex][attributeId], '', currentSheetIndex);
      }else{
        let {row, col, currentSheetIndex, originalValue} = coord;
        this.sheet.cellText(row, col, originalValue, currentSheetIndex)
      }
    });

    this.insertedPreview = [];
    this.sheet.reRender();
  }

  lineNumberInsertion(reRender=false){
    const currSheetIndex = this.sheet.getCurrentSheetIndex();
    const currSheet = this.sheet.getData()[currSheetIndex];
    const categoryMap = generateCategoryMap(currSheet);
    console.log('map', categoryMap)

    let categoryIDs = Object.keys(categoryMap).sort((id1, id2)=>
      // @ts-ignore
      categoryMap[id1] - categoryMap[id2]
    );

    for (let i = 0; i < categoryIDs.length; i++){
      // @ts-ignore
      this.sheet.cellText(categoryMap[categoryIDs[i]], 2, i + 1, currSheetIndex);
    }
    if (reRender) this.sheet.reRender();
  }

  // This function is responsible for inserting atrributes
  insertAttribute = (id:number, text:string)=>{
    // Get current index of the current sheet
    const currentIndex = this.sheet.getCurrentSheetIndex();
    const insertCol = this.currentCoord.col;

    // Insert col at the specified index
    this.sheet.insertColAt(insertCol);

    // Insert id and text to their rows
    this.sheet.cellText(0, insertCol, id, currentIndex);
    this.sheet.cellText(9, insertCol, text, currentIndex);
    this.sheet.reRender();
  }

  openUploadMenu(){
    const targetElement = document.getElementById('upload-button') as HTMLInputElement;
    targetElement.click();
  }

  // This is the function for handling the import
  // It reads the file from client's computer and converts it into Json array that
  // x-data-spreadsheet can understand. At the end we are saving this Json array 
  // to our DB.
  fileImportHandler(event:React.ChangeEvent<HTMLInputElement>) {
    excelImportHandler(event, (data:object)=>{this.sheet.loadData(data).reRender()});
  }

  getBasePeriod = () => {
    if (!this.sheet) {
      return ""
    }
    // return reporting period as string from main menu
    const mainMenu = this.sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'MAIN MENU');
    if (!mainMenu) {
      return ""
    }    
    const year = mainMenu.getCellTextOrDefault(4, 2);
    const q = mainMenu.getCellTextOrDefault(5, 2);
    return !!q ? `${year} ${q}` : `${year}`;
  }

  getUpdateCells = async (year_D: number, q_D: number): Promise<{proxy: any, ci: number, newAttr: string, newId: string}[]> => {
    // all column names
    const attributes: Attribute[] = await columnNameController.fetch();
    const notFound: string[] = [];
    const cells: {proxy: any, ci: number, newAttr: string, newId: string}[] = [];
    // find each attribute and attempt to update
    // don't update if the attribute does not exist
    this.sheet.datas.forEach((proxy: any) => {
      if (['MAIN MENU', 'IDENTIFICATION'].includes(proxy.name.toUpperCase())) {
        return;
      }
      proxy.rows.eachCells(9, (ci: number, cell: any) => {
        console.log('trying for', 9, ci, cell.text)
        // if attribute has a date and is an attribute (has id at row 1)
        let rgx = /20\d\d\/\d\d( Q1| Q2| Q3| YE)?/g;
        if (!rgx.test(cell.text) || !proxy.getCell(0, ci)) {
          return
        }
        // generate new attribute to look for
        let attribute = cell.text;
        const critical = (attribute.match(rgx) || [''])[0];
        const [yr, q] = critical.split(' ');
        if (!!yr) {
          const newYear = parseInt(yr.substring(0,4)) + year_D;
          const newQ = !!q ? ((parseInt(q.substring(1)) || 4) + q_D) % 4 : -1;
          let newQs = "";
          if (newQ == 0) {
            newQs = " YE";
          } else if (newQ > 0) {
            newQs = " Q" + newQ;
          }
          const newYearS = `${newYear}/${(newYear + 1) % 100}`;
          attribute = attribute.replace(rgx, newYearS + newQs);
        }
        // verify and update
        if (attribute !== cell.text) {
          // attribute was updated, see if it exists and update
          const id = attributes.find(attr => attr.name === attribute)?.id || -1;
          if (id !== -1) { 
            // proxy.setCellText(9, ci, attribute, 'finished');
            // proxy.setCellText(0, ci, id, 'finished');
            cells.push({proxy: proxy, ci: ci, newAttr: attribute, newId: id})
          } else {
            notFound.push(attribute)
          }
        }
      })
    })
    if (notFound.length > 0) {
      const notFoundMsg = 'Update unsuccessful. Did not find the following attributes: ' + notFound.reduce((acc, curr) => acc += curr + ", ", "")
      swal.fire({
        title: 'Some Attributes Not Found',
        icon: "error",
        text: notFoundMsg
      })
      return []
    } else {
      return cells
    }
  }

  unitOfMeasure = async () => {

    const unitOfMeasureInfo = await UnitOfMeasurementController.fetch();
    console.log("unit of measureInfo");
    console.log(unitOfMeasureInfo);
    this.sheet.datas[this.sheet.getCurrentSheetIndex()].UnitValidation.validate(unitOfMeasureInfo);
    this.sheet.reRender();
  }

  validateSheet = async () => {
    this.sheet.datas[this.sheet.getCurrentSheetIndex()].validateAll();
    this.sheet.reRender();
  }

  updatePeriod = async (year_D: number, q_D: number) => {
    if (!this.sheet) {
      return
    }
    const cells = await this.getUpdateCells(year_D, q_D)
    if (cells.length === 0) {
      return
    }
    // update reference on Main Menu
    const mainMenu = this.sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'MAIN MENU');
    const yearCell = mainMenu.getCell(4, 2);
    const qCell = mainMenu.getCell(5, 2);
    if (yearCell && yearCell.text) {
      // expect year cell [Main Menu (4,7)] to be 20xx-xy
      const newYear = parseInt(yearCell.text.substring(0,4)) + year_D;
      mainMenu.setCellText(4, 2, `${newYear}-${(newYear + 1) % 100}`, 'input'); // state??
    }
    if (qCell && qCell.text) {
      // expect Q1, Q2, Q3, YE
      const newNum = /^Q(1|2|3)$/.test(qCell.text) ? (parseInt(qCell.text.substring(1)) + q_D) % 4 : (4 + q_D) % 4;
      const newQ = newNum == 0 ? "YE" : "Q" + newNum;
      mainMenu.setCellText(5, 2, newQ, 'finished');
    }

    cells.forEach(data => {
      data.proxy.setCellText(9, data.ci, data.newAttr, 'finished')
      data.proxy.setCellText(0, data.ci, data.newId, 'finished')
    })
    // console.log('updated cells')
    // all column names
    // const attributes: Attribute[] = await columnNameController.fetch();
    // const notFound: string[] = []
    // find each attribute and attempt to update
    // don't update if the attribute does not exist
    // this.sheet.datas.forEach((proxy: any) => {
    //   if (['MAIN MENU', 'IDENTIFICATION'].includes(proxy.name.toUpperCase())) {
    //     return;
    //   }
    //   proxy.rows.eachCells(9, (ci: number, cell: any) => {
    //     console.log('trying for', 9, ci, cell.text)
    //     // if attribute has a date and is an attribute (has id at row 1)
    //     let rgx = /20\d\d\/\d\d( Q1| Q2| Q3| YE)?/g;
    //     if (!rgx.test(cell.text) || !proxy.getCell(0, ci)) {
    //       return
    //     }
    //     // generate new attribute to look for
    //     let attribute = cell.text;
    //     const critical = (attribute.match(rgx) || [''])[0];
    //     const [yr, q] = critical.split(' ');
    //     if (!!yr) {
    //       const newYear = parseInt(yr.substring(0,4)) + year_D;
    //       const newQ = !!q ? ((parseInt(q.substring(1)) || 4) + q_D) % 4 : -1;
    //       let newQs = "";
    //       if (newQ == 0) {
    //         newQs = " YE";
    //       } else if (newQ > 0) {
    //         newQs = " Q" + newQ;
    //       }
    //       const newYearS = `${newYear}/${(newYear + 1) % 100}`;
    //       attribute = attribute.replace(rgx, newYearS + newQs);
    //     }
    //     // verify and update
    //     if (attribute !== cell.text) {
    //       // attribute was updated, see if it exists and update
    //       const id = attributes.find(attr => attr.name === attribute)?.id || -1;
    //       if (id !== -1) { 
    //         proxy.setCellText(9, ci, attribute, 'finished');
    //         proxy.setCellText(0, ci, id, 'finished');
    //       } else {
    //         notFound.push(attribute)
    //       }
    //     }
    //   })
    // })
    // if (notFound.length > 0) {
    //   const notFoundMsg = 'Update successful but did not find the following attributes: ' + notFound.reduce((acc, curr) => acc += curr + ", ", "")
    //   swal.fire({
    //     title: 'Some Attributes Not Found',
    //     icon: "warning",
    //     text: notFoundMsg
    //   })
    // }
    this.sheet.reRender();
  }

  render(){
      return (
        <div>
            <div style={{display:'flex'}}>
              <Button variant="outlined" color="primary" onClick={this.saveTemplate}>
                Save
              </Button>
              <CategoryInsertMenu callback={this.insertCategory}/>
              <AttributeInsertMenu callback={this.insertAttribute}/>
              <PopulationSelectionMenu callback={this.enablePreview}/>
              <VarianceInsertionMenu callback={this.insertVariance} getSheet={this.getCurrentSheet}/>
              <UpdatePeriod callback={this.updatePeriod} getBasePeriod={this.getBasePeriod} runBP={this.state.hasSheet} />
              <Button variant="outlined" color="primary" onClick={()=>this.disablePreview()}>
                Disable preview
              </Button>
              <Button variant="outlined" color="primary" onClick={()=>this.lineNumberInsertion(true)}>
                Organize line numbers
              </Button>
              <Button variant="outlined" color="primary" onClick={()=>this.downloadTemplate(this.sheet.getData())}>
                Download Template
              </Button>
              <input
                type="file"
                accept=".xlsx, .xlsm"
                onChange={(e) => this.fileImportHandler(e)}
                hidden
                id='upload-button'
              />
             
              <Button variant="outlined" color="primary" onClick={()=>this.openUploadMenu()}>
                Upload Template
              </Button>
              <Button variant="outlined" color="primary" onClick={() => {this.validateSheet()}}>
                Validate
              </Button>

              <Button variant="outlined" color="primary" onClick={() => {this.unitOfMeasure()}}>
                Unit of Measure Validation
              </Button>
             
              <Button variant="outlined" color="primary" onClick={()=>this.backButton()}>
                Go Back
              </Button>
            </div>
            <div id="x-spreadsheet"></div>
            <a id="download" style={{display:'none'}}></a>
        </div>
      )
  }
  
}

export default SpreadSheet;