import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';
import AppSyses from './AppSyses';
import AppSysRoles from './AppSysRoles';
import AppRoles from './AppRoles';
import AppResources from './AppResources';
import AppRoleResourcesManagement from './AppRoleResourcesManagement';
import AppRoleResourceManagement from './AppRoleResourceManagement';

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
    <Route component={NotFound} />
  </Switch>
);

export default TemplateRouter;
