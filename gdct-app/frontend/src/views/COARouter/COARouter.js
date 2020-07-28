import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';
import COATrees from './COATrees';
import COATree from './COATree';
import COAGroups from './COAGroups';
import COAs from './COAs';

const TemplateRouter = () => (
  <Switch>
    <Route exact path="/admin/coa/group" component={COAGroups} />
    <Route exact path="/admin/coa/category" component={COAs} />
    <Route exact path="/admin/coa/attribute" component={COATrees} />
    <Route exact path="/admin/coa/attribute/:_id" component={COATree} />
    <Route component={NotFound} />
  </Switch>
);

export default TemplateRouter;
