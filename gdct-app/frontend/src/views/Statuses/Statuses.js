import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getStatusesRequest,
  createStatusRequest,
  deleteStatusRequest,
  updateStatusRequest,
} from '../../store/thunks/status';

import './Statuses.scss';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectStatusesStore } from '../../store/StatusesStore/selectors';

import {calculateOptions} from '../../tools/misc';
import moment from 'moment';

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
  const { statuses } = useSelector(
    state => ({
      statuses: selectFactoryRESTResponseTableValues(selectStatusesStore)(state),
    }),
    shallowEqual,
  );
  // console.log(statuses);
  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      { title: 'For Package', type: 'boolean', field: 'forPackage' },
      { title: 'Modified On', field: 'timestamp',
        editComponent: props => {return <div></div>} },
//      { title: 'Modified On', field: 'updatedDate', type: 'date',
//      initialEditValue: Date.now,},
      { title: 'Updated By', field: 'updatedBy', 
        editComponent: props => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: status =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          status.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          status.timestamp = event.toLocaleString(); 
          dispatch(createStatusRequest(status, resolve, reject));
        }),
      onRowUpdate: status =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          status.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          status.timestamp = event.toLocaleString(); 
          dispatch(updateStatusRequest(status, resolve, reject));
        }),
      onRowDelete: status =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          status.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          status.timestamp = event.toLocaleString(); 
          dispatch(deleteStatusRequest(status._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  // Convert Date format
  statuses.forEach(status => {
    const logtime = new Date(status.timestamp);
    status.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  useEffect(() => {
    dispatch(getStatusesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(statuses.length)}, [statuses]);

  return <MaterialTable key={readRowNum} columns={columns} data={statuses} editable={editable} options={options} />;
};

const Status = props => (
  <div className="statusesPage">
    <StatusHeader />
    <StatusesTable {...props} />
  </div>
);

export default Status;
