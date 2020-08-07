import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import LaunchIcon from '@material-ui/icons/Launch';

import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import {
  getSubmissionsRequest,
  createSubmissionRequest,
  deleteSubmissionRequest,
  updateSubmissionRequest,
} from '../../store/thunks/submission';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTLookup,
} from '../../store/common/REST/selectors';
import { selectTemplatesStore } from '../../store/TemplatesStore/selectors';
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
import { getStatusesRequest } from '../../store/thunks/status';
import { getTemplatesRequest } from '../../store/thunks/template';

const HeaderActions = () => {
  const history = useHistory();

  const handleCreateTemplate = () => history.push('/submission_manager/submission');

  return (
    <div>
      <Button color="primary" variant="contained" size="large" onClick={handleCreateTemplate}>
        Create
      </Button>
    </div>
  );
};

const SubmissionHeader = () => (
  <Paper className="header">
    <Typography variant="h5">Submissions</Typography>
    <HeaderActions />
  </Paper>
);

const Submission = ({ history }) => {
  const dispatch = useDispatch();

  const { submissions, lookupTemplates, lookupStatuses } = useSelector(
    state => ({
      submissions: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
      lookupTemplates: selectFactoryRESTLookup(selectTemplatesStore)(state),
      lookupStatuses: selectFactoryRESTLookup(selectStatusesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      {
        title: 'Template Id',
        field: 'templateId',
        lookup: lookupTemplates,
      },
      { title: 'Submitted Date', type: 'date', field: 'submittedDate' },
      { title: 'StatusId', field: 'statusId', lookup: lookupStatuses },
    ],
    [lookupTemplates, lookupStatuses],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Workbook',
        onClick: (_event, submission) => history.push(`/admin/submission/type/${submission._id}`),
      },
    ],
    [history],
  );

  const editable = useMemo(
    () => ({
      onRowAdd: submission =>
        new Promise((resolve, reject) => {
          dispatch(createSubmissionRequest(submission, resolve, reject));
        }),
      onRowUpdate: submission =>
        new Promise((resolve, reject) => {
          dispatch(updateSubmissionRequest(submission, resolve, reject));
        }),
      onRowDelete: submission =>
        new Promise((resolve, reject) => {
          dispatch(deleteSubmissionRequest(submission._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getSubmissionsRequest());
    dispatch(getTemplatesRequest());
    dispatch(getStatusesRequest());
  }, [dispatch]);

  return (
    <div className="submissions">
      <SubmissionHeader />
      <MaterialTable
        columns={columns}
        data={submissions}
        editable={editable}
        options={options}
        actions={actions}
      />
    </div>
  );
};

export default Submission;
