import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
import templateController from '../../../controllers/template'
import CategoryInsertMenu from '../../CategoryInsertionMenu';
import AttributeInsertMenu from '../../AttributeInsertionMenu';
import spreadSheetController from '../../../controllers/spreadSheet';
import PopulationSelectionMenu from '../../PopulationSelectionMenu';
import Button from '@material-ui/core/Button';
import { digitToAlpha } from '../../../tools/misc';
import { Input, InputLabel } from "@material-ui/core";
import XLSX from "xlsx";

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
        name: 'Helvetica',
        size: 10,
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
      this.id = this.props.sheetID;
      this.saveTemplate = this.saveTemplate.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.insertCategory = this.insertCategory.bind(this);
      this.insertAttribute = this.insertAttribute.bind(this);
      this.enablePreview = this.enablePreview.bind(this);
      this.disablePreview = this.disablePreview.bind(this);
      this.fileImportHandler = this.fileImportHandler.bind(this);
      this.downloadTemplate = this.downloadTemplate.bind(this);
      this.workBookName = this.props.name;
      this.currentCoord = {};
      this.categoryAndAttribute = {};
      this.insertedPreview = [];
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

    handleSave(e){
      e.preventDefault();
      this.saveTemplate();
    }

    saveTemplate = () =>{
      if (this.sheet){
        this.disablePreview()
        const sheetData = this.sheet.getData();
        templateController.sheetUpdate(this.id, sheetData).then(res=>console.log(res));
      }
    }

    // This function is responsible for inserting category selections
    insertCategory = (inputs, rowNum=null) =>{
      const currentIndex = this.sheet.getCurrentSheetIndex();
      const insertRow = rowNum? rowNum:this.currentCoord.row;
      let unitCol = this.sheet.datas[currentIndex].findInputColOnRow(9, "Unit of Measure");
      if (!unitCol){
        unitCol = this.sheet.datas[currentIndex].findFirstNotNullColOnRow(1);
        this.sheet.insertColAt(unitCol);
      }
      for (let key in inputs){
        let dataArr = inputs[key];
        this.sheet.insertRowAt(insertRow);
        this.sheet.cellText(insertRow, 0, key, currentIndex);
        this.sheet.cellText(insertRow, 1, dataArr[0], currentIndex);
        this.sheet.cellText(insertRow, unitCol, dataArr[1], currentIndex);
      }
      this.sheet.reRender();
    }

    downloadTemplate(sheetData){
      let out = XLSX.utils.book_new();
      sheetData.forEach((xws) => {
        let aoa = [[]];
        let rowobj = xws.rows;
        for(let ri = 0; ri < rowobj.len; ++ri) {
          let row = rowobj[ri];
          if(!row) continue;
          aoa[ri] = [];
          Object.keys(row.cells).forEach(function(k) {
            let idx = +k;
            if(isNaN(idx)) return;
            aoa[ri][idx] = row.cells[k].text;
          });
        }
        let ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(out, ws, xws.name);
      });
      XLSX.writeFile(out, this.workBookName + '.xlsx');
    }

    enablePreview(orgID){
      const currentSheetIndex = this.sheet.getCurrentSheetIndex();
      const categoryMapping = this.sheet.datas[currentSheetIndex].rowLookUpTable(0);
      const attributeMapping = this.sheet.datas[currentSheetIndex].colLookUpTable(0);
      const categories = Object.keys(categoryMapping);
      const attributes = Object.keys(attributeMapping);
      spreadSheetController.fetchByOrgID(orgID, categories, attributes).then(data=>{
        console.log(data);
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

    disablePreview(){
      const categoryMapping = [];
      const attributeMapping = [];
      this.sheet.datas.forEach(dataProxy => {
        console.log(dataProxy)
        categoryMapping.push(dataProxy.rowLookUpTable(0));
        attributeMapping.push(dataProxy.colLookUpTable(0));
      });
      this.insertedPreview.forEach(coord=>{
        let {COAID, attributeId, currentSheetIndex} = coord;
        this.sheet.cellText(categoryMapping[currentSheetIndex][COAID], attributeMapping[currentSheetIndex][attributeId], '', currentSheetIndex);
      })
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

    fileImportHandler(event) {
      //set up a event listner
      let reader = new FileReader();
      
      // Setting up a onload event handler, this event handler will only fire
      // when it completed a sucessful read.
      reader.onload = (event) => {
        // Get the file data from event
        const data = event.target.result;

        // Read the data in binary
        const wb = XLSX.read(data, { type: "binary" });
        // Create a new list that is use for holding Json sheet object
        let sheetList = [];
  
        // Iterate trough the sheet name
        wb.SheetNames.forEach((name) => {
          let currSheet = { name: name, rows: {} };
  
          // Get the sheet object by name
          let targetSheet = wb.Sheets[name];
          //convert it into json
          let info = XLSX.utils.sheet_to_json(targetSheet, {
            raw: false,
            header: 1,
          });
          // fill up the newly converted json
          info.forEach((r, i) => {
            let cells = {};
            r.forEach(function (c, j) {
              console.log(wb)
              let coord = digitToAlpha(j + 1) + (i + 1);
              console.log('this', coord, wb.Sheets[name], name)
              if (wb.Sheets[name][coord]) {
                let formula = wb.Sheets[name][coord]["f"];
                if (formula) {
                  cells[j] = { text: "=" + formula };
                } else {
                  cells[j] = { text: c };
                }
              } else {
                cells[j] = { text: c };
              }
            });
            currSheet.rows[i] = { cells: cells };
          });
          // push the sheet json object into the list
          sheetList.push(currSheet);
        });
  
        // Rerender the file
        this.sheet.loadData(sheetList).reRender();
      };

      const file = event.target.files[0];
  
      reader.readAsBinaryString(file);
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
                <Button variant="outlined" color="primary" onClick={()=>this.disablePreview()}>
                  Disable preview
                </Button>
                <Button variant="outlined" color="primary" onClick={()=>this.disablePreview()}>
                  Disable preview
                </Button>
                <input
                  type="file"
                  accept=".xlsx, .xlsm"
                  onChange={(e) => this.fileImportHandler(e)}
                />
                <Button variant="outlined" color="primary" onClick={()=>this.downloadTemplate(this.sheet.getData())}>
                  Download Template
                </Button>
              </div>
              <div id="x-spreadsheet"></div>
          </div>
        )
    }
}

export default SpreadSheet;