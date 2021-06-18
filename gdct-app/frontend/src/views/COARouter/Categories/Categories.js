import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography, Collapse, IconButton }  from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';

import {
  getCOAsRequest,
  createCOARequest,
  deleteCOARequest,
  updateCOARequest,
} from '../../../store/thunks/COA';

import { selectFactoryRESTResponseTableValues, selectFactoryRESTError } from '../../../store/common/REST/selectors';
import { selectCOAsStore } from '../../../store/COAsStore/selectors';
import { calculateOptions, checkDuplicates } from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import COAController from '../../../controllers/COA';

const COAsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Category Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// The Alert Sign
const AlertSign = () => {
  let [showingAlert, setShowingAlert] = useState(false);

  const { errors } = useSelector(
    state => ({
      errors: selectFactoryRESTError(selectCOAsStore)(state)
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
      This Category is referenced, can't be removed
    </Alert>
  </Collapse>
  );
};

// The material table
const COAsTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasCOAs, setHasCOAs] = useState(false)

  // table stuff while loading
  const preCOAs = [{ name: 'LOADING...' }]
  const preColumns = [{title: 'Name', field: 'name'}]

  // Prepare the data for material table
  const { COAs } = useSelector(
    state => ({
      COAs: selectFactoryRESTResponseTableValues(selectCOAsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  COAs.forEach(COA => {
    const logtime = new Date(COA.timestamp);
    COA.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss");
  });

  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'ID', field: 'id', validate: rowData => checkDuplicates(rowData, COAs, 'id') },
      { title: 'Name', field: 'name' },
      { title: 'OHFS Mapping', field: 'COA' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [COAs],
  );
  
  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(COA) {
    COA.updatedBy = localStorage.getItem('currentUser');
    COA.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: COA =>
        new Promise((resolve, reject) => {
          recordUpdate(COA);
          dispatch(createCOARequest(COA, resolve, reject));
        }).then(newCOA => {
          // For Auditlog
          CreateAuditLog(null, "Create Category", "Category", newCOA._id, {}, newCOA);
        }),

      onRowUpdate: COA =>
        new Promise((resolve, reject) => {
          recordUpdate(COA);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldCOA = await COAController.fetchCOAbyId(COA._id);
            CreateAuditLog(null, "Update Category", "Category", oldCOA.COAs._id, oldCOA.COAs, COA);
          })();
          // Do Update
          dispatch(updateCOARequest(COA, resolve, reject));
        }),

      onRowDelete: COA => 
        new Promise((resolve, reject) => {
          recordUpdate(COA);  
          dispatch(deleteCOARequest(COA._id, resolve, reject));
        }).then(() => {
          // For Auditlog
          (async () => {
            const oldCOA = await COAController.fetchCOAbyId(COA._id);
            // Actually Deleted (Category might not be deleted because it is referenced in master value table)
            if (oldCOA.COAs.length === 0) {
              CreateAuditLog(null, "Delete Category", "Category", COA._id, COA, {});
            }
          })();
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getCOAsRequest());
  }, [dispatch]);

  useEffect(()=>{ 
    setRowNum(COAs.length)
    if (!hasCOAs) {
      setHasCOAs(COAs.length >= 1)
    }
  }, [COAs])

  return (
    <div>
      <COAsHeader />
      <AlertSign />
      <MaterialTable
        key={readRowNum}
        columns={hasCOAs ? columns : preColumns}
        data={hasCOAs ? COAs : preCOAs}
        editable={hasCOAs ? editable : undefined}
        options={options}
      />
    </div>
  );
};

export default COAsTable;
