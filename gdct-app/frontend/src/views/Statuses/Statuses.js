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

import {calculateOptions} from '../../tools/misc'

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
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    statuses.forEach(statuses => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(statuses.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(statuses.timestamp.toString());
       statuses.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       statuses.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

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
