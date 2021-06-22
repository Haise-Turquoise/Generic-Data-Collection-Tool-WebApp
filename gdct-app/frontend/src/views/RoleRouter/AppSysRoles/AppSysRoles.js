import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import {
  getAppSysRolesRequest,
  createAppSysRoleRequest,
  deleteAppSysRoleRequest,
  updateAppSysRoleRequest,
} from '../../../store/thunks/AppSysRole';

import { getAppRolesRequest } from '../../../store/thunks/AppRole';
import { getAppSysesRequest } from '../../../store/thunks/AppSys';

import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
import { selectAppSysesStore } from '../../../store/AppSysesStore/selectors';
import { selectAppRolesStore } from '../../../store/AppRolesStore/selectors';
import { calculateOptions } from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import AppSysRoleController from '../../../controllers/AppSysRole';

const AppSysRolesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application System Role</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppSysRolesTable = props => {
  const dispatch = useDispatch();
  const [readNumRow, setNumRow] = useState(1);
  const [hasAppSysRoles, setHasAppSysRoles] = useState(false);

  // table stuff while loading
  const preAppSysRoles = [{ name: 'LOADING...' }];
  const preColumns = [{ title: 'Name', field: 'name' }];

  const { appSyses, appSysRoles, appRoles } = useSelector(
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
    appSysRole.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });
  const lookupSysRoles = appSyses.reduce(function (acc, appSys) {
    acc[appSys.code] = appSys.name;
    return acc;
  }, {});

  const lookupAppRoles = appRoles.reduce(function (acc, appRole) {
    acc[appRole.code] = appRole.name;
    return acc;
  }, {});

  const columns = useMemo(
    () => [
      {
        title: 'Application System',
        field: 'appSys',
      },
      { title: 'Role', field: 'role' },
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
    [lookupSysRoles, lookupAppRoles],
  );

  const options = useMemo(() => calculateOptions(readNumRow), [readNumRow]);

  // Record user and time when an action occurs
  function recordUpdate(appSysRole) {
    appSysRole.updatedBy = localStorage.getItem('currentUser');
    appSysRole.timestamp = new Date().toLocaleString();
  }
  const editable = useMemo(
    () => ({
      onRowAdd: appSysRole =>
        new Promise((resolve, reject) => {
          recordUpdate(appSysRole);
          dispatch(createAppSysRoleRequest(appSysRole, resolve, reject));
        }).then(newAppSysRole => {
          // For Auditlog
          CreateAuditLog(
            null,
            'Create Application System Role',
            'AppSysRole',
            newAppSysRole._id,
            {},
            newAppSysRole,
          );
        }),

      onRowUpdate: appSysRole =>
        new Promise((resolve, reject) => {
          recordUpdate(appSysRole);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldAppSysRole = await AppSysRoleController.fetchAppSysRole(appSysRole._id);
            CreateAuditLog(
              null,
              'Update Application System Role',
              'AppSysRole',
              oldAppSysRole._id,
              oldAppSysRole,
              appSysRole,
            );
          })();
          // Do Update
          dispatch(updateAppSysRoleRequest(appSysRole, resolve, reject));
        }),

      onRowDelete: appSysRole =>
        new Promise((resolve, reject) => {
          recordUpdate(appSysRole);
          dispatch(deleteAppSysRoleRequest(appSysRole._id, resolve, reject));
          // For Auditlog
          const appSysRole_trim = (({ tableData, ...o }) => o)(appSysRole);
          CreateAuditLog(
            null,
            'Delete Application System Role',
            'AppSysRole',
            appSysRole._id,
            appSysRole_trim,
            {},
          );
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppRolesRequest());
    dispatch(getAppSysesRequest());
    dispatch(getAppSysRolesRequest());
  }, [dispatch]);

  useEffect(() => {
    setNumRow(appSysRoles.length);
    if (!hasAppSysRoles) {
      setHasAppSysRoles(appSysRoles.length >= 1);
    }
  }, [appSysRoles]);

  return (
    // @ts-ignore
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
