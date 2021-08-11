import React from 'react';

import { Switch, Route } from 'react-router-dom';

//@ts-ignore
import NotFound from '../../components/NotFound';
import AppSyses from './AppSyses';
import AppSysRoles from './AppSysRoles';
import AppRoles from './AppRoles';
import AppResources from './AppResources';
import AppRoleResourcesManagement from './AppRoleResourcesManagement';
import AppRoleResourceManagement from './AppRoleResourceManagement';
import AppRoleButtonManagement from './AppRoleButtonManagement';
import AppRoleButtonsManagement from './AppRoleButtonsManagement';
import AppRoleWorkflowStatusManagement from './AppWorkflowManagement/AppWorkflowManagement';
import AppRoleWorkflowsManagement from './AppWorkflowsManagement.tsx/AppWorkflowsManagements';

const TemplateRouter = () => (
  <Switch>
    <Route exact path="/admin/role/appsystem" component={AppSyses} />
    <Route exact path="/admin/role/appsysrole" component={AppSysRoles} />
    <Route exact path="/admin/role/approle" component={AppRoles} />
    <Route exact path="/admin/role/appresource" component={AppResources} />
    <Route
      exact
      path="/admin/role/app_role_resource_management"
      component={AppRoleResourcesManagement}
    />
    <Route
      exact
      path="/admin/role/app_role_resource_management/:_id"
      component={AppRoleResourceManagement}
    />
    <Route
      exact
      path="/admin/role/app_role_button_management"
      component={AppRoleButtonsManagement}
    />
    <Route
      exact
      path="/admin/role/app_role_button_management/:role"
      component={AppRoleButtonManagement}
    />
    <Route
      exact
      path="/admin/role/app_role_workflow_management"
      component={AppRoleWorkflowsManagement}
    />
    <Route
      exact
      path="/admin/role/app_role_workflow_management/:role"
      component={AppRoleWorkflowStatusManagement}
    />
    <Route component={NotFound} />
  </Switch>
);

export default TemplateRouter;
