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
import { calculateOptions, formatTimestamp, sysRoleTraversal } from '../../tools/misc'
import submissionController from '../../controllers/submission';
import submissionPeriodController from '../../controllers/submissionPeriod';
import UsersController from '../../controllers/Users';
import roleWorkflowStatusController from '../../controllers/RoleWorkflowStatus';
import workflowController from '../../controllers/workflow';
import statusController from '../../controllers/status';
import orgController from '../../controllers/organization';

import './SubmissionDashboard.scss'
import Status from '../../types/status';
import usersController from '../../controllers/Users';
import templatePackageController from '../../controllers/templatePackage';
import { TemplatePackagePopulated } from '../../types/templatepackage';
import Template from '../../types/template'
import programController from '../../controllers/Program';
import Loading from '../../components/Loading';
import userController from '../../controllers/user';

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

  const [statuses, setStatuses] = useState<string[]>([]);
  const currUID = localStorage.getItem('currentUserID');
  const [submissions, setSubmissions] = useState<SubmissionPopulated[]>([]);
  const [submitterFlag, setSubmitterFlag] = useState(false)
  const [loading, setLoading] = useState(true)

  const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  useEffect(() => {
    // load data
    (async function() {
      const sysRole = (await usersController.fetchById(currUID || ''))?.sysRole
      let parsed = sysRoleTraversal(sysRole || [])
      console.log('what is', parsed)
      // we are only concerned with roles that match current selected user role
      // ex someone who is Submitter + Approver should only see whichever they signed in to
      parsed = parsed.filter(role => role.role === localStorage.getItem('currentRole'))
      const submissions = await submissionController.fetchByRole(parsed) // finding existing submissions
      setSubmissions(submissions)

      const allPrograms = parsed.map(role => role.progId)
      const allTemplateTypeIds = parsed.map(role => role.tempTypeId)
      /**
       * We create a new submission if
       * 1. User template type & program matches in template package table
       * 2. User status is output of unsubmitted in workflow (find from workflowProcess find to:current)
       * 3. Submission does not already exist (filter using submissions above)
       */

      let result: {process: WorkflowProcess, template: Template, pack: TemplatePackagePopulated}[] = []
      // we need these as ids
      const userStatNames = (await roleWorkflowStatusController.fetchStatusByRole(localStorage.getItem('currentRole') || '')).workflowStatus || []
      let userStatuses: string[] = []
      for (let stat of userStatNames) {
        const status = await statusController.fetchByName(stat)
        if (status && status.length > 0) {
          userStatuses.push(status[0]._id)
        }
      }
      // Step 1.
      //@ts-ignore
      let packages: TemplatePackagePopulated[] = await templatePackageController.queryPopulated({ programIds: {$in: allPrograms}}) // all packages w/ matching programId
      packages = packages.filter((pack) => {
        const progIds = pack.programIds.map(prog => prog._id)
        const tempTypeIds = pack.templateIds.map(template => template.templateTypeId)
        return !!parsed.find(role => progIds.includes(role.progId) && tempTypeIds.includes(role.tempTypeId))
      })
      // after template package is published users with matching prorgam & templateTypeId should see ^
      // Step 2.
      for (let pack of packages) {
        for (let template of pack.templateIds) {
          const workflowProcess = await workflowController.fetchProcess(template.workflowProcessId)
          if (workflowProcess) {
            const prev = (await workflowController.fetchPrevious(workflowProcess.workflowId, userStatuses))
            result = result.concat(prev.map(process => ({process, template, pack})))
          }
        }
      }

      // create the submission objects....
      const newPopulated: SubmissionPopulated[] = []
      const newSubmissions: Submission[] = []
      for (let sub of result) {
        for (let prog of sub.pack.programIds) {
          const foundRole = parsed.find(
            (role) => sub.pack.programIds.find(p => p._id === role.progId) && 
            sub.pack.templateIds.find(t => t.templateTypeId === role.tempTypeId))
          // populate things
          const programId = (await programController.fetchById(prog._id || ''))
          // find status of first workflowProcess (the one we assign to this submission)
          let processes: WorkflowProcess[] = await workflowController.fetchProcessesByWorkflowId(sub.process.workflowId)
          processes = processes.filter(proc => {
            let prev = processes.find(proc2 => proc2.to.length === 0)
            return !!prev
          })
          const process = processes[0]
          if (!process) {
            return
          }
          if (foundRole && programId) {
            //Step 3.
            const name = `${foundRole.orgId}_${programId.name}_${sub.template.name}_${sub.pack.submissionPeriodId.name}`
            const existing = await submissionController.fetch({name})
            const added = newSubmissions.find(submission => submission.name === name)
            if (existing.length > 0 || added) {
              // skipping
              continue
            }
            const userId = localStorage.getItem('currentUserID') || ''
            const user = await usersController.fetchById(userId)
            if (!user) {
              continue
            }
            const populated: SubmissionPopulated = {
              templateId: sub.template._id,
              templateName: sub.template.name,
              submissionPeriodId: sub.pack.submissionPeriodId,
              updatedAt: (new Date()).toLocaleDateString(),
              updatedBy: user,
              version: 0,
              workflowId: process.workflowId,
              workflowProcessId: process,
              orgId: +foundRole.orgId,
              // @ts-ignore
              statusId: (await statusController.fetchStatus(process.statusId)),
              isLatest: true,
              programId,
              createdAt: (new Date()).toLocaleDateString(),
              isPublished: false,
              workbookData: sub.template.templateData || {},
              templatePackageId: sub.pack._id,//where?
              name: `${foundRole.orgId}_${programId.name}_${sub.template.name}_${sub.pack.submissionPeriodId.name}`,
              submittedDate: '',
              approver: '',
              updatedDate: (new Date()).toLocaleDateString(),
            }
            const submission: Submission = {
              ...populated, // most fields are the same
              id: 0, //is this necessary?
              submissionPeriodId: sub.pack.submissionPeriodId._id,
              statusId: (process.statusId as unknown) as string,
              programId: programId._id,
              workflowProcessId: process._id || '',
              updatedBy: userId,
            }
            newPopulated.push(populated)
            newSubmissions.push(submission)
          }
        }
      }

      // console.log('we should have', [...submissions, ...newSubmissions])
      if (submissions && newSubmissions.length > 0) {
        //@ts-ignore
        await submissionController.create(newSubmissions)
        //@ts-ignore
        setSubmissions(prev => prev.concat(newPopulated))
      }

      // set submitter flag
      if (parsed.find(role => role.role === 'Submitter')) {
        setSubmitterFlag(true)
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    // we put these fetches here since they depend on updated submissions
    // get all statuses from submissions
    if (!submissions) {
      return
    }
    let statuses = submissions.map(sub => sub.statusId.name)
    // remove duplicates
    statuses = [...new Set(statuses)]

    // sort statuses
    statusController.fetch().then((res: Status[]) => {
      const statusMap: {[key: string]: number} = res.reduce((acc, curr) => ({
        ...acc,
        [curr.name]: curr.order || 100
      }), {})
      statuses.sort((a, b) => statusMap[a] - statusMap[b])
      setStatuses(statuses)
    })

    // find submission periods
    let periods = new Set<string>()
    submissions.forEach(sub => periods.add(sub.submissionPeriodId.name))
    setFilterOptions([...periods])
  }, [submissions])

  const handleFilterFrom = (event:ChangeEvent<{ value: any; }>) => {
    setFilterFrom(event.target.value);
  }

  const handleFilterTo = (event:ChangeEvent<{ value: any; }>) => {
    setFilterTo(event.target.value);
  }
  
  // Convert Date format
  submissions.forEach(sub => {
    sub.updatedAt = formatTimestamp(sub.updatedAt);
    sub.createdAt = formatTimestamp(sub.createdAt);
  });

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
      { title: 'Modified By', field: 'updatedBy.username', headerStyle: { padding: styleFactor }, cellStyle: { padding: styleFactor } },
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

  useEffect(() => {
    console.log('loading', loading)
  }, [loading])

  return loading ? <Loading /> : (
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
          return data.length >= 0 && (
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
              No Submissions Found
            </Typography>)
      }
    </div>
  );
};

export default SubmissionDashboard;
