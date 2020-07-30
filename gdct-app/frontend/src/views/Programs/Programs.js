import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getProgramsRequest,
  createProgramsRequest,
  deleteProgramsRequest,
  updateProgramsRequest,
} from '../../store/thunks/program';

import './Programs.scss';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';

const ProgramHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Programs</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const ProgramsTable = () => {
  const dispatch = useDispatch();

  const { programs } = useSelector(
    state => ({
      programs: selectFactoryRESTResponseTableValues(selectProgramsStore)(state),
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

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: true, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: program =>
        new Promise((resolve, reject) => {
          dispatch(createProgramsRequest(program, resolve, reject));
        }),
      onRowUpdate: program =>
        new Promise((resolve, reject) => {
          dispatch(updateProgramsRequest(program, resolve, reject));
        }),
      onRowDelete: program =>
        new Promise((resolve, reject) => {
          dispatch(deleteProgramsRequest(program._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getProgramsRequest());
  }, [dispatch]);

  return <MaterialTable columns={columns} data={programs} editable={editable} options={options} />;
};

const Program = props => (
  <div className="programsPage">
    <ProgramHeader />
    <ProgramsTable {...props} />
  </div>
);

export default Program;
