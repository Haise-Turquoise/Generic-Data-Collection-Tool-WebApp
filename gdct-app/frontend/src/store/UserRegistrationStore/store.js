import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
  userPermissions: [],
  ableToComplete: false,
  searchKey: '',
  userAppSys: '',
  reference: '',
};

const setRegistrationData = (state, { payload }) => ({
  ...state,
  registrationData: payload,
});

const setSnackbarMessage = (state, { payload }) => ({
  ...state,
  snackbarMessage: payload,
});

const setActiveStep = (state, { payload }) => ({
  ...state,
  activeStep: payload,
});
const setHelperState = (state, { payload }) => ({
  ...state,
  helperState: payload,
});
const setIsSnackbarOpen = (state, { payload }) => ({
  ...state,
  isSnackbarOpen: payload,
});
const setAppSysOptions = (state, { payload }) => ({
  ...state,
  appSysOptions: payload,
});
const setOrganizationGroupOptions = (state, { payload }) => ({
  ...state,
  organizationGroupOptions: payload,
});
const setOrganizationOptions = (state, { payload }) => ({
  ...state,
  organizationOptions: payload,
});
const setProgramOptions = (state, { payload }) => ({
  ...state,
  programOptions: payload,
});
const setUserOrganizations = (state, { payload }) => ({
  ...state,
  userOrganizations: payload,
});
const setUserPrograms = (state, { payload }) => ({
  ...state,
  userPrograms: payload,
});
const setUserSubmissionList = (state, { payload }) => ({
  ...state,
  userSubmissions: payload,
});
const setUserPermissionList = (state, { payload }) => ({
  ...state,
  userPermissions: payload,
});
const setSearchKey = (state, { payload }) => ({
  ...state,
  searchKey: payload,
});
const setUserAppSys = (state, { payload }) => ({
  ...state,
  userAppSys: payload,
});
const setReference = (state, { payload }) => ({
  ...state,
  reference: payload,
});
const setOrganizationGroup = (state, { payload }) => ({
  ...state,
  organizationGroup: payload,
});
const setAbleToComplete = (state, { payload }) => ({
  ...state,
  ableToComplete: payload,
});

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
