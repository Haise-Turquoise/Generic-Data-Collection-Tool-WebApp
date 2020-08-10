import React, { useState, useEffect } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';

import { CircularProgress, Grid } from '@material-ui/core';
import AuthPage from './components/AuthPage';
import Error from './views/authError';
import AuthController from './controllers/Auth';
import Login from './views/Login';
import RoleManagement from './views/RoleManagement';
import Logout from './views/Logout';
import GDCTMenu from './views/GDCTMenu';
import Programs from './views/Programs';
import Statuses from './views/Statuses';
import ReportingPeriods from './views/ReportingPeriods';

import UserRouter from './views/UserRouter';
import ReportRouter from './views/ReportRouter';
import TemplateRouter from './views/TemplateRouter';
import OrgRouter from './views/OrganizationRouter';
import SubmissionRouter from './views/SubmissionRouter';
import RoleRouter from './views/RoleRouter';
import COARouter from './views/COARouter';
import WorkflowRouter from './views/WorkflowRouter';
import Register from './views/UserRegistrationRouter';
import MasterValuePopulation from './views/MasterValuePopulation';
import { ROUTE_WORKFLOW, ROUTE_TEMPLATE_PCKGS, ROUTE_CATEGORY } from './constants/routes';

import './App.scss';

const PrivateRouter = ({ setLoggedIn }) => {
  return (
    <Switch>
      <Route exact path="/" component={GDCTMenu} />
      <Route path="/template" component={TemplateRouter} />
      <Route path="/report" component={ReportRouter} />
      <Route path="/submission" component={SubmissionRouter} />
      <Route path={ROUTE_TEMPLATE_PCKGS} component={TemplateRouter} />
      <Route path="/admin/populate" component={MasterValuePopulation} />
      <Route path="/admin/organization" component={OrgRouter} />
      <Route path="/admin/submission" component={SubmissionRouter} />
      <Route path="/admin/role" component={RoleRouter} />
      <Route path={ROUTE_CATEGORY} component={COARouter} />
      <Route exact path="/admin/configuration" component={null} />
      <Route exact path="/admin/business_rule_configure" component={null} />
      <Route path="/admin/user_management" component={UserRouter} />
      <Route exact path="/admin/program" component={Programs} />
      <Route exact path="/admin/status" component={Statuses} />
      <Route exact path="/admin/reporting_period" component={ReportingPeriods} />
      <Route path={ROUTE_WORKFLOW} component={WorkflowRouter} />
      <Route exact path="/admin/roleManagement" component={RoleManagement} />
      {/* <Route path="/submission_manager" component={SubmissionRouter} /> */}
      {/* <Route path="/sheetNames" component={SheetNames} />{' '} */}
      {/* <Route path={ROUTE_COLUMN_NAMES} component={ColumnNames} /> */}
      <Route
        exact
        path="/logout"
        render={props => <Logout {...props} setLoggedIn={setLoggedIn} />}
      />
      <Redirect from="*" to="/" />
    </Switch>
  );
};
const PublicRouter = ({ setLoggedIn }) => {
  return (
    <Switch>
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" render={props => <Login {...props} setLoggedIn={setLoggedIn} />} />
      <Route exact path="/auth/error" component={Error} />
      <Redirect from="*" to="/login" />
    </Switch>
  );
};

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(null);
  useEffect(() => {
    AuthController.profile()
      .then(res => {
        setLoggedIn(res.status === 'ok');
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, []);

  return (
    <div className="appContainer">
      {isLoggedIn === null ? (
        <Grid container style={{ height: '100vh' }} justify="center" alignContent="center">
          <Grid item>
            <CircularProgress color="secondary" />
          </Grid>
        </Grid>
      ) : isLoggedIn ? (
        <AuthPage>
          <PrivateRouter setLoggedIn={setLoggedIn} />
        </AuthPage>
      ) : (
        <PublicRouter setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
};

export default App;
