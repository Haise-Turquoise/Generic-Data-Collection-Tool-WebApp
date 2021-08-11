import React, { useEffect, useState, MouseEvent} from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Snackbar from '@material-ui/core/Snackbar';
// @ts-ignore
import Loading from '../../components/Loading/Loading';
// @ts-ignore
import { getSubmissionRequest } from '../../store/thunks/submission';
// @ts-ignore
import CustomSnackbarContent from '../../components/CustomSnackbarContent/CustomSnackbarContent';
import SubmissionSpreadSheet from './SubmissionSpreadSheet';

const Submission = ({
  match: {
    params: { _id },
  },
}:{match:{
  params:{_id:string}
}}) => {
  const dispatch = useDispatch();
  const [snackBar, setSnackBar] = useState(false);

  const isCallInProgress = useSelector(
    // @ts-ignore
    ({ SubmissionsStore: { isCallInProgress } }) => isCallInProgress,
  );

  const handleSnackbarClose = (event:MouseEvent, reason:string) => {
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
    // @ts-ignore
    <Loading />
  ) : (
    <div>
      
      <SubmissionSpreadSheet
      //@ts-ignore
      sheetID={_id} />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackBar}
        autoHideDuration={6000}
        color="primary"
        // @ts-ignore
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
