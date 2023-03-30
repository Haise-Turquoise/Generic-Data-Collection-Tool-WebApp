import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import {
  calculateOptions,
  checkDuplicates,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  fetchWithStatus,
} from '../../../tools/misc'
import CreateAuditLog from '../../AuditLog_Global';
import AppResourceController from '../../../controllers/AppResource';
import AppResource from '../../../types/appresource'

interface AppResourceMT extends AppResource {
  tableData?: any,
}

const AppResourcesHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Application Resource</Typography>
    </div>
  );
};

const AppResourcesTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [appResources, setAppResources] = useState<AppResource[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<AppResource>(AppResourceController, setAppResources, setStatus)
  }, [])

  // table stuff while loading
  const preColumns: Column<AppResourceMT>[] = [{title: 'Name', field: 'resourceName'}]
  const preAppResources: AppResourceMT[] = [{
    _id: '',
    id: 0,
    isProtected: '',
    resourceName: status,
    resourcePath: '',
    updatedAt: '',
    updatedBy: '',
  }]
  // Convert Date format
  appResources?.forEach(appResource => {
    appResource.updatedAt = formatTimestamp(appResource.updatedAt);
  });

  // Prepare the columns for material table
  const columns: Column<AppResourceMT>[] = useMemo(
    () => [
      {
        title: 'ID',
        field: 'id',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Resource Name',
        field: 'resourceName',
        validate: rowData => checkDuplicates(rowData, appResources, 'resourceName'),
      },
      {
        title: 'Resource Path',
        field: 'resourcePath',
        validate: rowData => checkDuplicates(rowData, appResources, 'resourcePath'),
      },
      { title: 'Protection', field: 'isProtected', lookup: {'FALSE': 'FALSE', 'TRUE': 'TRUE'} },
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
    ],
    [appResources],
  );

  const options: Options<AppResourceMT> = useMemo(() => ({...calculateOptions(readRowNum), filtering: true}), [readRowNum]);


  // Record who and when action took place
  const recordUpdate = (appResource: AppResourceMT) => {
    // get email and record in Modified By columns
    appResource.updatedBy = localStorage.getItem('currentUser') || '';
    // record new date and time in Modified On column 
    appResource.updatedAt = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: (appResource: AppResourceMT) =>
        new Promise<AppResource>((resolve, reject) => {
          appResource.id = readRowNum + 1
          recordUpdate(appResource);
          controllerAddRow(AppResourceController, setAppResources, appResource)
            .then((res: AppResource) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newAppResource => {
          // For Auditlog
          if (newAppResource) {
            CreateAuditLog(
              null,
              "Create Application Resource",
              "AppResource",
              newAppResource._id,
              {},
              newAppResource
            );
          }
        }),

      onRowUpdate: (appResource: AppResourceMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appResource);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldAppResource = await AppResourceController.fetchAppResource(appResource._id);
            CreateAuditLog(
              null,
              'Update Application Resource',
              'AppResource',
              oldAppResource?._id,
              oldAppResource,
              appResource,
            );
          })();
          // Do Update
          controllerEditRow(AppResourceController, setAppResources, appResource)
            .then((res: boolean) => {
              if (res) {
                resolve(appResource)
              }
              reject()
            })
        }),

      onRowDelete: (appResource: AppResourceMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appResource);
          // For Auditlog
          const appResource_trim = (({ tableData, ...o }) => o)(appResource);
          CreateAuditLog(null, "Delete Application Resource", "AppResource", appResource._id, appResource_trim, {});
          controllerDeleteRow(AppResourceController, setAppResources, appResource._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
    }),
    [readRowNum],
  );

  useEffect(()=>{
    setRowNum(appResources?.length || 1)
  }, [appResources]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!appResources ? columns : preColumns}
      data={!!appResources ? appResources : preAppResources}
      editable={!!appResources ? editable : undefined}
      options={options}
    />
  );
};

// any type since props unused
const AppResources = (props: any) => {
  return (
    <div className="AppResources">
      <AppResourcesHeader />
      {/* <FileDropzone/> */}
      <AppResourcesTable {...props} />
    </div>
  );
};

export default AppResources;
