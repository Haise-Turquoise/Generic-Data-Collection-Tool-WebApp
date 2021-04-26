import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';

import ModifyPermission from './ModifyPermission/ModifyPermission';
import ModifyUserInfo from './ModifyUserInfo/ModifyUserInfo';

import {

    ROUTE_MODIFY_PROFILE_USER_INFO,
    ROUTE_MODIFY_PROFILE_USER_PERMISSION,

  } from '../../constants/routes';




const ModifyProfileRouter = () => (
    <Switch>
      <Route exact path={ROUTE_MODIFY_PROFILE_USER_PERMISSION} component={ModifyPermission} />
      <Route exact path={ROUTE_MODIFY_PROFILE_USER_INFO} component={ModifyUserInfo} />
      <Route component={NotFound} />
    </Switch>
  );

export default ModifyProfileRouter; 
