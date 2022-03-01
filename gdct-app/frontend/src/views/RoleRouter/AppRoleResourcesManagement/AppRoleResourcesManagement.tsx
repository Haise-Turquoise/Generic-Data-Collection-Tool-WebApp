import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import { selectAppRoleResourcesStore } from '../../../store/AppRoleResourcesStore/selectors';
import AppRoleResourceController from '../../../controllers/AppRoleResource'
import AppSysRoleController from '../../../controllers/AppSysRole'
import AppResourceController from '../../../controllers/AppResource'
import ErrorBanner from '../../ErrorBanner';
import {
  calculateOptions,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  fetchWithStatus,
  checkDuplicates,
} from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import { RouteComponentProps } from 'react-router';

import AppResource from '../../../types/appresource';
import AppRoleResource from '../../../types/approleresource';
import AppSysRole from '../../../types/appsysrole';
import SysRole from '../../../types/sysrole';
import AppRole from '../../../types/approle';
import { any } from 'prop-types';

interface AppRoleResourceMT extends AppRoleResource {
  tableData?: any,
}

// add an interface for modified Date
interface AppRolePlus extends AppRole {
  modifiedOn: string,
  updatedBy: string,
}

const AppRoleResourceHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">App Role Resources Management</Typography>
    </Paper>
  );
};

// Prepare the data for material table
const AppRoleResourceTable = ({ history }: RouteComponentProps) => {
  const [readRowNum, setRowNum] = useState(1);
  const [appRoleResources, setAppRoleResources] =
    useState<AppRoleResource[] | undefined>(undefined)
  const [appSysRoles, setAppSysRoles] =
    useState<AppSysRole[] | undefined>(undefined)
  const [appResources, setAppResources] =
    useState<AppResource[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
 
  useEffect(() => {
    fetchWithStatus<AppRoleResource>(AppRoleResourceController, setAppRoleResources, setStatus)
    AppSysRoleController.fetch().then((res: unknown) => {
      setAppSysRoles(res as AppSysRole[])
    })
    AppResourceController.fetch().then((res: unknown) => {
      setAppResources(res as AppResource[])
    })
  }, [])

  // table stuff while loading
  const preColumns: Column<AppRoleResourceMT>[] = [{title: 'Name', field: 'updatedBy'}]
  const preAppRoleResources: AppRoleResourceMT[] = [{
    _id: '',
    appSysRoleId: { roleId: '', roleName: '' },
    resourceId: [],
    updatedAt: '',
    updatedBy: status,
  }]

  appRoleResources?.forEach(appRoleResource => {
    appRoleResource.updatedAt = formatTimestamp(appRoleResource.updatedAt);
  });

  useEffect(()=>{
    setRowNum(appRoleResources?.length || 1)
  }, [appRoleResources])

  //convert appSysRoleId from object to objectId if necessary
  appRoleResources?.forEach(appRoleResource => {   
    if(typeof appRoleResource.appSysRoleId !== 'string'){
      appRoleResource.appSysRoleId = appRoleResource.appSysRoleId.roleId
    }    
  })
  const lookupSysRoles = appSysRoles?.reduce(function (acc: {[key: string]: string}, sysRole: SysRole) {
    acc[sysRole._id!] = `${sysRole.appSys} - ${sysRole.role}`;
    return acc;
  }, {});

  const lookupResources = appResources?.reduce(function (acc: {[key:string]: string}, resource: AppResource) {
    acc[resource._id] = resource.resourcePath;
    return acc;
  }, {});
  
  // Prepare the columns for material table
  const columns: Column<AppRoleResourceMT>[] = useMemo(
    () => [
      { title: 'Application System Role', field: 'appSysRoleId', lookup: lookupSysRoles, validate: rowData => checkDuplicates(rowData, appRoleResources, 'appSysRoleId') },
      {
        title: 'Modified On',
        field: 'updatedAt',
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
      // {title: 'IsActive', field: 'isActive'}
    ],
    [lookupSysRoles, lookupResources, appRoleResources],
  );
  // Prepare the actions for the material table
  const actions: Action<AppRoleResourceMT>[] = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Manage App Role Resource',
        onClick: (_: any, appRoleResource: AppRoleResourceMT | AppRoleResourceMT[]) => {
          if (!Array.isArray(appRoleResource)) {
            history.push(`/admin/role/app_role_resource_management/${appRoleResource._id}`);
          }
        },
      },
    ],
    [history],
  );

  const options: Options<AppRoleResourceMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(appRoleResource: AppRoleResourceMT) {
    appRoleResource.updatedBy = localStorage.getItem('currentUser') || '';
    appRoleResource.updatedAt = new Date().toLocaleString(); 
    console.log(appRoleResource);
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (appRoleResource: AppRoleResourceMT) =>
        new Promise<AppRoleResource | undefined>((resolve, reject) => {
          recordUpdate(appRoleResource);
          controllerAddRow(AppRoleResourceController, setAppRoleResources, appRoleResource)
            .then((res: AppRoleResource) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newAppRoleResource => {
          // For Auditlog
          if (newAppRoleResource) {
            CreateAuditLog(
              null,
              "Create Application Role Resource",
              "AppRoleResource",
              newAppRoleResource._id,
              {},
              newAppRoleResource
            );
          }
        }),
      onRowUpdate: (appRoleResource: AppRoleResourceMT) =>
      new Promise((resolve, reject) => {
        recordUpdate(appRoleResource);
        // Find the old value before updating in order to Auditlog
        (async () => { 
          const oldAppRoleResource = await AppRoleResourceController.fetchAppRoleResource(appRoleResource._id);
          CreateAuditLog(null, "Update Application Role Resource", "AppRoleResource", oldAppRoleResource?._id, oldAppRoleResource, appRoleResource);
        })();
        // Do Update
        controllerEditRow(AppRoleResourceController, setAppRoleResources, appRoleResource)
        
          .then((res: boolean) => {
            if (res) {
              resolve(res)
            }
            reject()
          })
      }),
      onRowDelete: (appRoleResource: AppRoleResourceMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appRoleResource);
          // For Auditlog
          const appRoleResource_trim = (({ tableData, ...o }) => o)(appRoleResource);
          CreateAuditLog(null, "Delete Application Role Resource", "AppRoleResource", appRoleResource._id, appRoleResource_trim, {});
          controllerDeleteRow(AppRoleResourceController, setAppRoleResources, appRoleResource._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
    }),
    [],
  );


  return (
    <MaterialTable
      key={readRowNum}
      columns={!!appRoleResources ? columns : preColumns}
      actions={!!appRoleResources ? actions : undefined}
      data={!!appRoleResources ? appRoleResources : preAppRoleResources}
      editable={!!appRoleResources ? editable : undefined}
      options={options} />
  );
};

const AppRoleResourcesManagement = (props: RouteComponentProps) => (
  <div className="appRoleResourcePage">
    <AppRoleResourceHeader />
    <ErrorBanner
      title={
        'The AppRoleResource type you are trying to delete is referenced in one or more appSysRole'
      }
      targetStore={selectAppRoleResourcesStore}
    />
    <AppRoleResourceTable {...props} />
  </div>
);

export default AppRoleResourcesManagement;
