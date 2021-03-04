import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import {
  getProgramsRequest,
  createProgramsRequest,
  deleteProgramsRequest,
  updateProgramsRequest,
} from '../../store/thunks/program';

import ErrorBanner from '../ErrorBanner';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
import { calculateOptions } from '../../tools/misc'

import ProgramController from '../../controllers/Programs'
import CreateAuditLog from '../AuditLog_Global'

const ProgramHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Program</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const ProgramsTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

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

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: program =>
        new Promise((resolve, reject) => {
          dispatch(createProgramsRequest(program, resolve, reject));
        }).then(newProgram => {
          CreateAuditLog(null, "Create Program", "Program", newProgram._id, {}, newProgram);
        }),
      onRowUpdate: program =>
        new Promise((resolve, reject) => {
          // Find the old value before updating in order to Auditlog
          async function findProgramById() {
            return ProgramController.fetchById(program._id);
          }
          (async () => {
            const oldProgram = await findProgramById();
            CreateAuditLog(null, "Update Program", "Program", oldProgram._id, oldProgram, program);
          })();
          // Do Update
          dispatch(updateProgramsRequest(program, resolve, reject));
        }),
      onRowDelete: program =>
        new Promise((resolve, reject) => {
          dispatch(deleteProgramsRequest(program._id, resolve, reject));
          // For Auditlog
          const program_trim = (({ tableData, ...o }) => o)(program);
          CreateAuditLog(null, "Delete Program", "Program", program._id, program_trim, {})
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getProgramsRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(programs.length)}, [programs])

  // @ts-ignore
  return <MaterialTable key={readRowNum} columns={columns} data={programs} editable={editable} options={options} />;
};

const Program = props => (
  <div className="programsPage">
    <ProgramHeader />
    <ErrorBanner title={"Cannot delete the selected program since it is referenced in the master value table"} targetStore={selectProgramsStore}/>
    <ProgramsTable {...props} />
  </div>
);

export default Program;
