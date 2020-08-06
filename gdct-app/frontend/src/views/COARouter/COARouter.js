import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';
import COATrees from './COATrees';
import COATree from './COATree';
import COAGroups from './COAGroups';
import COAs from './COAs';
import {
  ROUTE_CATEGORY_CATEGORIES,
  ROUTE_CATEGORY_GROUPS,
  ROUTE_CATEGORY_TREES,
} from '../../constants/routes';

const TemplateRouter = () => (
  <Switch>
    <Route exact path={ROUTE_CATEGORY_GROUPS} component={COAGroups} />
    <Route exact path={ROUTE_CATEGORY_CATEGORIES} component={COAs} />
    <Route exact path={ROUTE_CATEGORY_TREES} component={COATrees} />
    <Route exact path={`${ROUTE_CATEGORY_TREES}/:_id`} component={COATree} />
    <Route component={NotFound} />
  </Switch>
);

export default TemplateRouter;
