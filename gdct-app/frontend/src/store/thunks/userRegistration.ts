import hash from 'object-hash';
import cloneDeep from 'clone-deep';
import bcrypt from 'bcrypt-nodejs';
import organizationController from '../../controllers/organization';
import AppSysController from '../../controllers/AppSys';
import organizationGroupController from '../../controllers/organizationGroup';
import programController from '../../controllers/Program';
import templateTypeController from '../../controllers/templateType';
import userController from '../../controllers/user';
import usersController from '../../controllers/Users';
import userRegistrationStore from '../UserRegistrationStore/store';

import { Dispatch } from 'redux';
import User, { RawData } from '../../types/user';
import SysRole from '../../types/sysrole';
import { state } from '../types';

interface organization {
  name: string,
  orgId: number,
  authorizedPerson: {
    name: string,
    email: string,
  },
  program: program[],
  IsActive: boolean,
}

interface program {
  name: string,
  programCode: string,
  programId: string,
  template: template[]
}

interface template {
  templateTypeId: string,
  templateCode: string,
  status: string | undefined
}

interface userProgram {
  _id: string,
  name: string,
  code: string,
  org: {
    id: string
  }
}

interface registrationData {
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
}

interface organizationOption {
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
}

interface programOption {
  information: {
    org: {
      name: string,
      id: number,
    }
  }
}

