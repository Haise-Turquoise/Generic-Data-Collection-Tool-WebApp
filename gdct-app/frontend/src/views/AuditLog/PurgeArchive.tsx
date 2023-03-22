import React, { useState , useEffect, useMemo, useCallback} from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MaterialTable, { Action, Column, EditCellColumnDef, Filter, Options } from 'material-table';
import {  calculateOptions } from '../../tools/misc';
import moment from 'moment';
import AuditLogController from '../../controllers/AuditLog'

import {
    Paper,
    Button,
    Typography,
    Box,
    makeStyles,
    Dialog,
    TextField,
    Grid
} from '@material-ui/core';
import PurgeLog from "../../types/purgelog";

const useStyles = makeStyles(theme => ({
  root: {

  },
  SaveButton: {

  }
}))

// const SaveButton = {
//   display: 'inline-block',
//   padding:0,
//   minHeight: 0,
//   minWidth: 0,
// }



const PurgeArchive = (props: any) => {
    const classes = useStyles();
    const user = localStorage.getItem('currentUser') || '';

    // States
      // startDate is the initial date in the selector, we will grab the latest log in the purgelog and set it to startDate
    const [startDate, setStartDate] = useState(new Date("2010-05-10 00:00"));
      // selectedDate is the currently selected date in the selector, this will initially be the same as startDate
    const [selectedDate, setSelectedDate] = useState(new Date("2010-05-10 00:00"));

      // state used to store the purgearchive logs we get from the database
    const [purgelogs, setPurgeLogs] = useState<PurgeLog[] | undefined>(undefined);

      // state used to set row numbers on row entries in the purgearchivelog
    const [readRowNum, setRowNum] = useState(1);
      // state used to buffer the table when it is awaiting new logs from the database
    const [isLoading, setIsLoading] = useState(false);
    
    const sleep = (time: number) => {
      return new Promise(resolve => setTimeout(resolve, time));
    };


    // callmove first performs the purge and archiving using axios call (move) using parameters set by datepicker, 
    //  then it fetches the purgelog and sets it so the user can see the updated log in real time
    const callMove = async () => {
      setIsLoading(true);
      // Add a timeout to eliminate race condition between move() and fetchpurge()
      await sleep(3000);
      setStartDate(selectedDate)
      try {
        const temp = await AuditLogController.move(selectedDate, user)
        // Add a timeout to eliminate race condition between move() and fetchpurge(), may need to adjust based on future sizes
        await sleep(3000)
        const resi = await AuditLogController.fetchPurge()
        if (resi)
          setPurgeLogs(resi.sort((a,b)=>b.purgeDate!.localeCompare(a.purgeDate!)))
      } catch (err) {
        console.trace(err);
      }
      setIsLoading(false);

    }

    useEffect(() => {    
      AuditLogController.fetchLatest()
        .then(res => { 
          if (res != null){
            setStartDate(new Date(res.archiveMarkerDate))
            setSelectedDate(new Date(res.archiveMarkerDate))
          }
      })
      AuditLogController.fetchPurge()
      .then(res => { 
        if (res != null){
          setPurgeLogs(res.sort((a,b)=>b.purgeDate!.localeCompare(a.purgeDate!)))
        }
      })

    },[]);
    useEffect(() => {
      setRowNum(purgelogs?.length || 0)
      purgelogs?.forEach(purgelogs => {
        if (purgelogs.archiveMarkerDate != null){
          purgelogs.archiveMarkerDate = moment(purgelogs.archiveMarkerDate).format("YYYY-MM-DD HH:mm:ss")
          purgelogs.purgeDate = moment(purgelogs.purgeDate).format("YYYY-MM-DD HH:mm:ss")
      
        }
      })
      
    }, [purgelogs])


    //the following are mandatory props required for the materialtable to function

    const preColumns: Column<PurgeLog>[] = [{ title: 'Name', field: 'moduleName' }]
    const preLogs: PurgeLog[] = [{
      _id: '',
      numberDeleted: 0,
      numberArchived: 0,
      archiveMarkerDate: '',
      user: '',
      purgeDate: '',
    }]

    const columns: Column<PurgeLog>[] = useMemo(
      () => [
        {
          title: 'Archive Perform Date',
          field: 'purgeDate',
        },
        { title: 'User Email', field: 'user' },
        { title: 'ArchivedDate', field: 'archiveMarkerDate' },
        { title: 'Number Deleted', field: 'numberDeleted' },
        { title: 'Number Archived', field: 'numberArchived' },
      ],
      [],
    );

    const options = useMemo(() => calculateOptions(readRowNum,{search: true, showTitle: true, filtering: true, pageSize: 5}), [readRowNum]);


    return (
      <Box mx="auto" className={classes.root}>
        <Paper>
          <Typography variant="h6" component={'span'} >
              Records up to {startDate.toDateString()} have been archived
          </Typography>
          <br />
          <Typography variant="h6"  component={'span'}>
              Select a new archive date
          </Typography>

        <Box  
          p={2}  
          m={0}
          sx={{ paddingLeft: 0}}

        >
          <DatePicker 
            selected={selectedDate} 
            popperPlacement="right"
            dateFormat={"yyyy-MM-dd HH:mm"}
            onChange={(date: Date) => setSelectedDate(date)} 
            minDate={new Date(startDate)}
            maxDate={new Date()}
            showTimeSelect
            showMonthDropdown
            showYearDropdown
          />
          <Button
            type="button"
            className="SaveButton"
            color="primary"
            variant="contained"
            size="medium"
            onClick={callMove}
            style={{position:"static"}}
          >
            Archive
          </Button>

        </Box>


          {/* <Typography variant="h6" component={'span'} >
              Purge records
          </Typography> */}
          <MaterialTable
            title="Purge and Archive log"
            key={readRowNum}
            isLoading={isLoading}
            options={options}
            columns={!!purgelogs ? columns : preColumns}
            data={!!purgelogs ? purgelogs : preLogs}
          />
        </Paper>
      </Box>

    )
}


export default PurgeArchive;
