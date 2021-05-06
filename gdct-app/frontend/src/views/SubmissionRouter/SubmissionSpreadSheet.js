import React, { Component } from "react";
import Spreadsheet from 'x-data-spreadsheet';
import submissionController from '../../controllers/submission';
import usersController from '../../controllers/Users';
import statusController from '../../controllers/status';
import OrgselectionMenu from './OrgSelectionMenu';
import reportingPeriodController from '../../controllers/reportingPeriod'
import orgController from '../../controllers/organization';
import { compareSheet } from '../../tools/misc';
import CreateAuditLog from '../AuditLog_Global';
import Button from '@material-ui/core/Button';


// Sheet style Option
const sheetOption = {
  mode: 'edit', // edit | read
  showToolbar: false,
  showGrid: true,
  showContextmenu: false,
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

// Created by Sheldon Su 2021/01/20
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
      this.clearComponentChild = this.clearComponentChild.bind(this);
      this.insertOrg = this.insertOrg.bind(this);
      this.disable = this.props.disable;
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
            this.clearComponentChild();
            // @ts-ignore
            this.orginalValue = JSON.parse(JSON.stringify(submission.workbookData));
            // @ts-ignore
            this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(submission.workbookData).reRender();
            this.sheet.on('cell-selected',(cell, row, col)=>{
              this.currentCoord = {row, col};
            })

            // Get user data from server, handle auto population
            const currentUser = localStorage.getItem('currentUser');
            usersController.fetchByEmail(currentUser).then(data=>{
              let orgArr = []
              data.sysRole.forEach(element => {
                element.org.forEach(org => {
                  const {orgId} = org;
                  orgArr.push(orgId);
                });
              });
              if (orgArr.length == 1) this.insertOrg(orgArr[0]);
            });
  
          });
        });
      }else{
        submissionController.fetchSubmission(this.id).then(submission=>{
          this.submissionObject = submission;
          this.clearComponentChild()
          // @ts-ignore
          this.sheet = new Spreadsheet("#x-spreadsheet", sheetOption).loadData(submission.workbookData).reRender();
          this.sheet.on('cell-selected',(cell, row, col)=>{
            this.currentCoord = {row, col};
          })
        })
      }
    }

    // Clear the x-data-spreadsheet, or else ther is going to have duplicate sheet,
    // Don't ask me why, I have no idea =_=, this might be a async issue due to how react
    // render and mount the dom.
    // Last Update by Sheldon Su on 2021/04/29
    clearComponentChild(){
      const ele = document.getElementById('x-spreadsheet');
      if (ele){
        while(ele.childNodes[0]) {
          ele.removeChild(ele.childNodes[0]);
        };
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
        console.log(newData)
        this.submissionObject.workbookData = newData;
        submissionController.updateWorkbook(this.submissionObject).then(res=>{
          const difference = compareSheet(this.orginalValue, newData);
          CreateAuditLog(null, "Update Submission workbook", "Submisson", this.submissionObject._id, difference.oldValues, difference.newValues);
        });

      }
    }


    insertOrg = async (orgId) => {
      if (this.edit){

        // Get org data
        const org = await orgController.fetchById(Number(orgId));

        // Get reporting period data
        const reportPeriod = await submissionController.fetchSubmissionReportingPeriod(this.id);
        const data = this.sheet.getData();

        // Iterate through each sheet to fill in information (start from the second sheet)
        for (let i = 1; i < data.length; i++){
          const currSheet = data[i];

          // Identification sheet has different format
          if (currSheet.name.toLowerCase() === 'identification'){
            this.sheet.cellText(8, 3, org.id, i);
            this.sheet.cellText(9, 3, org.IFISNum, i);
            this.sheet.cellText(10, 3, reportPeriod.name, i);
            this.sheet.cellText(12, 3, org.name, i);
            this.sheet.cellText(13, 3, org.legalName, i);
          }else{
            this.sheet.cellText(3, 1, 'Facility ID: ' + org.id, i);
            this.sheet.cellText(2, 1, 'Hospital Name: ' + org.name, i);
          }
        }
        this.sheet.reRender();
      }
    }

    render(){
        return (
          <div>
            <div style={{display:'flex'}}>
              <Button variant="outlined" color="primary" onClick={this.saveTemplate}>
                Save
              </Button>
              <OrgselectionMenu callback={this.insertOrg}/>
            </div>
            <div id="x-spreadsheet"></div>
          </div>
        )
    }
}

export default SubmissionSpreadSheet;