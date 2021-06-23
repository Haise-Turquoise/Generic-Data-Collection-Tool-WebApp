import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';

import {
  getAppRolesRequest,
  createAppRoleRequest,
  deleteAppRoleRequest,
  updateAppRoleRequest,
//@ts-ignore
} from '../../../store/thunks/AppRole';

//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectAppRolesStore } from '../../../store/AppRolesStore/selectors';
//@ts-ignore
import { calculateOptions } from '../../../tools/misc';
//@ts-ignore
import CreateAuditLog from '../../AuditLog_Global';
//@ts-ignore
import AppRoleController from '../../../controllers/AppRole';

import AppRole from '../../../types/approle';
interface AppRoleMT extends AppRole {
  tableData?: any,
}

const AppRolesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application Role</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppRolesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasAppRoles, setHasAppRoles] = useState(false);

  // table stuff while loading
  const preColumns: Column<AppRoleMT>[] = [{title: 'Name', field: 'name'}]
  const preAppRoles: AppRoleMT[] = [{
    name: 'LOADING...',
    _id: '',
    code: '',
    isActive: false,
    timestamp: '',
    updatedBy: '',
  }]
  
  // Prepare the data for material table
  const { appRoles }: { appRoles: AppRoleMT[] } = useSelector(
    state => ({
      appRoles: selectFactoryRESTResponseTableValues(selectAppRolesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  appRoles.forEach(appRole => {
    const logtime = new Date(appRole.timestamp);
    appRole.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });

  // Prepare the columns for material table
  const columns: Column<AppRoleMT>[] = useMemo(
    () => [
      { title: 'Code', field: 'code' },
      { title: 'Name', field: 'name' },
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
    [],
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
        new Promise((resolve, reject) => {
          recordUpdate(appRole);
          dispatch(createAppRoleRequest(appRole, resolve, reject));
        }).then(newAppRole => {
          // For Auditlog
          if (newAppRole) {
            CreateAuditLog(
              null,
              "Create Application Role",
              "AppRole",
              (newAppRole as AppRole)._id,
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
              oldAppRole._id,
              oldAppRole,
              appRole,
            );
          })();
          // Do Update
          dispatch(updateAppRoleRequest(appRole, resolve, reject));
        }),

      onRowDelete: (appRole: AppRoleMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appRole);
          dispatch(deleteAppRoleRequest(appRole._id, resolve, reject));
          // For Auditlog
          const appRole_trim = (({ tableData, ...o }) => o)(appRole);
          CreateAuditLog(null, 'Delete Application Role', 'AppRole', appRole._id, appRole_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppRolesRequest());
  }, [dispatch]);

  useEffect(() => {
    setRowNum(appRoles.length);
    if (!hasAppRoles) {
      setHasAppRoles(appRoles.length >= 1);
    }
  }, [appRoles]);

  // @ts-ignore
  return (
    <MaterialTable
      key={readRowNum}
      columns={hasAppRoles ? columns : preColumns}
      data={hasAppRoles ? appRoles : preAppRoles}
      editable={hasAppRoles ? editable : undefined}
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
