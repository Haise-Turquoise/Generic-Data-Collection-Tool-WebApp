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

export interface UserStateType {
  isLoggedIn: boolean,
  currentUser: string,
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
  organizationGroup: [] | string,
  helperState: boolean,
  isSnackbarOpen: boolean,
  appSysOptions: {
    label: string,
    value: {
      name: string,
      _id: string,
    }
  }[],
  organizationGroupOptions: {
    label: string,
    value: {
      name: string,
      _id: string,
    }
  }[],
  organizationOptions: {
    label: string,
    value: number,
    information: {
      _id: string,
      name: string,
      id: number,
      orgGroupId: string,
      programId: string[],
      authorizedPerson: {
        name: string,
        email: string,
      }
    }
  }[],
  programOptions: {
    information: {
      org: {
        name: string,
        id: number,
      }
    }
  }[],
  userOrganizations: { _id: string }[],
  userPrograms: { _id: string }[],
  userSubmissions: {
    organization: {
      name: string,
      id: number,
      authorizedPerson: {
        name: string,
        email: string,
      },
    },
    program: {
      name: string,
      code: string,
      _id: string,
    },
    submission: {
      name: string,
      _id: string,
    },
    approveAvailable: boolean,
    reviewAvailable: boolean,
    submitAvailable: boolean,
    inputAvailable: boolean,
    viewCognosAvailable: boolean,
    approve: boolean,
    review: boolean,
    submit: boolean,
    input: boolean,
    view: boolean,
    viewCognos: boolean,
    index: number,
  }[],
  tempUserSubmissions: any[],
  userPermissions: {
    organization: {
      name: string,
      id: number,
      authorizedPerson: {
        name: string,
        email: string,
      },
    },
    program: {
      name: string,
      code: string,
      _id: string,
    },
    submission: {
      name: string,
      _id: string,
    },
    permission: string,
    approve: boolean,
    review: boolean,
    submit: boolean,
    view: boolean,
    viewCognos: boolean,
    input: boolean,
    status: string,
    appSys: string,
  }[],
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
