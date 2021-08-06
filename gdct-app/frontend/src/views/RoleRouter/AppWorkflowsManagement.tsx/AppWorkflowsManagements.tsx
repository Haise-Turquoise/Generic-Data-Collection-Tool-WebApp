import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import AppRoleController from '../../../controllers/AppRole'
import {
  calculateOptions,
} from '../../../tools/misc';
import { RouteComponentProps } from 'react-router';

import AppRole from '../../../types/approle';

const AppRoleWorkflowHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">App Role Workflows Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// Prepare the data for material table
const AppRoleWorkflowTable = ({ history }: RouteComponentProps) => {
  const [readRowNum, setRowNum] = useState(1);
  const [appRoles, setAppRoles] =
    useState<AppRole[] | undefined>(undefined)

  useEffect(() => {
    AppRoleController.fetch().then((res: unknown) => {
      setAppRoles(res as AppRole[])
    })
  }, [])

  // table stuff while loading
  const preColumns: Column<AppRole>[] = [{title: 'Name', field: 'updatedBy'}]
  const preAppRoleWorkflows: AppRole[] = [{
    _id: '',
    code: '',
    name: '',
    isActive: false,
    timestamp: '',
    updatedBy: 'LOADING...',
  }]

  useEffect(()=>{
    setRowNum(appRoles?.length || 1)
  }, [appRoles])
  
  // Prepare the columns for material table
  const columns: Column<AppRole>[] = useMemo(
    () => [
      { title: 'Application System Role', field: 'name' },
    ],
    [],
  );
  // Prepare the actions for the material table
  const actions: Action<AppRole>[] = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Manage App Role Workflow',
        onClick: (_: any, appRole: AppRole | AppRole[]) => {
          if (!Array.isArray(appRole)) {
            history.push(`/admin/role/app_role_workflow_management/${appRole.name.replace(" ", "_")}`);
          }
        },
      },
    ],
    [history],
  );

  const options: Options<AppRole> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!appRoles ? columns : preColumns}
      actions={!!appRoles ? actions : undefined}
      data={!!appRoles ? appRoles : preAppRoleWorkflows}
      options={options} />
  );
};

const AppRoleWorkflowsManagement = (props: RouteComponentProps) => (
  <div className="appRoleResourcePage">
    <AppRoleWorkflowHeader />
    <AppRoleWorkflowTable {...props} />
  </div>
);

export default AppRoleWorkflowsManagement;
