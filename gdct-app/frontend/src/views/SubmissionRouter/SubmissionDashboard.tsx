import React, { useMemo, useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialTable, { Action } from 'material-table';
import Paper from '@material-ui/core/Paper';
import LaunchIcon from '@material-ui/icons/Launch';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { History } from 'history';
import Submission, { SubmissionPopulated } from '../../types/submission'
import RoleWorkflowStatus from '../../types/roleWorkflowStatus';
import  User  from '../../types/user';
import WorkflowProcess from '../../types/workflowprocess';
import Typography from '@material-ui/core/Typography';
import { getSubmissionsRequest } from '../../store/thunks/submission';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { calculateOptions, sysRoleTraversal } from '../../tools/misc'
import submissionController from '../../controllers/submission';
import submissionPeriodController from '../../controllers/submissionPeriod';
import UsersController from '../../controllers/Users';
import roleWorkflowStatusController from '../../controllers/RoleWorkflowStatus';
import workflowController from '../../controllers/workflow';
import statusController from '../../controllers/status';

import './SubmissionDashboard.scss'
import Status from '../../types/status';
import usersController from '../../controllers/Users';

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

  const [filterOptions, setFilterOptions] = useState<string[]>([])
  const [readFilterFrom, setFilterFrom] = useState('All');
  const [readFilterTo, setFilterTo] = useState('All');
  const [readMessage, setMessage] = useState('Loading submissions...');

  const [statuses, setStatuses] = useState<string[]>([]);
  const currUID = localStorage.getItem('currentUserID');
  const [submissions, setSubmissions] = useState<SubmissionPopulated[]>([]);
  const [submitterFlag, setSubmitterFlag] = useState(false)

  // StatusController.fetch().then(res => {
  //     const valid = res
  //       .filter(status => status.isActive && !status.forPackage)
  //       .sort((a, b) => a.order - b.order)
  //     setStatuses(valid.map(status => status.name));
  //   })

  const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  useEffect(() => {
    // load data
    (async function() {
      const sysRole = (await usersController.fetchById(currUID || ''))?.sysRole
      const parsed = sysRoleTraversal(sysRole || [])
      const submissions = await submissionController.fetchByRole(parsed)
      console.log('sub', submissions)
      setSubmissions(submissions)

      // set submitter flag
      if (parsed.find(role => role.role === 'Submitter')) {
        setSubmitterFlag(true)
      }
      
      // get all statuses from submissions
      let statuses = submissions.map(sub => sub.statusId.name)
      // remove duplicates
      statuses = [...new Set(statuses)]

      // sort statuses
      const statusMap: {[key: string]: number} = 
        (await statusController.fetch())
        .reduce((acc, curr) => ({...acc, [curr.name]: curr.order || 100}), {})
      // sort
      statuses.sort((a, b) => statusMap[a] - statusMap[b])
      setStatuses(statuses)

      // find submission periods
      let periods = new Set<string>()
      submissions.forEach(sub => periods.add(sub.submissionPeriodId.name))
      setFilterOptions([...periods])
    })()
  }, [])


  const handleFilterFrom = (event:ChangeEvent<{ value: any; }>) => {
    setFilterFrom(event.target.value);
  }

  const handleFilterTo = (event:ChangeEvent<{ value: any; }>) => {
    setFilterTo(event.target.value);
  }


  const checkBoxColumns = useMemo(
    () => [
      { title: 'Period', field: 'submissionPeriodId.name', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Submission', field: 'name', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Program', field: 'programId.name', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Approver', field: 'approver' , headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Health Service Provider', field: 'orgId', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Template Package Name', field: 'templateName', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
      { title: 'Status', field: 'statusId.name', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
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
        onClick: (_event:MouseEvent, submission:SubmissionPopulated) =>
          history.push({
            pathname: `/submission/dashboard/editSubmission/${submission._id}`,
            state: { detail: submission, submissionList: submissions},
          }),
      },
    ],
    [history],
  );
  const noUpload = ['Submitted', 'Reviewed', 'Approved']
  const actions: (Action<SubmissionPopulated> | ((rowData: SubmissionPopulated) => Action<SubmissionPopulated>))[] = useMemo(
    () => [
      (rowData: SubmissionPopulated) => ({
        icon: (LaunchIcon as any),
        tooltip: 'Upload Submission',
        onClick: (_event:MouseEvent, submission:SubmissionPopulated | SubmissionPopulated[]) => {
          if (Array.isArray(submission)) return
          history.push({
            pathname: `/submission/createSubmission/${submission._id}`,
            state: { detail: submission },
          })
        },
        hidden: noUpload.includes(rowData.statusId.name)
      }),
      {
        icon: CreateOutlinedIcon,
        tooltip: 'View/Edit Submission',
        onClick: (_event:MouseEvent, submission:SubmissionPopulated | SubmissionPopulated[]) => {
          if (Array.isArray(submission)) return
          history.push({
            pathname: `/submission/dashboard/editSubmission/${submission._id}`,
            state: { detail: submission },
          })
        }
      },
    ],
    [history],
  );

  // compare two period names, return false if p1 before p2, true otherwise 
  const periodIsAfter = (p1: string, p2: string) => {
    const p1Year = p1.substring(0,4)
    const p2Year = p2.substring(0,4)
    const p1Q = p1.substring(9,10)
    const p2Q = p2.substring(9,10)
    if (p1Year !== p2Year) {
      return !!(+p2Year <= +p1Year)
    } else {
      return !!(+p2Q <= +p1Q)
    }
  }

  const getSubmissionsInRange = (status:string) => submissions.filter(
    (submission) =>
      // get submissions for given status and selected period 
      (submission.statusId.name || '') === status && 
      (readFilterFrom === 'All' || periodIsAfter(submission.submissionPeriodId.name, readFilterFrom)) && 
      (readFilterTo === 'All' || periodIsAfter(readFilterTo, submission.submissionPeriodId.name))
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
          {filterOptions.map((element) => {
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
          {filterOptions.map((element) => {
            return <MenuItem value={element}>{element}</MenuItem>
          })}
        </Select>
      </FormControl>
      {statuses.length > 0 ? 
        statuses.map(status => {
          const data = getSubmissionsInRange(status)
          const options = calculateOptions(data.length)
          return data.length > 0 && (
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
