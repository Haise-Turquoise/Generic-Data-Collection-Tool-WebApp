import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';

import { getSubmissionPeriodsRequest } from '../../store/thunks/submissionPeriod';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectIsSubmissionPeriodDialogOpen } from '../../store/DialogsStore/selectors';
import DialogsStore from '../../store/DialogsStore/store';
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';

const SubmissionPeriodDialog = ({ handleChange }) => {
  const dispatch = useDispatch();

  const { isSubmissionPeriodDialogOpen, submissionPeriods } = useSelector(
    state => ({
      isSubmissionPeriodDialogOpen: selectIsSubmissionPeriodDialogOpen(state),
      submissionPeriods: selectFactoryRESTResponseTableValues(selectSubmissionPeriodsStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(
    () => dispatch(DialogsStore.actions.CLOSE_SUBMISSION_PERIOD_DIALOG()),
    [dispatch],
  );

  const handleSelect = useCallback(
    data => {
      handleChange(data);
      handleClose();
    },
    [dispatch],
  );

  useEffect(() => {
    if (isSubmissionPeriodDialogOpen && !submissionPeriods.length)
      dispatch(getSubmissionPeriodsRequest());
  }, [dispatch, isSubmissionPeriodDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  return (
    <SelectableTableDialog
      title="Submission Period"
      columns={columns}
      isOpen={isSubmissionPeriodDialogOpen}
      data={submissionPeriods}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default SubmissionPeriodDialog;
