import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
import submissionController from '../../controllers/submission'

// Sheet style Option
const sheetOption = {
    mode: 'edit', // edit | read
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    view: {
      height: () => document.documentElement.clientHeight*0.885,
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
class SubmissionSpreadSheet extends Component{
    constructor(props) {
      super(props);
      this.sheet = null;
      this.id = this.props.sheetID;
      this.currentCoord = {};
      this.categoryAndAttribute = {};
      this.insertedPreview = [];
    }

    // After component mount, initailize spreadsheet and load data from DB
    componentDidMount(){
      submissionController.fetchSubmission(this.id).then(submission=>{
        const data = submission.workbookData;
        // @ts-ignore
        this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(data).reRender();
        this.sheet.on('cell-selected',(cell, row, col)=>{
          this.currentCoord = {row, col};
        })
      });
    }

    render(){
        return (
          <div>
              <div id="x-spreadsheet"></div>
          </div>
        )
    }
}

export default SubmissionSpreadSheet;