interface userSubmission {
  organization: {
    name: string,
    id: number,
    authorizedPerson: {
      name: string,
      email: string,
    },
    IsActive: boolean,
  },
  program: {
    name: string,
    code: string,
    _id: string,
  },
  submission: {
    name: string,
    _id: string,
    status: string | undefined
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
}

interface userPermission {
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
}

// Loading Update Profile Page
export const getUserInfo = () => (dispatch: Dispatch) => {
  const email = localStorage.getItem('currentUser');
  usersController.fetchByEmail(email!).then((users: User | null) => {
    const userInfo = {
      title: '',
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      // password: '',
      // passwordConfirm: '',
      ext: '',
      // IsActive: false,
      // startDate: new Date(),
      // endDate: new Date(),
      // sysRole: [],
    };
    userInfo.title = users!.title;
    userInfo.username = users!.username;
    userInfo.email = users!.email;
    userInfo.firstName = users!.firstName;
    userInfo.lastName = users!.lastName;
    userInfo.phoneNumber = users!.phoneNumber;
    // userInfo.password = users.password;
    userInfo.ext = users!.ext!;
    // userInfo.IsActive = users.IsActive;
    // userInfo.startDate = users.startDate;
    // userInfo.endDate = users.endDate;
    // userInfo.sysRole = users.sysRole;

    // @ts-ignore
    dispatch(userRegistrationStore.actions.setRegistrationData(userInfo));
  });
};

const ModifyPermissionHandleInputTemplate = (templateSet: Array<template>, submission: userSubmission) => {
  const templateType = {
    templateTypeId: '',
    templateCode: '',
    status: '',
  };
  let templateSelected = templateSet.find(element => {
    return element.templateTypeId === submission.submission._id;
  });

  if (templateSelected === undefined) {
    templateType.templateCode = submission.submission.name;
    templateType.templateTypeId = submission.submission._id;
    if (!submission.submission.status) {
      // templateType.pending = submission.submission.pending;
      templateType.status = 'pending';
    } else {
      templateType.status = submission.submission.status;
    }
    templateSelected = templateType;
    templateSet.push(templateSelected);
  }
};

const handleInputTemplate = (templateSet: Array<template>, submission: userSubmission) => {
  const templateType = {
    templateTypeId: '',
    templateCode: '',
    status: undefined,
  };
  let templateSelected = templateSet.find(element => {
    return element.templateTypeId === submission.submission._id;
  });

  if (templateSelected === undefined) {
    templateType.templateCode = submission.submission.name;
    templateType.templateTypeId = submission.submission._id;
    templateSelected = templateType;
    templateSet.push(templateSelected);
  }
};

const handleInputProgram = (programSet: Array<program>, submission: userSubmission) => {
  const program = {
    programId: '',
    programCode: '',
    name: '',
    template: [],
  };
  console.log(programSet, submission);
  let programSelected = programSet.find((element: program) => {
    return element.programId === submission.program._id;
  });

  if (programSelected === undefined) {
    program.programCode = submission.program.code;
    program.programId = submission.program._id;
    program.name = submission.program.name;
    programSelected = program;
    programSet.push(programSelected);
  }

  handleInputTemplate(programSelected.template, submission);
};

const ModifyPermissionHandleInputProgram = (programSet: Array<program>, submission: userSubmission) => {
  const program = {
    programId: '',
    programCode: '',
    name: '',
    template: [],
  };
  let programSelected = programSet.find(element => {
    return element.programId === submission.program._id;
  });

  if (programSelected === undefined) {
    program.programCode = submission.program.code;
    program.programId = submission.program._id;
    program.name = submission.program.name;
    programSelected = program;
    programSet.push(programSelected);
  }

  ModifyPermissionHandleInputTemplate(programSelected.template, submission);
};

const handleInputOrg = (organization: Array<organization>, submission: userSubmission) => {
  const org = {
    orgId: 0,
    program: [],
    IsActive: false,
    name: '',
    authorizedPerson: {
      name: '',
      email: ''
    }
  };
  console.log(organization, submission);
  let organizationSelected = organization.find((element: organization) => {
    return element.orgId === submission.organization.id;
  });
  if (organizationSelected === undefined) {
    org.IsActive = false;
    org.orgId = submission.organization.id;
    org.name = submission.organization.name;
    org.authorizedPerson = submission.organization.authorizedPerson;
    organizationSelected = org;

    organization.push(organizationSelected);
  }

  handleInputProgram(organizationSelected.program, submission);
};

const ModifyPermissionHandleInputOrg = (organization: Array<organization>, submission: userSubmission) => {
  const org = {
    orgId: 0,
    program: [],
    IsActive: false,
    name: '',
    authorizedPerson: {
      name: '',
      email: ''
    }
  };

  let organizationSelected = organization.find(element => {
    return element.orgId === submission.organization.id;
  });
  if (organizationSelected === undefined) {
    if (submission.organization.IsActive === undefined) {
      org.IsActive = false;
    } else {
      org.IsActive = submission.organization.IsActive;
    }

    org.orgId = submission.organization.id;
    org.name = submission.organization.name;
    org.authorizedPerson = submission.organization.authorizedPerson;
    organizationSelected = org;

    organization.push(organizationSelected);
  }
  if (submission.organization.IsActive === undefined) {
    organizationSelected.IsActive = false;
  }
  ModifyPermissionHandleInputProgram(organizationSelected.program, submission);
};

const checkPerission = (submission: userSubmission) => {
  const permission = [];
  if (submission.approve) permission.push('Submission Approver');
  if (submission.review) permission.push('Reviewer');
  if (submission.submit) permission.push('Submitter');
  if (submission.input) permission.push('Inputter');
  if (submission.view) permission.push('Viewer');
  if (submission.viewCognos) permission.push('Reporter');
  return permission;
};

const getAppSys = () => {
  return AppSysController.fetch().then(appSys => {
    const options: any[] = [];
    appSys.forEach(appSysOptions => {
      options.push({
        label: appSysOptions.name,
        value: { name: appSysOptions.code, _id: appSysOptions._id },
      });
    });
    return options;
  });
};

const getOrgGroup = () => {
  return organizationGroupController.fetch().then(organizationGroups => {
    const options: any[] = [];
    organizationGroups.forEach((orgGroup) => {
      options.push({
        // @ts-ignore
        label: orgGroup.name,
        // @ts-ignore
        value: { name: orgGroup.name, _id: orgGroup._id },
      });
    });
    return options;
  });
};

const getOrg = (orgGroup: string) => {
  return organizationController.fetchByOrgGroupId(orgGroup).then(organizations => {
    const options: any[] = [];
    organizations.forEach(org => {
      options.push({
        label: `(${org.id})${org.name}`,
        value: org.id,
        information: {
          _id: org._id,
          name: org.name,
          id: org.id,
          orgGroupId: orgGroup,
          programId: org.programId,
          authorizedPerson: org.authorizedPerson,
        },
      });
    });
    return options;
  });
};

const getProgram = (programInfo: Array<program>) => {
  const programId: any[] = [];
  programInfo.forEach(program => {
    // @ts-ignore
    programId.push(program.id);
  });
  return programController.fetchByIds(programId).then(programs => {
    const options: any[] = [];
    programs.forEach(program => {
      // @ts-ignore
      const option = programInfo.find(element => element.id === program._id);
      options.push({
        label: `(${program.code})${program.name}`,
        value: program._id,
        information: {
          _id: program._id,
          name: program.name,
          code: program.code,
          // @ts-ignore
          org: option!.org,
        },
      });
    });
    return options;
  });
};

const getTemplateType = (userPrograms: Array<userProgram>) => {
  const programList: any[] = [];
  userPrograms.forEach(userProgram => {
    programList.push(userProgram._id);
  });
  return templateTypeController.fetchByProgramIds(programList).then(templateTypes => {
    const submissionList: any[] = [];
    let index = 0;

    templateTypes.forEach(templateType => {
      userPrograms.forEach(userProgram => {
        const check = templateType.programIds.includes(userProgram._id);
        if (check) {
          submissionList.push({
            organization: userProgram.org,
            program: {
              name: userProgram.name,
              code: userProgram.code,
              _id: userProgram._id,
            },
            submission: { name: templateType.name, _id: templateType._id },
            approveAvailable: templateType.isApprovable,
            reviewAvailable: templateType.isReviewable,
            submitAvailable: templateType.isSubmittable,
            inputAvailable: templateType.isInputtable,
            viewAvailable: templateType.isViewable,
            viewCognosAvailable: templateType.isReportable,
            approve: false,
            review: false,
            submit: false,
            input: false,
            view: false,
            viewCognos: false,
            index,
          });
          index += 1;
        }
      });
    });
    return submissionList;
  });
};

const sendRegistrationData = (registerData: User) => {
  return userController.create(registerData).catch(error => {
    throw new Error(error);
  });
};

const updatePermissionData = (email: string, permissionData: RawData) => {
  return userController
    .updatePermissionByUserEmail(email, permissionData)
    .then(result => {
      Promise.resolve(result);
    })
    .catch(error => {
      throw new Error(error);
    });
};

const submissionChange = (userSubmissions: Array<userSubmission>) => {
  const permissionList: any[] = [];
  userSubmissions.forEach(submission => {
    const permission = checkPerission(submission);

    // eslint-disable-next-line no-shadow
    permission.forEach(permission => {
      permissionList.push({
        organization: submission.organization,
        program: submission.program,
        submission: submission.submission,
        permission,
        approve: submission.approve,
        review: submission.review,
        submit: submission.submit,
        view: submission.view,
        viewCognos: submission.viewCognos,
        input: submission.input,
        status:
          submission.submission.status === undefined ? 'pending' : submission.submission.status,

    // @ts-ignore
        appSys: submission.appSys === undefined ? 'unknown' : submission.appSys,
      });
    });
  });
  return permissionList;
};

// @ts-ignore
const handleInputSysRole = (data: User, permission: string, submission, userAppSys: string) => {
  const sysRole = {
    appSys: '',
    role: '',
    org: [],
  };

  if (submission[permission]) {
    let sysRoleSelected = data.sysRole.find(element => {
      return element.role === permission && element.appSys === userAppSys;
    });
    if (sysRoleSelected === undefined) {
      // @ts-ignore
      sysRoleSelected = sysRole;
      sysRoleSelected!.role = permission;
      sysRoleSelected!.appSys = userAppSys;
      data.sysRole.push(sysRoleSelected!);
    }
    // @ts-ignore
    handleInputOrg(sysRoleSelected.org, submission);
  }
};

// @ts-ignore
const ModifyPermissionHandleInputSysRole = (data: User, permission: string, submission, userAppSys: string) => {
  const sysRole = {
    appSys: '',
    role: '',
    org: [],
  };

  if (submission[permission]) {
    let sysRoleSelected = data.sysRole.find(element => {
      return element.role === permission && element.appSys === userAppSys;
    });
    if (sysRoleSelected === undefined) {
      // @ts-ignore
      sysRoleSelected = sysRole;
      sysRoleSelected!.role = permission;
      sysRoleSelected!.appSys = userAppSys;
      data.sysRole.push(sysRoleSelected!);
    }
    // @ts-ignore
    ModifyPermissionHandleInputOrg(sysRoleSelected.org, submission);
  }
};

export const orgChange = (selectedOrganization: Array<organizationOption>) => (dispatch: Dispatch) => {
  const userOrg: any[] = [];
  const programs: any[] = [];
  selectedOrganization.forEach(org => {
    userOrg.push(org.information);
    org.information.programId.forEach((programId: string) => {
      programs.push({
        org: {
          name: org.information.name,
          id: org.information.id,
          authorizedPerson: org.information.authorizedPerson,
        },
        id: programId,
      });
    });
  });
  dispatch(userRegistrationStore.actions.setUserOrganizations(userOrg));
  getProgram(programs).then(programOptions => {
    dispatch(userRegistrationStore.actions.setProgramOptions(programOptions));
  });
};

export const programChange = (selectedPrograms: Array<programOption>) => (dispatch: Dispatch, getState: () => state) => {
  const {
    // @ts-ignore
    UserRegistrationStore: { userPrograms },
  } = getState();
  let userProgramsCopy = cloneDeep(userPrograms);

  const newUserPrograms: any[] = [];
  selectedPrograms.forEach(program => {
    newUserPrograms.push(program.information);
  });

  if (userProgramsCopy.length > 0) {
    // programs differentiate by _id and organization differentiate by id.
    userProgramsCopy = userProgramsCopy.filter((userProgram: userProgram) =>
      userProgram._id !== newUserPrograms[0]._id ||
      userProgram.org.id !== newUserPrograms[0].org.id,
    );
  }
  userProgramsCopy.push(newUserPrograms[0]);
  dispatch(userRegistrationStore.actions.setUserPrograms(userProgramsCopy));

  getTemplateType(userProgramsCopy).then(templateTypeList => {
    dispatch(userRegistrationStore.actions.setUserSubmissionList(templateTypeList));
  });
};

export const changeSubmissionInModifyPermission = () => (dispatch: Dispatch, getState: () => state) => {
  const {
    // @ts-ignore
    UserRegistrationStore: { userSubmissions },
  } = getState();
  dispatch(userRegistrationStore.actions.setAbleToComplete(true));
  const permissionList = submissionChange(userSubmissions);
  const userSubmissionsCopy = cloneDeep(userSubmissions);
  // grey-out all selected box
  userSubmissionsCopy.forEach((userSubmission: userSubmission) => {
    userSubmission.approve = false;
    userSubmission.view = false;
    userSubmission.submit = false;
    userSubmission.input = false;
    userSubmission.review = false;
  });
  dispatch(userRegistrationStore.actions.setUserSubmissionList(userSubmissionsCopy));
  const {
    // @ts-ignore
    UserRegistrationStore: { userPermissions },
  } = getState();
  const userPermissionsCopy = cloneDeep(userPermissions);
  permissionList.forEach(permission => {
    userPermissionsCopy.push(permission);
  });

  dispatch(userRegistrationStore.actions.setUserPermissionList(userPermissionsCopy));
};

export const changeSubmission = () => (dispatch: Dispatch, getState: () => state) => {
  const {
    // @ts-ignore
    UserRegistrationStore: { userSubmissions },
  } = getState();
  dispatch(userRegistrationStore.actions.setAbleToComplete(true));
  const permissionList = submissionChange(userSubmissions);
  const userSubmissionsCopy = cloneDeep(userSubmissions);
  userSubmissionsCopy.forEach((userSubmission: userSubmission) => {
    userSubmission.approve = false;
    userSubmission.view = false;
    userSubmission.submit = false;
    userSubmission.input = false;
    userSubmission.review = false;
  });
  dispatch(userRegistrationStore.actions.setUserSubmissionList(userSubmissionsCopy));
  const {
    // @ts-ignore
    UserRegistrationStore: { userPermissions },
  } = getState();
  const userPermissionsCopy = cloneDeep(userPermissions);
  permissionList.forEach(permission => {
    userPermissionsCopy.push(permission);
  });

  dispatch(userRegistrationStore.actions.setUserPermissionList(userPermissionsCopy));
};

export const orgGroupChange = (event: any) => (dispatch: Dispatch) => {
  dispatch(userRegistrationStore.actions.setOrganizationGroup(event.value.name));
  getOrg(event.value._id).then(orgOptions => {
    dispatch(userRegistrationStore.actions.setOrganizationOptions(orgOptions));
  });
};

export const searchKeyChange = (event: any) => (dispatch: Dispatch) => {
  dispatch(userRegistrationStore.actions.setSearchKey(event.value));
};

export const appSysChange = (event: any) => (dispatch: Dispatch) => {
  dispatch(userRegistrationStore.actions.setUserAppSys(event.value.name));
};

export const referenceChange = (event: any) => (dispatch: Dispatch) => {
  const {
    target: { value },
  } = event;
  dispatch(userRegistrationStore.actions.setReference(value));
};

// @ts-ignore
export const changePermission = (rowData, permission: string) => (dispatch: Dispatch, getState: () => state) => {
  const {
    // @ts-ignore
    UserRegistrationStore: { userSubmissions, helperState },
  } = getState();
  const submissions = cloneDeep(userSubmissions);
  const instruction = !rowData[permission];
  submissions[rowData.index][permission] = !rowData[permission];
  rowData[permission] = instruction;
  dispatch(userRegistrationStore.actions.setUserSubmissionList(submissions));
  dispatch(userRegistrationStore.actions.setHelperState(!helperState));
};

const searchOrg = (searchKey: string, reference: string, options: organizationOption) => {
  // @ts-ignore
  return options[searchKey] === reference;
};

export const searchOrganization = () => (dispatch: Dispatch, getState: () => state) => {
  const {
    // @ts-ignore
    UserRegistrationStore: { searchKey, reference, organizationOptions },
  } = getState();
  const orgOptions = searchOrg(searchKey, reference, organizationOptions);
  // @ts-ignore
  dispatch(userRegistrationStore.actions.setOrganizationOptions(orgOptions));
};

export const loadModifyPermissionPage = () => async (dispatch: Dispatch, getState: () => state) => {
  const email = localStorage.getItem('currentUser');
  const {
    // @ts-ignore
    UserRegistrationStore: { tempUserSubmissions },
  } = getState();

  const user = await usersController.fetchByEmail(email!);

  if (user!.sysRole && tempUserSubmissions.length === 0) {
    let UserSysRole = [];
    // if there is no pending templates in the database
    // @ts-ignore
    if (user!.tempSysRole.length === 0 || user!.tempSysRole === undefined) {
      UserSysRole = user!.sysRole;
    }
    // there exist some pending templates
    else {
      // @ts-ignore
      UserSysRole = user!.tempSysRole;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const sysRole of UserSysRole) {
      const userSubmission = {
        organization: null,
        program: null,
        submission: null,
        approve: false,
        review: false,
        submit: false,
        input: false,
        view: false,
        viewCognos: false,
        approveAvailable: true,
        reviewAvailable: true,
        submitAvailable: true,
        inputAvailable: true,
        viewAvailable: true,
        viewCognosAvailable: true,
        appSys: null,
      };
      // assign appSys for each userSubmission
      userSubmission.appSys = sysRole.appSys;
      // set each boolean represent of role for each userSubmission
      if (sysRole.role === 'Submitter') {
        userSubmission.submit = true;
      } else if (sysRole.role === 'Submission Approver') {
        userSubmission.approve = true;
      } else if (sysRole.role === 'Reviewer') {
        userSubmission.review = true;
      } else if (sysRole.role === 'Inputter') {
        userSubmission.input = true;
      } else if (sysRole.role === 'Viewer') {
        userSubmission.view = true;
      } else if (sysRole.role === 'Reporter') {
        userSubmission.viewCognos = true;
      }
      // loop over each organization
      sysRole.org.forEach(async (org: organization) => {
        // fetch the organization info
        const orgInfo = await organizationController.fetchById(org.orgId);
        // @ts-ignore
        userSubmission.organization = {
          name: orgInfo!.name,
          id: orgInfo!.id,
          authorizedPerson: orgInfo!.authorizedPerson,
          IsActive: org.IsActive,
        };
        // loop over each program
        org.program.forEach(async (program: program) => {
          // fetch additional program info
          const programInfo = await programController.fetchById(program.programId);
          // @ts-ignore
          userSubmission.program = {
            name: programInfo!.name,
            code: programInfo!.code,
            _id: programInfo!._id,
          };
          // loop over each template
          program.template.forEach(async (template: template) => {
            // @ts-ignore
            userSubmission.submission = {
              name: template.templateCode,
              _id: template.templateTypeId,
              status: template.status,
            };
            const userSubmissionCopy = cloneDeep(userSubmission);
            // get specific template information
            const templateTypeInfo = await templateTypeController.fetchById(template.templateTypeId);

            userSubmissionCopy.approveAvailable = templateTypeInfo!.isApprovable;
            userSubmissionCopy.reviewAvailable = templateTypeInfo!.isReviewable;
            userSubmissionCopy.submitAvailable = templateTypeInfo!.isSubmittable;
            userSubmissionCopy.inputAvailable = templateTypeInfo!.isInputtable;
            userSubmissionCopy.viewAvailable = templateTypeInfo!.isViewable!;
            userSubmissionCopy.viewCognosAvailable = templateTypeInfo!.isReportable;

            const {
              // eslint-disable-next-line no-shadow
              // @ts-ignore
              UserRegistrationStore: { tempUserSubmissions },
            } = getState();
            const userSubmissionsCopy = cloneDeep(tempUserSubmissions);
            // @ts-ignore
            userSubmissionCopy.index = userSubmissionsCopy.length;

            userSubmissionsCopy.push(userSubmissionCopy);
            dispatch(userRegistrationStore.actions.setTempUserSubmissionList(userSubmissionsCopy));

            const permissionList = submissionChange(userSubmissionsCopy);
            dispatch(userRegistrationStore.actions.setUserPermissionList(permissionList));
          });
        });
      });
    }
  }

  const {
    // @ts-ignore
    UserRegistrationStore: { userPermissions },
  } = getState();
  const userPermissionsCopy = cloneDeep(userPermissions);
  user!.pendingPermissions!.forEach(pendingPermission => {
    userPermissionsCopy.push(pendingPermission);
  });
  dispatch(userRegistrationStore.actions.setUserPermissionList(userPermissionsCopy));

  getAppSys().then(appSys => {
    dispatch(userRegistrationStore.actions.setAppSysOptions(appSys));
    getOrgGroup().then(orgGroupOptions => {
      dispatch(userRegistrationStore.actions.setOrganizationGroupOptions(orgGroupOptions));
    });
    dispatch(userRegistrationStore.actions.setActiveStep(1));
  });
};

export const stepNext = (values: registrationData) => (dispatch: Dispatch) => {
  dispatch(userRegistrationStore.actions.setRegistrationData(values));

  getAppSys().then(appSys => {
    dispatch(userRegistrationStore.actions.setAppSysOptions(appSys));
    getOrgGroup().then(orgGroupOptions => {
      dispatch(userRegistrationStore.actions.setOrganizationGroupOptions(orgGroupOptions));
    });
    dispatch(userRegistrationStore.actions.setActiveStep(1));
  });
};

export const snackbarClose = () => (dispatch: Dispatch) => {
  dispatch(userRegistrationStore.actions.setIsSnackbarOpen(false));
  dispatch(userRegistrationStore.actions.setSnackbarMessage(''));
};

export const stepBack = () => (dispatch: Dispatch) => {
  dispatch(userRegistrationStore.actions.setActiveStep(0));
};

export const deleteUserPermission = (userPermission: userPermission) => (dispatch: Dispatch, getState: () => state) => {
  // dispatch(userRegistrationStore.actions.REQUEST());
  const {
    // @ts-ignore
    UserRegistrationStore: { userPermissions },
  } = getState();
  let userPermissionsCopy = [...userPermissions];
  userPermissionsCopy = userPermissionsCopy.filter(ele => {
    return !(
      ele.permission === userPermission.permission &&
      ele.organization.id === userPermission.organization.id &&
      ele.program._id === userPermission.program._id &&
      ele.submission._id === userPermission.submission._id
    );
  });
  dispatch(userRegistrationStore.actions.setUserPermissionList(userPermissionsCopy));
};

export const submit = () => (getState: () => state) => {
  const {
    // @ts-ignore
    UserRegistrationStore: { registrationData, userPermissions, userAppSys },
  } = getState();
  const userData = cloneDeep(registrationData);
  userData.phoneNumber = userData.phoneNumber.replace('-', '');
  userData.hashedUsername = hash(userData.username);
  userData.password = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(8));
  userData.email = userData.email.toLowerCase();
  delete userData.passwordConfirm;
  userPermissions.forEach((userPermission: userPermission) => {
    handleInputSysRole(userData, 'approve', userPermission, userAppSys);
    handleInputSysRole(userData, 'review', userPermission, userAppSys);
    handleInputSysRole(userData, 'input', userPermission, userAppSys);
    handleInputSysRole(userData, 'submit', userPermission, userAppSys);
    handleInputSysRole(userData, 'view', userPermission, userAppSys);
    handleInputSysRole(userData, 'viewCognos', userPermission, userAppSys);
  });
  const userPermissionsCopy = cloneDeep(userPermissions);
  userData.newTemplates = userPermissionsCopy.filter((userPermission: userPermission) => {
    return userPermission.appSys === 'unknown';
  });
  // @ts-ignore
  userData.newTemplates.forEach(newTemplate => {
    // @ts-ignore
    newTemplate.appSys = userAppSys;
    newTemplate.applierEmail = userData.email;
  });
  sendRegistrationData(userData);
};

