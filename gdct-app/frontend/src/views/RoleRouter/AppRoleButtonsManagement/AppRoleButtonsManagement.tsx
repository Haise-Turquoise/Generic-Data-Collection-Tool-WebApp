import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import AppRoleController from '../../../controllers/AppRole'
import {
  calculateOptions, formatTimestamp,
} from '../../../tools/misc';
import { RouteComponentProps } from 'react-router';
import AppRole from '../../../types/approle';
import roleSubmissionButtonController from '../../../controllers/RoleSubmissionButton';

interface AppRolePlus extends AppRole {
  modifiedOn: string,
  updatedBy: string,
}

const AppRoleResourceHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">App Role Buttons Management</Typography>
    </Paper>
  );
};

// Prepare the data for material table
const AppRoleResourceTable = ({ history }: RouteComponentProps) => {
  const [readRowNum, setRowNum] = useState(1);
  const [appRoles, setAppRoles] =
    useState<AppRolePlus[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

    useEffect(() => {
      (
        async () => {
          const appRoleRes = await AppRoleController.fetch()
          const buttonsRes = await roleSubmissionButtonController.findAll()
          if (!appRoleRes || !buttonsRes) {
            setStatus('NOT ALLOWED')
            return
          }
          const appRolesPlus: AppRolePlus[] = []
          for (const appRole of appRoleRes) {
            const buttonRes = buttonsRes.find(button => button.role === appRole.name)
            appRolesPlus.push({
              ...appRole,
              modifiedOn: buttonRes ? formatTimestamp(buttonRes.modifiedOn) : '',
              updatedBy: buttonRes ? buttonRes.updatedBy : '',
            })
          }
          setAppRoles(appRolesPlus)
        }
      )()
    }, [])

  // table stuff while loading
  const preColumns: Column<AppRolePlus>[] = [{title: 'Name', field: 'updatedBy'}]
  const preAppRoleResources: AppRolePlus[] = [{
    _id: '',
    code: '',
    name: '',
    isActive: false,
    updatedAt: '',
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
        tooltip: 'Manage App Role Resource',
        onClick: (_: any, appRole: AppRole | AppRole[]) => {
          if (!Array.isArray(appRole)) {
            history.push(`/admin/role/app_role_button_management/${appRole.name.replace(" ", "_")}`);
          }
        },
      },
    ],
    [history],
  );

  const options: Options<AppRolePlus> = useMemo(() => calculateOptions(readRowNum,{search: true, showTitle: false, filtering: false}), [readRowNum]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!appRoles ? columns : preColumns}
      actions={!!appRoles ? actions : undefined}
      data={!!appRoles ? appRoles : preAppRoleResources}
      options={options} />
  );
};

const AppRoleResourcesManagement = (props: RouteComponentProps) => (
  <div className="appRoleResourcePage">
    <AppRoleResourceHeader />
    <AppRoleResourceTable {...props} />
  </div>
);

export default AppRoleResourcesManagement;
