import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { RouterProps, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper/Paper';
import DoneIcon from '@material-ui/icons/Done';
//@ts-ignore
import { excelImportHandler } from '../../tools/misc';
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
import SubmissionWorkbookStore from '../../store/SubmissionWorkbookStore/store';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import { selectSubmissionWorkbookStore } from '../../store/SubmissionWorkbookStore/selectors';
import { updateWorkbookRequest } from '../../store/thunks/submission';

const SubmissionHeader = () => (
  <Paper className="header">
    <Typography variant="h5">Submissions</Typography>
  </Paper>
);

const FileUpload = () => {
  const dispatch = useDispatch();
  const handleChange = useCallback(
    async (event: any) => {
      excelImportHandler(event, (workBookData: any) => {
        dispatch(SubmissionWorkbookStore.actions.RECEIVE(workBookData));
      });
    },
    [dispatch],
  );

  return (
    <Button className="submission_upload_button">
      <input type="file" onChange={handleChange} />
    </Button>
  );
};

const CreateSubmission = ({ history }: RouterProps) => {
  //  const [workflowProcess, setWorkflowProcess] = useState()
  const dispatch = useDispatch();
  const [showSave, setSave] = useState<'visible' | 'hidden'>('hidden');
  const [message, setMessage] = useState('hidden');
  const [messageColour, setMessageColour] = useState('green');

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(event.target.value));
  };

  const location = useLocation<{ detail: { phase: string }}>();

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
  const backButtonAction = () => {
    history.push({
      pathname: `/submission/dashboard`,
    });
  };

  const handleCreateSubmission = useCallback(
    (submissionNote: any, submissionWorkbook: any) =>
    //TODO need help on this
    //@ts-ignore
      dispatch(updateWorkbookRequest(submissionNote, submissionWorkbook, location.state.detail)),
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

        <div style={{ display: 'flex', verticalAlign: 'middle' }}>
          <Button size="large" color="primary" variant="contained" onClick={backButtonAction}>
            <ArrowBackIcon></ArrowBackIcon>
            Back
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={
              location.state.detail.phase === 'Submitted' ||
              location.state.detail.phase === 'Approved'
            }
            onClick={() => {
              try {
                handleCreateSubmission(submissionNote, submissionWorkbook);
                setSave('visible');
                setMessage('Sucessfully Saved!');
                setMessageColour('green');
              } catch (e) {
                setSave('visible');
                setMessage('Fail to save workbook');
                setMessageColour('red');
              }
            }}
          >
            Upload
          </Button>

          <div style={{ visibility: showSave, color: messageColour, fontSize: 16 }}>
            <DoneIcon />
            <Typography>{message}</Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default CreateSubmission;
