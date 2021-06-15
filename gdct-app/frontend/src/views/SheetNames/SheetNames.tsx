import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import Swal from 'sweetalert2';

import moment from 'moment';
import {
  getSheetNamesRequest,
  createSheetNameRequest,
  deleteSheetNameRequest,
  updateSheetNameRequest,
  //@ts-ignore
} from '../../store/thunks/sheetName';
//@ts-ignore
import DetectEmptySheet from './DetectEmptySheet';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectSheetNamesStore } from '../../store/SheetNamesStore/selectors';
//@ts-ignore
import { calculateOptions, checkDuplicates } from '../../tools/misc';
//@ts-ignore
import sheetNameController from '../../controllers/sheetName';
//@ts-ignore
import CreateAuditLog from '../AuditLog_Global';

import SheetName from '../../types/sheetname'

interface SheetNameMT extends SheetName {
  tableData?: any
}

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
  const [hasSheets, setHasSheets] = useState(false)

  // table vars while loading data
  const preColumns: Column<SheetNameMT>[] = [{ title: 'Name', field: 'name' }]
  const preSheets: SheetName[] = [{
    name: 'LOADING...',
    _id: '',
    id: 0,
    isActive: true,
    timestamp: '',
    updatedBy: '',
    templateTypeId: '',
  }]

  // Prepare the data for material table
  const { sheetNames }: { sheetNames: SheetName[] } = useSelector(
    state => ({
      sheetNames: selectFactoryRESTResponseTableValues(selectSheetNamesStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  sheetNames.forEach((sheetName: SheetName) => {
    const logtime = new Date(sheetName.timestamp);
    sheetName.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  
  // Prepare the columns for material table
  const columns: Column<SheetNameMT>[] = useMemo(
    () => [
      { title: "ID", field: "id", editComponent: () => {return <div></div>} },
      { title: 'Name', field: 'name', validate: rowData => checkDuplicates(rowData, sheetNames, 'name') },
      { title: 'Active', field: 'isActive', type: 'boolean' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [sheetNames],
  );

  const options: Options<SheetNameMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record who and when of the action
  const recordUpdate = (sheetName: SheetNameMT) => {
    //get username and record in Modified By column
    sheetName.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column 
    sheetName.timestamp = new Date().toLocaleString();   
  }
   
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (sheetName: SheetNameMT) =>
        new Promise((resolve, reject) => {
          sheetName.id = readRowNum
          recordUpdate(sheetName);
          dispatch(createSheetNameRequest(sheetName, resolve, reject));
        }).then(newSheetName => {
          // For Auditlog
          if (newSheetName) {
            CreateAuditLog(
              null,
              "Create Sheet",
              "SheetName",
              (newSheetName as SheetName)._id,
              {},
              newSheetName);
          }
        }),
      onRowUpdate: (sheetName: SheetNameMT) =>
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
      onRowDelete: (sheetName: SheetNameMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(sheetName);
          //Prevent deletion of referenced sheetname logic
          DetectEmptySheet(sheetName._id).then((hiddenValue: boolean) =>{
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
    [dispatch, readRowNum],
  );
  
  useEffect(() => {
    // console.log('Page Refresh')
    dispatch(getSheetNamesRequest());
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(sheetNames.length)
    if (!hasSheets) {
      setHasSheets(sheetNames.length >= 1)
    }
  }, [sheetNames])

  return (
    // @ts-ignore
    <MaterialTable
      key={readRowNum}
      columns={hasSheets ? columns : preColumns}
      data={hasSheets ? sheetNames : preSheets}
      editable={hasSheets ? editable : undefined}
      options={options}
    />
  );
};

// any type since props unused
const SheetName = (props: any) => (
  <div className="sheetNames">
    <SheetNameHeader />
    <SheetNamesTable {...props} />
  </div>
);

export default SheetName;
