import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
import templateController from '../controllers/template'
import CategoryInsertMenu from './CategoryInsertionMenu';
import AttributeInsertMenu from './AttributeInsertionMenu';

// Sheet Option
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
      this.currentCoord = {};
      this.categoryAndAttribute = {};
    }

    // After component mount, initailize spreadsheet and load data from DB
    componentDidMount(){
      templateController.fetchTemplate(this.id).then(template=>{
        const data = template.templateData;
        this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(data).reRender();
        // This event listner handles user close the tab without saving
        window.addEventListener('beforeunload', this.handleSave);
        this.sheet.on('cell-selected',(cell, row, col)=>{
          this.currentCoord = {row, col};
        })
        console.log(document.documentElement.clientWidth)
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
        const sheetData = this.sheet.getData();
        templateController.sheetUpdate(this.id, sheetData).then(res=>console.log(res));
      }
    }

    insertCategory = (inputs, rowNum=null) =>{
      const currentIndex = this.sheet.getCurrentSheetIndex();
      const insertRow = rowNum? rowNum:this.currentCoord.row;
      for (let key in inputs){
        this.sheet.insertRowAt(insertRow);
        this.sheet.cellText(insertRow, 0, key, currentIndex);
        this.sheet.cellText(insertRow, 1, inputs[key], currentIndex);
      }
      this.sheet.reRender();
    }

    insertAttribute = (id, text)=>{
      const currentIndex = this.sheet.getCurrentSheetIndex();
      const insertCol = this.currentCoord.col;
      this.sheet.insertColAt(insertCol);
      this.sheet.cellText(0, insertCol, id, currentIndex);
      this.sheet.cellText(9, insertCol, text, currentIndex);
      this.sheet.reRender();
    }

    render(){
        return (
          <div>
              <div style={{display:'flex'}}>
                <CategoryInsertMenu callback={this.insertCategory}/>
                <AttributeInsertMenu callback={this.insertAttribute}/>
              </div>
              <div id="x-spreadsheet"></div>
          </div>
        )
    }
}

export default SpreadSheet;