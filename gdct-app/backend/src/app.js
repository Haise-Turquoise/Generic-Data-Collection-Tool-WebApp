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
import { errorHandler } from './middlewares/shared';
import MenuItemController from './controllers/MenuItem';
import MenuController from './controllers/Menu';
import UsersController from './controllers/Users/controller';

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
    cookie: { maxAge: 3600000 },
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', Container.get(ProgramController));
app.use('/', Container.get(ReportingPeriodController));
app.use('/', Container.get(SheetNameController));
app.use('/', Container.get(ColumnNameController));
app.use('/', Container.get(OrgController));

app.use('/', Container.get(AuthController));
app.use('/public', Container.get(UserController));

app.use('/template_manager', Container.get(TemplateController));
app.use('/template_manager', Container.get(TemplatePackageController));
app.use('/template_manager', Container.get(TemplateTypeController));

app.use('/designer', Container.get(StatusController));

app.use('/submission_manager', Container.get(SubmissionPeriodController));
app.use('/submission_manager', Container.get(SubmissionController));

app.use('/COA_manager', Container.get(COAController));
app.use('/COA_manager', Container.get(COATreeController));
app.use('/COA_manager', Container.get(COAGroupController));

app.use('/workflow_manager', Container.get(WorkflowController));

app.use('/', Container.get(UsersController));

app.use(
  '/role_manager',
  // auth.required,
  // Container.get(Auth).authorized,
  Container.get(AppSysController),
);
app.use(
  '/role_manager',
  // auth.required,
  // Container.get(Auth).authorized,
  Container.get(AppRoleController),
);
app.use(
  '/role_manager',
  // auth.required,
  // Container.get(Auth).authorized,
  Container.get(AppSysRoleController),
);
app.use(
  '/role_manager',
  // auth.required,
  // Container.get(Auth).authorized,
  Container.get(AppRoleResourceController),
);
app.use(
  '/role_manager',
  // auth.required,
  // Container.get(Auth).authorized,
  Container.get(AppResourceController),
);

app.use('/', Container.get(MenuController));
app.use('/', Container.get(MenuItemController));

app.use(errorHandler);

export default app;
