import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Snackbar from '@material-ui/core/Snackbar';
import Loading from '../../components/Loading/Loading';

import { getSubmissionRequest } from '../../store/thunks/submission';

import CustomSnackbarContent from '../../components/CustomSnackbarContent/CustomSnackbarContent';
import SubmissionSpreadSheet from './SubmissionSpreadSheet'

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


  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getSubmissionRequest(_id));
  }, []);

  return isCallInProgress ? (
    <Loading />
  ) : (
    <div>
      <SubmissionSpreadSheet sheetID= {_id}/>

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
