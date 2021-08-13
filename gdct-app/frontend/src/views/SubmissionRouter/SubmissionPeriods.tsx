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
  fetchWithStatus,
  checkDuplicates,
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
  const [readIndex, setIndex] = useState<{[key: string]: string, [key: number]: string} | undefined>();
  const [readsubmissionPeriods, setModifiedSubmissionPeriod] = useState<Template[] | undefined>();
  const [readIndexName, setIndexName] = useState<{[key: string]: string, [key: number]: string} | undefined>();
  useEffect(() => {
    // dispatch(getSubmissionPeriodsRequest())
    dispatch(getReportingPeriodsRequest());
    SubmissionPeriodController.fetch().then((res: unknown) => {
      setSubmissionPeriods(res as SubmissionPeriod[])
    })
  }, [dispatch])
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<SubmissionPeriod>(SubmissionPeriodController, setSubmissionPeriods, setStatus)
  }, [])

  // table vars for loading
  const preColumns = [{ title: 'Name', field: 'name' }];
  const prePeriods = [{ name: status }];

  const { lookupReportingPeriods}: {
    lookupReportingPeriods: {[key:string]: any}
    // submissionPeriods:SubmissionPeriod[]
  } = useSelector(
    state => ({
      lookupReportingPeriods: selectFactoryRESTLookup(selectReportingPeriodsStore)(state),
      // submissionPeriods:selectFactoryRESTResponseTableValues(selectSubmissionPeriodsStore)(state)
    }),
    shallowEqual,
  );
  
  


  useEffect(()=>{
    if(submissionPeriods && Object.keys(submissionPeriods).length>0){
      const keys = Object.keys(lookupReportingPeriods);
      const nameArray: string[] = [];
      keys.forEach(key=>{
        nameArray.push(lookupReportingPeriods[key]);
      });
      const sortedNameArray = nameArray.sort();
      const IdToIndex = new Map();
      const IndexToId: {[key: number]: string} = {};
      const IndexToName: {[key: number]: string} = {};
      keys.forEach(key=>{
        const index = sortedNameArray.indexOf(lookupReportingPeriods[key]);
        IdToIndex.set(String(key), index);
        IndexToId[index]=String(key);
        IndexToName[index]=lookupReportingPeriods[key];
      })
      const modifiedSubmissionPeriods: SubmissionPeriod[] = [];
      submissionPeriods.forEach(submissionPeriod=>{
        const Id = String(submissionPeriod.reportingPeriodId);
        const modifiedSubmissionPeriod = Object.assign({}, submissionPeriod)
        modifiedSubmissionPeriod.reportingPeriodId = IdToIndex.get(Id);
        modifiedSubmissionPeriods.push(modifiedSubmissionPeriod);
      });
      setModifiedSubmissionPeriod(modifiedSubmissionPeriods);
      console.log(readsubmissionPeriods)
      setIndex(IndexToId);
      setIndexName(IndexToName);
      
    }
    

    
  }, [submissionPeriods, lookupReportingPeriods])
  
  // Convert Date format
  submissionPeriods?.forEach(submissionPeriod => {
    submissionPeriod.timestamp = formatTimestamp(submissionPeriod.timestamp);
  });

  const columns: Column<SubmissionPeriod>[] = useMemo(
    () => [
      { title: 'Name', field: 'name', validate: rowData => checkDuplicates(rowData, readsubmissionPeriods, 'name')},
      { title: 'Start Date', type: 'date', field: 'startDate' },
      { title: 'End Date', type: 'date', field: 'endDate' },
      {
        title: 'ReportingPeriodId',
        field: 'reportingPeriodId',
        lookup: readIndexName,
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
    [lookupReportingPeriods, readIndexName],
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
          const convertedSubmissionPeriod = Object.assign({}, submissionPeriod);
          convertedSubmissionPeriod.reportingPeriodId = (readIndex && readIndex[submissionPeriod.reportingPeriodId]) || '';
          recordUpdate(convertedSubmissionPeriod);
          controllerAddRow(SubmissionPeriodController, setSubmissionPeriods, convertedSubmissionPeriod)
            .then((res?: SubmissionPeriod) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
      onRowUpdate: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          const convertedSubmissionPeriod = Object.assign({}, submissionPeriod);
          convertedSubmissionPeriod.reportingPeriodId = (readIndex && readIndex[submissionPeriod.reportingPeriodId]) || '';
          recordUpdate(convertedSubmissionPeriod);
          controllerEditRow(SubmissionPeriodController, setSubmissionPeriods, convertedSubmissionPeriod)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
          
        }),
      onRowDelete: (submissionPeriod: SubmissionPeriod) =>
        new Promise((resolve, reject) => {
          const convertedSubmissionPeriod = Object.assign({}, submissionPeriod);
          convertedSubmissionPeriod.reportingPeriodId = (readIndex && readIndex[parseInt(submissionPeriod.reportingPeriodId)]) || '';
          recordUpdate(convertedSubmissionPeriod);
          controllerDeleteRow(SubmissionPeriodController, setSubmissionPeriods, convertedSubmissionPeriod._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
    }),
    [dispatch, readIndex],
  );

  // useEffect(() => {
    
  //   dispatch(getReportingPeriodsRequest());
  // }, [dispatch]);

  useEffect(()=>{
    setRowNum(submissionPeriods?.length || 1)
  }, [submissionPeriods])
  return (
    <div>
      <SubmissionPeriodHeader />
      <MaterialTable
        key={readRowNum}
        columns={!!submissionPeriods ? columns : preColumns}
        data={!!submissionPeriods ? readsubmissionPeriods : prePeriods}
        editable={!!submissionPeriods ? editable : undefined}
        options={options}
      />
    </div>
  );
};

export default SubmissionPeriod;
