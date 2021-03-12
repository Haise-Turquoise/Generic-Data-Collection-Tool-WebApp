import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import moment from 'moment';

import {
  getAppConfigsRequest,
  createAppConfigRequest,
  deleteAppConfigRequest,
  updateAppConfigRequest,
} from '../../store/thunks/AppConfig';

import { getAppSysesRequest } from '../../store/thunks/AppSys';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectAppConfigsStore } from '../../store/AppConfigsStore/selectors';
import { selectAppSysesStore } from '../../store/AppSysesStore/selectors';

import AppConfigController from '../../controllers/AppConfig';
import CreateAuditLog from '../AuditLog_Global';

const AppConfigsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Configuration</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppConfigsTable = () => {
  const dispatch = useDispatch();

  // Prepare the data for the material table
  const { appConfigs, appSyses } = useSelector(
    state => ({
      appConfigs: selectFactoryRESTResponseTableValues(selectAppConfigsStore)(state),
      appSyses: selectFactoryRESTResponseTableValues(selectAppSysesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  appConfigs.forEach(appConfig => {
    const logtime = new Date(appConfig.timestamp);
    appConfig.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  // Assign code as name
  const lookupSysRoles = appSyses.reduce(function (acc, appSys) {
    acc[appSys.code] = appSys.name;
    return acc;
  }, {});

  // Prepare the columns for the material table
  const columns = useMemo(
    () => [
      { title: 'Key', field: 'key' },
      { title: 'Value', field: 'value' },
      { title: 'System', field: 'appSys', lookup: lookupSysRoles },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [lookupSysRoles],
  );

  // Prepare the options
  const options = useMemo(
    () => (
      {
        actionsColumnIndex: -1,
        search: true,
        showTitle: false,
        addRowPosition: "first",
      }
    ), 
    []
  );

  // Record who and when of the action
  function recordUpdate(appConfig) {
    //get username and record in Modified By column
    appConfig.updatedBy = localStorage.getItem('currentUser');
    //record new date and time in Modified On column 
    appConfig.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: appConfig =>
        new Promise((resolve, reject) => {
          recordUpdate(appConfig);
          dispatch(createAppConfigRequest(appConfig, resolve, reject));
        }).then(newAppConfig => {
          // For Auditlog
          CreateAuditLog(null, "Add Application Configuration", "AppConfig", newAppConfig._id, {}, newAppConfig);
        }),

      onRowUpdate: appConfig =>
        new Promise((resolve, reject) => {
          recordUpdate(appConfig);
          // Find the old value before updating for Auditlog
          (async () => {
            const oldAppConfig = await AppConfigController.fetchAppConfig(appConfig._id);
            CreateAuditLog(null, "Update Application System", "AppSys", appConfig._id, oldAppConfig, appConfig);
          })();
          // Do Update
          dispatch(updateAppConfigRequest(appConfig, resolve, reject));
        }),
        
      onRowDelete: appConfig =>
        new Promise((resolve, reject) => {
          recordUpdate(appConfig);
          dispatch(deleteAppConfigRequest(appConfig._id, resolve, reject));
          // For Auditlog
          const appConfig_trim = (({ tableData, ...o }) => o)(appConfig);
          CreateAuditLog(null, "Delete Application Configuration", "AppConfig", appConfig._id, appConfig_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppSysesRequest());
    dispatch(getAppConfigsRequest());
  }, [dispatch]);

  return (
    <MaterialTable
      columns={columns}
      data={appConfigs}
      editable={editable}
      // @ts-ignore
      options={options}
    />
  );
};

const AppConfigs = props => (
  <div className="AppConfigs">
    <AppConfigsHeader />
    {/* <FileDropzone/> */}
    <AppConfigsTable {...props} />
  </div>
);

export default AppConfigs;
