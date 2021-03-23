import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  getAppRoleResourcesRequest,
  createAppRoleResourceRequest,
  deleteAppRoleResourceRequest,
  updateAppRoleResourceRequest,
} from '../../../store/thunks/AppRoleResource';

import { getAppSysRolesRequest } from '../../../store/thunks/AppSysRole';

import { getAppResourcesRequest } from '../../../store/thunks/AppResource';

import './AppRoleResources.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppRoleResourcesStore } from '../../../store/AppRoleResourcesStore/selectors';
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';
import { calculateOptions } from '../../../tools/misc';
import moment from 'moment';

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
  const { appRoleResources, appSysRoles, appResources } = useSelector(
    state => ({
      appRoleResources: selectFactoryRESTResponseTableValues(selectAppRoleResourcesStore)(state),
      appResources: selectFactoryRESTResponseTableValues(selectAppResourcesStore)(state),
      appSysRoles: selectFactoryRESTResponseTableValues(selectAppSysRolesStore)(state),
    }),
    shallowEqual,
  );

  const lookupSysRoles = appSysRoles.reduce(function (acc, sysRoles) {
    acc[sysRoles._id] = `${sysRoles.appSys} - ${sysRoles.role}`;
    return acc;
  }, {});

  const lookupResources = appResources.reduce(function (acc, resource) {
    acc[resource._id] = resource.resourcePath;
    return acc;
  }, {});

  // Convert Date format
  appRoleResources.forEach(appRoleResource => {
    const logtime = new Date(appRoleResource.timestamp);
    appRoleResource.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  
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
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [lookupSysRoles, lookupResources],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appRoleResource =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appRoleResource.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appRoleResource.timestamp = event.toLocaleString(); 
          dispatch(createAppRoleResourceRequest(appRoleResource, resolve, reject));
        }),
      onRowUpdate: appRoleResource =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appRoleResource.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appRoleResource.timestamp = event.toLocaleString(); 
          dispatch(updateAppRoleResourceRequest(appRoleResource, resolve, reject));
        }),
      onRowDelete: appRoleResource =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appRoleResource.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appRoleResource.timestamp = event.toLocaleString(); 
          dispatch(deleteAppRoleResourceRequest(appRoleResource._id, resolve, reject));
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
    <MaterialTable
      key={readRowNum}
      columns={columns}
      data={appRoleResources}
      editable={editable}
      options={options}
    />
  );
};

const AppRoleResources = props => {
  console.log('why not: ', props);
  return (
    <div className="AppRoleResources">
      <AppRoleResourcesHeader />
      {/* <FileDropzone/> */}
      <AppRoleResourcesTable {...props} />
    </div>
  );
};

export default AppRoleResources;
