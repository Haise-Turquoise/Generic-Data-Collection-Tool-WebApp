import { Container } from 'typedi';
import TemplateController from './Template';
import StatusController from './Status';
import ProgramController from './Program';
import TemplateTypeController from './TemplateType';
import TemplatePackageController from './TemplatePackage';
import SubmissionPeriodController from './SubmissionPeriod';
import OrgGroupController from './OrganizationGroup';
import ReportingPeriodController from './ReportingPeriod';
import COAController from './COA';
import COATreeController from './COATree';
import COAGroupController from './COAGroup';
import OrgController from './Organization';
import SheetNameController from './SheetName';
import AppConfigController from './AppConfig';
import AppSysController from './AppSys';
import AppRoleController from './AppRole';
import AppSysRoleController from './AppSysRole';
import SubmissionController from './Submission';
import ColumnNameController from './ColumnName';
import UserController from './User';
import AuthController from './Auth';
import AppRoleResourceController from './AppRoleResource/controller';
import AppResourceController from './AppResource';
import WorkflowController from './Workflow';
import MenuController from './Menu';
import UsersController from './Users/controller';
import SubmissionNoteController from './SubmissionNote';
import AuditLogController from './AuditLog';
import MasterValueController from './MasterValue/controller';
import DataResumeController from './DataResume/controller';
import SpreadsheetApisController from './GoogleApis';
import TransferStatusController from './TransferStatus';
import SessionController from '../controllers/Session/Session';
import PackageStatusController from './PackageStatus/controller';

export const routerManager = app => {
  app.use('/', Container.get(AuthController));
  app.use('/', Container.get(MenuController));
  app.use('/admin/user_management', Container.get(UsersController));
  app.use('/', Container.get(ProgramController));
  app.use('/role_manager', Container.get(AppSysController));
  app.use('/org_manager', Container.get(OrgController));
  app.use('/orgGroup_manager', Container.get(OrgGroupController));
  app.use('/user_management', Container.get(UserController));
  app.use('/template_manager', Container.get(TemplateTypeController));
  app.use('/role_manager', Container.get(AppConfigController));
  app.use('/AuditLog', Container.get(AuditLogController));
  app.use('/Session', Container.get(SessionController));

  app.use('/', Container.get(ReportingPeriodController));
  app.use('/', Container.get(SheetNameController));
  app.use('/', Container.get(DataResumeController));
  app.use('/', Container.get(ColumnNameController));
  app.use('/', Container.get(MasterValueController));
  app.use('/template_manager', Container.get(TemplateController));
  app.use('/template_manager', Container.get(TemplatePackageController));

  app.use('/designer', Container.get(StatusController));

  app.use('/submission_manager', Container.get(SubmissionPeriodController));
  app.use('/submission_manager', Container.get(SubmissionController));
  app.use('/submissionNote_manager', Container.get(SubmissionNoteController));

  app.use('/workflow_manager', Container.get(WorkflowController));
  app.use('/COA_manager', Container.get(ColumnNameController));
  app.use('/COA_manager', Container.get(COAController));
  app.use('/COA_manager', Container.get(COATreeController));
  app.use('/COA_manager', Container.get(COAGroupController));

  app.use('/workflow_manager', Container.get(WorkflowController));

  app.use('/role_manager', Container.get(AppRoleController));
  app.use('/role_manager', Container.get(AppSysRoleController));
  app.use('/role_manager', Container.get(AppRoleResourceController));
  app.use('/role_manager', Container.get(AppResourceController));

  // Oct 26, 2020
  // Used to handle requests from google
  app.use('/googleapis_manager', Container.get(SpreadsheetApisController));

  // Jan 22, 2021
  // Use to handle transfer control
  
  app.use('/transferManager', Container.get(TransferStatusController));

  app.use('/report', Container.get(PackageStatusController))

};

