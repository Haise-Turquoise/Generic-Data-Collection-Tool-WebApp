import React, { useState, useEffect } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';

import { CircularProgress, Grid } from '@material-ui/core';
import AuthPage from './components/AuthPage';
import Error from './views/authError';
import AuthController from './controllers/Auth';
import Login from './views/Login';
import RoleManagement from './views/UserRoleManagement/UserRoleManagement';
import Logout from './views/Logout';
import GDCTMenu from './views/GDCTMenu';
import ModifyProfileRouter from './views/ModifyProfileRouter';
import Programs from './views/Programs';
import Statuses from './views/Statuses';
import RequestManagement from './views/RequestManagement';

import ReportingPeriods from './views/ReportingPeriods/ReportingPeriods';
import AppConfigs from './views/AppConfigs';
import SheetNames from './views/SheetNames';
import UserRouter from './views/UserRouter';
import ReportRouter from './views/ReportingPeriods';
import TemplateRouter from './views/TemplateRouter';
import OrgRouter from './views/OrganizationRouter';
import OrganizationGroups from './views/OrganizationGroup';
import SubmissionRouter from './views/SubmissionRouter';
import RoleRouter from './views/RoleRouter';
import COARouter from './views/COARouter';
import WorkflowRouter from './views/WorkflowRouter';
import Register from './views/UserRegistrationRouter';
import UpdatePassword from './views/UserNewPassword';
import MasterValuePopulation from './views/MasterValuePopulation';
import AuditLog from './views/AuditLog';
import TransferStatus from './views/TransferStatus/TransferStatus';
import { ROUTE_WORKFLOW, ROUTE_TEMPLATE_PCKGS, ROUTE_CATEGORY } from './constants/routes';

import './App.scss';
import UnitValidation from './views/UnitValidation';
// import './i18n';

//here are some comments

const PrivateRouter = ({ setLoggedIn }: {setLoggedIn: (value: boolean) => void}) => {
  return (
    <Switch>
      <Route exact path="/" component={GDCTMenu} />
      <Route path="/template" component={TemplateRouter} />
      <Route path="/report" component={ReportRouter} />
      <Route path="/submission" component={SubmissionRouter} />
      <Route path={ROUTE_TEMPLATE_PCKGS} component={TemplateRouter} />
      <Route path="/admin/auditlog" component={AuditLog} />
      <Route path="/admin/populate" component={MasterValuePopulation} />
      <Route path="/admin/organization" component={OrgRouter} />
      <Route path="/admin/organization/group" component={ OrganizationGroups } />
      <Route path="/admin/submission" component={SubmissionRouter} />
      <Route path="/admin/role" component={RoleRouter} />
      <Route path={ROUTE_CATEGORY} component={COARouter} />
      <Route exact path="/admin/configuration" component={AppConfigs} />
      <Route exact path="/admin/business_rule_configure" component={undefined} />
      <Route path="/admin/user_management" component={UserRouter} />
      <Route exact path="/admin/program" component={Programs} />
      <Route exact path="/admin/status" component={Statuses} />
      <Route exact path="/request_management" component={RequestManagement} />
      <Route path="/user/profile" component={ModifyProfileRouter} />
      <Route exact path="/admin/reporting_period" component={ReportingPeriods} />
      <Route path={ROUTE_WORKFLOW} component={WorkflowRouter} />
      <Route exact path="/admin/roleManagement" component={RoleManagement} />
      <Route exact path="/admin/TransferStatus" component={TransferStatus} />
      {/* <Route path="/submission_manager" component={SubmissionRouter} /> */}
      <Route exact path="/admin/sheetName" component={SheetNames} />
      {/* <Route path={ROUTE_COLUMN_NAMES} component={ColumnNames} /> */}
      <Route exact path="/admin/unitOfMeasurement" component={UnitValidation} />
      <Route
        exact
        path="/logout"
        render={props => <Logout {...props} setLoggedIn={setLoggedIn} />}
      />
      <Redirect from="*" to="/" />
    </Switch>
  );
};
const PublicRouter = ({ setLoggedIn }: {setLoggedIn: (value: boolean) => void}) => {
  return (
    <Switch>
      <Route exact path="/register" component={Register} />
      <Route exact path="/updatePassword" component={UpdatePassword} />
      <Route exact path="/login" render={props => <Login {...props} setLoggedIn={setLoggedIn} />} />
      <Route exact path="/auth/error" component={Error} />
      <Redirect from="*" to="/login" />
    </Switch>
  );
};

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);

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
