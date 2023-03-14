import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography, Collapse, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { selectFactoryRESTError } from '../../../store/common/REST/selectors';
import { selectCOAsStore } from '../../../store/COAsStore/selectors';
import { calculateOptions, checkDuplicates, controllerAddRow, controllerEditRow, controllerDeleteRow, formatTimestamp, fetchWithStatus } from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import COAController from '../../../controllers/COA';
import Category from '../../../types/category'

const COAsHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Category Management</Typography>
    </div>
  );
};

// The Alert Sign
const AlertSign = () => {
  const [showingAlert, setShowingAlert] = useState(false);

  const { errors } = useSelector(
    state => ({
      errors: selectFactoryRESTError(selectCOAsStore)(state),
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
        This Category is referenced, can't be removed
      </Alert>
    </Collapse>
  );
};

// The material table
const COAsTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [COAs, setCOAs] = useState<Category[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<Category>(COAController, setCOAs, setStatus)
  }, [])

  // table stuff while loading
  const preColumns: Column<Category>[] = [{ title: 'Name', field: 'name' }]
  const preCOAs: Category[] = [{
    name: status,
    _id: '',
    id: '',
    COA: '',
    unitOfMeasure: '',
    updatedAt: '',
  }]

  // Convert Date format
  COAs?.forEach((COA: Category) => {
    COA.updatedAt = formatTimestamp(COA.updatedAt);
  });

  // Prepare the columns for material table
  const columns: Column<Category>[] = useMemo(
    () => [
      { title: 'ID', field: 'id', validate: rowData => checkDuplicates(rowData, COAs, 'id') },
      { title: 'Name', field: 'name' },
      { title: 'OHFS Mapping', field: 'COA' },
      { title: 'Unit Of Measure', field: 'unitOfMeasure' },
      {
        title: 'Modified On',
        field: 'updatedAt',
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
    [COAs],
  );

  const options: Options<Category> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(COA: Category) {
    COA.updatedBy = localStorage.getItem('currentUser') || '';
    COA.updatedAt = new Date().toLocaleString();
  }
  const editable = useMemo(
    () => ({
      onRowAdd: (COA: Category) =>
        new Promise<Category | undefined>((resolve, reject) => {
          recordUpdate(COA);
          controllerAddRow(COAController, setCOAs, COA)
            .then((res: Category) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newCOA => {
          // For Auditlog
          if (newCOA) {
            CreateAuditLog(
              null,
              "Create Category",
              "Category",
              newCOA._id,
              {},
              newCOA
            );
          }
        }),

      onRowUpdate: (COA: Category) =>
        new Promise((resolve, reject) => {
          recordUpdate(COA);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldCOA = await COAController.fetchCOAbyId(COA._id || '');
            if (oldCOA.COA) {
              CreateAuditLog(null, 'Update Category', 'Category', oldCOA.COA._id, oldCOA.COA, COA);
            }
          })();
          // Do Update
          controllerEditRow(COAController, setCOAs, COA).then((res: boolean) => {
            if (res) {
              resolve(COA)
            }
            reject()
          })
        }),

      onRowDelete: (COA: Category) =>
        new Promise((resolve, reject) => {
          recordUpdate(COA);
          controllerDeleteRow(COAController, setCOAs, COA._id || '').then((res: boolean) => {
            if (res) {
              resolve(COA)
            }
            reject()
          })
        }).then(() => {
          // For Auditlog
          (async () => {
            const oldCOA = await COAController.fetchCOAbyId(COA._id || '');
            // Actually Deleted (Category might not be deleted because it is referenced in master value table)
            if (oldCOA.COA) {
              CreateAuditLog(null, 'Delete Category', 'Category', COA._id, COA, {});
            }
          })();
        }),
    }),
    [],
  );

  useEffect(() => {
    setRowNum(COAs?.length || 1)
  }, [COAs])

  return (
    <div>
      <COAsHeader />
      <AlertSign />
      <MaterialTable
        key={readRowNum}
        columns={!!COAs ? columns : preColumns}
        data={!!COAs ? COAs : preCOAs}
        editable={!!COAs ? editable : undefined}
        options={options}
      />
    </div>
  );
};

export default COAsTable;
