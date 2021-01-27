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
  getCOAsRequest,
  createCOARequest,
  deleteCOARequest,
  updateCOARequest,
} from '../../../store/thunks/COA';

import './COAs.scss';
import { selectFactoryRESTResponseTableValues, selectFactoryRESTError } from '../../../store/common/REST/selectors';
import { selectCOAsStore } from '../../../store/COAsStore/selectors';
import { calculateOptions } from '../../../tools/misc'

const COAsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">COAs</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

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

const COAsTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);


  const { COAs} = useSelector(
    state => ({
      COAs: selectFactoryRESTResponseTableValues(selectCOAsStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'id', field: 'id' },
      { title: 'Name', field: 'name' },
      { title: 'COA', field: 'COA' },
    ],
    [],
  );

  useEffect(()=>{setRowNum(COAs.length)}, [COAs])

  const options = useMemo(() => (calculateOptions(readRowNum)), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: COA =>
        new Promise((resolve, reject) => {
          dispatch(createCOARequest(COA, resolve, reject));
        }),
      onRowUpdate: COA =>
        new Promise((resolve, reject) => {
          dispatch(updateCOARequest(COA, resolve, reject));
        }),
      onRowDelete: COA => 
        new Promise((resolve, reject) => {    
          dispatch(deleteCOARequest(COA._id, resolve, reject));
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

  useEffect(() => {
    dispatch(getCOAsRequest());
  }, [dispatch]);

  return (
    <div>
      <COAsHeader />
      <AlertSign />
      <MaterialTable key={readRowNum} style={style} columns={columns} data={COAs} editable={editable} options={options}/>
    </div>
  );
};

export default COAsTable;
