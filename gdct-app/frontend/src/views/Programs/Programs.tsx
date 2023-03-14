import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
import Swal, { SweetAlertResult } from 'sweetalert2';
import {
  calculateOptions,
  checkDuplicates,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  fetchWithStatus,
} from '../../tools/misc'

import ErrorBanner from '../ErrorBanner';
import ProgramController from '../../controllers/Program';
import CreateAuditLog from '../AuditLog_Global';
import Program from '../../types/program';

interface ProgramMT extends Program {
  tableData?: any;
}

const ProgramHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Program</Typography>
    </div>
  );
};

const ProgramsTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [programs, setPrograms] = useState<Program[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<Program>(ProgramController, setPrograms, setStatus)
  }, [])

  // table vars for loading
  const preColumns: Column<ProgramMT>[] = [{ title: 'Name', field: 'name' }];
  const prePrograms: ProgramMT[] = [
    {
      name: status,
      _id: '',
      code: '',
      isActive: true,
      updatedAt: '',
      updatedBy: '',
    },
  ];
  // Convert Date format
  programs?.forEach((program: Program) => {
    program.updatedAt = formatTimestamp(program.updatedAt);
  });

  // Prepare the columns for material table
  const columns: Column<ProgramMT>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      {
        title: 'Code',
        field: 'code',
        validate: (rowData: Program) => checkDuplicates(rowData, programs, 'code'),
      },
      {
        title: 'Modified On',
        field: 'updatedAt',
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
    program.updatedAt = new Date().toLocaleString();
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (program: ProgramMT) =>
        new Promise<Program | undefined>((resolve, reject) => {
          recordUpdate(program);
          controllerAddRow(ProgramController, setPrograms, program)
            .then((res?: Program) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newProgram => {
          // For Auditlog
          if (newProgram) {
            CreateAuditLog(null, "Create Program", "Program", newProgram._id, {}, newProgram);
          }
        }),

      onRowUpdate: (program: ProgramMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(program);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldProgram: Program | null = await ProgramController.fetchById(program._id);
            CreateAuditLog(null, 'Update Program', 'Program', oldProgram?._id, oldProgram, program);
          })();
          // Do Update
          controllerEditRow(ProgramController, setPrograms, program)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),

      onRowDelete: (program: ProgramMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(program);
          // For Auditlog
          const program_trim = (({ tableData, ...o }) => o)(program);
          CreateAuditLog(null, "Delete Program", "Program", program._id, program_trim, {});
          controllerDeleteRow(ProgramController, setPrograms, program._id)
            .then((res: boolean) => {
              console.log("res : "  + res);
              if (res) {
                
                resolve(res)
              }
              else{

                Swal.fire({
                  title: 'Warning!',
                  text:
                    'Connot delete program',
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK',
                }).then((result:SweetAlertResult<any>) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }
                });
              }
              
              reject()
            })
        }),
    }),
    [],
  );

  useEffect(()=>{
    setRowNum(programs?.length || 1)
  }, [programs])
  programs?.sort((a,b)=>a.name.localeCompare(b.name)); // sort in alphabetical order - Tony x
  console.log(programs);
  console.log(programs?.length);
  return (
    <MaterialTable
      key={readRowNum}
      columns={!!programs ? columns : preColumns}
      data={!!programs ? programs : prePrograms}
      editable={!!programs ? editable : undefined}
      options={options}
    />
  );
};

// any type since no props used in table
const Program = (props: any) => (
  <div className="programsPage">
    <ProgramHeader />
    <ErrorBanner
      title={'Cannot delete the selected program since it is referenced in the master value table'}
      targetStore={selectProgramsStore}
    />
    <ProgramsTable {...props} />
  </div>
);

export default Program;
