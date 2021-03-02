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
import { calculateOptions } from '../../../tools/misc'


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

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    appSysRoles.forEach(appSysRoles => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(appSysRoles.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(appSysRoles.timestamp.toString());
       appSysRoles.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       appSysRoles.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

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
