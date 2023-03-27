import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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
import AppSysRoleController from '../../../controllers/AppSysRole';
import AppSysController from '../../../controllers/AppSys'
import AppRoleController from '../../../controllers/AppRole'

import AppSysRole from '../../../types/appsysrole';
import AppSys from '../../../types/appsys';
import AppRole from '../../../types/approle';

interface AppSysRoleMT extends AppSysRole {
  tableData?: any,
}

const customCheckDuplicates = (rowData:any, tableData:any, appSys:string, role:string) => {
  // field of element being edited -- null if not editing
  let current:any = null;
  if (rowData.tableData) {
    if (rowData.tableData.editing === 'delete') {
      return true;
    } else if (rowData.tableData.editing === 'update') {
      current = tableData.find((el:any) => el._id === rowData._id);
    }
  } else if (rowData._id) {
    // this case runs while submitting a change
    return true;
  }
  const duplicate = tableData.find((val:any) => val.appSys === rowData.appSys && val !== current && val.role === rowData.role)
  return duplicate ? `Duplicate appSys and role not allowed` : true
}

const AppSysRolesHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Application System Role</Typography>
    </div>
  );
};

const AppSysRolesTable = () => {
  const dispatch = useDispatch();
  const [readNumRow, setNumRow] = useState(1);
  const [appSyses, setAppSyses] = useState<AppSys[] | undefined>(undefined)
  const [appSysRoles, setAppSysRoles] = useState<AppSysRole[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  const [appRoles, setAppRoles] = useState<AppRole[] | undefined>(undefined)

  useEffect(() => {
    AppSysController.fetch().then((res: unknown) => {
      setAppSyses(res as AppSys[])
    })
    fetchWithStatus<AppSysRole>(AppSysRoleController, setAppSysRoles, setStatus)
    AppRoleController.fetch().then((res: unknown) => {
      setAppRoles(res as AppRole[])
    })
  }, [])

  // table stuff while loading
  const preColumns: Column<AppSysRoleMT>[] = [{title: 'Name', field: 'role'}]
  const preAppSysRoles: AppSysRoleMT[] = [{
    _id: '',
    appSys: '',
    isActive: false,
    role: status,
    updatedAt: '',
  }]

  // Convert Date format
  appSysRoles?.forEach(appSysRole => {
    appSysRole.updatedAt = formatTimestamp(appSysRole.updatedAt);
  });
  const lookupSysRoles = appSyses?.reduce(function (acc: {[key:string]: string}, appSys: AppSys) {
    acc[appSys.code] = appSys.code;
    acc = Object.fromEntries(Object.entries(acc).sort());
    return acc;
  }, {});

  const lookupAppRoles = appRoles?.reduce(function (acc: {[key:string]: string}, appRole: AppRole) {
    acc[appRole.code] = appRole.name;
    acc = Object.fromEntries(Object.entries(acc).sort());
    return acc;
  }, {});

  const columns: Column<AppSysRoleMT>[] = useMemo(
    () => [
      {
        title: 'Application System',
        field: 'appSys',
        lookup: lookupSysRoles,
        validate: rowData => customCheckDuplicates(rowData, appSysRoles, 'appSys', 'role')
      },
      { title: 'Role', 
        field: 'role', 
        lookup: lookupAppRoles,
        validate: rowData => customCheckDuplicates(rowData, appSysRoles, 'appSys', 'role'),
      },
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
    [lookupSysRoles, lookupAppRoles, appSysRoles],
  );
  const options: Options<AppSysRoleMT> = useMemo(() => ({...calculateOptions(readNumRow), filtering: true}), [readNumRow]);
  
  // Record user and time when an action occurs 
  function recordUpdate(appSysRole: AppSysRoleMT) {
    appSysRole.updatedBy = localStorage.getItem('currentUser') || '';
    appSysRole.updatedAt = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: (appSysRole: AppSysRoleMT) =>
        new Promise<AppSysRole | null>((resolve, reject) => {
          recordUpdate(appSysRole);
          controllerAddRow(AppSysRoleController, setAppSysRoles, appSysRole)
            .then((res: AppSysRole) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newAppSysRole => {
          // For Auditlog
          if (newAppSysRole) {
            CreateAuditLog(
              null,
              "Create Application System Role",
              "AppSysRole",
              newAppSysRole._id,
              {},
              newAppSysRole
            );
          }
        }),

      onRowUpdate: (appSysRole: AppSysRoleMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appSysRole);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldAppSysRole = await AppSysRoleController.fetchAppSysRole(appSysRole._id);
            CreateAuditLog(
              null,
              'Update Application System Role',
              'AppSysRole',
              oldAppSysRole?._id,
              oldAppSysRole,
              appSysRole,
            );
          })();
          // Do Update
          controllerEditRow(AppSysRoleController, setAppSysRoles, appSysRole)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),

      onRowDelete: (appSysRole: AppSysRoleMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appSysRole);
          // For Auditlog
          const appSysRole_trim = (({ tableData, ...o }) => o)(appSysRole);
          CreateAuditLog(null, "Delete Application System Role", "AppSysRole", appSysRole._id, appSysRole_trim, {});
          controllerDeleteRow(AppSysRoleController, setAppSysRoles, appSysRole._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject(res)
            })
        }),
    }),
    [],
  );

  useEffect(()=>{
    setNumRow(appSysRoles?.length || 1)
  }, [appSysRoles])
  appSysRoles?.sort((a,b)=>a.appSys.localeCompare(b.appSys)); // Sort Application System in alphabetical order - Tony X
  return (
    <MaterialTable
      key={readNumRow}
      columns={!!appSysRoles ? columns : preColumns}
      data={!!appSysRoles ? appSysRoles : preAppSysRoles}
      editable={!!appSysRoles ? editable : undefined}
      options={options}
    />
  );
};

const AppSysRoles = () => (
  <div className="AppSysRoles">
    <AppSysRolesHeader />
    {/* <FileDropzone/> */}
    <AppSysRolesTable />
  </div>
);

export default AppSysRoles;
