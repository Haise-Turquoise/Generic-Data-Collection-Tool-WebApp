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
import { calculateOptions } from '../../tools/misc'
import StatusController from '../../controllers/status'
import UsersController from '../../controllers/Users';
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
  const submissionPeriod = {};
  const styleFactor = '0.2%';
  const classTheme = useStyles();

  const [readFilterFrom, setFilterFrom] = useState('All');
  const [readFilterTo, setFilterTo] = useState('All');

  const [statuses, setStatuses] = useState([]);
  const [programFilter, setFilter] = useState([]);

  useEffect(() => {

    StatusController.fetch().then(res => {
      const valid = res
        .filter(status => status.isActive && !status.forPackage)
        .sort((a, b) => a.order - b.order)
      setStatuses(valid.map(status => status.name));
    })

    UsersController.fetchByEmail(localStorage.getItem('currentUser')).then(res=>{
      let filter = [];
      const currRole = localStorage.getItem('currentRole');
      res.sysRole.forEach(role => {
        if (role.role === currRole && currRole !== 'Business Admin'){
          filter = filter.concat(role.org[0].program.map(e=>String(e.programId)))
        }
      });
      setFilter(filter);
    });
  }, [])

  const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  let { submissions } = useSelector(
    state => ({
      submissions: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
    }),
    shallowEqual,
  )
  let submitterFlag = false;

  if (!Array.isArray(submissions)) {
    submissions = [];
    dispatch(getSubmissionsRequest());
  }
  if (submissions[0] !== undefined) {
    if (localStorage.getItem('currentRole') !== 'Business Admin'){
      submissions = submissions.filter(submission=>
        programFilter.includes(String(submission.programId))
      );
    }
    submissions.forEach(submission => {
      const createdAt = new Date(submission.createdAt);
      const modifiedAt = new Date(submission.updatedAt);
      // @ts-ignore
      submission.createdAt = createdAt.toLocaleDateString("en-US", timeOption);
      // @ts-ignore
      submission.updatedAt = modifiedAt.toLocaleDateString("en-US", timeOption);
      if (!submissionPeriod[submission.period]) {
        submissionPeriod[submission.period] = 1;
      }

      if (submission !== undefined) {
        if (
          submission.permission.find(
            permission => permission === 'Submitter' || permission === 'Inputter',
          ) !== undefined
        )
          submitterFlag = true;
      } else {
        // should remove invalid (undefined/out of range) submissions
        submissions.filter(element => element !== submission)
      }
    });
  }


  const handleFilterFrom = (event) => {
    setFilterFrom(event.target.value);
  }

  const handleFilterTo = (event) => {
    setFilterTo(event.target.value);
  }


  const checkBoxColumns = useMemo(
    () => [
      { title: 'Period', field: 'period', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Submission', field: 'name', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Program', field: 'programName', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Approver', field: 'approver' },
      { title: 'Health Service Provider', field: 'orgId', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Template Package Name', field: 'templatePackageName', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Status', field: 'phase', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Created On', field: 'createdAt', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Modified By', field: 'updatedBy', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Modified on', field: 'updatedAt', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'version', field: 'version', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Template Name', field: 'workbookData.name', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
    ],
    [],
  );

  const notEditableActions = useMemo(
    () => [
      {
        icon: CreateOutlinedIcon,
        tooltip: 'View/Edit Submission',
        onClick: (_event, submission) =>
          history.push({
            pathname: `/submission/dashboard/editSubmission/${submission._id}`,
            state: { detail: submission, submissionList: submissions },
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
            pathname: `/submission/dashboard/editSubmission/${submission._id}`,
            state: { detail: submission },
          }),
      },
    ],
    [history],
  );

  useEffect(() => {
    dispatch(getSubmissionsRequest());
  }, [dispatch]);

  const getSubmissionsInRange = (status) => submissions.filter(
    (submission) =>
      // get submissions for given status and selected period 
      submission.phase === status && 
      (readFilterFrom === 'All' || submission.period >= readFilterFrom) && 
      (readFilterTo === 'All' || submission.period <= readFilterTo)
    )


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
          {Object.keys(submissionPeriod).map((element) => {
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
          {Object.keys(submissionPeriod).map((element) => {
            return <MenuItem value={element}>{element}</MenuItem>
          })}
        </Select>
      </FormControl>

      {statuses.map(status => {
        const data = getSubmissionsInRange(status)
        const options = calculateOptions(data.length)
        return (
          <ExpansionPanel>
            <ExpansionPanelSummary 
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{status === 'Unsubmitted' ? 'To-do' : status}</Typography>
            </ExpansionPanelSummary>
            <div className="MuiTableContainer">
              <MaterialTable
                key={data.length}
                columns={checkBoxColumns}
                options={options}
                data={data}
                actions={submitterFlag ? actions : notEditableActions}
              />
            </div>
          </ExpansionPanel>
        )
      })}
    </div>
  );
};

export default SubmissionDashboard;
