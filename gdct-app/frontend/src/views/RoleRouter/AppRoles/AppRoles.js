import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';

import {
  getAppRolesRequest,
  createAppRoleRequest,
  deleteAppRoleRequest,
  updateAppRoleRequest,
} from '../../../store/thunks/AppRole';

import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppRolesStore } from '../../../store/AppRolesStore/selectors';
import { calculateOptions } from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import AppRoleController from '../../../controllers/AppRole';

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
  
  // Prepare the data for material table
  const { appRoles } = useSelector(
    state => ({
      appRoles: selectFactoryRESTResponseTableValues(selectAppRolesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  appRoles.forEach(appRole => {
    const logtime = new Date(appRole.timestamp);
    appRole.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  
  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'Code', field: 'code' },
      { title: 'Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(appRole) {
    appRole.updatedBy = localStorage.getItem('currentUser');
    appRole.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: appRole =>
        new Promise((resolve, reject) => {
          recordUpdate(appRole);
          dispatch(createAppRoleRequest(appRole, resolve, reject));
        }).then(newAppRole => {
          // For Auditlog
          CreateAuditLog(null, "Create Application Role", "AppRole", newAppRole._id, {}, newAppRole);
        }),

      onRowUpdate: appRole =>
        new Promise((resolve, reject) => {
          recordUpdate(appRole);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldAppRole = await AppRoleController.fetchAppRole(appRole._id);
            CreateAuditLog(null, "Update Application Role", "AppRole", oldAppRole._id, oldAppRole, appRole);
          })();
          // Do Update
          dispatch(updateAppRoleRequest(appRole, resolve, reject));
        }),

      onRowDelete: appRole =>
        new Promise((resolve, reject) => {
          recordUpdate(appRole);
          dispatch(deleteAppRoleRequest(appRole._id, resolve, reject));
          // For Auditlog
          const appRole_trim = (({ tableData, ...o }) => o)(appRole);
          CreateAuditLog(null, "Delete Application Role", "AppRole", appRole._id, appRole_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppRolesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(appRoles.length)}, [appRoles])

  // @ts-ignore
  return <MaterialTable key={readRowNum} columns={columns} data={appRoles} editable={editable} options={options} />;
};

const AppRoles = props => {
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
