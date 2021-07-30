import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
//@ts-ignore
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getReportingPeriodsRequest } from '../../store/thunks/reportingPeriod';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
//@ts-ignore
import { selectIsReportingPeriodDialogOpen } from '../../store/DialogsStore/selectors';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
import { state } from '../../store/types';

const ReportingPeriodDialog = ({ handleChange }:{handleChange:(id:string)=>void}) => {
  const dispatch = useDispatch();

  const { isReportingPeriodDialogOpen, reportingPeriods } = useSelector(
    (state: state) => ({
      isReportingPeriodDialogOpen: selectIsReportingPeriodDialogOpen(state),
      reportingPeriods: selectFactoryRESTResponseTableValues(selectReportingPeriodsStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(
    () => dispatch(DialogsStore.actions.CLOSE_REPORTING_PERIOD_DIALOG()),
    [dispatch],
  );

  const handleSelect = useCallback(
    data => {
      handleChange(data._id);
      handleClose();
    },
    [dispatch],
  );

  useEffect(() => {
    if (isReportingPeriodDialogOpen && !reportingPeriods.length)
      dispatch(getReportingPeriodsRequest());
  }, [dispatch, isReportingPeriodDialogOpen]);

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
      title="Reporting Period"
      columns={columns}
      isOpen={isReportingPeriodDialogOpen}
      data={reportingPeriods}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default ReportingPeriodDialog;
