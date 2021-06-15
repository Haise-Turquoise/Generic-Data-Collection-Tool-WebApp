import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import moment from 'moment';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import {
  getReportingPeriodsRequest,
  createReportingPeriodRequest,
  deleteReportingPeriodRequest,
  updateReportingPeriodRequest,
} from '../../store/thunks/reportingPeriod';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
import { calculateOptions } from '../../tools/misc'

import ErrorBanner from '../ErrorBanner';
import CreateAuditLog from '../AuditLog_Global'
import reportingPeriodController from '../../controllers/reportingPeriod';

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
  const [hasPeriods, setHasPeriods] = useState(false)

  // table vars for loading
  const preColumns = [{ title: 'Name', field: 'name' }]
  const prePeriods = [{ name: 'LOADING... '}]

  // Prepare the data for material table
  const { reportingPeriods } = useSelector(
    state => ({
      reportingPeriods: selectFactoryRESTResponseTableValues(selectReportingPeriodsStore)(state),
    }),
    shallowEqual,
  );
  useEffect(()=>{
    setRowNum(reportingPeriods.length)
    if (!hasPeriods) {
      setHasPeriods(reportingPeriods.length >= 1)
    }
  }, [reportingPeriods])
  // Convert Date format
  reportingPeriods.forEach(reportingPeriod => {
    const logtime = new Date(reportingPeriod.timestamp);
    reportingPeriod.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ], 
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record who and when of the action
  function recordUpdate(reportingPeriod) {
    //get username and record in Modified By column
    reportingPeriod.updatedBy = localStorage.getItem('currentUser');
    //record new date and time in Modified On column 
    reportingPeriod.timestamp = new Date().toLocaleString(); 
  }  
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: reportingPeriod =>
        new Promise((resolve, reject) => {
          recordUpdate(reportingPeriod);
          dispatch(createReportingPeriodRequest(reportingPeriod, resolve, reject));
        }).then(newReportingPeriod => {
          // For Auditlog
          CreateAuditLog(null, "Create Reporting Period", "ReportingPeriod", newReportingPeriod._id, {}, newReportingPeriod);
        }),
      onRowUpdate: reportingPeriod =>
        new Promise((resolve, reject) => {
          recordUpdate(reportingPeriod);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldReportingPeriod = await reportingPeriodController.fetchReportingPeriod(reportingPeriod._id);
            CreateAuditLog(null, "Update Reporting Period", "ReportingPeriod", oldReportingPeriod._id, oldReportingPeriod, reportingPeriod);
          })();
          // Do Update
          dispatch(updateReportingPeriodRequest(reportingPeriod, resolve, reject));
        }),
      onRowDelete: reportingPeriod =>
        new Promise((resolve, reject) => {
          recordUpdate(reportingPeriod);
          dispatch(deleteReportingPeriodRequest(reportingPeriod._id, resolve, reject));
          // For Auditlog
          const reportingPeriod_trim = (({ tableData, ...o }) => o)(reportingPeriod);
          CreateAuditLog(null, "Delete Reporting Period", "ReportingPeriod", reportingPeriod._id, reportingPeriod_trim, {})
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getReportingPeriodsRequest());
  }, [dispatch]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={hasPeriods ? columns : preColumns}
      data={hasPeriods ? reportingPeriods : prePeriods}
      editable={hasPeriods ? editable : undefined}
      // @ts-ignore
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
