import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import moment from 'moment'

import {
  getCOAGroupsRequest,
  createCOAGroupRequest,
  deleteCOAGroupRequest,
  updateCOAGroupRequest,
} from '../../../store/thunks/COAGroup';

import ErrorBanner from '../../ErrorBanner'
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectCOAGroupsStore } from '../../../store/COAGroupsStore/selectors';
import { calculateOptions } from '../../../tools/misc';
import CreateAuditLog from '../../AuditLog_Global';
import COAGroupController from '../../../controllers/COAGroup';

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
  
  // Prepare the data for material table
  const { COAGroups } = useSelector(
    state => ({
      COAGroups: selectFactoryRESTResponseTableValues(selectCOAGroupsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  COAGroups.forEach(COAGroup => {
    const logtime = new Date(COAGroup.timestamp);
    COAGroup.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });
  
  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record user and time when an action occurs 
  function recordUpdate(COAGroup) {
    COAGroup.updatedBy = localStorage.getItem('currentUser');
    COAGroup.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowAdd: COAGroup =>
        new Promise((resolve, reject) => {
          recordUpdate(COAGroup);
          dispatch(createCOAGroupRequest(COAGroup, resolve, reject));
        }).then(newCOAGroup => {
          // For Auditlog
          CreateAuditLog(null, "Create Category Group", "CategoryGroup", newCOAGroup._id, {}, newCOAGroup);
        }),

      onRowUpdate: COAGroup =>
        new Promise((resolve, reject) => {
          recordUpdate(COAGroup);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldCOAGroup = await COAGroupController.fetchCOAGroup(COAGroup._id);
            CreateAuditLog(null, "Update Category Group", "CategoryGroup", oldCOAGroup._id, oldCOAGroup, COAGroup);
          })();
          // Do Update
          dispatch(updateCOAGroupRequest(COAGroup, resolve, reject));
        }),

      onRowDelete: COAGroup =>
        new Promise((resolve, reject) => {
          recordUpdate(COAGroup);
          dispatch(deleteCOAGroupRequest(COAGroup._id, resolve, reject));
          // For Auditlog
          const COAGroup_trim = (({ tableData, ...o }) => o)(COAGroup);
          CreateAuditLog(null, "Delete Category Group", "CategoryGroup", COAGroup._id, COAGroup_trim, {});
        }),
    }),
    [dispatch],
  );
  
  useEffect(() => {
    dispatch(getCOAGroupsRequest());
  }, [dispatch]);

  useEffect(() => { setRowNum(COAGroups.length) }, [COAGroups]);

  // @ts-ignore
  return <MaterialTable key={readRowNum} columns={columns} data={COAGroups} editable={editable} options={options} />;
};

const COAGroups = props => (
  <div className="COAGroups">
    <COAGroupsHeader />
    {/* <FileDropzone/> */}
    <ErrorBanner title={"Cannot delete the selected category group since it is referenced in COAGroup tree."} targetStore={selectCOAGroupsStore} />
    <COAGroupsTable {...props} />
  </div>
);

export default COAGroups;
