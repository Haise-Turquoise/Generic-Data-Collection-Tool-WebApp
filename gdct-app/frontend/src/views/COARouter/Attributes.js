import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';
import {
  getColumnNamesRequest,
  createColumnNameRequest,
  deleteColumnNameRequest,
  updateColumnNameRequest,
} from '../../store/thunks/columnName';

import { selectFactoryRESTResponseTableValues, selectFactoryRESTError } from '../../store/common/REST/selectors';
import { selectColumnNamesStore } from '../../store/ColumnNamesStore/selectors';
import { ColumnNamesActions } from '../../store/ColumnNamesStore/store';
import { calculateOptions } from '../../tools/misc'

const ColumnNameHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Attribute Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AlertSign = () => {
  let [showingAlert, setShowingAlert] = useState(false);

  const { errors } = useSelector(
    state => ({
      errors: selectFactoryRESTError(selectColumnNamesStore)(state)
    }),
    shallowEqual,
  );

  
  useEffect(() => {
    if (errors){
      setShowingAlert(true);
    }
  }, [errors]);

  useEffect(() => {
    if (showingAlert){
      setTimeout(()=>{
        setShowingAlert(false)
      }, 5000)
    }
  }, [showingAlert]);

  return (
    <Collapse in={showingAlert}>
    <Alert
      severity="error"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setShowingAlert(false);
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      This Attribute is referenced, can't be removed
    </Alert>
  </Collapse>
  );
};

const ColumnNamesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  const { columnNames } = useSelector(
    state => ({
      columnNames: selectFactoryRESTResponseTableValues(selectColumnNamesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'id', field: 'id' },
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );
  

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: columnName =>
        new Promise((resolve, reject) => {
          dispatch(createColumnNameRequest(columnName, resolve, reject));
        }),
      onRowUpdate: columnName =>
        new Promise((resolve, reject) => {
          dispatch(updateColumnNameRequest(columnName, resolve, reject));
        }),
      onRowDelete: columnName =>
        new Promise((resolve, reject) => {
          dispatch(deleteColumnNameRequest(columnName._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  
  const style = useMemo(
    () => ({
      "margin-top": "10px",
    }),
    []
  )
  
  useEffect(()=>{setRowNum(columnNames.length)}, [columnNames]);

  useEffect(() => {
    dispatch(getColumnNamesRequest());

    return () => {
      dispatch(ColumnNamesActions.RESET());
    };
  }, [dispatch]);

  return (
    <MaterialTable key={readRowNum} style={style} columns={columns} data={columnNames} editable={editable} options={options} />
  );
};

const ColumnName = props => (
  <div className="columnNamesPage">
    <ColumnNameHeader />
    <AlertSign />
    <ColumnNamesTable {...props} />
  </div>
);

export default ColumnName;
