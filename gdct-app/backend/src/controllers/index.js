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
import MenuItemController from './MenuItem';
import MenuController from './Menu';
import UsersController from './Users/controller';
import SubmissionNoteController from './SubmissionNote';
import { authorized } from '../middlewares/auth/auth';
import GoogleApisController from './GoogleApis'
import TransferStatusController from './TransferStatus'
import TransferStatusService from '../services/TransferStatus'


export const routerManager = app => {
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

  // Oct 26, 2020
  // Used to handle requests from google
  app.use('/googleapis_manager', authorized, Container.get(GoogleApisController));

  // Jan 22, 2021
  // Use to handle transfer control
  
  app.use('/transferManager', authorized, Container.get(TransferStatusController));

  // const service = Container.get(TransferStatusService)
  // app.get('/transfer_manager/startService/:time', authorized, (req, res, next)=>{
  //   const { time } = req.params;
  //   service.startTransferProccess(time).then(()=>res.end()).catch(next);
  // })

  // app.get('/transfer_manager/stopService', authorized, (req, res, next)=>{
  //   service.closeCurrentTransferProcess().then(()=>res.end()).catch(next);
  // })

  
};
