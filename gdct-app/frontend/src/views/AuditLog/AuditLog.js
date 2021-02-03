import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
    getAuditLogRequest
} from '../../store/thunks/AuditLog';

import './AuditLog.scss';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectAuditLogStore } from '../../store/AuditLogStore/selectors';

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

  const { auditlogs } = useSelector(
    state => ({
      auditlogs: selectFactoryRESTResponseTableValues(selectAuditLogStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Time', field: 'timestamp' },
      { title: 'User', field: 'user' },
      { title: 'Activity', field: 'activity' },
    ],
    [],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: true, showTitle: false }), []);

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
