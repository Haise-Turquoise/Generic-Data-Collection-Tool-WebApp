import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';

import {
  getAppResourcesRequest,
  createAppResourceRequest,
  deleteAppResourceRequest,
  updateAppResourceRequest,
} from '../../../store/thunks/AppResource';

import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';
import { calculateOptions, checkDuplicates } from '../../../tools/misc'
import CreateAuditLog from '../../AuditLog_Global';
import AppResourceController from '../../../controllers/AppResource';

const AppResourcesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application Resource</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppResourcesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasAppRes, setHasAppRes] = useState(false)

  // table stuff while loading
  const preAppResources = [{ name: 'LOADING...' }]
  const preColumns = [{title: 'Name', field: 'name'}]
  
  // Prepare the data for material table
  const { appResources } = useSelector(
    state => ({
      appResources: selectFactoryRESTResponseTableValues(selectAppResourcesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  appResources.forEach(appResource => {
    const logtime = new Date(appResource.timestamp);
    appResource.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  
  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: "ID", field: "id", editComponent: () => {return <div></div>}},
      { title: 'Resource Name', field: 'resourceName', validate: rowData => checkDuplicates(rowData, appResources, 'resourceName') },
      { title: 'Resource Path', field: 'resourcePath', validate: rowData => checkDuplicates(rowData, appResources, 'resourcePath') },
      { title: 'Protection', field: 'isProtected' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [appResources],
  );

  const options = useMemo(() => (calculateOptions(readRowNum)), [readRowNum]);

  // Record who and when action took place
  const recordUpdate = (appResource) => {
    // get email and record in Modified By columns
    appResource.updatedBy = localStorage.getItem('currentUser');
    // record new date and time in Modified On column 
    const event = new Date();
    appResource.timestamp = event.toLocaleString();     
  }
  const editable = useMemo(
    () => ({
      onRowAdd: appResource =>
        new Promise((resolve, reject) => {
          appResource.id = readRowNum + 1
          recordUpdate(appResource);
          dispatch(createAppResourceRequest(appResource, resolve, reject));
        }).then(newAppResource => {
          // For Auditlog
          CreateAuditLog(null, "Create Application Resource", "AppResource", newAppResource._id, {}, newAppResource);
        }),

      onRowUpdate: appResource =>
        new Promise((resolve, reject) => {
          recordUpdate(appResource);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldAppResource = await AppResourceController.fetchAppResource(appResource._id);
            CreateAuditLog(null, "Update Application Resource", "AppResource", oldAppResource._id, oldAppResource, appResource);
          })();
          // Do Update
          dispatch(updateAppResourceRequest(appResource, resolve, reject));
        }),

      onRowDelete: appResource =>
        new Promise((resolve, reject) => {
          recordUpdate(appResource);
          // For Auditlog
          const appResource_trim = (({ tableData, ...o }) => o)(appResource);
          CreateAuditLog(null, "Delete Application Resource", "AppResource", appResource._id, appResource_trim, {});
          dispatch(deleteAppResourceRequest(appResource._id, resolve, reject));
        }),
    }),
    [dispatch, readRowNum],
  );

  useEffect(() => {
    dispatch(getAppResourcesRequest());
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(appResources.length)
    setHasAppRes(appResources.length >= 1)
  }, [appResources]);

  return (
    // @ts-ignore
    <MaterialTable
      key={readRowNum}
      columns={hasAppRes ? columns : preColumns}
      data={hasAppRes ? appResources : preAppResources}
      editable={hasAppRes ? editable : undefined}
      options={options}
    />
  );
};

const AppResources = props => {
  return (
    <div className="AppResources">
      <AppResourcesHeader />
      {/* <FileDropzone/> */}
      <AppResourcesTable {...props} />
    </div>
  );
};

export default AppResources;
