import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getSheetNamesRequest,
  createSheetNameRequest,
  deleteSheetNameRequest,
  updateSheetNameRequest,
} from '../../store/thunks/sheetName';

import './SheetNames.scss';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectSheetNamesStore } from '../../store/SheetNamesStore/selectors';
import { calculateOptions } from '../../tools/misc';

const SheetNameHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Sheet Names</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const SheetNamesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const { sheetNames } = useSelector(
    state => ({
      sheetNames: selectFactoryRESTResponseTableValues(selectSheetNamesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: sheetName =>
        new Promise((resolve, reject) => {
          dispatch(createSheetNameRequest(sheetName, resolve, reject));
        }),
      onRowUpdate: sheetName =>
        new Promise((resolve, reject) => {
          dispatch(updateSheetNameRequest(sheetName, resolve, reject));
        }),
      onRowDelete: sheetName =>
        new Promise((resolve, reject) => {
          dispatch(deleteSheetNameRequest(sheetName._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getSheetNamesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(sheetNames.length)}, [sheetNames])

  return (
    <MaterialTable key={readRowNum} columns={columns} data={sheetNames} editable={editable} options={options} />
  );
};

const SheetName = props => (
  <div className="sheetNames">
    <SheetNameHeader />
    <SheetNamesTable {...props} />
  </div>
);

export default SheetName;
