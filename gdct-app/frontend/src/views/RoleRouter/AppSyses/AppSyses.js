import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getAppSysesRequest,
  createAppSysRequest,
  deleteAppSysRequest,
  updateAppSysRequest,
} from '../../../store/thunks/AppSys';

import './AppSyses.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppSysesStore } from '../../../store/AppSysesStore/selectors';

const AppSysesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">AppSyses</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppSysesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const { appSyses } = useSelector(
    state => ({
      appSyses: selectFactoryRESTResponseTableValues(selectAppSysesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Code', field: 'code' },
      { title: 'Name', field: 'name' },
    ],
    [],
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
  
  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appSys =>
        new Promise((resolve, reject) => {
          dispatch(createAppSysRequest(appSys, resolve, reject));
        }),
      onRowUpdate: appSys =>
        new Promise((resolve, reject) => {
          dispatch(updateAppSysRequest(appSys, resolve, reject));
        }),
      onRowDelete: appSys =>
        new Promise((resolve, reject) => {
          dispatch(deleteAppSysRequest(appSys._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppSysesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(appSyses.length)}, [appSyses])

  return <MaterialTable key={readRowNum} columns={columns} data={appSyses} editable={editable} options={options} />;
};

const AppSyses = props => (
  <div className="AppSyses">
    <AppSysesHeader />
    {/* <FileDropzone/> */}
    <AppSysesTable {...props} />
  </div>
);

export default AppSyses;
