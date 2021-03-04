import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';

import {
  getAppSysesRequest,
  createAppSysRequest,
  deleteAppSysRequest,
  updateAppSysRequest,
} from '../../../store/thunks/AppSys';

import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppSysesStore } from '../../../store/AppSysesStore/selectors';
import { calculateOptions } from '../../../tools/misc'
import AppSysController from '../../../controllers/AppSys'

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

  // Convert Date format
  appSyses.forEach(appSys => {
    const logtime = new Date(appSys.timestamp);
    appSys.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  const columns = useMemo(
    () => [
      { title: 'Code', field: 'code' },
      { title: 'Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [],
  );
  
  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appSys => 
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appSys.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appSys.timestamp = event.toLocaleString(); 
          dispatch(createAppSysRequest(appSys, resolve, reject));
        }).then(newAppSys => {
          CreateAuditLog(null, "Add Application System", "AppSys", newAppSys._id, {}, newAppSys);
        }),
      onRowUpdate: appSys => 
        new Promise((resolve, reject) => {
          appSys.updatedBy=localStorage.getItem('currentUser')
          const event = new Date();
          appSys.timestamp = event.toLocaleString(); 
          // Find the old value before updating
          async function findAppSysById() {
            return AppSysController.fetchAppSys(appSys._id);
          }
          (async () => {
            const oldAppSys = await findAppSysById();
            CreateAuditLog(null, "Update Application System", "AppSys", appSys._id, oldAppSys, appSys);
          })();
          dispatch(updateAppSysRequest(appSys, resolve, reject));
        }),
      onRowDelete: appSys =>
        new Promise((resolve, reject) => {
          appSys.updatedBy=localStorage.getItem('currentUser')
          const event = new Date();
          appSys.timestamp = event.toLocaleString(); 
          dispatch(deleteAppSysRequest(appSys._id, resolve, reject));
          // onRowDelete will add a "tableData" attribute in the Object, which we don't need
          const appSys_trim = (({ tableData, ...o }) => o)(appSys)
          CreateAuditLog(null, "Delete Application System", "AppSys", appSys._id, appSys_trim, {});
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
