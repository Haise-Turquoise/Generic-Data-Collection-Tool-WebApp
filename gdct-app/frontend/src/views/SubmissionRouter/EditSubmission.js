import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { useLocation } from 'react-router-dom';
import MaterialTable from 'material-table';
import { convertExcelFileToState, convertStateToReactState } from '../../tools/excel';
import { setExcelData } from '../../store/actions/ui/excel/commands';
import { getSubmissionNoteRequest } from '../../store/thunks/submissionNote';
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
import SubmissionWorkbookStore from '../../store/SubmissionWorkbookStore/store';
import {
  selectFactoryRESTResponse,
  selectFactoryRESTResponseTableValues,
} from '../../store/common/REST/selectors';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import {
  getSubmissionByIdRequest,
  updateSubmissionStatusRequest,
} from '../../store/thunks/submission';
import DOWNLOAD from '../../store/reducers/ui/excel/commands/DOWNLOAD';
import { selectSubmissionNoteHistoryStore } from '../../store/SubmissionNoteHistoryStore/selectors';
import workflowController from '../../controllers/workflow';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const EditSubmission = ({ history }) => {
  const dispatch = useDispatch();
  const [submitUnavailable, setSubmitUnavailable] = useState(true);
  const [approveUnavailable, setApproveUnavailable] = useState(true);
  const [rejectUnavailable, setRejectUnavailable] = useState(true);

  const [submitId, setSubmitId] = useState('');
  const [approveId, setApproveId] = useState('');
  const [rejectId, setRejectId] = useState('');

  const SubmissionHeader = () => (
    <Paper className="header">
      <Typography variant="h5">Submissions</Typography>
    </Paper>
  );

  let submissionNotes = [];
  const checkBoxColumns = useMemo(
    () => [
      { title: 'Note', field: 'note' },
      { title: 'Updated Date', field: 'updatedDate' },
      { title: 'Updated By', field: 'updatedBy' },
      { title: 'Process', field: 'role' },
    ],
    [],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const handleNoteChange = event => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(event.target.value));
  };

  const location = useLocation();

  const { submission, submissionNote, submissionNoteHistory } = useSelector(
    state => ({
      submission: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
      submissionNote: selectFactoryRESTResponseTableValues(selectSubmissionNoteStore)(state),
      submissionNoteHistory: selectFactoryRESTResponseTableValues(selectSubmissionNoteHistoryStore)(
        state,
      ),
    }),
    shallowEqual,
  );
  useEffect(() => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(''));
    dispatch(getSubmissionByIdRequest(location.state.detail._id));
    dispatch(getSubmissionNoteRequest(location.state.detail.parentId));
    if (location.state.detail) {
      workflowController
        .fetchProcess(location.state.detail.workflowProcessId)
        .then(workflowProcess => {
          if (workflowProcess !== undefined)
            workflowProcess.to.forEach(process => {
              console.log(process.statusId.name);
              switch (process.statusId.name) {
                case 'Submitted': {
                  setSubmitUnavailable(false);
                  setSubmitId(process._id);
                  break;
                }
                case 'Approved': {
                  setApproveUnavailable(false);
                  setApproveId(process._id);
                  break;
                }
                case 'Rejected': {
                  setRejectUnavailable(false);
                  setRejectId(process._id);
                  break;
                }
              }
            });
        });
    }
  }, [location]);

  if (submissionNoteHistory[0] !== undefined) {
    if (submissionNoteHistory[0].note !== undefined) {
      console.log(submissionNoteHistory[0].note);
      submissionNotes = submissionNoteHistory;
    }
  }
  console.log(submissionNoteHistory);

  const handleOpenTemplate = () => history.push(`/submission/submissions/${submission._id}`);

  const handleDownloadWorkbook = () => {
    DOWNLOAD(convertStateToReactState(submission.workbookData));
  };

  const handleChangeStatus = (submission, submissionNote, role, newProcessId) => {
    console.log(submission);
    dispatch(updateSubmissionStatusRequest(submission, submissionNote, role, newProcessId));
  };

  return (
    <div className="submissions">
      <SubmissionHeader />
      <Paper className="pl-4 pr-4 pb-5 pt-4">
        <div className="submission__label">
          <Typography className="submission__inputTitle"> Note </Typography>
        </div>
        <div className="submission__noteField">
          <TextField
            variant="outlined"
            className="register__field"
            name="passwordConfirm"
            // value={values.passwordConfirm}
            multiline
            onChange={handleNoteChange}
          />
        </div>
        <div className="submission__label">
          <Typography className="submission__inputTitle"> Note History </Typography>
        </div>
        <MaterialTable columns={checkBoxColumns} options={options} data={submissionNotes} />
        <div>
          <Button color="primary" variant="contained" size="large" onClick={handleOpenTemplate}>
            View Document
          </Button>
          <Button color="primary" variant="contained" size="large" onClick={handleDownloadWorkbook}>
            Download
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={approveUnavailable}
            onClick={() => handleChangeStatus(submission, submissionNote, 'Approved', approveId)}
          >
            Approve
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={rejectUnavailable}
            onClick={() => handleChangeStatus(submission, submissionNote, 'Rejected', rejectId)}
          >
            Reject
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={submitUnavailable}
            onClick={() => handleChangeStatus(submission, submissionNote, 'Submitted', submitId)}
          >
            Submit
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={() => handleChangeStatus(submission, submissionNote)}
          >
            Change Notes
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default EditSubmission;
