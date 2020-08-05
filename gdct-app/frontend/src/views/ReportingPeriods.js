import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getReportingPeriodsRequest,
  createReportingPeriodRequest,
  deleteReportingPeriodRequest,
  updateReportingPeriodRequest,
} from '../store/thunks/reportingPeriod';
import { selectFactoryRESTResponseTableValues } from '../store/common/REST/selectors';
import { selectReportingPeriodsStore } from '../store/ReportingPeriodsStore/selectors';

const ReportingPeriodHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Reporting Periods</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const ReportingPeriodsTable = () => {
  const dispatch = useDispatch();

  const { reportingPeriods } = useSelector(
    state => ({
      reportingPeriods: selectFactoryRESTResponseTableValues(selectReportingPeriodsStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(() => [{ title: 'Name', field: 'name' }], []);

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: reportingPeriod =>
        new Promise((resolve, reject) => {
          dispatch(createReportingPeriodRequest(reportingPeriod, resolve, reject));
        }),
      onRowUpdate: reportingPeriod =>
        new Promise((resolve, reject) => {
          dispatch(updateReportingPeriodRequest(reportingPeriod, resolve, reject));
        }),
      onRowDelete: reportingPeriod =>
        new Promise((resolve, reject) => {
          dispatch(deleteReportingPeriodRequest(reportingPeriod._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getReportingPeriodsRequest());
  }, [dispatch]);

  return (
    <MaterialTable
      columns={columns}
      data={reportingPeriods}
      editable={editable}
      options={options}
    />
  );
};

const ReportingPeriod = props => (
  <div className="reportingPeriods">
    <ReportingPeriodHeader />
    <ReportingPeriodsTable {...props} />
  </div>
);

export default ReportingPeriod;