export const updatePermission = () => (getState: () => state) => {
  const {
    // @ts-ignore
    UserRegistrationStore: { userPermissions, registrationData, userAppSys },
  } = getState();
  const userData = cloneDeep(registrationData);
  userPermissions.forEach((permission: userPermission) => {
    const appSys = permission.appSys !== 'unknown' ? permission.appSys : userAppSys;
    ModifyPermissionHandleInputSysRole(userData, 'approve', permission, appSys);
    ModifyPermissionHandleInputSysRole(userData, 'review', permission, appSys);
    ModifyPermissionHandleInputSysRole(userData, 'input', permission, appSys);
    ModifyPermissionHandleInputSysRole(userData, 'submit', permission, appSys);
    ModifyPermissionHandleInputSysRole(userData, 'view', permission, appSys);
    ModifyPermissionHandleInputSysRole(userData, 'viewCognos', permission, appSys);
  });

  const email = localStorage.getItem('currentUser');
  const userPermissionsCopy = cloneDeep(userPermissions);
  userData.newTemplates = userPermissionsCopy.filter((userPermission: userPermission) => {
    return userPermission.appSys === 'unknown';
  });
  // @ts-ignore
  userData.newTemplates.forEach(newTemplate => {
    newTemplate.appSys = userAppSys;
    newTemplate.applierEmail = email;
  });
  updatePermissionData(email!, userData);
};
