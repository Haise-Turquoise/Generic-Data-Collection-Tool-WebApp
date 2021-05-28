import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
import templateController from '../../../controllers/template'
import CategoryInsertMenu from './CategoryInsertionMenu';
import AttributeInsertMenu from './AttributeInsertionMenu';
import spreadSheetController from '../../../controllers/spreadSheet';
import PopulationSelectionMenu from './PopulationSelectionMenu';
import VarianceInsertionMenu from './InsertVarianceMenu'
import Button from '@material-ui/core/Button';
import { digitToAlpha,
  generateCategoryMap, generateAttributeMap, 
  findWordInRow, findLastAttributeCol, 
  templateDownloader, excelImportHandler, generateFullMap} from '../../../tools/misc';
import appConfigController from '../../../controllers/AppConfig';

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
class SpreadSheet extends Component{
    constructor(props) {
      super(props);
      this.sheet = null;
      this.id = this.props.templateID;
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
      this.workBookName = this.props.name;
      this.currentCoord = {};
      this.categoryAndAttribute = {};
      this.insertedPreview = [];
      this.prevVarianceSelection = null;
      this.validationThreshold = 0.05;
      this.attrbuteRow = 9;
    }

    // After component mount, initailize spreadsheet and load data from DB
    componentDidMount(){
      templateController.fetchTemplate(this.id).then(template=>{
        const data = template.templateData?template.templateData:[];
        // @ts-ignore
        this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(data).reRender();
        
        // This event listner handles user close the tab without saving
        window.addEventListener('beforeunload', this.handleSave);
        this.sheet.on('cell-selected',(cell, row, col)=>{
          this.currentCoord = {row, col};
        })
      });

      // fetch Validation Threshold
      appConfigController.fetchValidationThreshold().then(data=>{
        // default value is 0.05
        this.validationThreshold = data.value?Number(data.value):0.05;
      })

    }
    
    // This handles user navigate to different page without saving
    componentWillUnmount(){
      window.removeEventListener('beforeunload', this.handleSave);
      this.saveTemplate();
    }

    // Prevent default action when save
    handleSave(e){
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
    insertCategory = (inputs, rowNum=null) =>{
      const currentIndex = this.sheet.getCurrentSheetIndex();
      const insertRow = rowNum? rowNum - 1:this.currentCoord.row;
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
    insertVariance = (varianceSelection) => {

      const currSheetIndex = this.sheet.getCurrentSheetIndex();

      // split the attribute id pairs
      const selection = varianceSelection.split(' ');
      const currSheet = this.sheet.datas[currSheetIndex];
      
      // Generate Mappings
      const categoryMap = generateCategoryMap(currSheet);
      const attributeMap = generateAttributeMap(currSheet);

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
      }

      const keys = Object.keys(categoryMap);

      // Insert the variance formula for each of the cells
      // e.g: =(A1-A2)/A2
      const targetColAlphabit = digitToAlpha(targetCol);
      for (const attributeID of keys){
        const rowNum = Number(categoryMap[attributeID]) + 1;
        const text = '=' + '(' + startCol + rowNum + '-' + endCol + rowNum + ')/' + startCol + rowNum;
        this.sheet.cellText(rowNum - 1, targetCol, text, currSheetIndex);
        const cellCoord = targetColAlphabit + (targetCol + 1);
        this.sheet.addOtherGreaterThan(
          rowNum - 1, 
          rowNum - 1, 
          targetCol + 1, 
          targetCol + 1,
          `=${cellCoord}`, 
          0.05, 
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
    downloadTemplate(sheetData){
      templateDownloader(this.workBookName, sheetData);
    }

    // This function handles enable preview feature
    enablePreview(orgID){
      const currentSheetIndex = this.sheet.getCurrentSheetIndex();

      // Generate mappings
      const categoryMapping = this.sheet.datas[currentSheetIndex].rowLookUpTable(0);
      const attributeMapping = this.sheet.datas[currentSheetIndex].colLookUpTable(0);

      const categories = Object.keys(categoryMapping);
      const attributes = Object.keys(attributeMapping);

      // Get the master values from DB
      spreadSheetController.fetchByOrgID(orgID, categories, attributes).then(data=>{
        data.forEach(element => {
          const COAID = element["categoryId"];
          const attributeId = element["attributeId"];
          const value = element['value'];
          this.sheet.cellText(categoryMapping[COAID], attributeMapping[attributeId], value, currentSheetIndex);
          this.insertedPreview.push({COAID, attributeId, currentSheetIndex});
        });
        this.sheet.reRender();
      });
    }

    getCurrentSheet(){
      return this.sheet.datas[this.sheet.getCurrentSheetIndex()];
    }
    
    // This function handles disable preview feature
    disablePreview(){
      const categoryMapping = [];
      const attributeMapping = [];

      // Generate look up table for all the sheets 
      this.sheet.datas.forEach(dataProxy => {
        categoryMapping.push(dataProxy.rowLookUpTable(0));
        attributeMapping.push(dataProxy.colLookUpTable(0));
      });

      // delete the previews for all the sheets
      // Coord is the object in the inserted preview array
      this.insertedPreview.forEach(coord=>{
        let {COAID, attributeId, currentSheetIndex} = coord;
        this.sheet.cellText(categoryMapping[currentSheetIndex][COAID], attributeMapping[currentSheetIndex][attributeId], '', currentSheetIndex);
      });

      this.insertedPreview = [];
      this.sheet.reRender();
    }

    lineNumberInsertion(reRender=false){
      const currSheetIndex = this.sheet.getCurrentSheetIndex();
      const currSheet = this.sheet.datas[currSheetIndex];
      const categoryMap = generateCategoryMap(currSheet);

      let categoryIDs = Object.keys(categoryMap).sort((id1, id2)=>
        categoryMap[id1] - categoryMap[id2]
      );

      for (let i = 0; i < categoryIDs.length; i++){
        this.sheet.cellText(categoryMap[categoryIDs[i]], 2, i + 1, currSheetIndex);
      }
      if (reRender) this.sheet.reRender();
    }

    // This function is responsible for inserting atrributes
    insertAttribute = (id, text)=>{
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

    // This is the function for handling the import
    // It reads the file from client's computer and converts it into Json array that
    // x-data-spreadsheet can understand. At the end we are saving this Json array 
    // to our DB.
    fileImportHandler(event) {
      excelImportHandler(event, (data)=>{this.sheet.loadData(data).reRender()});
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
                />
              </div>
              <div id="x-spreadsheet"></div>
              <a id="download" style={{display:'none'}}></a>
          </div>
        )
    }
  
}

export default SpreadSheet;