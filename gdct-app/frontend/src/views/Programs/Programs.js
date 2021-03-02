import React, { useMemo, useEffect, useState } from 'react';
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

import ErrorBanner from '../ErrorBanner';

import './Programs.scss';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
import { calculateOptions } from '../../tools/misc'

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
      { title: 'Modified On', field: 'timestamp',
        editComponent: props => {return <div></div>} },
//      { title: 'Modified On', field: 'updatedDate', type: 'date',
//      initialEditValue: Date.now,},
      { title: 'Updated By', field: 'updatedBy', 
        editComponent: props => {return <div></div>} },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: program =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          program.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          program.timestamp = event.toLocaleString(); 
          dispatch(createProgramsRequest(program, resolve, reject));
        }),
      onRowUpdate: program =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          program.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          program.timestamp = event.toLocaleString(); 
          dispatch(updateProgramsRequest(program, resolve, reject));
        }),
      onRowDelete: program =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          program.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          program.timestamp = event.toLocaleString(); 
          dispatch(deleteProgramsRequest(program._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    programs.forEach(programs => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(programs.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(programs.timestamp.toString());
       programs.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       programs.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

  useEffect(() => {
    dispatch(getProgramsRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(programs.length)}, [programs])

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
