import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography, Collapse, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';

import {
  getColumnNamesRequest,
  createColumnNameRequest,
  deleteColumnNameRequest,
  updateColumnNameRequest,
} from '../../store/thunks/columnName';

import { selectFactoryRESTResponseTableValues, selectFactoryRESTError } from '../../store/common/REST/selectors';
import { selectColumnNamesStore } from '../../store/ColumnNamesStore/selectors';
import { ColumnNamesActions } from '../../store/ColumnNamesStore/store';
import CreateAuditLog from '../AuditLog_Global';
import columnNameController from '../../controllers/columnName';
import { checkDuplicates } from '../../tools/misc'

const ColumnNameHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Attribute Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// The Alert Sign
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

// The material table
const ColumnNamesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasCols, setHasCols] = useState(false)

  // table stuff while loading
  const preCols = [{ name: 'LOADING...' }]
  const preColumns = [{title: 'Name', field: 'name'}]

  const { columnNames } = useSelector(
    state => ({
      columnNames: selectFactoryRESTResponseTableValues(selectColumnNamesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  columnNames.forEach(columnName => {
    const logtime = new Date(columnName.timestamp);
    columnName.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss");
  });

  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'ID', field: 'id', validate: rowData => checkDuplicates(rowData, columnNames, 'id') },
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [columnNames],
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

  // Record user and time when an action occurs 
  function recordUpdate(columnName) {
    columnName.updatedBy = localStorage.getItem('currentUser');
    columnName.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: columnName =>
        new Promise((resolve, reject) => {
          recordUpdate(columnName);
          dispatch(createColumnNameRequest(columnName, resolve, reject));
        }).then(newColumnName => {
          // For Auditlog
          CreateAuditLog(null, "Create Attribute", "Attribute", newColumnName._id, {}, newColumnName);
        }),

      onRowUpdate: columnName =>
        new Promise((resolve, reject) => {
          recordUpdate(columnName);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldColumnName = await columnNameController.fetchAttribute(columnName._id);
            // console.log(oldColumnName);
            CreateAuditLog(null, "Update Attribute", "Attribute", oldColumnName._id, oldColumnName, columnName);
          })();
          // Do Update
          dispatch(updateColumnNameRequest(columnName, resolve, reject));
        }),

      onRowDelete: columnName =>
        new Promise((resolve, reject) => {
          recordUpdate(columnName);
          dispatch(deleteColumnNameRequest(columnName._id, resolve, reject));
        }).then(() => {
          // For Auditlog
          (async () => { 
            const oldColumnName = await columnNameController.fetchAttribute(columnName._id);
            // Actually Deleted (Attribute might not be deleted because it is referenced in master value table)
            if (oldColumnName.length === 0) {
              CreateAuditLog(null, "Delete Attribute", "Attribute", columnName._id, columnName, {});
            }
          })();
        }),
    }),
    [dispatch],
  );

  useEffect(()=>{
    setRowNum(columnNames.length)
    if (!hasCols) {
      setHasCols(columnNames.length >= 1)
    }
  }, [columnNames]);

  useEffect(() => {
    dispatch(getColumnNamesRequest());

    return () => {
      dispatch(ColumnNamesActions.RESET());
    };
  }, [dispatch]);

  return (
    // @ts-ignore
    <MaterialTable
      key={readRowNum}
      columns={hasCols ? columns : preColumns}
      data={hasCols ? columnNames : preCols}
      editable={hasCols ? editable : undefined}
      options={options}
    />
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
