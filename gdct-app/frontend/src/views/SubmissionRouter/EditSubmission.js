import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useMemo, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { useLocation } from 'react-router-dom';
import MaterialTable from 'material-table';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { excelImportHandler, templateDownloader } from '../../tools/misc';

import { getSubmissionNoteRequest } from '../../store/thunks/submissionNote';
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
import {
  selectFactoryRESTResponseTableValues,
} from '../../store/common/REST/selectors';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import {
  getSubmissionByIdRequest,
  updateSubmissionStatusRequest,
} from '../../store/thunks/submission';
// import DOWNLOAD from '../../store/reducers/ui/excel/commands/DOWNLOAD';
import { selectSubmissionNoteHistoryStore } from '../../store/SubmissionNoteHistoryStore/selectors';
import workflowController from '../../controllers/workflow';

const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };

const EditSubmission = ({ history }) => {
  const dispatch = useDispatch();
  const [submitUnavailable, setSubmitUnavailable] = useState(true);
  const [approveUnavailable, setApproveUnavailable] = useState(true);
  const [rejectUnavailable, setRejectUnavailable] = useState(true);
  const [isSubmitterOrInputter, setIsSubmitterOrInputter] = useState(false);
  const [isReviewerOrApprover, setIsReviewerOrApprover] = useState(false);

  const [submitId, setSubmitId] = useState('');
  const [approveId, setApproveId] = useState('');
  const [rejectId, setRejectId] = useState('');
  const [cursor, setCursor] = useState('standard');
  const [userFeedback, setUserFeedback] = useState('');
  const [refresh, setRefresh] = useState(false);

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

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: true }), []);

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
    // @ts-ignore
    if (location.state.detail) {
      if (
        // @ts-ignore
        location.state.detail.permission.find(
          permission => permission === 'Submitter' || permission === 'Inputter',
        ) !== undefined
      )
        setIsSubmitterOrInputter(true);
      if (
        // @ts-ignore
        location.state.detail.permission.find(
          permission => permission === 'Reviewer' || permission === 'Submission Approver',
        ) !== undefined
      )
        setIsReviewerOrApprover(true);
      workflowController
        // @ts-ignore
        .fetchProcess(location.state.detail.workflowProcessId)
        .then(workflowProcess => {
          if (workflowProcess !== undefined)
            workflowProcess.to.forEach(process => {
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
    dispatch(SubmissionNoteStore.actions.RECEIVE(''));
    // @ts-ignore
    dispatch(getSubmissionByIdRequest(location.state.detail._id));
    // @ts-ignore
    dispatch(getSubmissionNoteRequest(location.state.detail.parentId));
  }, [location, dispatch, refresh]);


 
  submissionNotes = submissionNoteHistory.filter(note=>note.note !== undefined)
  // @ts-ignore
  submissionNotes.forEach(note => note.updatedDate = new Date(note.updatedDate).toLocaleDateString("en-US", timeOption));


  const handleOpenTemplate = () => {
    history.push({
      pathname: `/admin/submission/submissions/${submission._id}`,  
      // @ts-ignore
      state: { detail: location.state.detail },
    });
    //Creates a new spreadsheet in google and returns the id. 
    // openGoogleSheetRequest(submission._id);
  }

  const backButtonAction = () => {
    history.push({

      pathname: `/submission/dashboard`
    })
  }

  const UserFeedback = feedback => {
    setUserFeedback(feedback);
  };


  const handleDownloadWorkbook = () => {
    setUserFeedback('Downloading !');
    setCursor('progress');
    // DOWNLOAD(convertStateToReactState(submission.workbookData), UserFeedback);

    setTimeout(function () {
      UserFeedback('Download successfully !');
    }, 2000);

    setCursor('standard');
    setTimeout(function () {
      setUserFeedback('');
    }, 4000);
  };

  const handleChangeStatus = async (submission, submissionNote, role, newProcessId) => {
    // setCursor('progress');

    const result = await dispatch(
      updateSubmissionStatusRequest(submission, submissionNote, role, newProcessId),
    );
    // console.log('result', result)
    if (result) {
      if (!role) {
        role = 'ChangeNote';
      }
      // console.log(role);
      setUserFeedback(`${role} successfully !`);
      setRefresh(true);
      setTimeout(function () {
        setRefresh(false);
      }, 500);

      setTimeout(function () {
        setUserFeedback('');
      }, 2000);
    }
  };

  return (



    <div className="submissions" style={{ cursor }}>
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
        <MaterialTable
          title={userFeedback}
          columns={checkBoxColumns}
          options={options}
          data={submissionNotes}
        />
        <div>
          <Button
            color="primary"
            variant="contained"
            style={{ cursor }}
            size="large"
            onClick={handleOpenTemplate}
          >
            View Document
          </Button>
          <Button
            color="primary"
            variant="contained"
            style={{ cursor }}
            size="large"
            onClick={()=>templateDownloader(submission.name, submission.workbookData)}
          >
            Download
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            disabled={approveUnavailable || !isReviewerOrApprover}
            onClick={() => handleChangeStatus(submission, submissionNote, 'Approved', approveId)}
          >
            Approve
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            disabled={rejectUnavailable || !isReviewerOrApprover}
            onClick={() => handleChangeStatus(submission, submissionNote, 'Rejected', rejectId)}
          >
            Reject
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            disabled={submitUnavailable || !isSubmitterOrInputter}
            onClick={() => handleChangeStatus(submission, submissionNote, 'Submitted', submitId)}
          >
            Submit
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            onClick={() => handleChangeStatus(submission, submissionNote)}
          >
            Change Notes
          </Button>



          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={backButtonAction}
          >
            <ArrowBackIcon></ArrowBackIcon>
            Back
          </Button>

          <div>{userFeedback}</div>


        </div>
      </Paper>
      <a id="download" style={{display:'none'}}></a>
    </div>
  );
};

export default EditSubmission;
