import React from 'react';

import { Switch, Route } from 'react-router-dom';
import '../../images/static_report.jpg';
import PackageStatuses from './PackageStatus';

const ReportRouter = () => (
  <Switch>
    <Route
      exact
      path="/report"
      component={() => <img src="/static_report.jpg" alt="static report" />}
    />
    <Route exact path="/report/packageStatus" component={PackageStatuses} />
  </Switch>
);

export default ReportRouter;
