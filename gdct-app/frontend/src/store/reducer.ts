import { Action, combineReducers } from 'redux';

import TemplatesStore from './TemplatesStore/store';
import TemplateTypesStore from './TemplateTypesStore/store';
import TemplatePackagesStore from './TemplatePackagesStore/store';
import ModifyUserInfoStore from './ModifyUserInfo/store';
import COAGroupsStore from './COAGroupsStore/store';
import COAsStore from './COAsStore/store';
import AppRolesStore from './AppRolesStore/store';
import AppResourcesStore from './AppResourcesStore/store';
import AppRoleResourcesStore from './AppRoleResourcesStore/store';
import AppSysesStore from './AppSysesStore/store';
import AppSysRolesStore from './AppSysRolesStore/store';
import AuditLogStore from './AuditLogStore/store';
import DialogsStore from './DialogsStore/store';
import ReportingPeriodsStore from './ReportingPeriodsStore/store';

import AppConfigsStore from './AppConfigsStore/store';
import StatusesStore from './StatusesStore/store';
import SubmissionPeriodsStore from './SubmissionPeriodsStore/store';
import ProgramsStore from './ProgramsStore/store';
import SubmissionsStore from './SubmissionsStore/store';
import SubmissionNoteStore from './SubmissionNoteStore/store';
import SubmissionNoteHistoryStore from './SubmissionNoteHistoryStore/store';
import SubmissionWorkbookStore from './SubmissionWorkbookStore/store';
//@ts-ignore
import COATreeStore from './COATreeStore/store';
import COATreesStore from './COATreesStore/store';
import DetectEmptyTreeStore from './DetectEmptyTreeStore/store';
import DataResumeStore from './DataResumeStore/store';
import SheetNamesStore from './SheetNamesStore/store';
import ColumnNamesStore from './ColumnNamesStore/store';
import OrgsStore from './OrganizationsStore/store';
import OrganizationGroupStore from './OrganizationGroupStore/store';
import WorkflowStore from './WorkflowStore/store';
import WorkflowsStore from './WorkflowsStore/store';
import UserStore from './UserStore/store';
import UsersStore from './UsersStore/store';
import UserRegistrationStore from './UserRegistrationStore/store';
import WorkflowProcessesStore from './WorkflowProcessesStore/store';
import TransferStatusStore from './TransferStatusStore/store';

export const appReducer = combineReducers({
  UserStore: UserStore.reducer,
  StatusesStore: StatusesStore.reducer,
  ProgramsStore: ProgramsStore.reducer,
  TemplatesStore: TemplatesStore.reducer,
  TemplateTypesStore: TemplateTypesStore.reducer,
  TemplatePackagesStore: TemplatePackagesStore.reducer,
  ModifyUserInfoStore: ModifyUserInfoStore.reducer,
  COATreesStore: COATreesStore.reducer,
  COAGroupsStore: COAGroupsStore.reducer,
  COAsStore: COAsStore.reducer,
  AppRolesStore: AppRolesStore.reducer,
  AppResourcesStore: AppResourcesStore.reducer,
  AppRoleResourcesStore: AppRoleResourcesStore.reducer,
  AppSysesStore: AppSysesStore.reducer,
  AppSysRolesStore: AppSysRolesStore.reducer,
  AuditLogStore: AuditLogStore.reducer,
  DialogsStore: DialogsStore.reducer,
  ReportingPeriodsStore: ReportingPeriodsStore.reducer,
  OrgsStore: OrgsStore.reducer,
  OrganizationGroupStore: OrganizationGroupStore.reducer,
  UsersStore: UsersStore.reducer,

  AppConfigsStore: AppConfigsStore.reducer,
  COATreeStore: COATreeStore.reducer,
  DataResumeStore: DataResumeStore.reducer,
  DetectEmptyTreeStore: DetectEmptyTreeStore.reducer,
  SheetNamesStore: SheetNamesStore.reducer,
  SubmissionPeriodsStore: SubmissionPeriodsStore.reducer,
  SubmissionsStore: SubmissionsStore.reducer,
  SubmissionNoteStore: SubmissionNoteStore.reducer,
  SubmissionNoteHistoryStore: SubmissionNoteHistoryStore.reducer,
  SubmissionWorkbookStore: SubmissionWorkbookStore.reducer,

  ColumnNamesStore: ColumnNamesStore.reducer,
  UserRegistrationStore: UserRegistrationStore.reducer,

  WorkflowStore: WorkflowStore.reducer,
  WorkflowsStore: WorkflowsStore.reducer,
  WorkflowProcessesStore: WorkflowProcessesStore.reducer,
  TransferStatusStore: TransferStatusStore.reducer,
});
const rootReducer = (state: any, action: Action<any>) => {
  // console.log('action', action)
  if (action.type === 'USER/LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;





