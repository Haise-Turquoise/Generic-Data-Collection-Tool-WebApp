import React, { useEffect, useCallback, useState } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import Snackbar from '@material-ui/core/Snackbar';
import Loading from '../../components/Loading/Loading';

import { updateSubmissionExcelRequest, getSubmissionRequest } from '../../store/thunks/submission';
import { Excel } from '../../components/Excel';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';

import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import CustomSnackbarContent from '../../components/CustomSnackbarContent/CustomSnackbarContent';

const Submission = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();
  const [snackBar, setSnackBar] = useState(false);

  const isCallInProgress = useSelector(
    ({ SubmissionsStore: { isCallInProgress } }) => isCallInProgress,
  );

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBar(false);
  };

  const { submission } = useSelector(
    state => ({
      submission: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
    }),
    shallowEqual,
  );
  const handleSaveSubmission = useCallback(submission => {
    if (submission) {
      console.log(submission);
      dispatch(updateSubmissionExcelRequest());
      // workflowController
      //   .fetchProcess(submission[0].workflowProcessId)
      //   .then((workflowProcess) => {
      //     console.log(workflowProcess)
      //     if (workflowProcess !== undefined)
      //       workflowProcess.to.forEach((process) => {
      //         if (process.statusId.name === 'Approved') {
      //           console.log("123")
      //           setSnackBar(true)
      //         }
      //         dispatch(updateSubmissionExcelRequest())
      //       })
      //   })
    }
  }, []);

  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getSubmissionRequest(_id));
  }, []);

  return isCallInProgress ? (
    <Loading />
  ) : (
    <div>
      <Excel
        type="submission"
        returnLink="/submission_manager/dashboard"
        handleSave={() => handleSaveSubmission(submission)}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackBar}
        autoHideDuration={6000}
        color="primary"
        onClose={handleSnackbarClose}
      >
        <CustomSnackbarContent
          onClose={handleSnackbarClose}
          variant="error"
          message="Can not change approved submission"
        />
      </Snackbar>
    </div>
  );
};

export default Submission;
