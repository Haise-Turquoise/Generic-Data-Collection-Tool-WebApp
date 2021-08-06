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
import {
  calculateOptions,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  //@ts-ignore
} from '../../tools/misc'
//@ts-ignore
import SubmissionPeriodController from '../../controllers/submissionPeriod'

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
  const [submissionPeriods, setSubmissionPeriods] =
    useState<SubmissionPeriod[] | undefined>(undefined)

  useEffect(() => {
    SubmissionPeriodController.fetch().then((res: unknown) => {
      setSubmissionPeriods(res as SubmissionPeriod[])
    })
  }, [])

  // table vars for loading
  const preColumns = [{ title: 'Name', field: 'name' }];
  const prePeriods = [{ name: 'LOADING...' }];

  const { lookupReportingPeriods }: {
    lookupReportingPeriods: {[key:string]: any}
  } = useSelector(
    state => ({
      lookupReportingPeriods: selectFactoryRESTLookup(selectReportingPeriodsStore)(state),
    }),
    shallowEqual,
  );

  // Convert Date format
  submissionPeriods?.forEach(submissionPeriod => {
    submissionPeriod.timestamp = formatTimestamp(submissionPeriod.timestamp);
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
      {
        title: 'Modified On',
        field: 'timestamp',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [lookupReportingPeriods],
  );

  // Record who and when of the action
  function recordUpdate(submissionPeriod: SubmissionPeriod) {
    //get username and record in Modified By column
    submissionPeriod.updatedBy = localStorage.getItem('currentUser');
    // record new date and time in Modified On column
    submissionPeriod.timestamp = new Date().toLocaleString();
  }

  const options: Options<SubmissionPeriod> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          recordUpdate(submissionPeriod);
          controllerAddRow(SubmissionPeriodController, setSubmissionPeriods, submissionPeriod)
            .then((res?: SubmissionPeriod) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
      onRowUpdate: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          recordUpdate(submissionPeriod);
          controllerEditRow(SubmissionPeriodController, setSubmissionPeriods, submissionPeriod)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
      onRowDelete: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          recordUpdate(submissionPeriod);
          controllerDeleteRow(SubmissionPeriodController, setSubmissionPeriods, submissionPeriod._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
    }),
    [],
  );

  useEffect(() => {
    dispatch(getReportingPeriodsRequest());
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(submissionPeriods?.length || 1)
  }, [submissionPeriods])

  return (
    <div>
      <SubmissionPeriodHeader />
      <MaterialTable
        key={readRowNum}
        columns={!!submissionPeriods ? columns : preColumns}
        data={!!submissionPeriods ? submissionPeriods : prePeriods}
        editable={!!submissionPeriods ? editable : undefined}
        options={options}
      />
    </div>
  );
};

export default SubmissionPeriod;
