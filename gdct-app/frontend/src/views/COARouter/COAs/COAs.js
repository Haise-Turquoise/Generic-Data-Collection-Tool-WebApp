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
      <Typography variant="h5">Category Management</Typography>
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
      { title: 'ID', field: 'id' },
      { title: 'Name', field: 'name' },
      { title: 'OHFS Mapping', field: 'COA' },
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
//      { title: 'Modified On', field: 'updatedDate', type: 'date',
//      initialEditValue: Date.now,},
    { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [],
  );

  useEffect(()=>{setRowNum(COAs.length)}, [COAs])

  const options = useMemo(() => (calculateOptions(readRowNum)), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: COA =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          COA.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          COA.timestamp = event.toLocaleString(); 
          dispatch(createCOARequest(COA, resolve, reject));
        }),
      onRowUpdate: COA =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          COA.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          COA.timestamp = event.toLocaleString(); 
          dispatch(updateCOARequest(COA, resolve, reject));
        }),
      onRowDelete: COA => 
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          COA.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          COA.timestamp = event.toLocaleString();     
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

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    COAs.forEach(COAs => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(COAs.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(COAs.timestamp.toString());
       COAs.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       COAs.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

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
