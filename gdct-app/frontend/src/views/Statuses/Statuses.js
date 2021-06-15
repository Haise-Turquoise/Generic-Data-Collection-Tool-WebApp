import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import moment from 'moment';

import {
  getStatusesRequest,
  createStatusRequest,
  deleteStatusRequest,
  updateStatusRequest,
} from '../../store/thunks/status';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectStatusesStore } from '../../store/StatusesStore/selectors';

import {calculateOptions} from '../../tools/misc';

import statusController from '../../controllers/status';
import CreateAuditLog from '../AuditLog_Global';

const StatusHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Status</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const StatusesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasStatuses, setHasStatuses] = useState(false)

  const preColumns = [{ title: 'Name', field: 'name' }]
  const preStatuses = [{ name: 'LOADING...' }]
  
  // Prepare the data for the material table
  const { statuses } = useSelector(
    state => ({
      statuses: selectFactoryRESTResponseTableValues(selectStatusesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  statuses.forEach(status => {
    const logtime = new Date(status.timestamp);
    status.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      { title: 'For Package', type: 'boolean', field: 'forPackage' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record who and when of the action
  function recordUpdate(status) {
    //get username and record in Modified By column
    status.updatedBy = localStorage.getItem('currentUser');
    //record new date and time in Modified On column 
    status.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: status =>
        new Promise((resolve, reject) => {
          recordUpdate(status);
          dispatch(createStatusRequest(status, resolve, reject));
        }).then(newStatus => {
          // For Auditlog
          CreateAuditLog(null, "Add Status", "Status", newStatus._id, {}, newStatus);
        }),
      
      onRowUpdate: status =>
        new Promise((resolve, reject) => {
          recordUpdate(status);
          // Find the old value before updating for Auditlog
          (async () => {
            const oldStatus = await statusController.fetchStatus(status._id);
            CreateAuditLog(null, "Update Status", "Status", oldStatus._id, oldStatus, status);
          })();
          // Do Update
          dispatch(updateStatusRequest(status, resolve, reject));
        }),
      
      onRowDelete: status =>
        new Promise((resolve, reject) => {
          recordUpdate(status);
          dispatch(deleteStatusRequest(status._id, resolve, reject));
          // For Auditlog
          const status_trim = (({ tableData, ...o }) => o)(status);
          CreateAuditLog(null, "Delete Status", "Status", status._id, status_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getStatusesRequest());
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(statuses.length)
    if (!hasStatuses) {
      setHasStatuses(statuses.length >= 1)
    }
  }, [statuses]);

  // @ts-ignore
  return <MaterialTable key={readRowNum} columns={columns} data={statuses} editable={editable} options={options} />;
};

const Status = props => (
  <div className="statusesPage">
    <StatusHeader />
    <StatusesTable {...props} />
  </div>
);

export default Status;
