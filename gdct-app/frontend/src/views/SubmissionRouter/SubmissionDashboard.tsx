import React, { useMemo, useEffect, useState, MouseEvent, ChangeEvent } from 'react';
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

import { History } from 'history';
import { Submission } from '../../types/submissions'
import  User  from '../../types/user';
import Typography from '@material-ui/core/Typography';
// @ts-ignore
import { getSubmissionsRequest } from '../../store/thunks/submission';
// @ts-ignore
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
// @ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
// @ts-ignore
import { calculateOptions } from '../../tools/misc'
// @ts-ignore
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

const SubmissionDashboard = ({ history }:{history:History}) => {
  const dispatch = useDispatch();
  const submissionPeriod:{[index:string]:number} = {};
  const styleFactor = '0.2%';
  const classTheme = useStyles();

  const [readFilterFrom, setFilterFrom] = useState('All');
  const [readFilterTo, setFilterTo] = useState('All');
  const [readMessage, setMessage] = useState('Loading submissions...');

  const [statuses, setStatuses] = useState<string[]>([]);
  const [programFilter, setFilter] = useState<string[]>([]);
  const currRole = localStorage.getItem('currentRole');

  let allowedGrouping:string[];

  switch(currRole){
    case('Inputter'):
      allowedGrouping = ['Inputted', 'Unsubmitted'];
      break;

    case('Submitter'):
      allowedGrouping = ['Unsubmitted', 'Inputted', 'Submitted', 'review', 'Approved' ,'Returned', 'Rejected'];
      break;

    case('Reviewer'):
      allowedGrouping = ['Submitted', 'Returned', 'Approved', 'review'];
      break;

    case('Submission Approver'):
       allowedGrouping = ['Submitted', 'Returned', 'Approved', 'review', 'Rejected'];
      break;

    default:
      allowedGrouping = ['Unsubmitted', 'Inputted', 'Submitted', 'Approved',
      'pre_view', 'review', 'Returned', 'Rejected'];
      break;
  }

  // StatusController.fetch().then(res => {
  //     const valid = res
  //       .filter(status => status.isActive && !status.forPackage)
  //       .sort((a, b) => a.order - b.order)
  //     setStatuses(valid.map(status => status.name));
  //   })

  const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  let { submissions }:{submissions:Submission[]} = useSelector(
    state => ({
      submissions: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
    }),
    shallowEqual,
  )

  console.log(submissions)

   useEffect(() => {
    
    const submissionGroups = submissions.map(e=>e.phase);
    const allowedStatus = allowedGrouping.filter(e=>submissionGroups.includes(e));
    setStatuses(allowedStatus);
    UsersController.fetchByEmail(localStorage.getItem('currentUser')).then((res:User)=>{
      let filter:string[] = [];
      res.sysRole.forEach(role => {
        if (role.role === currRole && currRole !== 'Business Admin'){
          role.org.forEach(orginfo => {
            filter = filter.concat(orginfo.program.map(e=>String(e.programId)))
          });
        }
      });
      setFilter(filter);
    });
  }, [submissions])

  let submitterFlag = false;

  if (!Array.isArray(submissions)) {
    submissions = [];
    dispatch(getSubmissionsRequest(()=>{setMessage('Nothing to show');}));
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


  const handleFilterFrom = (event:ChangeEvent<{ value: any; }>) => {
    setFilterFrom(event.target.value);
  }

  const handleFilterTo = (event:ChangeEvent<{ value: any; }>) => {
    setFilterTo(event.target.value);
  }


  const checkBoxColumns = useMemo(
    () => [
      { title: 'Period', field: 'period', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Submission', field: 'name', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Program', field: 'programName', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Approver', field: 'approver' , headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Health Service Provider', field: 'orgId', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Template Package Name', field: 'templatePackageName', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Status', field: 'phase', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Created On', field: 'createdAt', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Modified By', field: 'updatedBy', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Modified on', field: 'updatedAt', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'version', field: 'version', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Template Name', field: 'templateName', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
    ],
    [],
  );
  const notEditableActions = useMemo(
    () => [
      {
        icon: CreateOutlinedIcon,
        tooltip: 'View/Edit Submission',
        onClick: (_event:MouseEvent, submission:Submission) =>
          history.push({
            pathname: `/submission/dashboard/editSubmission/${submission._id}`,
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
        onClick: (_event:MouseEvent, submission:Submission) =>
          history.push({
            pathname: `/submission/createSubmission/${submission._id}`,
            state: { detail: submission },
          }),
      },
      {
        icon: CreateOutlinedIcon,
        tooltip: 'View/Edit Submission',
        onClick: (_event:MouseEvent, submission:Submission) =>
          history.push({
            pathname: `/submission/dashboard/editSubmission/${submission._id}`,
            state: { detail: submission },
          }),
      },
    ],
    [history],
  );

  useEffect(() => {
    dispatch(getSubmissionsRequest(()=>{setMessage('Nothing to show')}));
  }, [dispatch]);

  const getSubmissionsInRange = (status:string) => submissions.filter(
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
      {statuses.length > 0 ? 
        statuses.map(status => {
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
                  //@ts-ignore
                  actions={submitterFlag ? actions : notEditableActions}
                />
              </div>
            </ExpansionPanel>
          )
        }):(<Typography variant="h6" align='center'>
              {readMessage}
            </Typography>)
      }
    </div>
  );
};

export default SubmissionDashboard;
