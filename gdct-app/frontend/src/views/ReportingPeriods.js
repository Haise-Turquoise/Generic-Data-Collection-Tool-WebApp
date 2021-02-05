import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import ErrorBanner from './ErrorBanner';

import Typography from '@material-ui/core/Typography';
import {
  getReportingPeriodsRequest,
  createReportingPeriodRequest,
  deleteReportingPeriodRequest,
  updateReportingPeriodRequest,
} from '../store/thunks/reportingPeriod';
import { selectFactoryRESTResponseTableValues } from '../store/common/REST/selectors';
import { selectReportingPeriodsStore } from '../store/ReportingPeriodsStore/selectors';
import { calculateOptions } from '../tools/misc'

const ReportingPeriodHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Reporting Period</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const ReportingPeriodsTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  const { reportingPeriods } = useSelector(
    state => ({
      reportingPeriods: selectFactoryRESTResponseTableValues(selectReportingPeriodsStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(() => [{ title: 'Name', field: 'name' }], []);

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

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

  useEffect(()=>{setRowNum(reportingPeriods.length)}, [reportingPeriods])

  return (
    <MaterialTable
      key={readRowNum}
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
    <ErrorBanner title={"Cannot delete the selected reporting period since it is referenced in master value table."} targetStore={selectReportingPeriodsStore}/>
    <ReportingPeriodsTable {...props} />
  </div>
);

export default ReportingPeriod;
