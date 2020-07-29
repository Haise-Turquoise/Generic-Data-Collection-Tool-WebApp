import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';

import SubmissionPeriods from './SubmissionPeriods';
import Submissions from './Submissions';
import Submission from './Submission';

const SubmissionRouter = () => {
  return (
    <Switch>
      <Route exact path="/admin/submission/period" component={SubmissionPeriods} />
      <Route exact path="/admin/submission/type" component={Submissions} />
      <Route exact path="/admin/submission/type/:_id" component={Submission} />
      <Route exact path="/admin/submission/type" component={Submission} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default SubmissionRouter;
