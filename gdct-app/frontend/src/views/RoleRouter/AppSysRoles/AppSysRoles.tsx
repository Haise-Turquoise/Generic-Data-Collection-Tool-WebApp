import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import {
  getAppSysRolesRequest,
  createAppSysRoleRequest,
  deleteAppSysRoleRequest,
  updateAppSysRoleRequest,
//@ts-ignore
} from '../../../store/thunks/AppSysRole';

//@ts-ignore
import { getAppRolesRequest } from '../../../store/thunks/AppRole';
//@ts-ignore
import { getAppSysesRequest } from '../../../store/thunks/AppSys';

//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
//@ts-ignore
import { selectAppSysesStore } from '../../../store/AppSysesStore/selectors';
//@ts-ignore
import { selectAppRolesStore } from '../../../store/AppRolesStore/selectors';
//@ts-ignore
import { calculateOptions } from '../../../tools/misc';
import moment from 'moment';
//@ts-ignore
import CreateAuditLog from '../../AuditLog_Global';
//@ts-ignore
import AppSysRoleController from '../../../controllers/AppSysRole';

import AppSysRole from '../../../types/appsysrole';
import AppSys from '../../../types/appsys';
import AppRole from '../../../types/approle';

interface AppSysRoleMT extends AppSysRole {
  tableData?: any,
}

const AppSysRolesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application System Role</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppSysRolesTable = () => {
  const dispatch = useDispatch();
  const [readNumRow, setNumRow] = useState(1);
  const [hasAppSysRoles, setHasAppSysRoles] = useState(false)

  // table stuff while loading
  const preColumns: Column<AppSysRoleMT>[] = [{title: 'Name', field: 'role'}]
  const preAppSysRoles: AppSysRoleMT[] = [{
    _id: '',
    appSys: '',
    isActive: false,
    role: 'LOADING...',
    timestamp: '',
  }]

  const { appSyses, appSysRoles, appRoles }: {
    appSyses: AppSys[],
    appSysRoles: AppSysRole[],
    appRoles: AppRole[],
  } = useSelector(
    state => ({
      appRoles: selectFactoryRESTResponseTableValues(selectAppRolesStore)(state),
      appSyses: selectFactoryRESTResponseTableValues(selectAppSysesStore)(state),
      appSysRoles: selectFactoryRESTResponseTableValues(selectAppSysRolesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  appSysRoles.forEach(appSysRole => {
    const logtime = new Date(appSysRole.timestamp);
    appSysRole.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  const lookupSysRoles = appSyses.reduce(function (acc: {[key:string]: string}, appSys: AppSys) {
    acc[appSys.code] = appSys.name;
    return acc;
  }, {});

  const lookupAppRoles = appRoles.reduce(function (acc: {[key:string]: string}, appRole: AppRole) {
    acc[appRole.code] = appRole.name;
    return acc;
  }, {});

  const columns: Column<AppSysRoleMT>[] = useMemo(
    () => [
      {
        title: 'Application System',
        field: 'appSys',
      },
      { title: 'Role', field: 'role' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [lookupSysRoles, lookupAppRoles],
  );

  const options: Options<AppSysRoleMT> = useMemo(() => calculateOptions(readNumRow), [readNumRow]);
  
  // Record user and time when an action occurs 
  function recordUpdate(appSysRole: AppSysRoleMT) {
    appSysRole.updatedBy = localStorage.getItem('currentUser') || '';
    appSysRole.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: (appSysRole: AppSysRoleMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appSysRole);
          dispatch(createAppSysRoleRequest(appSysRole, resolve, reject));
        }).then(newAppSysRole => {
          // For Auditlog
          if (newAppSysRole) {
            CreateAuditLog(
              null,
              "Create Application System Role",
              "AppSysRole",
              (newAppSysRole as AppSysRole)._id,
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
            CreateAuditLog(null, "Update Application System Role", "AppSysRole", oldAppSysRole._id, oldAppSysRole, appSysRole);
          })();
          // Do Update
          dispatch(updateAppSysRoleRequest(appSysRole, resolve, reject));
        }),

      onRowDelete: (appSysRole: AppSysRoleMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appSysRole);
          dispatch(deleteAppSysRoleRequest(appSysRole._id, resolve, reject));
          // For Auditlog
          const appSysRole_trim = (({ tableData, ...o }) => o)(appSysRole);
          CreateAuditLog(null, "Delete Application System Role", "AppSysRole", appSysRole._id, appSysRole_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppRolesRequest());
    dispatch(getAppSysesRequest());
    dispatch(getAppSysRolesRequest());
  }, [dispatch]);

  useEffect(()=>{
    setNumRow(appSysRoles.length)
    if (!hasAppSysRoles) {
      setHasAppSysRoles(appSysRoles.length >= 1)
    }
  }, [appSysRoles])

  return (
    <MaterialTable
      key={readNumRow}
      columns={hasAppSysRoles ? columns : preColumns}
      data={hasAppSysRoles ? appSysRoles : preAppSysRoles}
      editable={hasAppSysRoles ? editable : undefined}
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
