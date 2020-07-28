import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  getAppSysRolesRequest,
  createAppSysRoleRequest,
  deleteAppSysRoleRequest,
  updateAppSysRoleRequest,
} from '../../../store/thunks/AppSysRole';

import { getAppRolesRequest } from '../../../store/thunks/AppRole';

import { getAppSysesRequest } from '../../../store/thunks/AppSys';

import './AppSysRoles.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
import { selectAppSysesStore } from '../../../store/AppSysesStore/selectors';
import { selectAppRolesStore } from '../../../store/AppRolesStore/selectors';

const AppSysRolesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">AppSysRoles</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppSysRolesTable = props => {
  const dispatch = useDispatch();
  const { appSyses, appSysRoles, appRoles } = useSelector(
    state => ({
      appRoles: selectFactoryRESTResponseTableValues(selectAppRolesStore)(state),
      appSyses: selectFactoryRESTResponseTableValues(selectAppSysesStore)(state),
      appSysRoles: selectFactoryRESTResponseTableValues(selectAppSysRolesStore)(state),
    }),
    shallowEqual,
  );
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
        title: 'AppSys',
        field: 'appSys',
        lookup: lookupSysRoles,
      },
      { title: 'Role', field: 'role', lookup: lookupAppRoles },
    ],
    [lookupSysRoles, lookupAppRoles],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: appSysRole =>
        new Promise((resolve, reject) => {
          dispatch(createAppSysRoleRequest(appSysRole, resolve, reject));
        }),
      onRowUpdate: appSysRole =>
        new Promise((resolve, reject) => {
          dispatch(updateAppSysRoleRequest(appSysRole, resolve, reject));
        }),
      onRowDelete: appSysRole =>
        new Promise((resolve, reject) => {
          dispatch(deleteAppSysRoleRequest(appSysRole._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppRolesRequest());
    dispatch(getAppSysesRequest());
    dispatch(getAppSysRolesRequest());
  }, [dispatch]);

  return (
    <MaterialTable columns={columns} data={appSysRoles} editable={editable} options={options} />
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
