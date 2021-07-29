import { createSlice } from '@reduxjs/toolkit';
import { UserRegistrationStore as UserRegStoreType } from '../types';

// registrationData: user's input in step1(except sysRole) and step2 (sysRole)
// Other part is for ui state
const initialState: UserRegStoreType = {
  registrationData: {
    title: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    passwordConfirm: '',
    ext: '',
    IsActive: false,
    startDate: new Date(),
    endDate: new Date(),
    sysRole: [],
  },
  snackbarMessage: '',
  activeStep: 0,
  organizationGroup: [],
  helperState: true,
  isSnackbarOpen: false,
  appSysOptions: [],
  organizationGroupOptions: [],
  organizationOptions: [],
  programOptions: [],
  userOrganizations: [],
  userPrograms: [],
  userSubmissions: [],
  tempUserSubmissions: [],
  userPermissions: [],
  ableToComplete: false,
  searchKey: '',
  userAppSys: '',
  reference: '',
};

const setRegistrationData = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["registrationData"]}) => ({
  ...state,
  registrationData: payload,
});

const setSnackbarMessage = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["snackbarMessage"]}) => ({
  ...state,
  snackbarMessage: payload,
});

const setActiveStep = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["activeStep"]}) => ({
  ...state,
  activeStep: payload,
});
const setHelperState = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["helperState"]}) => ({
  ...state,
  helperState: payload,
});
const setIsSnackbarOpen = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["isSnackbarOpen"]}) => ({
  ...state,
  isSnackbarOpen: payload,
});
const setAppSysOptions = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["appSysOptions"]}) => ({
  ...state,
  appSysOptions: payload,
});
const setOrganizationGroupOptions = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["organizationGroupOptions"]}) => ({
  ...state,
  organizationGroupOptions: payload,
});
const setOrganizationOptions = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["organizationOptions"]}) => ({
  ...state,
  organizationOptions: payload,
});
const setProgramOptions = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["programOptions"]}) => ({
  ...state,
  programOptions: payload,
});
const setUserOrganizations = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["userOrganizations"]}) => ({
  ...state,
  userOrganizations: payload,
});
const setUserPrograms = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["userPrograms"]}) => ({
  ...state,
  userPrograms: payload,
});
const setUserSubmissionList = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["userSubmissions"]}) => ({
  ...state,
  userSubmissions: payload,
});
const setTempUserSubmissionList = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["tempUserSubmissions"]}) => ({
  ...state,
  tempUserSubmissions: payload,
});
const setUserPermissionList = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["userPermissions"]}) => ({
  ...state,
  userPermissions: payload,
});
const setSearchKey = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["searchKey"]}) => ({
  ...state,
  searchKey: payload,
});
const setUserAppSys = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["userAppSys"]}) => ({
  ...state,
  userAppSys: payload,
});
const setReference = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["reference"]}) => ({
  ...state,
  reference: payload,
});
const setOrganizationGroup = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["organizationGroup"]}) => ({
  ...state,
  organizationGroup: payload,
});
const setAbleToComplete = (state: UserRegStoreType, { payload }: { payload: UserRegStoreType["ableToComplete"]}) => ({
  ...state,
  ableToComplete: payload,
});

// reducers to set each state
const reducers = {
  setRegistrationData,
  setSnackbarMessage,
  setActiveStep,
  setOrganizationGroup,
  setHelperState,
  setIsSnackbarOpen,
  setAppSysOptions,
  setOrganizationGroupOptions,
  setOrganizationOptions,
  setProgramOptions,
  setUserOrganizations,
  setUserPrograms,
  setUserSubmissionList,
  setTempUserSubmissionList,
  setUserPermissionList,
  setAbleToComplete,
  setSearchKey,
  setUserAppSys,
  setReference,
};

export const UserRegistrationStore = createSlice({
  name: 'UserRegistration',
  initialState,
  reducers,
});

export default UserRegistrationStore;
