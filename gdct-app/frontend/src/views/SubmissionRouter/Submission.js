import React, { useState, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { showAppNavigation, hideAppNavigation } from '../../store/actions/ui/isAppNavigationOpen';
import Loading from '../../components/Loading/Loading';

import { updateSubmissionExcelRequest, getSubmissionRequest } from '../../store/thunks/submission';
import { Excel } from '../../components/Excel';

const Submission = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();

  const isCallInProgress = useSelector(
    ({ SubmissionsStore: { isCallInProgress } }) => isCallInProgress,
  );

  const handleSaveSubmission = useCallback(() => {
    dispatch(updateSubmissionExcelRequest());
  }, []);

  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getSubmissionRequest(_id));
    dispatch(hideAppNavigation());

    return () => {
      dispatch(showAppNavigation());
    };
  }, []);

  return isCallInProgress ? (
    <Loading />
  ) : (
    <Excel
      type="submission"
      returnLink="/submission_manager/submissions"
      handleSave={handleSaveSubmission}
    />
  );
};

export default Submission;
