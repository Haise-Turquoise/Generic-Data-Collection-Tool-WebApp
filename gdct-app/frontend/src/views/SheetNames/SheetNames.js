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
      <Typography variant="h5">Sheet Name</Typography>
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
      { title: 'Active', field: 'isActive' },
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
      onRowAdd: sheetName =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          sheetName.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          sheetName.timestamp = event.toLocaleString(); 
          dispatch(createSheetNameRequest(sheetName, resolve, reject));
        }),
      onRowUpdate: sheetName =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          sheetName.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          sheetName.timestamp = event.toLocaleString(); 
          dispatch(updateSheetNameRequest(sheetName, resolve, reject));
        }),
      onRowDelete: sheetName =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          sheetName.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          sheetName.timestamp = event.toLocaleString(); 
          dispatch(deleteSheetNameRequest(sheetName._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    sheetNames.forEach(sheetNames => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(sheetNames.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(sheetNames.timestamp.toString());
       sheetNames.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       sheetNames.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

  useEffect(() => {
    // console.log('Page Refresh')
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
