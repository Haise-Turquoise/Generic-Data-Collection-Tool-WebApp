import React, { useMemo, useEffect, useState } from 'react';
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
import { calculateOptions } from '../../../tools/misc';
import moment from 'moment';

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
        title: 'Application System',
        field: 'appSys',
        lookup: lookupSysRoles,
      },
      { title: 'Role', field: 'role', lookup: lookupAppRoles },
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [lookupSysRoles, lookupAppRoles],
  );

  // Convert Date format
  appSyses.forEach(appSys => {
    const logtime = new Date(appSys.timestamp);
    appSys.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  const options = useMemo(() => calculateOptions(readNumRow), [readNumRow]);

  const editable = useMemo(
    () => ({
      onRowAdd: appSysRole =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appSysRole.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appSysRole.timestamp = event.toLocaleString(); 
          dispatch(createAppSysRoleRequest(appSysRole, resolve, reject));
        }),
      onRowUpdate: appSysRole =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appSysRole.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appSysRole.timestamp = event.toLocaleString(); 
          dispatch(updateAppSysRoleRequest(appSysRole, resolve, reject));
        }),
      onRowDelete: appSysRole =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appSysRole.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appSysRole.timestamp = event.toLocaleString(); 
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

  useEffect(()=>{setNumRow(appSysRoles.length)}, [appSysRoles])

  return (
    <MaterialTable key={readNumRow} columns={columns} data={appSysRoles} editable={editable} options={options} />
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
