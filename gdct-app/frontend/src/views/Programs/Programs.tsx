import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import moment from 'moment';

import MaterialTable, { Column, MaterialTableProps, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import {
  getProgramsRequest,
  createProgramsRequest,
  deleteProgramsRequest,
  updateProgramsRequest,
  //@ts-ignore
} from '../../store/thunks/program';
  //@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
  //@ts-ignore
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
  //@ts-ignore
import { calculateOptions, checkDuplicates } from '../../tools/misc'

  //@ts-ignore
import ErrorBanner from '../ErrorBanner';
  //@ts-ignore
import ProgramController from '../../controllers/Program'
  //@ts-ignore
import CreateAuditLog from '../AuditLog_Global'
import Program from '../../types/program'

interface ProgramMT extends Program {
  tableData?: any,
}

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
  const [hasPrograms, setHasPrograms] = useState(false)

  // table vars for loading
  const preColumns: Column<ProgramMT>[] = [{ title: 'Name', field: 'name' }]
  const prePrograms: ProgramMT[] = [{
    name: 'LOADING... ',
    _id: '',
    code: '',
    isActive: true,
    updatedAt: '',
    updatedBy: '',
    timestamp: '',
  }]

  // Prepare the data for material table
  const { programs }: { programs: Program[] } = useSelector(
    state => ({
      programs: selectFactoryRESTResponseTableValues(selectProgramsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  programs.forEach((program: Program) => {
    const logtime = new Date(program.timestamp);
    program.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  // Prepare the columns for material table
  const columns: Column<ProgramMT>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code', validate: (rowData: Program) => checkDuplicates(rowData, programs, 'code') },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [programs],
  );
  
  const options: Options<ProgramMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  
  // Record who and when of the action
  function recordUpdate(program: ProgramMT) {
    //get username and record in Modified By column
    program.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column 
    program.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (program: ProgramMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(program);
          dispatch(createProgramsRequest(program, resolve, reject));
        }).then(newProgram => {
          // For Auditlog
          if (newProgram) {
            CreateAuditLog(null, "Create Program", "Program", (newProgram as Program)._id, {}, newProgram);
          }
        }),
      
      onRowUpdate: (program: ProgramMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(program);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldProgram: Program = await ProgramController.fetchById(program._id);
            CreateAuditLog(null, "Update Program", "Program", oldProgram._id, oldProgram, program);
          })();
          // Do Update
          dispatch(updateProgramsRequest(program, resolve, reject));
        }),
      
      onRowDelete: (program: ProgramMT) =>
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

  useEffect(()=>{
    setRowNum(programs.length)
    if (!hasPrograms) {
      setHasPrograms(programs.length >= 1)
    }
  }, [programs])

  return (
    <MaterialTable
      key={readRowNum}
      columns={hasPrograms ? columns : preColumns}
      data={hasPrograms ? programs : prePrograms}
      editable={hasPrograms ? editable : undefined}
      options={options}
    />
  );
};

// any type since no props used in table
const Program = (props: any) => (
  <div className="programsPage">
    <ProgramHeader />
    <ErrorBanner title={"Cannot delete the selected program since it is referenced in the master value table"} targetStore={selectProgramsStore}/>
    <ProgramsTable {...props} />
  </div>
);

export default Program;
