import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

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

  const lookupSysRoles = appSyses.reduce(function (acc, appSys) {
    acc[appSys.code] = appSys.name;
    return acc;
  }, {});

  const columns = useMemo(
    () => [
      { title: 'Key', field: 'key' },
      { title: 'Value', field: 'value' },
      { title: 'System', field: 'sys', lookup: lookupSysRoles },
    ],
    [lookupSysRoles],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: appConfig =>
        new Promise((resolve, reject) => {
          dispatch(createAppConfigRequest(appConfig, resolve, reject));
        }),
      onRowUpdate: appConfig =>
        new Promise((resolve, reject) => {
          dispatch(updateAppConfigRequest(appConfig, resolve, reject));
        }),
      onRowDelete: appConfig =>
        new Promise((resolve, reject) => {
          dispatch(deleteAppConfigRequest(appConfig._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppSysesRequest());
    dispatch(getAppConfigsRequest());
  }, [dispatch]);
 
//  Based on Appsys:  
//    return () => {
//      dispatch(WorkflowStoreActions.RESET());
//      dispatch(AppConfigsStore.actions.RESET());
//    };
//  }, [dispatch]);

  return (
    <MaterialTable 
      columns={columns}
//      actions={actions}
      data={appConfigs}
      editable={editable}
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
