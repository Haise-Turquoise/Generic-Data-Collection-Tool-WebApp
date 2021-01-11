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

const AppRoleResourcesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">AppRoleResources</Typography>
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
  
  const calculateOptions = (itemCount)=>{
    let length = itemCount
    if (length > 100) length = 100;
    else if (length == 0) length = 1;
    return {
      actionsColumnIndex: -1, 
      search: false, 
      showTitle: false,
      maxBodyHeight:"400px",
      pageSize:length
    }
  }

  const lookupSysRoles = appSysRoles.reduce(function (acc, sysRoles) {
    acc[sysRoles._id] = `${sysRoles.appSys} - ${sysRoles.role}`;
    return acc;
  }, {});

  const lookupResources = appResources.reduce(function (acc, resource) {
    acc[resource._id] = resource.resourcePath;
    return acc;
  }, {});

  const columns = useMemo(
    () => [
      { title: 'AppSysRole', field: 'appSysRoleId', lookup: lookupSysRoles },
      {
        title: 'Resource',
        field: 'resourceId',
        render: ({ resourceId }) => (
          <>
            {resourceId &&
              resourceId.map((e, i) => {
                let data;
                if (lookupResources[e]) {
                  data = lookupResources[e].split('/')[2];
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
    ],
    [lookupSysRoles, lookupResources],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appRoleResource =>
        new Promise((resolve, reject) => {
          dispatch(createAppRoleResourceRequest(appRoleResource, resolve, reject));
        }),
      onRowUpdate: appRoleResource =>
        new Promise((resolve, reject) => {
          dispatch(updateAppRoleResourceRequest(appRoleResource, resolve, reject));
        }),
      onRowDelete: appRoleResource =>
        new Promise((resolve, reject) => {
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

  useEffect(()=>{setRowNum(appRoleResources.length), [appRoleResources]})

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
