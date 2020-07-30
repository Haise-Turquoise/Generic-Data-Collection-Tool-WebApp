import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ROUTE_WORKFLOW, ROUTE_WORKFLOW_CREATE } from '../../constants/routes';
import Workflow from './Workflow';
import Workflows from './Workflows';

const WorkflowRouter = () => (
  <Switch>
    <Route
      exact
      path={ROUTE_WORKFLOW_CREATE}
      render={routeProps => <Workflow {...routeProps} type="create" />}
    />
    <Route exact path={ROUTE_WORKFLOW} component={Workflows} />
    <Route exact path={`${ROUTE_WORKFLOW}/:_id`} component={Workflow} />
  </Switch>
);

export default WorkflowRouter;
