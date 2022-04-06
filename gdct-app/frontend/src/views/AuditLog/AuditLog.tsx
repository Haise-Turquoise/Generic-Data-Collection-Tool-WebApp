import React, { Fragment, useMemo, useEffect, useState, ChangeEvent } from 'react';

import moment from 'moment';
//@ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import MaterialTable, { Action, Column, EditCellColumnDef, Filter, Options } from 'material-table';
import { Paper, Typography, Button,
         Dialog, DialogActions, DialogContent, 
         DialogContentText, DialogTitle, Box, Tabs, Tab, AppBar} from '@material-ui/core';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import AuditLogController from '../../controllers/AuditLog'

import PurgeArchive from './PurgeArchive';
import AuditLog from '../../types/auditlog';
import { fetchWithStatus, calculateOptions } from '../../tools/misc';



// Title Text
const AuditLogHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5" component={'span'}>Audit Log</Typography>
    </Paper>
  );
};

// A calendar for selecting dates
const CustomDatePicker = (props: {
  columnDef: Column<AuditLog>,
  onFilterChanged: (rowId: string, value: any) => void,
  merge: (start: Date) => void, 
}) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  useEffect(()=>{
    AuditLogController.fetchLatest()
    .then(res => { 
      if (res != null)
        setStartDate(new Date(res.archiveMarkerDate))
    })
  }, []) 


  return (
    <Fragment>
      <label>From:</label>
      <DatePicker
        id="startDatePicker"
        selected={startDate}
        dateFormat={"yyyy-MM-dd HH:mm"}
        onChange={(selectedDate:any) => {

          if (!selectedDate) {
            return
          } else if (Array.isArray(selectedDate)) {
            selectedDate = selectedDate[0]
          }
          props.merge(new Date(selectedDate))
          setStartDate(selectedDate)
          props.onFilterChanged(
            (props.columnDef as EditCellColumnDef).tableData.id.toString(),
            selectedDate
          );
        }}
        closeOnScroll={(e:any) => e.target === document}
        showTimeSelect
        showMonthDropdown
        showYearDropdown
        maxDate={new Date()}
        dropdownMode="select"
      />
      <br />
      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To:</label>
      <DatePicker
        id="endDatePicker"
        selected={endDate}
        dateFormat={'yyyy-MM-dd HH:mm'}
        onChange={(selectedDate:any) => {
          // @ts-ignore
          setEndDate(selectedDate)
          // @ts-ignore
          props.onFilterChanged(
            (props.columnDef as EditCellColumnDef).tableData.id.toString(), 
            selectedDate
          );
        }}
        closeOnScroll={(e:any) => e.target === document}
        minDate={startDate}
        showTimeSelect
        showMonthDropdown
        showYearDropdown
        maxDate={new Date()}
        dropdownMode="select"
      />
    </Fragment>
  );
};

