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
} from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import AppRoleController from '../../../controllers/AppRole';
import AppRole from '../../../types/approle';
interface AppRoleMT extends AppRole {
  tableData?: any,
}

const AppRolesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application Role</Typography>
    </Paper>
  );
};

const AppRolesTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [appRoles, setAppRoles] = useState<AppRole[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<AppRole>(AppRoleController, setAppRoles, setStatus)
  }, [])

  // table stuff while loading
  const preColumns: Column<AppRoleMT>[] = [{title: 'Name', field: 'name'}]
  const preAppRoles: AppRoleMT[] = [{
    name: status,
    _id: '',
    code: '',
    isActive: false,
    timestamp: '',
    updatedBy: '',
  }]

  // Convert Date format
  appRoles?.forEach(appRole => {
    appRole.timestamp = formatTimestamp(appRole.timestamp);
  });

  // Prepare the columns for material table
  const columns: Column<AppRoleMT>[] = useMemo(
    () => [
      { title: 'Code', field: 'code', validate: rowData => checkDuplicates(rowData, appRoles, 'code') },
      { title: 'Name', field: 'name', validate: rowData => checkDuplicates(rowData, appRoles, 'name') },
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
    [appRoles],
  );

  const options: Options<AppRoleMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(appRole: AppRoleMT) {
    appRole.updatedBy = localStorage.getItem('currentUser') || '';
    appRole.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: (appRole: AppRoleMT) =>
        new Promise<AppRole | undefined>((resolve, reject) => {
          recordUpdate(appRole);
          controllerAddRow(AppRoleController, setAppRoles, appRole)
            .then((res: AppRole) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newAppRole => {
          // For Auditlog
          if (newAppRole) {
            CreateAuditLog(
              null,
              "Create Application Role",
              "AppRole",
              newAppRole._id,
              {},
              newAppRole
            );
          }
        }),

      onRowUpdate: (appRole: AppRoleMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appRole);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldAppRole = await AppRoleController.fetchAppRole(appRole._id);
            CreateAuditLog(
              null,
              'Update Application Role',
              'AppRole',
              oldAppRole?._id,
              oldAppRole,
              appRole,
            );
          })();
          // Do Update
          controllerEditRow(AppRoleController, setAppRoles, appRole)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),

      onRowDelete: (appRole: AppRoleMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appRole);
          // For Auditlog
          const appRole_trim = (({ tableData, ...o }) => o)(appRole);
          CreateAuditLog(null, "Delete Application Role", "AppRole", appRole._id, appRole_trim, {});
          controllerDeleteRow(AppRoleController, setAppRoles, appRole._id)
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
    setRowNum(appRoles?.length || 1)
  }, [appRoles])

  // @ts-ignore
  return (
    <MaterialTable
      key={readRowNum}
      columns={!!appRoles ? columns : preColumns}
      data={!!appRoles ? appRoles : preAppRoles}
      editable={!!appRoles ? editable : undefined}
      options={options}
    />
  );
};

// any type since props unused
const AppRoles = (props: any) => {
  console.log('why not: ', props);
  return (
    <div className="AppRoles">
      <AppRolesHeader />
      {/* <FileDropzone/> */}
      <AppRolesTable {...props} />
    </div>
  );
};

export default AppRoles;
