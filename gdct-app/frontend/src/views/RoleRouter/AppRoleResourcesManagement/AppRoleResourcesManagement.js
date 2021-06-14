import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import MaterialTable from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import { getAppSysRolesRequest } from '../../../store/thunks/AppSysRole';
import { getAppResourcesRequest } from '../../../store/thunks/AppResource';
import {
    getAppRoleResourcesRequest,
    createAppRoleResourceRequest,
    deleteAppRoleResourceRequest,
    updateAppRoleResourceRequest,
  } from '../../../store/thunks/AppRoleResource';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppRoleResourcesStore } from '../../../store/AppRoleResourcesStore/selectors';
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';
import {AppRoleResourcesStore} from '../../../store/AppRoleResourcesStore/store';
import {AppSysRolesStore} from '../../../store/AppSysRolesStore/store';
import {AppResourcesStore} from '../../../store/AppResourcesStore/store';
import AppRoleResourceController from '../../../controllers/AppRoleResource'
import ErrorBanner from '../../ErrorBanner';
import { calculateOptions } from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';


const AppRoleResourceHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">App Role Resources Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// Prepare the data for material table
const AppRoleResourceTable = ({ history }) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasAppRoleRes, setHasAppRoleRes] = useState(false)
  // get app role resource info
  const { appRoleResources, appSysRoles, appResources } = useSelector(
    state => ({
      appRoleResources: selectFactoryRESTResponseTableValues(selectAppRoleResourcesStore)(state),
      appResources: selectFactoryRESTResponseTableValues(selectAppResourcesStore)(state),
      appSysRoles: selectFactoryRESTResponseTableValues(selectAppSysRolesStore)(state),
    }),
    shallowEqual,
  );

  // table stuff while loading
  const preAppRoleResources = [{ name: 'LOADING...' }]
  const preColumns = [{title: 'Name', field: 'name'}]

  useEffect(()=>{
    setRowNum(appRoleResources.length)
    setHasAppRoleRes(appRoleResources.length >= 1)
  }, [appRoleResources])
  // Convert Date format
  appRoleResources.forEach(appRoleResource => {
    const logtime = new Date(appRoleResource.timestamp);
    appRoleResource.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  //convert appSysRoleId from object to objectId if necessary
  appRoleResources.forEach(appRoleResource => {
    if(appRoleResource.appSysRoleId.roleId){
      appRoleResource.appSysRoleId = appRoleResource.appSysRoleId.roleId
    }
    
  })
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
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
      // {title: 'IsActive', field: 'isActive'}
    ],
    [lookupSysRoles, lookupResources],
  );
  // Prepare the actions for the material table
  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Manage App Role Resource',
        onClick: (_event, appRoleResource) => {
          
          history.push(`/admin/role/app_role_resource_management/${appRoleResource._id}`);
        },
      },
    ],
    [history],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(appRoleResource) {
    appRoleResource.updatedBy = localStorage.getItem('currentUser');
    appRoleResource.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
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
        // console.log(appRoleResource)
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
    return () => {

      dispatch(AppResourcesStore.actions.RESET());
      dispatch(AppRoleResourcesStore.actions.RESET());
      dispatch(AppSysRolesStore.actions.RESET());
    };
  }, [dispatch]);

  return (
    // @ts-ignore
    <MaterialTable
      key={readRowNum}
      columns={hasAppRoleRes ? columns : preColumns}
      actions={actions}
      data={hasAppRoleRes ? appRoleResources : preAppRoleResources}
      editable={hasAppRoleRes ? editable : undefined}
      options={options} />
  );
};

const AppRoleResourcesManagement = props => (
  <div className="appRoleResourcePage">
    <AppRoleResourceHeader />
    <ErrorBanner title={"The AppRoleResource type you are trying to delete is referenced in one or more appSysRole"} targetStore={selectAppRoleResourcesStore }/>
    <AppRoleResourceTable {...props} />
  </div>
);

export default AppRoleResourcesManagement;