import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import LaunchIcon from '@material-ui/icons/Launch';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Typography from '@material-ui/core/Typography';
import { getSubmissionsRequest } from '../../store/thunks/submission';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import './SubmissionDashboard.scss'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));


const SubmissionHeader = () => (
  <Paper className="header">
    <Typography variant="h5">Submissions</Typography>
  </Paper>
);

const SubmissionDashboard = ({ history }) => {
  const dispatch = useDispatch();
  const publishedSubmission = [];
  const approvedSubmission = [];
  const rejectedSubmission = [];
  const expiredSubmission = [];
  const submittedSubmission = [];
  const unsubmittedSubmission = [];
  const submissionPeriod = {};
  const styleFactor = '0.2%';
  const classTheme = useStyles();

  // Set up the states that update the table row number
  const [readUnsubmittedLength, setUnsubmittedLength] = useState(1);
  const [readApprovedLength, setApprovedLength] = useState(1);
  const [readRejectedLength, setRejectedLength] = useState(1); 
  const [readExpiredLength, setExpiredLength] = useState(1); 
  const [readSubmittedLength, setSubmittedLength] = useState(1); 
  const [readPublishedLength, setPublishedLength] = useState(1); 

  const [readFilterFrom, setFilterFrom] = useState('All');
  const [readFilterTo, setFilterTo] = useState('All');

  const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
  let { submissions } = useSelector(
    state => ({
      submissions: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
    }),
    shallowEqual,
  )
  let submitterFlag = false;

  if (!Array.isArray(submissions)){
    submissions = [];
    dispatch(getSubmissionsRequest());
  }
  if (submissions[0] !== undefined){
    submissions.forEach(submission => {
      const createdAt = new Date(submission.createdAt);
      const modifiedAt = new Date(submission.updatedAt);
      submission.createdAt = createdAt.toLocaleDateString("en-US", timeOption);
      submission.updatedAt = modifiedAt.toLocaleDateString("en-US", timeOption);
      if (!submissionPeriod[submission.period]){
        submissionPeriod[submission.period] = 1;
      }
      let filterFrom = submission.period.split(' ')[2];
      let filterTo = filterFrom;

      if (readFilterFrom != 'All'){
        filterFrom = readFilterFrom.split(' ')[2];
      }

      if(readFilterTo != 'All'){
        filterTo = readFilterTo.split(' ')[2];
      }

      if (submission !== undefined && 
        (submission.period.split(' ')[2] >= filterFrom && submission.period.split(' ')[2] <= filterTo)) {
        
        if (
          submission.permission.find(
            permission => permission === 'Submitter' || permission === 'Inputter',
          ) !== undefined
        )
          submitterFlag = true;
        switch (submission.phase) {
          case 'Unsubmitted':
            unsubmittedSubmission.push(submission);
            break;
          case 'Submitted':
            submittedSubmission.push(submission);
            break;
          case 'Expired':
            expiredSubmission.push(submission);
            break;
          case 'Rejected':
            rejectedSubmission.push(submission);
            break;
          case 'Approved':
            approvedSubmission.push(submission);
            break;
          case 'Published':
            publishedSubmission.push(submission);
            break;
        }
      }
    });
  }

  // Set the length state after array change, cause a refresh for the page
  useEffect(() => {
    setSubmittedLength(submittedSubmission.length)
  }, [submittedSubmission])

  useEffect(() => {
    setExpiredLength(expiredSubmission.length)
  }, [expiredSubmission])

  useEffect(() => {
    setRejectedLength(rejectedSubmission.length)
  }, [rejectedSubmission])
  
  useEffect(() => {
    setUnsubmittedLength(unsubmittedSubmission.length)
  }, [unsubmittedSubmission])
  
  useEffect(() => {
    setApprovedLength(approvedSubmission.length)
  }, [approvedSubmission])
  

  const handleFilterFrom = (event)=>{
    setFilterFrom(event.target.value);
  }

  const handleFilterTo = (event)=>{
    setFilterTo(event.target.value);
  }
    
 
  const checkBoxColumns = useMemo(
    () => [
      { title: 'Period', field: 'period', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor}},
      { title: 'Submission', field: 'name', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor}},
      { title: 'Program', field: 'programName', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'Approver', field: 'approver' },
      { title: 'Health Service Provider', field: 'orgId', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'Template Package Name', field: 'templatePackageName', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'Status', field: 'phase', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'Created On', field: 'createdAt', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'Modified By', field: 'updatedBy', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'Modified on', field: 'updatedAt', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'version', field: 'version', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
      { title: 'Template Name', field: 'workbookData.name', headerStyle:{ padding: styleFactor}, cellStyle:{ padding: styleFactor} },
    ],
    [],
  );
  
  // Caculate how many rows
  const calculateOptions = (itemCount)=>{
    let length = itemCount
    if (length > 100) length = 100;
    else if (length == 0) length = 1;
    return {
      actionsColumnIndex: -1, 
      search: false, 
      showTitle: false,
      maxBodyHeight:"400px",
      pageSize:length
    }
  }


  // memfunction that generate options object
  const unsubmittedOptions = useMemo(()=>calculateOptions(readUnsubmittedLength), [readUnsubmittedLength]);
  const submittedOptions = useMemo(()=>calculateOptions(readSubmittedLength), [readSubmittedLength]);
  const expiredOptions = useMemo(()=>calculateOptions(readExpiredLength), [readExpiredLength]);
  const rejectedOptions = useMemo(()=>calculateOptions(readRejectedLength),[readRejectedLength]);
  const approvedOptions = useMemo(()=>calculateOptions(readApprovedLength), [readApprovedLength]);


  const notEditableActions = useMemo(
    () => [
      {
        icon: CreateOutlinedIcon,
        tooltip: 'View/Edit Submission',
        onClick: (_event, submission) =>
          history.push({
            pathname: `/submission/editSubmission/${submission._id}`,
            state: { detail: submission, submissionList: submissions},
          }),
      },
    ],
    [history],
  );
  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Upload Submission',
        onClick: (_event, submission) =>
          history.push({
            pathname: `/submission/createSubmission/${submission._id}`,
            state: { detail: submission },
          }),
      },
      {
        icon: CreateOutlinedIcon,
        tooltip: 'View/Edit Submission',
        onClick: (_event, submission) =>
          history.push({
            pathname: `/submission/editSubmission/${submission._id}`,
            state: { detail: submission },
          }),
      },
    ],
    [history],
  );

  useEffect(() => {
    dispatch(getSubmissionsRequest());
  }, [dispatch]);


  return (
    <div className="submissions">
      <SubmissionHeader />

      <FormControl className={classTheme.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Filter Start:</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          onChange={handleFilterFrom}
        >
        <MenuItem value='All'>All</MenuItem>
          {Object.keys(submissionPeriod).map((element)=>{
            return <MenuItem value={element}>{element}</MenuItem>
          })}
        </Select>
      </FormControl>

      <FormControl className={classTheme.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Filter Ends:</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          onChange={handleFilterTo}
        >
        <MenuItem value='All'>All</MenuItem>
          {Object.keys(submissionPeriod).map((element)=>{
            return <MenuItem value={element}>{element}</MenuItem>
          })}
        </Select>
      </FormControl>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> To-do </Typography>
        </ExpansionPanelSummary>
        
          {/* We need to pass row number state to 
          "key" param to force an table update */}
          <div className="MuiTableContainer">
            <MaterialTable
              key={readUnsubmittedLength}
              columns={checkBoxColumns}
              options={unsubmittedOptions}
              data={unsubmittedSubmission}
              actions={submitterFlag ? actions : notEditableActions}
            />
          </div>
        
      </ExpansionPanel>
      
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Submitted</Typography>
        </ExpansionPanelSummary>
        {/* <ExpansionPanelDetails> */}
        <div className="MuiTableContainer">
          <MaterialTable
            key={readSubmittedLength}
            columns={checkBoxColumns}
            options={submittedOptions}
            data={submittedSubmission}
            actions={notEditableActions}
          />
        </div>
        {/* </ExpansionPanelDetails> */}
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Rejected</Typography>
        </ExpansionPanelSummary>
        {/* <ExpansionPanelDetails> */}
        <div className="MuiTableContainer">
          <MaterialTable
            key={readRejectedLength}
            columns={checkBoxColumns}
            options={rejectedOptions}
            data={rejectedSubmission}
            actions={submitterFlag ? actions : notEditableActions}
          />
        </div>
        {/* </ExpansionPanelDetails> */}
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Expired</Typography>
        </ExpansionPanelSummary>
        {/* <ExpansionPanelDetails> */}
        <div className="MuiTableContainer">
          <MaterialTable
            key={readExpiredLength}
            columns={checkBoxColumns}
            options={expiredOptions}
            data={expiredSubmission}
            actions={notEditableActions}
          />
        {/* </ExpansionPanelDetails> */}
        </div>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Approved</Typography>
        </ExpansionPanelSummary>
        {/* <ExpansionPanelDetails> */}
        <div className="MuiTableContainer">
          <MaterialTable
            key={readApprovedLength}
            columns={checkBoxColumns}
            options={approvedOptions}
            data={approvedSubmission}
            actions={notEditableActions}
          />
        </div>
        {/* </ExpansionPanelDetails> */}
      </ExpansionPanel>
    </div>
  );
};

export default SubmissionDashboard;
