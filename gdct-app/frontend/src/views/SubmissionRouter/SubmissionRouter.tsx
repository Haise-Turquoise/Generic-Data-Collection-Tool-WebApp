import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';

import SubmissionPeriod from './SubmissionPeriods';
import Submission from './Submission';
import SubmissionDashboard from './SubmissionDashboard';
import CreateSubmission from './CreateSubmission';
import EditSubmission from './EditSubmission';

const SubmissionRouter = () => {
  return (
    <Switch>
      <Route exact path="/admin/submission/period" component={SubmissionPeriod} />
      <Route exact path="/admin/submission/submissions/:_id" component={Submission} />
      <Route exact path="/admin/submission/submissions" component={Submission} />
      <Route exact path="/submission/dashboard" component={SubmissionDashboard} />
      <Route exact path="/submission/createSubmission/:id" component={CreateSubmission} />
      <Route exact path="/submission/dashboard/editSubmission/:id" component={EditSubmission} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default SubmissionRouter;
