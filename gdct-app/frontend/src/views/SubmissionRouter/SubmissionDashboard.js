import React, { useMemo, useEffect, useState } from 'react';
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
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Typography from '@material-ui/core/Typography';
import { getSubmissionsRequest } from '../../store/thunks/submission';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import './SubmissionDashboard.scss'
import { element } from 'prop-types';
import { read } from 'find-config';

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
  const [readFilterFrom, setFilterFrom] = useState('All')
  const [readFilterTo, setFilterTo] = useState('All')
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
  if (submissions[0] !== undefined)
    submissions.forEach(submission => {
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
      console.log(filterFrom, filterTo)

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

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false}), []);
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

  // useEffect(()=>{

  // })

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
        {/* <ExpansionPanelDetails> */}
          <div className="MuiTableContainer">
            <MaterialTable
              columns={checkBoxColumns}
              options={options}
              data={unsubmittedSubmission}
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
          <Typography> Submitted</Typography>
        </ExpansionPanelSummary>
        {/* <ExpansionPanelDetails> */}
        <div className="MuiTableContainer">
          <MaterialTable
            columns={checkBoxColumns}
            options={options}
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
            columns={checkBoxColumns}
            options={options}
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
            columns={checkBoxColumns}
            options={options}
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
            columns={checkBoxColumns}
            options={options}
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
