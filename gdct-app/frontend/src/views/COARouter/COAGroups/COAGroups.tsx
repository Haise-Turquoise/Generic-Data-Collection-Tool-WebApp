import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import ErrorBanner from '../../ErrorBanner'
import { selectCOAGroupsStore } from '../../../store/COAGroupsStore/selectors';
import { 
  calculateOptions,
  checkDuplicates,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  fetchWithStatus
} from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import COAGroupController from '../../../controllers/COAGroup';

import CategoryGroup from '../../../types/categorygroup';

interface CategoryGroupMT extends CategoryGroup {
  tableData?: any,
}

const COAGroupsHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Category Group Management</Typography>
    </div>
  );
};

// The material table
const COAGroupsTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [COAGroups, setCOAGroups] = useState<CategoryGroup[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<CategoryGroup>(COAGroupController, setCOAGroups, setStatus)
  }, [])

  // table stuff while loading
  const preColumns: Column<CategoryGroupMT>[] = [{title: 'Name', field: 'name'}]
  const preGroups: CategoryGroupMT[] = [{ 
    name: status,
    _id: '',
    updatedAt: '',
  }]

  // Convert Date format
  COAGroups?.forEach((COAGroup: CategoryGroup) => {
    COAGroup.updatedAt = formatTimestamp(COAGroup.updatedAt)
  });

  // Prepare the columns for material table
  const columns: Column<CategoryGroupMT>[] = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
        validate: rowData => checkDuplicates(rowData, COAGroups, 'name'),
      },
      { title: 'Code', field: 'code' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
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
    [COAGroups],
  );

  

  const options: Options<CategoryGroupMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record user and time when an action occurs 
  function recordUpdate(COAGroup: CategoryGroupMT) {
    COAGroup.updatedBy = localStorage.getItem('currentUser') || '';
    COAGroup.updatedAt = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: (COAGroup: CategoryGroupMT) =>
        new Promise<CategoryGroup | undefined>((resolve, reject) => {
          recordUpdate(COAGroup);
          controllerAddRow(COAGroupController, setCOAGroups, COAGroup)
            .then((res: CategoryGroup) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newCOAGroup => {
          // For Auditlog
          if (newCOAGroup) {
            CreateAuditLog(
              null,
              "Create Category Group",
              "CategoryGroup",
              newCOAGroup._id,
              {},
              newCOAGroup
            );
          }
        }),

      onRowUpdate: (COAGroup: CategoryGroupMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(COAGroup);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldCOAGroup = await COAGroupController.fetchCOAGroup(COAGroup._id || '');
            CreateAuditLog(
              null,
              'Update Category Group',
              'CategoryGroup',
              oldCOAGroup?._id,
              oldCOAGroup,
              COAGroup,
            );
          })();
          // Do Update
          controllerEditRow(COAGroupController, setCOAGroups, COAGroup)
            .then((res: boolean) => {
              if (res) {
                resolve(COAGroup)
              }
              reject()
            })
        }),

      onRowDelete: (COAGroup: CategoryGroupMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(COAGroup);
          controllerDeleteRow(COAGroupController, setCOAGroups, COAGroup._id || '')
            .then((res: boolean) => {
              if (res) {
                resolve(COAGroup)
              }
              reject()
            })
          // For Auditlog
          const COAGroup_trim = (({ tableData, ...o }) => o)(COAGroup);
          CreateAuditLog(
            null,
            'Delete Category Group',
            'CategoryGroup',
            COAGroup._id,
            COAGroup_trim,
            {},
          );
        }),
    }),
    [],
  );

  useEffect(() => { 
    setRowNum(COAGroups?.length || 1)
  }, [COAGroups]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!COAGroups ? columns : preColumns}
      data={!!COAGroups ? COAGroups : preGroups}
      editable={!!COAGroups ? editable : undefined}
      options={options} 
    />
  );
};

// any type since props unused
const COAGroups = (props: any) => (
  <div className="COAGroups">
    <COAGroupsHeader />
    {/* <FileDropzone/> */}
    <ErrorBanner
      title={'Cannot delete the selected category group since it is referenced in COAGroup tree.'}
      targetStore={selectCOAGroupsStore}
    />
    <COAGroupsTable {...props} />
  </div>
);

export default COAGroups;
