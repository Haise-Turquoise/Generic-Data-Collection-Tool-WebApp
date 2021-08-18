import React, { Fragment, useMemo, useEffect, useState } from 'react';

import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import MaterialTable, { Action, Column, EditCellColumnDef, Filter, Options } from 'material-table';
import { Paper, Typography, Button,
         Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import AuditLogController from '../../controllers/AuditLog'

import AuditLog from '../../types/auditlog';
import { fetchWithStatus } from '../../tools/misc';

// Title Text
const AuditLogHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Audit Log</Typography>
    </Paper>
  );
};

// A calendar for selecting dates
const CustomDatePicker = (props: {
  columnDef: Column<AuditLog>,
  onFilterChanged: (rowId: string, value: any) => void,
}) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
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
        dropdownMode="select"
      />
    </Fragment>
  );
};

// Table contents
const AuditLogTable = () => {
  const [auditlogs, setAuditLogs] = useState<AuditLog[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus(AuditLogController, setAuditLogs, setStatus)
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
    timestamp: '',
  }]

  // Prepare the table columns for MaterialTable
  const columns: Column<AuditLog>[] = useMemo(
    () => [
      {
        title: 'Time',
        field: 'timestamp',
        // Use Datepicker as filter
        filterComponent: props => <CustomDatePicker {...props} />,
        // must have "term" as an input even it is not used
        customFilterAndSearch: (_term, rowData) => {
          const startDate = document.getElementById("startDatePicker")!.getAttribute("value")
          const endDate = document.getElementById("endDatePicker")!.getAttribute("value")
          return (
            new Date(rowData.timestamp || '') >= new Date(startDate || '') && 
            new Date (rowData.timestamp || '') <= new Date(endDate || '')
          )
        }
      },
      { title: 'User Email', field: 'user.email' },
      { title: 'Activity', field: 'activity' },
      { title: 'Module Name', field: 'moduleName' },
    ],
    [],
  );

  //= =================================================================================================

  // Prepare the options for MaterialTable
  const options: Options<AuditLog> = useMemo(
    () => (
      {
        actionsColumnIndex: -1,
        search: false,
        showTitle: false,
        filtering: true
      }
    ), 
    []
  );

  //= =================================================================================================

  // Prepare the data for MaterialTable
  // Convert Auditlogs' time format
  auditlogs?.forEach(auditlog => {
    auditlog.timestamp = moment(auditlog.timestamp).format("YYYY-MM-DD HH:mm:ss")
  })

  //= =================================================================================================

  // Prepare the action for the MaterialTable
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState('');
  // onClick function for action
  const handleClickOpen = (rowData: AuditLog) => {
    setOpen(true);
    setDetail(
      `AT ${rowData.timestamp}
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

  //==================================================================================================

  return <Fragment>
            <MaterialTable 
              columns={!!auditlogs ? columns : preColumns} 
              data={!!auditlogs ? auditlogs : preLogs} 
              options={options} 
              actions={!!auditlogs ? actions : undefined} 
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

// any type since props unused
const AuditLog = (props: any) => (
  <div className="AuditLogPage">
    <AuditLogHeader />
    <AuditLogTable {...props} />
  </div>
);

export default AuditLog;
