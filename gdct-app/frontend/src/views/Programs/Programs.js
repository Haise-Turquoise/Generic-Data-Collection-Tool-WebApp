import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import moment from 'moment';

import MaterialTable from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import {
  getProgramsRequest,
  createProgramsRequest,
  deleteProgramsRequest,
  updateProgramsRequest,
} from '../../store/thunks/program';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
import { calculateOptions } from '../../tools/misc'

import ErrorBanner from '../ErrorBanner';
import ProgramController from '../../controllers/programs'
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

  // Prepare the data for material table
  const { programs } = useSelector(
    state => ({
      programs: selectFactoryRESTResponseTableValues(selectProgramsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  programs.forEach(program => {
    const logtime = new Date(program.timestamp);
    program.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );
  
  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record who and when of the action
  function recordUpdate(program) {
    //get username and record in Modified By column
    program.updatedBy = localStorage.getItem('currentUser');
    //record new date and time in Modified On column 
    program.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: program =>
        new Promise((resolve, reject) => {
          recordUpdate(program);
          dispatch(createProgramsRequest(program, resolve, reject));
        }).then(newProgram => {
          // For Auditlog
          CreateAuditLog(null, "Create Program", "Program", newProgram._id, {}, newProgram);
        }),
      
      onRowUpdate: program =>
        new Promise((resolve, reject) => {
          recordUpdate(program);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldProgram = await ProgramController.fetchById(program._id);
            CreateAuditLog(null, "Update Program", "Program", oldProgram._id, oldProgram, program);
          })();
          // Do Update
          dispatch(updateProgramsRequest(program, resolve, reject));
        }),
      
      onRowDelete: program =>
        new Promise((resolve, reject) => {
          recordUpdate(program);
          dispatch(deleteProgramsRequest(program._id, resolve, reject));
          // For Auditlog
          const program_trim = (({ tableData, ...o }) => o)(program);
          CreateAuditLog(null, "Delete Program", "Program", program._id, program_trim, {});
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
