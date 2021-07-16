import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment';

import {
  getCOAGroupsRequest,
  createCOAGroupRequest,
  deleteCOAGroupRequest,
  updateCOAGroupRequest,
  //@ts-ignore
} from '../../../store/thunks/COAGroup';

  //@ts-ignore
import ErrorBanner from '../../ErrorBanner'
  //@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
  //@ts-ignore
import { selectCOAGroupsStore } from '../../../store/COAGroupsStore/selectors';
import { 
  calculateOptions,
  checkDuplicates,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow
  //@ts-ignore
} from '../../../tools/misc';
  //@ts-ignore
import CreateAuditLog from '../../AuditLog_Global';
  //@ts-ignore
import COAGroupController from '../../../controllers/COAGroup';

import CategoryGroup from '../../../types/categorygroup';

interface CategoryGroupMT extends CategoryGroup {
  tableData?: any,
}

const COAGroupsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Category Group Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// The material table
const COAGroupsTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [COAGroups, setCOAGroups] = useState<CategoryGroup[] | undefined>(undefined)

  useEffect(() => {
    COAGroupController.fetch().then((res: unknown) => {
      setCOAGroups(res as CategoryGroup[])
    })
  }, [])

  // table stuff while loading
  const preColumns: Column<CategoryGroupMT>[] = [{title: 'Name', field: 'name'}]
  const preGroups: CategoryGroupMT[] = [{ 
    name: 'LOADING...',
    _id: '',
    timestamp: '',
  }]

  // Convert Date format
  COAGroups?.forEach((COAGroup: CategoryGroup) => {
    const logtime = new Date(COAGroup.timestamp);
    COAGroup.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
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
    [COAGroups],
  );

  const options: Options<CategoryGroupMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record user and time when an action occurs 
  function recordUpdate(COAGroup: CategoryGroupMT) {
    COAGroup.updatedBy = localStorage.getItem('currentUser') || '';
    COAGroup.timestamp = new Date().toLocaleString(); 
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
              oldCOAGroup._id,
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
          controllerDeleteRow(COAGroupController, setCOAGroups, COAGroup._id)
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
    [dispatch],
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
