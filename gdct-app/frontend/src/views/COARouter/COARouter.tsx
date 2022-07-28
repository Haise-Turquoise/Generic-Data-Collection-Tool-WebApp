import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';
import COATrees from './COATrees';
import COATree from './COATree';
import COAGroups from './COAGroups';
import COAs from './Categories';
import Attributes from './Attributes';
import AttributeMap from './AttributeMap';
import COAGenerator from './COAGenerator';
import {
  ROUTE_CATEGORY_CATEGORIES,
  ROUTE_CATEGORY_GROUPS,
  ROUTE_CATEGORY_TREES,
  ROUTE_CATEGORY_ATTRIBUTES,
  ROUTE_CATEGORY_GENERATE,
  ROUTE_CATEGORY_ATTRIBUTEMAP,
//@ts-ignore
} from '../../constants/routes';

const COARouter = () => (

  <Switch>
    <Route exact path={ROUTE_CATEGORY_GROUPS} component={COAGroups} />
    <Route exact path={ROUTE_CATEGORY_CATEGORIES} component={COAs} />
    <Route exact path={ROUTE_CATEGORY_TREES} component={COATrees} />
    <Route exact path={`${ROUTE_CATEGORY_TREES}/:_id`} component={COATree} />
    <Route exact path={ROUTE_CATEGORY_ATTRIBUTES} component={Attributes} />
    <Route exact path={ROUTE_CATEGORY_ATTRIBUTEMAP} component={AttributeMap}/>
    <Route exact path={ROUTE_CATEGORY_GENERATE} component={COAGenerator} />
    <Route component={NotFound} />
  </Switch>
);

export default COARouter;
