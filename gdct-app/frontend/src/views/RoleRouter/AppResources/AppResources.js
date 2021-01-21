import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getAppResourcesRequest,
  createAppResourceRequest,
  deleteAppResourceRequest,
  updateAppResourceRequest,
} from '../../../store/thunks/AppResource';

import './AppResources.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';
import { calculateOptions } from '../../../tools/misc'

const AppResourcesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">AppResources</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppResourcesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  const { appResources } = useSelector(
    state => ({
      appResources: selectFactoryRESTResponseTableValues(selectAppResourcesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Resource Name', field: 'resourceName' },
      { title: 'Resource Path', field: 'resourcePath' },
      { title: 'Protection', field: 'isProtected' },
    ],
    [],
  );

  const options = useMemo(() => (calculateOptions(readRowNum)), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appResource =>
        new Promise((resolve, reject) => {
          dispatch(createAppResourceRequest(appResource, resolve, reject));
        }),
      onRowUpdate: appResource =>
        new Promise((resolve, reject) => {
          dispatch(updateAppResourceRequest(appResource, resolve, reject));
        }),
      onRowDelete: appResource =>
        new Promise((resolve, reject) => {
          dispatch(deleteAppResourceRequest(appResource._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppResourcesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(appResources.length)}, [appResources]);

  return (
    <MaterialTable key={readRowNum} columns={columns} data={appResources} editable={editable} options={options} />
  );
};

const AppResources = props => {
  console.log('why not: ', props);
  return (
    <div className="AppResources">
      <AppResourcesHeader />
      {/* <FileDropzone/> */}
      <AppResourcesTable {...props} />
    </div>
  );
};

export default AppResources;
