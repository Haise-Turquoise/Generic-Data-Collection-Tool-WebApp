import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper/Paper';
import { convertExcelFileToState, convertStateToReactState } from '../../tools/excel';
import { setExcelData } from '../../store/actions/ui/excel/commands';
import SubmissionsStore from '../../store/SubmissionsStore/store';
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
import SubmissionWorkbookStore from '../../store/SubmissionWorkbookStore/store';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import { selectSubmissionWorkbookStore } from '../../store/SubmissionWorkbookStore/selectors';
import { createSubmissionRequest } from '../../store/thunks/submission';
import workflowController from '../../controllers/workflow';

const SubmissionHeader = () => (
  <Paper className="header">
    <Typography variant="h5">Submissions</Typography>
  </Paper>
);

const FileUpload = () => {
  const dispatch = useDispatch();
  const handleChange = useCallback(
    async ({ target }) => {
      const fileData = target.files[0];

      const { name } = fileData;

      const extension = name.split('.').pop();

      if (extension === 'xlsx') {
        // !unoptimized function... since straight conversion to react state doesn't exist at the moment.
        // ! TODO: implement straight conversion from file to react state
        const fileStates = await convertExcelFileToState(fileData);
        dispatch(SubmissionWorkbookStore.actions.RECEIVE(fileStates));
      }
    },
    [dispatch],
  );

  return (
    <Button className="submission_upload_button">
      <input type="file" onChange={handleChange} />
    </Button>
  );
};

const CreateSubmission = props => {
  //  const [workflowProcess, setWorkflowProcess] = useState()
  const dispatch = useDispatch();

  const handleNoteChange = event => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(event.target.value));
  };

  const location = useLocation();

  useEffect(() => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(''));
  }, [location]);

  const { submissionNote, submissionWorkbook } = useSelector(
    state => ({
      submissionNote: selectFactoryRESTResponseTableValues(selectSubmissionNoteStore)(state),
      submissionWorkbook: selectFactoryRESTResponseTableValues(selectSubmissionWorkbookStore)(
        state,
      ),
    }),
    shallowEqual,
  );

  const handleCreateSubmission = useCallback(
    (submissionNote, submissionWorkbook) =>
      dispatch(createSubmissionRequest(submissionNote, submissionWorkbook, location.state.detail)),
    [dispatch],
  );

  return (
    <div className="submissions">
      <SubmissionHeader />
      <Paper className="pl-4 pr-4 pb-5 pt-4">
        <FileUpload />
        <br />
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

        <div>
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={() => handleCreateSubmission(submissionNote, submissionWorkbook)}
          >
            Upload
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default CreateSubmission;
