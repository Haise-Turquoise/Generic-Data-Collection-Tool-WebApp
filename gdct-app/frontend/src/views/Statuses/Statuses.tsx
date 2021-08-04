import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import moment from 'moment';

import {
  getStatusesRequest,
  createStatusRequest,
  deleteStatusRequest,
  updateStatusRequest,
  //@ts-ignore
} from '../../store/thunks/status';

//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectStatusesStore } from '../../store/StatusesStore/selectors';

import {
  calculateOptions,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  //@ts-ignore
} from '../../tools/misc';

//@ts-ignore
import statusController from '../../controllers/status';
//@ts-ignore
import CreateAuditLog from '../AuditLog_Global';

import Status from '../../types/status';

interface StatusMT extends Status {
  tableData?: any;
}

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
  const [statuses, setStatuses] = useState<Status[] | undefined>(undefined)

  useEffect(() => {
    statusController.fetch().then((res: unknown) => {
      setStatuses(res as Status[])
    })
  }, [])

  const preColumns: Column<StatusMT>[] = [{ title: 'Name', field: 'name' }]
  const preStatuses: StatusMT[] = [{
    name: 'LOADING...',
    _id: '',
    description: '',
    isActive: true,
    updatedAt: '',
    forPackage: true,
    timestamp: '',
    updatedBy: '',
  }]
  
  // Convert Date format
  statuses?.forEach((status: Status) => {
    status.timestamp = formatTimestamp(status.timestamp);
  });

  // Prepare the columns for material table
  const columns: Column<StatusMT>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      { title: 'For Package', type: 'boolean', field: 'forPackage' },
      {
        title: 'Modified On',
        field: 'timestamp',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [],
  );

  const options: Options<StatusMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record who and when of the action
  function recordUpdate(status: StatusMT) {
    //get username and record in Modified By column
    status.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column
    status.timestamp = new Date().toLocaleString();
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (status: StatusMT) =>
        new Promise<Status | undefined>((resolve, reject) => {
          recordUpdate(status);
          controllerAddRow(statusController, setStatuses, status)
            .then((res?: Status) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newStatus => {
          // For Auditlog
          if (newStatus) {
            CreateAuditLog(null, "Add Status", "Status", newStatus._id, {}, newStatus);
          }
        }),

      onRowUpdate: (status: StatusMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(status);
          // Find the old value before updating for Auditlog
          (async () => {
            const oldStatus = await statusController.fetchStatus(status._id);
            CreateAuditLog(null, 'Update Status', 'Status', oldStatus?._id, oldStatus, status);
          })();
          // Do Update
          controllerEditRow(statusController, setStatuses, status)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),

      onRowDelete: (status: StatusMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(status);
          // For Auditlog
          const status_trim = (({ tableData, ...o }) => o)(status);
          CreateAuditLog(null, "Delete Status", "Status", status._id, status_trim, {});
          controllerDeleteRow(statusController, setStatuses, status._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
    }),
    [],
  );

  useEffect(()=>{
    setRowNum(statuses?.length || 1)
  }, [statuses]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!statuses ? columns : preColumns}
      data={!!statuses ? statuses : preStatuses}
      editable={!!statuses ? editable : undefined}
      options={options}
    />
  );
};

// any is fine since no props required
const Status = (props: any) => (
  <div className="statusesPage">
    <StatusHeader />
    <StatusesTable {...props} />
  </div>
);

export default Status;
