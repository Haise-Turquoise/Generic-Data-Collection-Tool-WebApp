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
    const [startDate, setStartDate] = useState(new Date("2010-05-10 00:00"));
    const [selectedDate, setSelectedDate] = useState(new Date("2010-05-10 00:00"));
    const classes = useStyles();
    const [readRowNum, setRowNum] = useState(1);
    const options = useMemo(() => calculateOptions(readRowNum,{search: true, showTitle: true, filtering: false}), [readRowNum]);

    const [reloadNum, setReloadNum] = useState(1);
    const user = localStorage.getItem('currentUser') || '';
    const [purgelogs, setPurgeLogs] = useState<PurgeLog[] | undefined>(undefined);

    const callMove = () => {
      setStartDate(selectedDate)
      AuditLogController.move(selectedDate, user).then(res=>{
        setReloadNum(reloadNum+1)
        AuditLogController.fetchPurge()
        .then(res => { 
          setPurgeLogs(res)
        })
       }
      )

      // AuditLogController.fetchLatest()
      // .then(res => { 
      //   setStartDate(new Date(res.archiveMarkerDate))
      //   setSelectedDate(new Date(res.archiveMarkerDate))
      // })

    }

    useEffect(()=> {
      AuditLogController.fetchPurge()
      .then(res => { 
        setPurgeLogs(res)
      })
    }, [reloadNum])


    useEffect(() => {    
      AuditLogController.fetchLatest()
        .then(res => { 
          setStartDate(new Date(res.archiveMarkerDate))
          setSelectedDate(new Date(res.archiveMarkerDate))
      })
      AuditLogController.fetchPurge()
      .then(res => { 
        setPurgeLogs(res)
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
            options={options}
            columns={!!purgelogs ? columns : preColumns}
            data={!!purgelogs ? purgelogs : preLogs}
          />
        </Paper>
      </Box>

    )
}


export default PurgeArchive;
