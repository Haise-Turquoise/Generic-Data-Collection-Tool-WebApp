import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import AppRoleController from '../../../controllers/AppRole'
//@ts-ignore
import ErrorBanner from '../../ErrorBanner';
import {
  calculateOptions,
  //@ts-ignore
} from '../../../tools/misc';
//@ts-ignore
import { RouteComponentProps } from 'react-router';

import AppRole from '../../../types/approle';

const AppRoleResourceHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">App Role Resources Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// Prepare the data for material table
const AppRoleResourceTable = ({ history }: RouteComponentProps) => {
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
  const preAppRoleResources: AppRole[] = [{
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

  const options: Options<AppRole> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

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
