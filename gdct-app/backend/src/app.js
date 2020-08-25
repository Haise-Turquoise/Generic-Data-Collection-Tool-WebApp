import express from 'express';

import 'reflect-metadata';

import { json, urlencoded } from 'body-parser';

import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import mongoStore from 'connect-mongo';
import compression from 'compression';

import { Container } from 'typedi';
import Database from './loaders/database';

import TemplateController from './controllers/Template';
import StatusController from './controllers/Status';
import ProgramController from './controllers/Program';
import TemplateTypeController from './controllers/TemplateType';
import TemplatePackageController from './controllers/TemplatePackage';
import SubmissionPeriodController from './controllers/SubmissionPeriod';
import OrgGroupController from './controllers/OrganizationGroup';
import ReportingPeriodController from './controllers/ReportingPeriod';
import COAController from './controllers/COA';
import COATreeController from './controllers/COATree';
import COAGroupController from './controllers/COAGroup';
import OrgController from './controllers/Organization';
import SheetNameController from './controllers/SheetName';
import AppSysController from './controllers/AppSys';
import AppRoleController from './controllers/AppRole';
import AppSysRoleController from './controllers/AppSysRole';
import SubmissionController from './controllers/Submission';
import ColumnNameController from './controllers/ColumnName';
import UserController from './controllers/User';
import AuthController from './controllers/Auth';
import AppRoleResourceController from './controllers/AppRoleResource/controller';
import AppResourceController from './controllers/AppResource';
import WorkflowController from './controllers/Workflow';
import { errorHandlerController } from './middlewares/shared';
import MenuItemController from './controllers/MenuItem';
import MenuController from './controllers/Menu';
import UsersController from './controllers/Users/controller';
import SubmissionNoteController from './controllers/SubmissionNote';
import { authorized } from './middlewares/auth/auth';

// https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications
const logger = require('morgan');

const app = express();
const cookieParser = require('cookie-parser');

export const dbUtil = new Database();

dbUtil.connect();

app.set('port', process.env.PORT);

app.use(cookieParser());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));

// app.use(cors());
app.use(cors({ credentials: true, origin: process.env.CLIENT_SERVER }));

app.use(compression());

app.use(logger('dev'));

require('./middlewares/passport/index')();

const CookieStore = mongoStore(session);
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 },
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  next();
});

app.use('/', Container.get(AuthController));
app.use('/', Container.get(MenuController));
app.use('/', Container.get(MenuItemController));
app.use('/', Container.get(UsersController));
app.use('/', Container.get(ProgramController));
app.use('/role_manager', Container.get(AppSysController));
app.use('/org_manager', Container.get(OrgController));
app.use('/orgGroup_manager', Container.get(OrgGroupController));
app.use('/user_management', Container.get(UserController));
app.use('/template_manager', Container.get(TemplateTypeController));

app.use('/', authorized, Container.get(ReportingPeriodController));
app.use('/', authorized, Container.get(SheetNameController));
app.use('/', authorized, Container.get(ColumnNameController));

app.use('/template_manager', authorized, Container.get(TemplateController));
app.use('/template_manager', authorized, Container.get(TemplatePackageController));

app.use('/designer', authorized, Container.get(StatusController));

app.use('/submission_manager', authorized, Container.get(SubmissionPeriodController));
app.use('/submission_manager', Container.get(SubmissionController));
app.use('/submissionNote_manager', authorized, Container.get(SubmissionNoteController));

app.use('/workflow_manager', authorized, Container.get(WorkflowController));
app.use('/COA_manager', authorized, Container.get(ColumnNameController));
app.use('/COA_manager', authorized, Container.get(COAController));
app.use('/COA_manager', authorized, Container.get(COATreeController));
app.use('/COA_manager', authorized, Container.get(COAGroupController));

app.use('/workflow_manager', authorized, Container.get(WorkflowController));

app.use('/role_manager', authorized, Container.get(AppRoleController));
app.use('/role_manager', authorized, Container.get(AppSysRoleController));
app.use('/role_manager', authorized, Container.get(AppRoleResourceController));
app.use('/role_manager', authorized, Container.get(AppResourceController));

app.use(errorHandlerController);

export default app;
