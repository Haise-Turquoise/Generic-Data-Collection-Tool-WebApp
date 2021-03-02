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

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp',
        editComponent: props => {return <div></div>} },
//      { title: 'Modified On', field: 'updatedDate', type: 'date',
//      initialEditValue: Date.now,},
      { title: 'Updated By', field: 'updatedBy', 
        editComponent: props => {return <div></div>} },
    ], 
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: reportingPeriod =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          reportingPeriod.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          reportingPeriod.timestamp = event.toLocaleString(); 
          dispatch(createReportingPeriodRequest(reportingPeriod, resolve, reject));
        }),
      onRowUpdate: reportingPeriod =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          reportingPeriod.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          reportingPeriod.timestamp = event.toLocaleString(); 
          dispatch(updateReportingPeriodRequest(reportingPeriod, resolve, reject));
        }),
      onRowDelete: reportingPeriod =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          reportingPeriod.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          reportingPeriod.timestamp = event.toLocaleString(); 
          dispatch(deleteReportingPeriodRequest(reportingPeriod._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    reportingPeriods.forEach(reportingPeriods => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(reportingPeriods.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(reportingPeriods.timestamp.toString());
       reportingPeriods.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       reportingPeriods.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

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
