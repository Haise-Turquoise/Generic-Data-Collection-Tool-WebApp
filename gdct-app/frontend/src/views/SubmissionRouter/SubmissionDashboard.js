import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

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
  const styleFactor = '0.2%'
  const { submissions } = useSelector(
    state => ({
      submissions: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
    }),
    shallowEqual,
  )
  let submitterFlag = false;
  if (submissions[0] !== undefined)
  console.log("====================Log====================")
  console.log(submissions)
  console.log("====================EndLog====================")
    submissions.forEach(submission => {
      if (submission !== undefined) {
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
            state: { detail: submission },
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
