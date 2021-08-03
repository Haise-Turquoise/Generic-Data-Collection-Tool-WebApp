import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography, Collapse, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';

import {
  getColumnNamesRequest,
  createColumnNameRequest,
  deleteColumnNameRequest,
  updateColumnNameRequest,
  //@ts-ignore
} from '../../store/thunks/columnName';

  //@ts-ignore
import { selectFactoryRESTResponseTableValues, selectFactoryRESTError } from '../../store/common/REST/selectors';
  //@ts-ignore
import { selectColumnNamesStore } from '../../store/ColumnNamesStore/selectors';
  //@ts-ignore
import { ColumnNamesActions } from '../../store/ColumnNamesStore/store';
  //@ts-ignore
import CreateAuditLog from '../AuditLog_Global';
  //@ts-ignore
import columnNameController from '../../controllers/columnName';
  //@ts-ignore
import { checkDuplicates, controllerAddRow, controllerEditRow, controllerDeleteRow, formatTimestamp } from '../../tools/misc'

import Attribute from '../../types/attrubute';

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
  const [showingAlert, setShowingAlert] = useState(false);

  const { errors } = useSelector(
    state => ({
      errors: selectFactoryRESTError(selectColumnNamesStore)(state),
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (errors) {
      setShowingAlert(true);
    }
  }, [errors]);

  useEffect(() => {
    if (showingAlert) {
      setTimeout(() => {
        setShowingAlert(false);
      }, 5000);
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
  const [columnNames, setColumnNames] = useState<Attribute[] | undefined>(undefined)

  useEffect(() => {
    columnNameController.fetch().then((res: unknown) => {
      setColumnNames(res as Attribute[])
    })
  }, [])

  // table stuff while loading
  const preColumns: Column<Attribute>[] = [{title: 'Name', field: 'name'}]
  const preCols: Attribute[] = [{
    name: 'LOADING...',
    _id: '',
    id: '',
    timestamp: '',
  }]

  // Convert Date format
  columnNames?.forEach((columnName: Attribute) => {
    columnName.timestamp = formatTimestamp(columnName.timestamp);
  });

  // Prepare the columns for material table
  const columns: Column<Attribute>[] = useMemo(
    () => [
      { title: 'ID', field: 'id', validate: rowData => checkDuplicates(rowData, columnNames, 'id') || true },
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      {
        title: 'Modified On',
        field: 'timestamp',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [columnNames],
  );
  
  const options: Options<Attribute> = useMemo(
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
  function recordUpdate(columnName: Attribute) {
    columnName.updatedBy = localStorage.getItem('currentUser') || '';
    columnName.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: (columnName: Attribute) =>
        new Promise<Attribute | undefined>((resolve, reject) => {
          recordUpdate(columnName);
          // dispatch(createColumnNameRequest(columnName, resolve, reject));
          controllerAddRow(columnNameController, setColumnNames, columnName)
            .then((res: Attribute) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newColumnName => {
          // For Auditlog
          if (newColumnName) {
            CreateAuditLog(
              null,
              "Create Attribute",
              "Attribute",
              newColumnName._id,
              {},
              newColumnName
            );
          }
        }),

      onRowUpdate: (columnName: Attribute) =>
        new Promise((resolve, reject) => {
          recordUpdate(columnName);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldColumnName = await columnNameController.fetchAttribute(columnName._id);
            // console.log(oldColumnName);
            CreateAuditLog(
              null,
              'Update Attribute',
              'Attribute',
              oldColumnName?._id,
              oldColumnName,
              columnName,
            );
          })();
          // Do Update
          // dispatch(updateColumnNameRequest(columnName, resolve, reject));
          controllerEditRow(columnNameController, setColumnNames, columnName).then((res: boolean) => {
            if (res) {
              resolve(columnName)
            }
            reject()
          })
        }),

      onRowDelete: (columnName: Attribute) =>
        new Promise((resolve, reject) => {
          recordUpdate(columnName);
          // dispatch(deleteColumnNameRequest(columnName._id, resolve, reject));
          controllerDeleteRow(columnNameController, setColumnNames, columnName._id).then((res: boolean) => {
            if (res) {
              resolve(columnName)
            }
            reject()
          })
        }).then(() => {
          // For Auditlog
          (async () => {
            const oldColumnName = await columnNameController.fetchAttribute(columnName._id);
            // Actually Deleted (Attribute might not be deleted because it is referenced in master value table)
            if (oldColumnName) {
              CreateAuditLog(null, 'Delete Attribute', 'Attribute', columnName._id, columnName, {});
            }
          })();
        }),
    }),
    [dispatch],
  );

  useEffect(()=>{
    setRowNum(columnNames?.length || 1)
  }, [columnNames]);

  return (
    // @ts-ignore
    <MaterialTable
      key={readRowNum}
      columns={!!columnNames ? columns : preColumns}
      data={!!columnNames ? columnNames : preCols}
      editable={!!columnNames ? editable : undefined}
      options={options}
    />
  );
};

const ColumnName = (props: any) => (
  <div className="columnNamesPage">
    <ColumnNameHeader />
    <AlertSign />
    <ColumnNamesTable {...props} />
  </div>
);

export default ColumnName;
