import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import {
  getCOAGroupsRequest,
  createCOAGroupRequest,
  deleteCOAGroupRequest,
  updateCOAGroupRequest,
} from '../../../store/thunks/COAGroup';

import './COAGroups.scss';
import ErrorBanner from '../../ErrorBanner'
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectCOAGroupsStore } from '../../../store/COAGroupsStore/selectors';

import { calculateOptions } from '../../../tools/misc';


const COAGroupsHeader = () => {
  const { t, i18n } = useTranslation();
  return (
    <Paper className="header">
      <Typography variant="h5">Category Group Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const COAGroupsTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  const { COAGroups } = useSelector(
    state => ({
      COAGroups: selectFactoryRESTResponseTableValues(selectCOAGroupsStore)(state),
    }),
    shallowEqual,
  );

  useEffect(() => { setRowNum(COAGroups.length) }, [COAGroups]);


  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
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
      onRowAdd: COAGroup =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          COAGroup.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          COAGroup.timestamp = event.toLocaleString(); 
          dispatch(createCOAGroupRequest(COAGroup, resolve, reject));
        }),
      onRowUpdate: COAGroup =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          COAGroup.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          COAGroup.timestamp = event.toLocaleString(); 
          dispatch(updateCOAGroupRequest(COAGroup, resolve, reject));
        }),
      onRowDelete: COAGroup =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          COAGroup.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          COAGroup.timestamp = event.toLocaleString(); 
          dispatch(deleteCOAGroupRequest(COAGroup._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getCOAGroupsRequest());
  }, [dispatch]);

  return <MaterialTable key={readRowNum} columns={columns} data={COAGroups} editable={editable} options={options} />;
};

const COAGroups = props => (
  <div className="COAGroups">
    <COAGroupsHeader />
    {/* <FileDropzone/> */}
    <ErrorBanner title={"Cannot delete the selected category group since it is referenced in COA tree."} targetStore={selectCOAGroupsStore} />
    <COAGroupsTable {...props} />
  </div>
);

export default COAGroups;
