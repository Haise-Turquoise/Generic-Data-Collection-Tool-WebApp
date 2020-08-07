import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getSubmissionPeriodsRequest,
  createSubmissionPeriodRequest,
  deleteSubmissionPeriodRequest,
  updateSubmissionPeriodRequest,
} from '../../store/thunks/submissionPeriod';

import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTLookup,
} from '../../store/common/REST/selectors';
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';
import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
import { getReportingPeriodsRequest } from '../../store/thunks/reportingPeriod';

const SubmissionPeriodHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Submission Periods</Typography>
    </Paper>
  );
};

const SubmissionPeriod = () => {
  const dispatch = useDispatch();

  const { submissionPeriods, lookupReportingPeriods } = useSelector(
    state => ({
      submissionPeriods: selectFactoryRESTResponseTableValues(selectSubmissionPeriodsStore)(state),
      lookupReportingPeriods: selectFactoryRESTLookup(selectReportingPeriodsStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Start Date', type: 'date', field: 'startDate' },
      { title: 'End Date', type: 'date', field: 'endDate' },
      {
        title: 'ReportingPeriodId',
        field: 'reportingPeriodId',
        lookup: lookupReportingPeriods,
      },
    ],
    [lookupReportingPeriods],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: submissionPeriod =>
        new Promise((resolve, reject) => {
          dispatch(createSubmissionPeriodRequest(submissionPeriod, resolve, reject));
        }),
      onRowUpdate: submissionPeriod =>
        new Promise((resolve, reject) => {
          dispatch(updateSubmissionPeriodRequest(submissionPeriod, resolve, reject));
        }),
      onRowDelete: submissionPeriod =>
        new Promise((resolve, reject) => {
          dispatch(deleteSubmissionPeriodRequest(submissionPeriod._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getSubmissionPeriodsRequest());
    dispatch(getReportingPeriodsRequest());
  }, [dispatch]);

  return (
    <div>
      <SubmissionPeriodHeader />
      <MaterialTable
        columns={columns}
        data={submissionPeriods}
        editable={editable}
        options={options}
      />
    </div>
  );
};

export default SubmissionPeriod;
