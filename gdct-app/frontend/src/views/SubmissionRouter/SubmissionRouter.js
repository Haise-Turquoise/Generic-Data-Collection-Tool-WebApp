import React from 'react';

import { Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';

import SubmissionPeriods from './SubmissionPeriods';
import Submissions from './Submissions';
import Submission from './Submission';
import SubmissionDashboard from './SubmissionDashboard';
import CreateSubmission from './CreateSubmission';
import EditSubmission from './EditSubmission';

const SubmissionRouter = () => {
  return (
    <Switch>
      <Route exact path="/admin/submission/submissionPeriods" component={SubmissionPeriods} />
      <Route exact path="/admin/submission/submissions" component={Submissions} />
      <Route exact path="/admin/submission/submissions/:_id" component={Submission} />
      <Route exact path="/admin/submission/submission" component={Submission} />
      <Route exact path="/admin/submission/dashboard" component={SubmissionDashboard} />
      <Route exact path="/admin/submission/createSubmission/:id" component={CreateSubmission} />
      <Route exact path="/admin/submission/editSubmission/:id" component={EditSubmission} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default SubmissionRouter;
