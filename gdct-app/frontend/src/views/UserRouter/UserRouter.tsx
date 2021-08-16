import React from 'react';
import { Switch, Route } from 'react-router-dom';

//@ts-ignore
import NotFound from '../../components/NotFound';
import Users from './Users';
import UserInfo from './UserInfo';
import UserPermissions from './UserPermissions'

const UserRouter = () => (
  <Switch>
    <Route exact path="/admin/user_management/:_id" component={UserInfo} />
    <Route exact path="/admin/user_management/" component={Users} />
    <Route exact path="/admin/user_management/permissions/:_id" component={UserPermissions} />
    <Route component={NotFound} />
  </Switch>
);

export default UserRouter;
