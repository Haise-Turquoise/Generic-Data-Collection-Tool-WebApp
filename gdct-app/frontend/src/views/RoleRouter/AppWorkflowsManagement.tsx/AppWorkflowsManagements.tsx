import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import AppRoleController from '../../../controllers/AppRole'
import roleSubmissionButtonController from '../../../controllers/RoleSubmissionButton';
import {
  calculateOptions,
  formatTimestamp,
} from '../../../tools/misc';
import { RouteComponentProps } from 'react-router';

import AppRole from '../../../types/approle';
import roleWorkflowStatusController from '../../../controllers/RoleWorkflowStatus';

interface AppRolePlus extends AppRole {
  modifiedOn: string,
  updatedBy: string,
}

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
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  const [appRoles, setAppRoles] =
    useState<AppRolePlus[] | undefined>(undefined)

  useEffect(() => {
    (
      async () => {
        const appRoleRes = await AppRoleController.fetch()
        const workflowsRes = await roleWorkflowStatusController.findAll()
        if (!workflowsRes) {
          setStatus('NOT ALLOWED')
          return
        }
        const appRolesPlus: AppRolePlus[] = []
        for (const appRole of appRoleRes) {
          const workflowRes = workflowsRes.find(workflow => workflow.role === appRole.name)
          appRolesPlus.push({
            ...appRole,
            modifiedOn: workflowRes ? formatTimestamp(workflowRes.modifiedOn) : '',
            updatedBy: workflowRes ? workflowRes.updatedBy : '',
          })
        }
        setAppRoles(appRolesPlus)
      }
    )()
  }, [])

  // table stuff while loading
  const preColumns: Column<AppRolePlus>[] = [{title: 'Name', field: 'updatedBy'}]
  const preAppRoleWorkflows: AppRolePlus[] = [{
    _id: '',
    code: '',
    name: '',
    isActive: false,
    timestamp: '',
    updatedBy: status,
    modifiedOn: '',
  }]

  useEffect(()=>{
    setRowNum(appRoles?.length || 1)
  }, [appRoles])
  
  // Prepare the columns for material table
  const columns: Column<AppRolePlus>[] = useMemo(
    () => [
      { title: 'Application System Role', field: 'name' },
      { title: 'Modified On', field: 'modifiedOn' },
      { title: 'Updated By', field: 'updatedBy' },
    ],
    [],
  );
  // Prepare the actions for the material table
  const actions: Action<AppRolePlus>[] = useMemo(
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

  const options: Options<AppRolePlus> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

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
