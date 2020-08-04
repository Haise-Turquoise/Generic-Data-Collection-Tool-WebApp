import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getCOAGroupsRequest,
  createCOAGroupRequest,
  deleteCOAGroupRequest,
  updateCOAGroupRequest,
} from '../../../store/thunks/COAGroup';

import './COAGroups.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectCOAGroupsStore } from '../../../store/COAGroupsStore/selectors';

const COAGroupsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">COA Groups</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const COAGroupsTable = () => {
  const dispatch = useDispatch();

  const { COAGroups } = useSelector(
    state => ({
      COAGroups: selectFactoryRESTResponseTableValues(selectCOAGroupsStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

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

  return <MaterialTable columns={columns} data={COAGroups} editable={editable} options={options} />;
};

const COAGroups = props => (
  <div className="COAGroups">
    <COAGroupsHeader />
    {/* <FileDropzone/> */}
    <COAGroupsTable {...props} />
  </div>
);

export default COAGroups;
