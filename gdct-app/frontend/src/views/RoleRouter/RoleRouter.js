import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';
import AppSyses from './AppSyses';
import AppSysRoles from './AppSysRoles';
import AppRoles from './AppRoles';
import AppResources from './AppResources';
import AppRoleResources from './AppRoleResources';

const TemplateRouter = () => (
  <Switch>
    <Route exact path="/admin/role/appsys" component={AppSyses} />
    <Route exact path="/admin/role/appsysrole" component={AppSysRoles} />
    <Route exact path="/admin/role/approle" component={AppRoles} />
    <Route exact path="/admin/role/appresource" component={AppResources} />
    <Route exact path="/admin/role/app_role_resource" component={AppRoleResources} />
    <Route component={NotFound} />
  </Switch>
);

export default TemplateRouter;
