import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getAppConfigsRequest,
  createAppConfigsRequest,
  deleteAppConfigsRequest,
  updateAppConfigsRequest,
} from '../../store/thunks/AppConfig';

import './AppConfigs.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppConfigsStore } from '../../store/AppConfigsStore/selectors';

const AppConfigsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">AppConfigs</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppConfigsTable = () => {
  const dispatch = useDispatch();
  const { appConfigs } = useSelector(
    state => ({
      appConfigs: selectFactoryRESTResponseTableValues(selectAppConfigsStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Key', field: 'key' },
      { title: 'Value', field: 'value' },
    ],
    [],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: appConfig =>
        new Promise((resolve, reject) => {
          dispatch(createAppSysRequest(appConfig, resolve, reject));
        }),
      onRowUpdate: appConfig =>
        new Promise((resolve, reject) => {
          dispatch(updateAppSysRequest(appConfig, resolve, reject));
        }),
      onRowDelete: appConfig =>
        new Promise((resolve, reject) => {
          dispatch(deleteAppSysRequest(appConfig._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppConfigsRequest());
  }, [dispatch]);

  return <MaterialTable columns={columns} data={appConfigs} editable={editable} options={options} />;
};

const AppConfigs = props => (
  <div className="AppConfigs">
    <AppConfigsHeader />
    {/* <FileDropzone/> */}
    <AppConfigsTable {...props} />
  </div>
);

export default AppConfigs;