// Table contents
const AuditLogTable = () => {
  
  const [readRowNum, setRowNum] = useState(1);
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...');

  const [archivedDate, setArchivedDate] = useState(new Date());

  const [auditlogs, setAuditLogs] = useState<AuditLog[] | undefined>(undefined);
  const [archivelogs, setArchiveLogs] = useState<AuditLog[] | undefined>(undefined);
  const [combinedlogs, setCombinedLogs] = useState<AuditLog[] | undefined>(undefined);


  useEffect(() => {
    fetchWithStatus(AuditLogController, setAuditLogs, setStatus)
    AuditLogController.fetchLatest()
    .then(res => { 
      if (res != null)
        setArchivedDate(new Date(res.archiveMarkerDate))
    })
  }, [])

  // table vars for loading
  const preColumns: Column<AuditLog>[] = [{ title: 'Name', field: 'moduleName' }]
  const preLogs: AuditLog[] = [{
    _id: '',
    activity: '',
    moduleName: status,
    newValue: {},
    oldValue: {},
    recordId: '',
    user: {_id: '', email: ''},
    updatedAt: '',
  }]



  // Prepare the table columns for MaterialTable
  const columns: Column<AuditLog>[] = useMemo(
    () => [
      {
        title: 'Time',
        field: 'updatedAt',
        // Use Datepicker as filter
        filterComponent: props => <CustomDatePicker {...props }  merge={merge}/>,
        //must have "term" as an input even it is not used
        customFilterAndSearch: (_term, rowData) => {
          const startDate = document.getElementById("startDatePicker")!.getAttribute("value")
          const endDate = document.getElementById("endDatePicker")!.getAttribute("value")
          return (
            new Date(rowData.updatedAt || '') >= new Date(startDate || '') && 
            new Date (rowData.updatedAt || '') <= new Date(endDate || '')
          )
        }
      },
      { title: 'User Email', field: 'user.email' },
      { title: 'Activity', field: 'activity' },
      { title: 'Module Name', field: 'moduleName' },
    ],
    [],
  );

    //<CustomDatePicker {...props} />,
  //= =================================================================================================

  // Prepare the data for MaterialTable
  // Convert Auditlogs' time format
  auditlogs?.forEach(auditlog => {
    auditlog.updatedAt = moment(auditlog.updatedAt).format("YYYY-MM-DD HH:mm:ss")
  })

  //= =================================================================================================
  
  // Prepare the options for MaterialTable

  
  
  const options = useMemo(() => calculateOptions(readRowNum,{search: true, showTitle: false, filtering: true, sorting: true}), [readRowNum]);

  //= =================================================================================================


  // Prepare the action for the MaterialTable
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState('');
  // onClick function for action
  const handleClickOpen = (rowData: AuditLog) => {
    setOpen(true);
    setDetail(
      `AT ${rowData.updatedAt}
      USER: ${rowData.user.email}
      PERFORMED: ${rowData.activity}
      FOR DOCUMENT: ${rowData.recordId}
      IN COLLECTION: ${rowData.moduleName}
      ==============================================
      the previous value for the document was: ${JSON.stringify(rowData.oldValue, null, '\t')}
      ==============================================
      now the new value for the document is: ${JSON.stringify(rowData.newValue, null, '\t')}`,
    );
  };
  const handleClose = () => {
    setOpen(false);
  };
  const actions: Action<AuditLog>[] = [
    {
      icon: () => <FindInPageIcon />, 
      tooltip: "Detailed Information",
      onClick: (_: any, rowData: AuditLog | AuditLog[]) => {
        if (!Array.isArray(rowData)) {
          handleClickOpen(rowData);
        }
      }
    }
  ]

  //update combinedlogs format
  useEffect(() => {
    setRowNum(combinedlogs?.length || 0)
    combinedlogs?.forEach(auditlog => {
      auditlog.updatedAt = moment(auditlog.updatedAt).format("YYYY-MM-DD HH:mm:ss")
    })
  }, [combinedlogs])

  //update auditlogs format and feed it into combinedlogs
  useEffect(() => {
    setRowNum(auditlogs?.length || 0)
    setCombinedLogs(auditlogs?.sort((a,b)=>b.updatedAt!.localeCompare(a.updatedAt!)))
  }, [auditlogs])

  //merge the auditlogs with the fetched archivelogs, if they exist
  useEffect(() => { 
    if (archivelogs){
      archivelogs?.forEach(auditlog => {
        auditlog.updatedAt = moment(auditlog.updatedAt).format("YYYY-MM-DD HH:mm:ss")
      })
      if(auditlogs !== undefined&& archivelogs !== undefined) {
        //setAuditLogs(auditlogs.concat(archivelogs)) 
        setCombinedLogs(auditlogs.concat(archivelogs).sort((a,b)=>b.updatedAt!.localeCompare(a.updatedAt!)))
      }
    }
  }, [ archivelogs]);

  //function to retrieve the archives from the archivelog
  const merge = (start: Date) => {
    if (start < archivedDate){
      console.log(start + " " + archivedDate)
      AuditLogController.fetchArchive(new Date(start), new Date(archivedDate))
      .then(res => { 
        setArchiveLogs(res)
      })
      setArchivedDate(start)
    }
  }

  //==================================================================================================

  return <Fragment>
            <MaterialTable
              key={readRowNum}
              columns={!!combinedlogs ? columns : preColumns} 
              data={!!combinedlogs ? combinedlogs : preLogs} 
              options={options} 
              actions={!!combinedlogs ? actions : undefined} 
            />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              fullWidth
              maxWidth={"md"}
            >
              <DialogTitle id="alert-dialog-title">{"Detailed Audit Information:"}</DialogTitle>
              <DialogContent>
                <DialogContentText style={{whiteSpace: 'pre-wrap'}}> 
                  {detail}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
} // End of defining Table contents


//tools needed for tabs: a11yProps, TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

//props used for tabs
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


// any type since props unused
const AuditLog = (props: any) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return  (
  <div>
    <AuditLogHeader />
    <Paper>
      
      {/* Tab structure defined here */}
      <AppBar
        position="static"
        color="transparent"
        style={{ background: 'transparent', boxShadow: 'none' }}
      >
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs"
          indicatorColor="primary"
          >
          <Tab label="AuditLog" {...a11yProps(0)} />
          <Tab label="Purge and Archive" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {/* Corresponding tab contents here */}
      <TabPanel value={value} index={0}>
        <div className="AuditLogPage">
          <AuditLogTable {...props} />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PurgeArchive></PurgeArchive>
      </TabPanel>
    </Paper>
  </div>
  
  );

}

export default AuditLog;
