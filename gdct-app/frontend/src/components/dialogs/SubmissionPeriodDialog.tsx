import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getSubmissionPeriodsRequest } from '../../store/thunks/submissionPeriod';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectIsSubmissionPeriodDialogOpen } from '../../store/DialogsStore/selectors';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
//@ts-ignore
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';
import SubmissionPeriod from '../../types/submissionperiod';
const SubmissionPeriodDialog = ({ handleChange }:{handleChange:(data:SubmissionPeriod)=>void}) => {
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
    //@ts-ignore
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
