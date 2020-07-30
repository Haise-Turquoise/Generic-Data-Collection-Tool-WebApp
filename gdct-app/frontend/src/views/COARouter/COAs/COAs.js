import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getCOAsRequest,
  createCOARequest,
  deleteCOARequest,
  updateCOARequest,
} from '../../../store/thunks/COA';

import './COAs.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectCOAsStore } from '../../../store/COAsStore/selectors';

const COAsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">COAs</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const COAs = ({ history }) => {
  const dispatch = useDispatch();

  const { COAs } = useSelector(
    state => ({
      COAs: selectFactoryRESTResponseTableValues(selectCOAsStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: '_id', field: '_id', editable: 'never' },
      { title: 'Name', field: 'name' },
      { title: 'COA', field: 'COA' },
    ],
    [],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: COA =>
        new Promise((resolve, reject) => {
          dispatch(createCOARequest(COA, resolve, reject));
        }),
      onRowUpdate: COA =>
        new Promise((resolve, reject) => {
          dispatch(updateCOARequest(COA, resolve, reject));
        }),
      onRowDelete: COA =>
        new Promise((resolve, reject) => {
          dispatch(deleteCOARequest(COA._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getCOAsRequest());
  }, [dispatch]);

  return (
    <div>
      <COAsHeader />
      <MaterialTable columns={columns} data={COAs} editable={editable} options={options} />
    </div>
  );
};

export default COAs;
