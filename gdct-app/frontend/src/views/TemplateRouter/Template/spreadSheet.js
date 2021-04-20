import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
import templateController from '../../../controllers/template'
import CategoryInsertMenu from '../../CategoryInsertionMenu';
import AttributeInsertMenu from '../../AttributeInsertionMenu';
import spreadSheetController from '../../../controllers/spreadSheet';
import PopulationSelectionMenu from '../../PopulationSelectionMenu';
import VarianceInsertionMenu from '../../InsertVarianceMenu'
import Button from '@material-ui/core/Button';
import { excelJsStyle2Xspreadsheet, isObjectEmpty, 
  calculateMergeArray, digitToAlpha, Xspreadsheet2ExcelStyle,
  generateCategoryMap, generateAttributeMap, findWordInRow, findLastAttributeCol} from '../../../tools/misc';
import Excel from 'exceljs';

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
      this.workBookName = this.props.name;
      this.currentCoord = {};
      this.categoryAndAttribute = {};
      this.insertedPreview = [];
      this.prevVarianceSelection = null;
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
        this.disablePreview()
        const workBookData = this.sheet.getData();
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

      if (varianceCol && this.prevVarianceSelection) {
      }

      this.sheet.reRender();
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
      let targetCol =  findResult > 0 ? findResult: findLastAttributeCol(currSheet) + 1;

      // Insert the variance column if it does not exist
      if (findResult < 0){
        this.sheet.insertColAt(targetCol);
        this.sheet.cellText(9, targetCol, 'Variance', currSheetIndex);
      }

      const keys = Object.keys(categoryMap);

      // Insert the variance formula for each of the cells
      // e.g: =(A1-A2)/A2
      for (const attributeID of keys){
        const rowNum = Number(categoryMap[attributeID]) + 1;
        const text = '=' + '(' + startCol + rowNum + '-' + endCol + rowNum + ')/' + startCol + rowNum;
        this.sheet.cellText(rowNum - 1, targetCol, text, currSheetIndex);
      }

      // keep the previous varaince selection to incase user insert a new attribute
      this.prevVarianceSelection = varianceSelection;
      this.sheet.reRender()
    }

    // This function handles download template feature, it convert Json array
    // from x-data-spreadsheet to xlsx
    downloadTemplate(sheetData){

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
            if (targetCell.style){ 
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
        targetEle.download = this.workBookName;
        targetEle.click();
      })
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
        console.log(data)
        data.forEach(element => {
          const COAID = element["CategoryId"];
          const attributeId = element["AttributeId"];
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
        
        // Rerender the file
        this.sheet.loadData(dataArr).reRender();
      };
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