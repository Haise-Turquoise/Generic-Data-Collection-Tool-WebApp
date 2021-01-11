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
      <Typography variant="h5">Statuses</Typography>
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

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: status =>
        new Promise((resolve, reject) => {
          dispatch(createStatusRequest(status, resolve, reject));
        }),
      onRowUpdate: status =>
        new Promise((resolve, reject) => {
          dispatch(updateStatusRequest(status, resolve, reject));
        }),
      onRowDelete: status =>
        new Promise((resolve, reject) => {
          dispatch(deleteStatusRequest(status._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

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
