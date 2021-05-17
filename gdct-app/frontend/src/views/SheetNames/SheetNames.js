import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import Swal from 'sweetalert2';

import moment from 'moment';
import {
  getSheetNamesRequest,
  createSheetNameRequest,
  deleteSheetNameRequest,
  updateSheetNameRequest,
} from '../../store/thunks/sheetName';
import DetectEmptySheet from './DetectEmptySheet';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectSheetNamesStore } from '../../store/SheetNamesStore/selectors';
import { calculateOptions } from '../../tools/misc';

import sheetNameController from '../../controllers/sheetName';
import CreateAuditLog from '../AuditLog_Global';

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

  // Prepare the data for material table
  const { sheetNames } = useSelector(
    state => ({
      sheetNames: selectFactoryRESTResponseTableValues(selectSheetNamesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  sheetNames.forEach(sheetName => {
    const logtime = new Date(sheetName.timestamp);
    sheetName.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  
  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: "ID", field: "id", editComponent: () => {return <div></div>} },
      { title: 'Name', field: 'name' },
      { title: 'Active', field: 'isActive', type: 'boolean' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record who and when of the action
    function recordUpdate(sheetName) {
      //get username and record in Modified By column
      sheetName.updatedBy = localStorage.getItem('currentUser');
      //record new date and time in Modified On column 
     sheetName.timestamp = new Date().toLocaleString();   
    }
   
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: sheetName =>
        new Promise((resolve, reject) => {
          recordUpdate(sheetName);
          dispatch(createSheetNameRequest(sheetName, resolve, reject));
        }).then(newSheetName => {
          // For Auditlog
          CreateAuditLog(null, "Create Sheet", "SheetName", newSheetName._id, {}, newSheetName);
        }),
      onRowUpdate: sheetName =>
        new Promise((resolve, reject) => {
          recordUpdate(sheetName); 
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldSheetName = await sheetNameController.fetchById(sheetName._id);
            CreateAuditLog(null, "Update Sheet", "SheetName", oldSheetName._id, oldSheetName, sheetName);
          })();
          // Do Update
          dispatch(updateSheetNameRequest(sheetName, resolve, reject));
        }),
      onRowDelete: sheetName =>
        new Promise((resolve, reject) => {
          recordUpdate(sheetName);
          //Prevent deletion of referenced sheetname logic
          DetectEmptySheet(sheetName._id).then(hiddenValue =>{
            //if hiddenValue is true, the categoryTree is empty and the sheetname will be delete-able
            if (hiddenValue === true) {
              dispatch(deleteSheetNameRequest(sheetName._id, resolve, reject));
              // For Auditlog
              const sheetName_trim = (({ tableData, ...o }) => o)(sheetName);
              CreateAuditLog(null, "Delete Sheet", "SheetName", sheetName._id, sheetName_trim, {});
            }
            //trigger warning popup to alert user sheetname is referenced in a Category Tree
            else {
              Swal.fire({
                title: 'Warning!',
                text: "The sheet you are attempting to delete is referenced by a Category Tree and may not be deleted. Please click OK to return to the page.",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              })
            }
          });
        }),
    }),
    [dispatch],
  );
  
  useEffect(() => {
    // console.log('Page Refresh')
    dispatch(getSheetNamesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(sheetNames.length)}, [sheetNames])

  return (
    // @ts-ignore
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
