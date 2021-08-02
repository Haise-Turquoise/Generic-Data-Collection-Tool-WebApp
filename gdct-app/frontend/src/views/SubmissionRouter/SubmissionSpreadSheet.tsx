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
// @ts-ignore
import CreateAuditLog from '../AuditLog_Global';
import Button from '@material-ui/core/Button';
import Submission, { submissionSpreadsheetProps } from '../../types/submission';
import Status from '../../types/status';
import { SheetData } from '../../types/template';

// Sheet style Option
const sheetOption = {
  mode: 'edit', // edit | read
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

// Created by Sheldon Su 2021/01/20
// We use compoenent instead of hooks since hooks will cause undefined behavior
class SubmissionSpreadSheet extends Component<submissionSpreadsheetProps>{

  sheet: Spreadsheet|any;
  id: string;
  currentCoord: Coordinate|{};
  categoryAndAttribute: {};
  submissionObject: Partial<Submission>;
  edit: boolean;
  orginalValue: SheetData[];
  history: any;

  constructor(props:submissionSpreadsheetProps) {
    super(props);
    this.sheet = null;
    this.id = this.props.sheetID;
    this.currentCoord = {};
    this.categoryAndAttribute = {};
    this.submissionObject = {};
    this.edit = true;
    this.orginalValue = [];
    this.clearComponentChild = this.clearComponentChild.bind(this);
    this.insertOrg = this.insertOrg.bind(this);
    //@ts-ignore
    this.history = this.props.history;
  }

  // After component mount, initailize spreadsheet and load data from DB
  componentDidMount() {
    if (this.sheet == null) {
      submissionController.fetchSubmission(this.id).then((submission:Submission|null) => {
        if (!submission) throw new Error('Submission not found');
        statusController.findStatusByID(submission.statusId).then((status:Status|null) => {
          if (status && status.name === 'Approved') {
            sheetOption.mode = 'read';
            this.edit = false;
          } else {
            sheetOption.mode = 'edit';
            this.edit = true;
          }

          this.submissionObject = submission;
          this.clearComponentChild();
          this.orginalValue = JSON.parse(JSON.stringify(submission.workbookData));
          // @ts-ignore
          this.sheet = new Spreadsheet('#x-spreadsheet', sheetOption)
            //@ts-ignore
            .loadData(submission.workbookData).reRender();
          //@ts-ignore
          this.sheet.on('cell-selected', (cell, row, col) => {
            this.currentCoord = { row, col };
          });
        });
      });
    } else {
      submissionController.fetchSubmission(this.id).then((submission:Submission|null) => {
        if (!submission) throw new Error('Submission not found');
        this.submissionObject = submission;
        this.clearComponentChild();
        // @ts-ignore
        this.sheet = new Spreadsheet('#x-spreadsheet', sheetOption)
        //@ts-ignore
          .loadData(submission.workbookData).reRender();
        //@ts-ignore
        this.sheet.on('cell-selected', (cell, row, col) => {
          this.currentCoord = { row, col };
        });
      });
    }
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
    window.removeEventListener('beforeunload', this.handleSave);
    this.saveTemplate();
  }

  handleSave(e:Event) {
    e.preventDefault();
    this.saveTemplate();
  }

  saveTemplate = () => {
    if (this.sheet && this.edit) {
      if (this.sheet === null) throw new Error("Sheet did not initialize correctly!");     
      const newData = this.sheet.getData() as SheetData[];
      this.submissionObject.workbookData = newData;
      submissionController.updateWorkbook(this.submissionObject as Submission, null).then((res:any) => {
        const difference = compareSheet(this.orginalValue, newData);
        CreateAuditLog(
          null,
          'Update Submission workbook',
          'Submisson',
          this.submissionObject._id,
          difference.oldValues,
          difference.newValues,
        );
      });
    }
  };

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
          <Button variant="outlined" color="primary" onClick={this.saveTemplate}>
            Save
          </Button>
            <Button variant="outlined" color="primary" onClick={()=>{this.history.goBack()}}>
            <ArrowBackIcon></ArrowBackIcon>
            back
          </Button>
          
        </div>
        <div id="x-spreadsheet"></div>
      </div>
    )
  }
}

// @ts-ignore
export default withRouter(SubmissionSpreadSheet);
