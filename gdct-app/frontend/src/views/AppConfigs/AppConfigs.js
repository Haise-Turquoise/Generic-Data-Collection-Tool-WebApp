import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import {
  getAppConfigsRequest,
  createAppConfigRequest,
  deleteAppConfigRequest,
  updateAppConfigRequest,
} from '../../store/thunks/AppConfig';

import { getAppSysesRequest } from '../../store/thunks/AppSys';

import './AppConfigs.scss';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectAppConfigsStore } from '../../store/AppConfigsStore/selectors';
import { selectAppSysesStore } from '../../store/AppSysesStore/selectors';

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

  const lookupSysRoles = appSyses.reduce(function (acc, appSys) {
    acc[appSys.code] = appSys.name;
    return acc;
  }, {});

  const columns = useMemo(
    () => [
      { title: 'Key', field: 'key' },
      { title: 'Value', field: 'value' },
      { title: 'System', field: 'appSys', lookup: lookupSysRoles },
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [lookupSysRoles],
  );

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

  const editable = useMemo(
    () => ({
      onRowAdd: appConfig =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appConfig.updatedBy=localStorage.getItem('currentUser')
         //record new date and time in Modified On column 
         const event = new Date();
         appConfig.timestamp = event.toLocaleString(); 
          dispatch(createAppConfigRequest(appConfig, resolve, reject));
        }),
      onRowUpdate: appConfig =>
        new Promise((resolve, reject) => {
          appConfig.updatedBy=localStorage.getItem('currentUser')
         const event = new Date();
         appConfig.timestamp = event.toLocaleString(); 
          dispatch(updateAppConfigRequest(appConfig, resolve, reject));
        }),
      onRowDelete: appConfig =>
        new Promise((resolve, reject) => {
          appConfig.updatedBy=localStorage.getItem('currentUser')
         const event = new Date();
         appConfig.timestamp = event.toLocaleString(); 
          dispatch(deleteAppConfigRequest(appConfig._id, resolve, reject));
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
      //      actions={actions}
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
