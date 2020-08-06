import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';
import Users from './Users';
import UserInfo from './UserInfo';

const OrgRouter = () => (
  <Switch>
    <Route exact path="/admin/user_management/:_id" component={UserInfo} />
    <Route exact path="/admin/user_management/" component={Users} />

    <Route component={NotFound} />
  </Switch>
);

export default OrgRouter;
