import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';

import {
  getAppSysesRequest,
  createAppSysRequest,
  deleteAppSysRequest,
  updateAppSysRequest,
//@ts-ignore
} from '../../../store/thunks/AppSys';

//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectAppSysesStore } from '../../../store/AppSysesStore/selectors';
//@ts-ignore
import { calculateOptions } from '../../../tools/misc'

//@ts-ignore
import AppSysController from '../../../controllers/AppSys'
//@ts-ignore
import CreateAuditLog from '../../AuditLog_Global'

import AppSys from '../../../types/appsys';
interface AppSysMT extends AppSys {
  tableData?: any,
}

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
  const [hasAppSys, setHasAppSys] = useState(false)

  // table stuff while loading
  const preColumns: Column<AppSysMT>[] = [{title: 'Name', field: 'name'}]
  const preAppSys: AppSysMT[] = [{
    name: 'LOADING...',
    _id: '',
    code: '',
    isActive: false,
    timestamp: '',
  }]
  
  const { appSyses }: { appSyses: AppSys[] } = useSelector(
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

  const columns: Column<AppSysMT>[] = useMemo(
    () => [
      { title: 'Code', field: 'code' },
      { title: 'Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [],
  );
  
  const options: Options<AppSysMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record who and when of the action
  function recordUpdate(appSys: AppSysMT) {
    //get username and record in Modified By column
    appSys.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column 
    appSys.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (appSys: AppSys) => 
        new Promise((resolve, reject) => {
          recordUpdate(appSys);
          dispatch(createAppSysRequest(appSys, resolve, reject));
        }).then(newAppSys => {
          // For Auditlog
          if (newAppSys) {
            CreateAuditLog(
              null,
              "Add Application System",
              "AppSys",
              (newAppSys as AppSys)._id,
              {},
              newAppSys
            );
          }
        }),

      onRowUpdate: (appSys: AppSysMT) => 
        new Promise((resolve, reject) => {
          recordUpdate(appSys); 
          // Find the old value before updating for Auditlog
          (async () => {
            const oldAppSys = await AppSysController.fetchAppSys(appSys._id);
            CreateAuditLog(null, "Update Application System", "AppSys", appSys._id, oldAppSys, appSys);
          })();
          // Do Update
          dispatch(updateAppSysRequest(appSys, resolve, reject));
        }),
        
      onRowDelete: (appSys: AppSysMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appSys);
          dispatch(deleteAppSysRequest(appSys._id, resolve, reject));
          // onRowDelete will add a "tableData" attribute in the Object, which we don't need for Auditlog
          const appSys_trim = (({ tableData, ...o }) => o)(appSys)
          CreateAuditLog(null, "Delete Application System", "AppSys", appSys._id, appSys_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getAppSysesRequest());
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(appSyses.length)
    if (!hasAppSys) {
      setHasAppSys(appSyses.length >= 1)
    }
  }, [appSyses])

  return (
    <MaterialTable
      key={readRowNum}
      columns={hasAppSys ? columns : preColumns}
      data={hasAppSys ? appSyses : preAppSys}
      editable={hasAppSys ? editable : undefined}
      options={options} 
    />
  );
};

// any type since props unused
const AppSyses = (props: any) => (
  <div className="AppSyses">
    <AppSysesHeader />
    {/* <FileDropzone/> */}
    <AppSysesTable {...props} />
  </div>
);

export default AppSyses;
