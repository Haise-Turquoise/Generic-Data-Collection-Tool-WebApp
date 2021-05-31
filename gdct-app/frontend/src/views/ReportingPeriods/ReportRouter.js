import React from 'react';

import { Switch, Route } from 'react-router-dom';
import '../../images/static_report.jpg'

const ReportRouter = () => (
  <Switch>
    <Route
      exact path="/report"
      component={() => <img src='/static_report.jpg' alt='static report' />}
    />
  </Switch>
);

export default ReportRouter;
