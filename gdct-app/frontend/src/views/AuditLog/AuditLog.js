import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';

import { getAuditLogRequest } from '../../store/thunks/AuditLog';
import { selectAuditLogStore } from '../../store/AuditLogStore/selectors';

//import './AuditLog.scss';

const AuditLogHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Audit Log</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AuditLogTable = () => {
  const dispatch = useDispatch();

  // Prepare the table columns for MaterialTable
  const columns = useMemo(
    () => [
      { title: 'Time', field: 'timestamp' },
      { title: 'User', field: 'user.name' },
      { title: 'Activity', field: 'activity' },
    ],
    [],
  );
  
  // Prepare the options for MaterialTable
  const options = useMemo(() => ({ actionsColumnIndex: -1, search: true, showTitle: false }), []);
  
  // Prepare the data for MaterialTable on initial load
  const { auditlogs } = useSelector(
    state => ({
      auditlogs: selectFactoryRESTResponseTableValues(selectAuditLogStore)(state),
    }),
    shallowEqual,
  );
  useEffect(() => {
    dispatch(getAuditLogRequest());
  }, [dispatch]);

  return <MaterialTable columns={columns} data={auditlogs} options={options} />;
};

const AuditLog = props => (
  <div className="AuditLogPage">
    <AuditLogHeader />
    <AuditLogTable {...props} />
  </div>
);

export default AuditLog;
