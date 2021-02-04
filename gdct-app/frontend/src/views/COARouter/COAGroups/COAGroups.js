import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
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
  const[readRowNum, setRowNum] = useState(1);

  const { COAGroups } = useSelector(
    state => ({
      COAGroups: selectFactoryRESTResponseTableValues(selectCOAGroupsStore)(state),
    }),
    shallowEqual,
  );

  useEffect(()=>{setRowNum(COAGroups.length)},[COAGroups]);


  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );
  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: COAGroup =>
        new Promise((resolve, reject) => {
          dispatch(createCOAGroupRequest(COAGroup, resolve, reject));
        }),
      onRowUpdate: COAGroup =>
        new Promise((resolve, reject) => {
          dispatch(updateCOAGroupRequest(COAGroup, resolve, reject));
        }),
      onRowDelete: COAGroup =>
        new Promise((resolve, reject) => {
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
    <ErrorBanner title={"Cannot delete the selected category group since it is referenced in COA tree."} targetStore={selectCOAGroupsStore}/>
    <COAGroupsTable {...props} />
  </div>
);

export default COAGroups;
