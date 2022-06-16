import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
import {
  calculateOptions,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  checkDuplicates,
  fetchWithStatus,
} from '../../tools/misc'

import ErrorBanner from '../ErrorBanner';
import CreateAuditLog from '../AuditLog_Global';
import reportingPeriodController from '../../controllers/reportingPeriod';
import ReportingPeriod from '../../types/reportingperiod';


interface ReportingPeriodMT extends ReportingPeriod {
  tableData?: any;
}

const ReportingPeriodHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Reporting Period</Typography>
    </Paper>
  );
};



const generateCode = (name: string) => {
  const first = `${name.substring(0,4)}9`
  let second
  if (name.substr(-2) === 'YE' || name.length < 10) {
    second = 9
  } else {
    second = name.substr(-1)
  }
  return `${first}${second}`
} 

const ReportingPeriodsTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [reportingPeriods, setReportingPeriods] =
    useState<ReportingPeriod[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<ReportingPeriod>(reportingPeriodController, setReportingPeriods, setStatus)
  }, [])

  // table vars for loading
  const preColumns: Column<ReportingPeriodMT>[] = [{ title: 'Name', field: 'name' }];
  const prePeriods: ReportingPeriodMT[] = [
    {
      name: status,
      _id: '',
      code: '',
      submissionClosed: false,
      updatedAt: '',
      updatedBy: '',
    },
  ];

  useEffect(()=>{
    setRowNum(reportingPeriods?.length || 1)
  }, [reportingPeriods])
  // Convert Date format
  reportingPeriods?.forEach((reportingPeriod: ReportingPeriod) => {
    reportingPeriod.updatedAt = formatTimestamp(reportingPeriod.updatedAt);
  });
  reportingPeriods?.sort((a,b)=>b.name.localeCompare(a.name)); //newest to oldest sorting - Tony X
  //reportingPeriods?.sort((a,b)=>a.name.localeCompare(b.name)); <--Would be oldest to newest

  // Prepare the columns for material table
  const columns: Column<ReportingPeriodMT>[] = useMemo(
    () => [
      { title: 'Name', field: 'name', validate: rowData => checkDuplicates(rowData, reportingPeriods, 'name') }, //Related to order sorting - Tony X
      { title: 'Code', field: 'code', editComponent: () => (<div></div>) },
      {
        title: 'Modified On',
        field: 'updatedAt',
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
      { title: 'SubmissionClosed', type: 'boolean', field: 'submissionClosed' },
    ],
    [reportingPeriods],
  );

  const options: Options<ReportingPeriodMT> = useMemo(() => calculateOptions(readRowNum), [
    readRowNum,
  ]);

  // Record who and when of the action
  function recordUpdate(reportingPeriod: ReportingPeriodMT) {
    //generate code
    reportingPeriod.code = generateCode(reportingPeriod.name)
    //get username and record in Modified By column
    reportingPeriod.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column
    reportingPeriod.updatedAt = new Date().toLocaleString();
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (reportingPeriod: ReportingPeriodMT) =>
        new Promise<ReportingPeriod | undefined>((resolve, reject) => {
          recordUpdate(reportingPeriod);
          controllerAddRow(reportingPeriodController, setReportingPeriods, reportingPeriod)
            .then((res?: ReportingPeriod) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newReportingPeriod => {
          // For Auditlog
          if (newReportingPeriod) {
            CreateAuditLog(
              null,
              "Create Reporting Period",
              "ReportingPeriod",
              newReportingPeriod._id,
              {},
              newReportingPeriod,
            );
          }
        }),
      onRowUpdate: (reportingPeriod: ReportingPeriodMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(reportingPeriod);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldReportingPeriod = await reportingPeriodController.fetchReportingPeriod(
              reportingPeriod._id,
            );
            CreateAuditLog(
              null,
              'Update Reporting Period',
              'ReportingPeriod',
              oldReportingPeriod?._id,
              oldReportingPeriod,
              reportingPeriod,
            );
          })();
          // Do Update
          controllerEditRow(reportingPeriodController, setReportingPeriods, reportingPeriod)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
      onRowDelete: (reportingPeriod: ReportingPeriodMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(reportingPeriod);
          // For Auditlog
          const reportingPeriod_trim = (({ tableData, ...o }) => o)(reportingPeriod);
          CreateAuditLog(null, "Delete Reporting Period", "ReportingPeriod", reportingPeriod._id, reportingPeriod_trim, {})
          controllerDeleteRow(reportingPeriodController, setReportingPeriods, reportingPeriod._id)
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

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!reportingPeriods ? columns : preColumns}
      data={!!reportingPeriods ? reportingPeriods : prePeriods}
      editable={!!reportingPeriods ? editable : undefined}
      options={options}
    />
  );
};

// any type since props unused
const ReportingPeriod = (props: any) => (
  <div className="reportingPeriods">
    <ReportingPeriodHeader />
    <ErrorBanner
      title={
        'Cannot delete the selected reporting period since it is referenced in master value table.'
      }
      targetStore={selectReportingPeriodsStore}
    />
    <ReportingPeriodsTable {...props} />
  </div>
);

export default ReportingPeriod;
