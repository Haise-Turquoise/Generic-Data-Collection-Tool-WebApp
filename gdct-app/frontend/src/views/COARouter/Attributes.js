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
import { calculateOptions } from '../../tools/misc';
import moment from 'moment';

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
      { title: 'ID', field: 'id' },
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      { title: 'Modified On', field: 'timestamp',
        editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
        editComponent: props => {return <div></div>} },
    ],
    [],
  );
  
  const options = useMemo(
    () => (
      {
        actionsColumnIndex: -1,
        search: true,
        showTitle: false,
        addRowPosition: "first",
      }
    ), 
    []
  );

  const editable = useMemo(
    () => ({
      onRowAdd: columnName =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          columnName.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          columnName.timestamp = event.toLocaleString(); 
          dispatch(createColumnNameRequest(columnName, resolve, reject));
        }),
      onRowUpdate: columnName =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          columnName.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          columnName.timestamp = event.toLocaleString(); 
          dispatch(updateColumnNameRequest(columnName, resolve, reject));
        }),
      onRowDelete: columnName =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          columnName.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          columnName.timestamp = event.toLocaleString(); 
          dispatch(deleteColumnNameRequest(columnName._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    columnNames.forEach(columnNames => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(columnNames.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const logtime = new Date(columnNames.timestamp);
       columnNames.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss");
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       columnNames.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

  useEffect(()=>{setRowNum(columnNames.length)}, [columnNames]);

  useEffect(() => {
    dispatch(getColumnNamesRequest());

    return () => {
      dispatch(ColumnNamesActions.RESET());
    };
  }, [dispatch]);

  return (
    // @ts-ignore
    <MaterialTable key={readRowNum} columns={columns} data={columnNames} editable={editable} options={options} />
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
