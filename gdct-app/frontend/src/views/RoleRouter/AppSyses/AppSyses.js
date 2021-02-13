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
import { calculateOptions } from '../../../tools/misc'

import CreateAuditLog from '../../AuditLog_Global'

const AppSysesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application System</Typography>
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
  
  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appSys =>
        new Promise((resolve, reject) => {
          dispatch(createAppSysRequest(appSys, resolve, reject));
          CreateAuditLog(null, "Add AppSys", "AppSys", null, {}, appSys);
        }),
      onRowUpdate: appSys =>
        new Promise((resolve, reject) => {
          dispatch(updateAppSysRequest(appSys, resolve, reject));
          CreateAuditLog(null, "Update AppSys", "AppSys", null, {}, appSys);
        }),
      onRowDelete: appSys =>
        new Promise((resolve, reject) => {
          dispatch(deleteAppSysRequest(appSys._id, resolve, reject));
          CreateAuditLog(null, "Delete AppSys", "AppSys", null, appSys, {});
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
