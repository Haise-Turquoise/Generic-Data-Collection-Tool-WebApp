import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import {
  calculateOptions,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  checkDuplicates,
  fetchWithStatus,
} from '../../../tools/misc'

import AppSysController from '../../../controllers/AppSys'
import CreateAuditLog from '../../AuditLog_Global'
import AppSys from '../../../types/appsys';
interface AppSysMT extends AppSys {
  tableData?: any,
}

const AppSysesHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Application System</Typography>
    </div>
  );
};

const AppSysesTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  const [appSyses, setAppSyses] = useState<AppSys[] | undefined>(undefined)

  useEffect(() => {
    fetchWithStatus<AppSys>(AppSysController, setAppSyses, setStatus)
  }, [])

  // table stuff while loading
  const preColumns: Column<AppSysMT>[] = [{title: 'Name', field: 'name'}]
  const preAppSys: AppSysMT[] = [{
    name: status,
    _id: '',
    code: '',
    isActive: false,
    updatedAt: '',
  }]

  // Convert Date format
  appSyses?.forEach(appSys => {
    appSys.updatedAt = formatTimestamp(appSys.updatedAt);
  });

  const columns: Column<AppSysMT>[] = useMemo(
    () => [
      { title: 'Code', field: 'code', validate: rowData => checkDuplicates(rowData, appSyses, 'code') },
      { title: 'Name', field: 'name', validate: rowData => checkDuplicates(rowData, appSyses, 'name') },
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
    ],
    [appSyses],
  );
  
  const options: Options<AppSysMT> = useMemo(() => ({...calculateOptions(readRowNum), filtering: true}), [readRowNum]);


  // Record who and when of the action
  function recordUpdate(appSys: AppSysMT) {
    //get username and record in Modified By column
    appSys.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column 
    appSys.updatedAt = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (appSys: AppSys) => 
        new Promise<AppSys | undefined>((resolve, reject) => {
          recordUpdate(appSys);
          controllerAddRow(AppSysController, setAppSyses, appSys)
            .then((res: AppSys) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newAppSys => {
          // For Auditlog
          if (newAppSys) {
            CreateAuditLog(
              null,
              "Add Application System",
              "AppSys",
              newAppSys._id,
              {},
              newAppSys
            );
          }
        }),

      onRowUpdate: (appSys: AppSysMT) => 
        new Promise((resolve, reject) => {
          recordUpdate(appSys);
          // Find the old value before updating for Auditlog
          (async () => {
            const oldAppSys = await AppSysController.fetchAppSys(appSys._id);
            CreateAuditLog(
              null,
              'Update Application System',
              'AppSys',
              appSys._id,
              oldAppSys,
              appSys,
            );
          })();
          // Do Update
          controllerEditRow(AppSysController, setAppSyses, appSys)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
        
      onRowDelete: (appSys: AppSysMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appSys);
          // onRowDelete will add a "tableData" attribute in the Object, which we don't need for Auditlog
          const appSys_trim = (({ tableData, ...o }) => o)(appSys)
          CreateAuditLog(null, "Delete Application System", "AppSys", appSys._id, appSys_trim, {});
          controllerDeleteRow(AppSysController, setAppSyses, appSys._id)
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

  useEffect(()=>{
    setRowNum(appSyses?.length || 1)
  }, [appSyses])

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!appSyses ? columns : preColumns}
      data={!!appSyses ? appSyses : preAppSys}
      editable={!!appSyses ? editable : undefined}
      options={options} 
    />
  );
};

// any type since props unused
const AppSyses = (props: any) => (
  <div className="AppSyses">
    <AppSysesHeader />
    {/* <FileDropzone/> */}
    <AppSysesTable {...props} />
  </div>
);

export default AppSyses;
