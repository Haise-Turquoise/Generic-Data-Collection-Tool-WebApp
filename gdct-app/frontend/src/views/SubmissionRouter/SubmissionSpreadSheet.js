import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
import submissionController from '../../controllers/submission';
import statusController from '../../controllers/status';
import { compareSheet } from '../../tools/misc';
import CreateAuditLog from '../AuditLog_Global';
import Button from '@material-ui/core/Button';


// Sheet style Option
const sheetOption = {
    mode: 'edit', // edit | read
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    view: {
      height: () => document.documentElement.clientHeight*0.86,
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
      this.submissionObject = {};
      this.edit = true;
      this.orginalValue = null;
    }

    // After component mount, initailize spreadsheet and load data from DB
    componentDidMount(){
      if(this.sheet == null){
        submissionController.fetchSubmission(this.id).then(submission=>{
          statusController.findStatusByID(submission.statusId).then((status)=>{
            if (status && (status.name === 'Approved')){
              sheetOption.mode = 'read';
              this.edit = false;
            }
  
            this.submissionObject = submission;
            // @ts-ignore
            this.orginalValue = JSON.parse(JSON.stringify(submission.workbookData));
            this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(submission.workbookData).reRender();
            this.sheet.on('cell-selected',(cell, row, col)=>{
              this.currentCoord = {row, col};
            })
          })
        });
      }else{
        submissionController.fetchSubmission(this.id).then(submission=>{
          this.submissionObject = submission;
            // @ts-ignore
            this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(submission.workbookData).reRender();
            this.sheet.on('cell-selected',(cell, row, col)=>{
              this.currentCoord = {row, col};
            })
        })
      }
    }

    componentWillUnmount(){
      
      window.removeEventListener('beforeunload', this.handleSave);
      this.saveTemplate();
    }

    handleSave(e){
      e.preventDefault();
      this.saveTemplate();
    }

    saveTemplate = () =>{
      if (this.sheet && this.edit){
        const newData = this.sheet.getData();
        this.submissionObject.workbookData = newData;
        submissionController.updateWorkbook(this.submissionObject).then(res=>{
          const difference = compareSheet(this.orginalValue, newData);
          CreateAuditLog(null, "Edit Submission workbook", "Submisson", this.submissionObject._id, difference.oldValues, difference.newValues);
        });

      }
    }

    render(){
        return (
          <div>
            <div style={{display:'flex'}}>
            <Button variant="outlined" color="primary" onClick={this.saveTemplate}>
                Save
              </Button>
            </div>
            <div id="x-spreadsheet"></div>
          </div>
        )
    }
}

export default SubmissionSpreadSheet;