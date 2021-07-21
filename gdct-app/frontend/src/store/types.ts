import { CaseReducer, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { Reducer } from "react";
import AppSys from "../types/appsys";
import Organization from "../types/organization";
import OrganizationGroup from "../types/organizationgroup";
import SysRole from "../types/sysrole";
import { StatusesStore } from "./StatusesStore/store";

export type responseVal = {
  _id: string,
  [key: string]: any,
}

export interface RestStateType<T extends {_id: string} = {_id: string, [key:string]: any}> {
  response: {
    Values: T[],
  },
  error: string | null,
  isCallInProgress: boolean,
}

export interface RestStateReducers {
  'CREATE': CaseReducer<RestStateType, {type: 'CREATE', payload: any}>,
  'DELETE': CaseReducer<RestStateType, {type: 'DELETE', payload: string}>,
  'FAIL_REQUEST': CaseReducer<RestStateType, {type: 'FAIL_REQUEST', payload: string}>,
  'RECEIVE': CaseReducer<RestStateType, {type: 'RECEIVE', payload: responseVal[]}>,
  'REQUEST': CaseReducer<RestStateType, {type: 'REQUEST'}>,
  'RESET': CaseReducer<RestStateType, {type: 'RESET'}>,
  'UPDATE': CaseReducer<RestStateType, {type: 'UPDATE', payload: responseVal}>,
}

export interface ControllerType {
  fetch: (query?: any) => Promise<unknown[] | 'UNAUTHORIZED ACCESS'>,
  fetchPopulated?: (query: any) => Promise<unknown[] | 'UNAUTHORIZED ACCESS'>,
  create: (value: any) => Promise<unknown | 'UNAUTHORIZED ACCESS'>,
  createPopulated?: (value: any) => Promise<unknown | 'UNAUTHORIZED ACCESS'>,
  delete: (_id: string) => Promise<any>,
  deletePopulated?: (_id: string) => Promise<any>,
  update: (value: any) => Promise<AxiosResponse<any>>,
  updatePopulated?: (value: any) => Promise<AxiosResponse<any>>,
}

export interface DialogsStore {
  isOrganizationDialogOpen: boolean,
  isCOADialogOpen: boolean,
  isCOAGroupDialogOpen: boolean,
  isUserDialogOpen: boolean,
  isStatusDialogOpen: boolean,
  isProgramDialogOpen: boolean,
  isSubmissionPeriodDialogOpen: boolean,
  isTemplateTypeDialogOpen: boolean,
  isReportingPeriodDialogOpen: boolean,
  isTemplateDialogOpen: boolean,
  isWorkflowDialogOpen: boolean,
}

export interface UserRegistrationStore {
  registrationData: {
    title: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    password: string,
    passwordConfirm: string,
    ext: string,
    IsActive: boolean,
    startDate: Date,
    endDate: Date,
    // unsure about this
    sysRole: SysRole[]
  },
  snackbarMessage: string,
  activeStep: number,
  organizationGroup: Organization[],
  helperState: boolean,
  isSnackbarOpen: boolean,
  //TODO check this
  appSysOptions: AppSys[],
  organizationGroupOptions: any[],
  organizationOptions: any[],
  programOptions: any[],
  userOrganizations: any[],
  userPrograms: any[],
  userSubmissions: any[],
  tempUserSubmissions: any[],
  userPermissions: any[],
  ableToComplete: boolean,
  searchKey: string,
  userAppSys: string,
  reference: string,
}

export interface workflowChart {
  offset: {
    x: number,
    y: number,
  },
  scale: number,
  nodes: any,
  links: any,
  selected: any,
  hovered: any,
}

export interface WorkflowState {
  chart: workflowChart,
  filter: string,
  name: string,
  error: string | null,
  _id: string | null,
  timestamp: Date,
  updatedBy: string,
}

export interface state {
  UserStore: Slice,
  StatusesStore: RestStateType,
  ProgramsStore: RestStateType,
  TemplatesStore: RestStateType,
  TemplateTypesStore: RestStateType,
  TemplatePackagesStore: RestStateType,
  ModifyUserInfoStore: RestStateType,
  COATreesStore: RestStateType,
  COAGroupsStore: RestStateType,
  COAsStore: RestStateType,
  AppRolesStore: RestStateType,
  AppResourcesStore: RestStateType,
  AppRoleResourcesStore: RestStateType,
  AppSysesStore: RestStateType,
  AppSysRolesStore: RestStateType,
  AuditLogStore: RestStateType,
  DialogsStore: DialogsStore,
  ReportingPeriodsStore: RestStateType,
  OrgsStore: RestStateType,
  UsersStore: RestStateType,

  AppConfigsStore: RestStateType,
  COATreeStore: Slice,
  DataResumeStore: RestStateType,
  DetectEmptyTreeStore: RestStateType,
  SheetNamesStore: RestStateType,
  SubmissionPeriodsStore: RestStateType,
  SubmissionsStore: RestStateType,
  SubmissionNoteStore: RestStateType,
  SubmissionNoteHistoryStore: RestStateType,
  SubmissionWorkbookStore: RestStateType,

  ColumnNamesStore: RestStateType,
  UserRegistrationStore: Slice,

  WorkflowStore: WorkflowState,
  WorkflowsStore: RestStateType,
  WorkflowProcessesStore: RestStateType,
  TransferStatusStore: RestStateType,

  ui: Slice,
}
