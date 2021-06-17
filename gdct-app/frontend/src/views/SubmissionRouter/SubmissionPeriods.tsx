// @ts-nocheck
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import {
  getSubmissionPeriodsRequest,
  createSubmissionPeriodRequest,
  deleteSubmissionPeriodRequest,
  updateSubmissionPeriodRequest,
//@ts-ignore
} from '../../store/thunks/submissionPeriod';

import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTLookup,
} from '../../store/common/REST/selectors';
//@ts-ignore
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';
//@ts-ignore
import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
//@ts-ignore
import { getReportingPeriodsRequest } from '../../store/thunks/reportingPeriod';
//@ts-ignore
import { calculateOptions } from '../../tools/misc'

import SubmissionPeriod from '../../types/submissionperiod';

const SubmissionPeriodHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Submission Periods</Typography>
    </Paper>
  );
};

const SubmissionPeriod = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasPeriods, setHasPeriods] = useState(false)

  // table vars for loading
  const preColumns = [{ title: 'Name', field: 'name' }]
  const prePeriods = [{ name: 'LOADING...' }]

  const { submissionPeriods, lookupReportingPeriods }: {
    submissionPeriods: SubmissionPeriod[],
    lookupReportingPeriods: {[key:string]: any}
  } = useSelector(
    state => ({
      submissionPeriods: selectFactoryRESTResponseTableValues(selectSubmissionPeriodsStore)(state),
      lookupReportingPeriods: selectFactoryRESTLookup(selectReportingPeriodsStore)(state),
    }),
    shallowEqual,
  );

  // Convert Date format
  submissionPeriods.forEach(submissionPeriod => {
    const logtime = new Date(submissionPeriod.timestamp);
    submissionPeriod.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  const columns: Column<SubmissionPeriod>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Start Date', type: 'date', field: 'startDate' },
      { title: 'End Date', type: 'date', field: 'endDate' },
      {
        title: 'ReportingPeriodId',
        field: 'reportingPeriodId',
        lookup: lookupReportingPeriods,
      },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [lookupReportingPeriods],
  );

  // Record who and when of the action
  function recordUpdate(submissionPeriod: SubmissionPeriod) {
    //get username and record in Modified By column
    submissionPeriod.updatedBy = localStorage.getItem('currentUser');
    //record new date and time in Modified On column 
    submissionPeriod.timestamp = new Date().toLocaleString(); 
  }

  const options: Options<SubmissionPeriod> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          recordUpdate(submissionPeriod);
          dispatch(createSubmissionPeriodRequest(submissionPeriod, resolve, reject));
        }),
      onRowUpdate: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          recordUpdate(submissionPeriod);
          dispatch(updateSubmissionPeriodRequest(submissionPeriod, resolve, reject));
        }),
      onRowDelete: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          recordUpdate(submissionPeriod);
          dispatch(deleteSubmissionPeriodRequest(submissionPeriod._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getSubmissionPeriodsRequest());
    dispatch(getReportingPeriodsRequest());
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(submissionPeriods.length)
    if (!hasPeriods) {
      setHasPeriods(submissionPeriods.length >= 1)
    }
  }, [submissionPeriods])

  return (
    <div>
      <SubmissionPeriodHeader />
      <MaterialTable
        key={readRowNum}
        columns={hasPeriods ? columns : preColumns}
        data={hasPeriods ? submissionPeriods : prePeriods}
        editable={hasPeriods ? editable : undefined}
        options={options}
      />
    </div>
  );
};

export default SubmissionPeriod;
