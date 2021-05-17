import React, { Fragment, useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import MaterialTable from 'material-table';
import { Paper, Typography, Button,
         Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import FindInPageIcon from '@material-ui/icons/FindInPage';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { getAuditLogRequest } from '../../store/thunks/AuditLog';
import { selectAuditLogStore } from '../../store/AuditLogStore/selectors';

// Title Text
const AuditLogHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Audit Log</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// A calendar for selecting dates
const CustomDatePicker = (props) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  return (
    <Fragment>
      <label>From:</label>
      <DatePicker id="startDatePicker"
        selected={startDate}
        dateFormat={"yyyy-MM-dd HH:mm"}
        onChange={(selectedDate) => { 
          // @ts-ignore
          setStartDate(selectedDate)
          props.onFilterChanged(props.columnDef.tableData.id, selectedDate);
        }}
        closeOnScroll={e => e.target === document}
        showTimeSelect
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      <br/>
      <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To:</label>
      <DatePicker id="endDatePicker"
        selected={endDate}
        dateFormat={"yyyy-MM-dd HH:mm"}
        onChange={(selectedDate) => {
          // @ts-ignore
          setEndDate(selectedDate)
          props.onFilterChanged(props.columnDef.tableData.id, selectedDate);
        }}
        closeOnScroll={e => e.target === document}
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
  const dispatch = useDispatch();

  //==================================================================================================
  
  // Prepare the table columns for MaterialTable
  const columns = useMemo(
    () => [
      { title: 'Time', 
        field: 'timestamp', 
        // Use Datepicker as filter
        filterComponent: (props) => <CustomDatePicker {...props}/>,
        // must have "term" as an input even it is not used
        customFilterAndSearch: (term, rowData) => {
          const startDate = document.getElementById("startDatePicker").getAttribute("value")
          const endDate = document.getElementById("endDatePicker").getAttribute("value")
          return new Date(rowData.timestamp) >= new Date(startDate) && new Date (rowData.timestamp) <= new Date(endDate)
        }
      },
      { title: 'User Email', field: 'user.email' },
      { title: 'Activity', field: 'activity' },
      { title: 'Module Name', field: 'moduleName', filtering: false},
    ],
    [],
  );
  
  //==================================================================================================
  
  // Prepare the options for MaterialTable
  const options = useMemo(
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

  //==================================================================================================

  // Prepare the data for MaterialTable
  let { auditlogs } = useSelector(
    state => ({
      auditlogs: selectFactoryRESTResponseTableValues(selectAuditLogStore)(state),
    }),
    shallowEqual,
  );
  // Convert Auditlogs' time format
  auditlogs.forEach(auditlog => {
    auditlog.timestamp = moment(auditlog.timestamp).format("YYYY-MM-DD HH:mm:ss")
  })

  //==================================================================================================

  // Prepare the action for the MaterialTable
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState("");
  // onClick function for action
  const handleClickOpen = (rowData) => {
    setOpen(true);
    setDetail(
      `AT ${rowData.timestamp}
      USER: ${rowData.user.email}
      PERFORMED: ${rowData.activity}
      FOR DOCUMENT: ${rowData.recordId}
      IN COLLECTION: ${rowData.moduleName}
      ==============================================
      the previous value for the document was: ${JSON.stringify(rowData.oldValue, null, "\t")}
      ==============================================
      now the new value for the document is: ${JSON.stringify(rowData.newValue, null, "\t")}`
    )
  };
  const handleClose = () => {
    setOpen(false);
  };
  const actions = [
    {
      icon: () => <FindInPageIcon />, 
      tooltip: "Detail Information",
      onClick: (event, rowData) => {
        handleClickOpen(rowData);
      }
    }
  ]

  //==================================================================================================
  
  // Dispatch GET on load
  useEffect(() => {
    dispatch(getAuditLogRequest());
  }, [dispatch]);

  return <Fragment>
            <MaterialTable 
              columns={columns} 
              data={auditlogs} 
              options={options} 
              actions={actions} 
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

const AuditLog = props => (
  <div className="AuditLogPage">
    <AuditLogHeader />
    <AuditLogTable {...props} />
  </div>
);

export default AuditLog;
