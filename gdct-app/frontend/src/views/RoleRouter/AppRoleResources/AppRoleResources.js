import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';

import {
  getAppRoleResourcesRequest,
  createAppRoleResourceRequest,
  deleteAppRoleResourceRequest,
  updateAppRoleResourceRequest,
} from '../../../store/thunks/AppRoleResource';

import { getAppSysRolesRequest } from '../../../store/thunks/AppSysRole';
import { getAppResourcesRequest } from '../../../store/thunks/AppResource';

import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppRoleResourcesStore } from '../../../store/AppRoleResourcesStore/selectors';
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';
import { calculateOptions } from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import AppRoleResourceController from '../../../controllers/AppRoleResource';

const AppRoleResourcesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application Role Resource</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppRoleResourcesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  
  // Prepare the data for material table
  const { appRoleResources, appSysRoles, appResources } = useSelector(
    state => ({
      appRoleResources: selectFactoryRESTResponseTableValues(selectAppRoleResourcesStore)(state),
      appResources: selectFactoryRESTResponseTableValues(selectAppResourcesStore)(state),
      appSysRoles: selectFactoryRESTResponseTableValues(selectAppSysRolesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  appRoleResources.forEach(appRoleResource => {
    const logtime = new Date(appRoleResource.timestamp);
    appRoleResource.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  const lookupSysRoles = appSysRoles.reduce(function (acc, sysRoles) {
    acc[sysRoles._id] = `${sysRoles.appSys} - ${sysRoles.role}`;
    return acc;
  }, {});

  const lookupResources = appResources.reduce(function (acc, resource) {
    acc[resource._id] = resource.resourcePath;
    return acc;
  }, {});
  
  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'Application System Role', field: 'appSysRoleId', lookup: lookupSysRoles },
      {
        title: 'Resource',
        field: 'resourceId',
        render: ({ resourceId }) => (
          <>
            {resourceId &&
              resourceId.map((e, i) => {
                let data;
                if (lookupResources[e]) {
                  // data = lookupResources[e].split('/')[2];
                  data = lookupResources[e].split('/');
                  // Use the last element of the resource string
                  data = data[data.length-1];
                }
                return (
                  <span style={{ marginRight: '10px' }} key={i}>
                    {data}
                  </span>
                );
              })}
          </>
        ),
        editable: 'never',
      },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [lookupSysRoles, lookupResources],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record user and time when an action occurs 
  function recordUpdate(appRoleResource) {
    appRoleResource.updatedBy = localStorage.getItem('currentUser');
    appRoleResource.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: appRoleResource =>
        new Promise((resolve, reject) => {
          recordUpdate(appRoleResource);
          dispatch(createAppRoleResourceRequest(appRoleResource, resolve, reject));
        }).then(newAppRoleResource => {
          // For Auditlog
          CreateAuditLog(null, "Create Application Role Resource", "AppRoleResource", newAppRoleResource._id, {}, newAppRoleResource);
        }),

      onRowUpdate: appRoleResource =>
        new Promise((resolve, reject) => {
          recordUpdate(appRoleResource);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldAppRoleResource = await AppRoleResourceController.fetchAppRoleResource(appRoleResource._id);
            CreateAuditLog(null, "Update Application Role Resource", "AppRoleResource", oldAppRoleResource._id, oldAppRoleResource, appRoleResource);
          })();
          // Do Update
          dispatch(updateAppRoleResourceRequest(appRoleResource, resolve, reject));
        }),

      onRowDelete: appRoleResource =>
        new Promise((resolve, reject) => {
          recordUpdate(appRoleResource);
          dispatch(deleteAppRoleResourceRequest(appRoleResource._id, resolve, reject));
          // For Auditlog
          const appRoleResource_trim = (({ tableData, ...o }) => o)(appRoleResource);
          CreateAuditLog(null, "Delete Application Role Resource", "AppRoleResource", appRoleResource._id, appRoleResource_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppRoleResourcesRequest());
    dispatch(getAppSysRolesRequest());
    dispatch(getAppResourcesRequest());
  }, [dispatch]);

  useEffect(() => { setRowNum(appRoleResources.length), [appRoleResources] })

  return (
    // @ts-ignore
    <MaterialTable key={readRowNum} columns={columns} data={appRoleResources} editable={editable} options={options}/>
  );
};

const AppRoleResources = props => {
  return (
    <div className="AppRoleResources">
      <AppRoleResourcesHeader />
      <AppRoleResourcesTable {...props} />
    </div>
  );
};

export default AppRoleResources;
