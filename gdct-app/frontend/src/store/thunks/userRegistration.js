import hash from 'object-hash';
import cloneDeep from 'clone-deep';
import bcrypt from 'bcrypt-nodejs';
import organizationController from '../../controllers/organization';
import AppSysController from '../../controllers/AppSys';
import organizationGroupController from '../../controllers/organizationGroup';
import programController from '../../controllers/programs';
import templateTypeController from '../../controllers/templateType';
import userController from '../../controllers/user';
import userRegistrationStore from '../UserRegistrationStore/store';

const handleInputTemplate = (templateSet, submission) => {
  const templateType = {
    templateTypeId: '',
    templateCode: '',
  };
  let templateSelected = templateSet.find(element => {
    return element.templateTypeId == submission.submission._id;
  });

  if (templateSelected == undefined) {
    templateType.templateCode = submission.submission.name;
    templateType.templateTypeId = submission.submission._id;
    templateSelected = templateType;
    templateSet.push(templateSelected);
  }
};

const handleInputProgram = (programSet, submission) => {
  const program = {
    programId: '',
    programCode: '',
    template: [],
  };
  let programSelected = programSet.find(function (element) {
    return element.programId === submission.program.code;
  });

  if (programSelected === undefined) {
    program.programCode = submission.program.code;
    program.programId = submission.program._id;
    programSelected = program;
    programSet.push(programSelected);
  }

  handleInputTemplate(programSelected.template, submission);
};

const handleInputOrg = (organization, submission) => {
  const org = {
    orgId: '',
    program: [],
  };

  let organizationSelected = organization.find(function (element) {
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

const checkPerission = submission => {
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
    const options = [];
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
    const options = [];
    organizationGroups.forEach(orgGroup => {
      options.push({
        label: orgGroup.name,
        value: { name: orgGroup.name, _id: orgGroup._id },
      });
    });
    return options;
  });
};

const getOrg = orgGroup => {
  return organizationController.fetchByOrgGroupId(orgGroup).then(organizations => {
    const options = [];
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

const searchOrg = (searchKey, reference, options) => {
  return options[searchKey] == reference;
};

const getProgram = programInfo => {
  const programId = [];
  programInfo.forEach(program => {
    programId.push(program.id);
  });

  return programController.fetchByIds(programId).then(programs => {
    const options = [];
    programs.forEach(program => {
      const option = programInfo.find(element => element.id == program._id);
      options.push({
        label: `(${program.code})${program.name}`,
        value: program._id,
        information: {
          _id: program._id,
          name: program.name,
          code: program.code,
          org: option.org,
        },
      });
    });
    return options;
  });
};

const getTemplateType = userPrograms => {
  const programList = [];
  userPrograms.forEach(userProgram => {
    programList.push(userProgram._id);
  });
  return templateTypeController.fetchByProgramIds(programList).then(templateTypes => {
    const submissionList = [];
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
          index++;
        }
      });
      // const submission = userPrograms.find(element =>
      //   templateType.programIds.includes(element._id),
      // );
      // submissionList.push({
      //   organization: submission.org,
      //   program: {
      //     name: submission.name,
      //     code: submission.code,
      //     _id: submission._id,
      //   },
      //   submission: { name: templateType.name, _id: templateType._id },
      //   approveAvailable: templateType.isApprovable,
      //   reviewAvailable: templateType.isReviewable,
      //   submitAvailable: templateType.isSubmittable,
      //   inputAvailable: templateType.isInputtable,
      //   viewAvailable: templateType.isViewable,
      //   viewCognosAvailable: templateType.isReportable,
      //   approve: false,
      //   review: false,
      //   submit: false,
      //   input: false,
      //   view: false,
      //   viewCognos: false,
      //   index,
      // });

    });
    return submissionList;
  });
};

const sendRegistrationData = registerData => {
  return userController.create(registerData).catch(error => console.error(error));
};

const submissionChange = userSubmissions => {
  const permissionList = [];
  userSubmissions.forEach(submission => {
    const permission = checkPerission(submission);
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
      });
    });
  });
  return permissionList;
};

const handleInputSysRole = (data, permission, submission, userAppSys) => {
  const sysRole = {
    appSys: '',
    role: '',
    org: [],
  };
  if (submission[permission]) {
    let sysRoleSelected = data.sysRole.find(element => {
      return element.role == permission;
    });
    if (sysRoleSelected == undefined) {
      sysRoleSelected = sysRole;
      sysRoleSelected.role = permission;
      sysRoleSelected.appSys = userAppSys;
      data.sysRole.push(sysRoleSelected);
    }
    handleInputOrg(sysRoleSelected.org, submission);
  }
};

export const orgChange = selectedOrganization => dispatch => {
  const userOrg = [];
  const programs = [];
  selectedOrganization.forEach(org => {
    userOrg.push(org.information);
    org.information.programId.forEach(programId => {
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

export const programChange = selectedPrograms => dispatch => {
  const userPrograms = [];
  selectedPrograms.forEach(program => {
    userPrograms.push(program.information);
  });
  dispatch(userRegistrationStore.actions.setUserPrograms(userPrograms));

  getTemplateType(userPrograms).then(templateTypeList => {
    dispatch(userRegistrationStore.actions.setUserSubmissionList(templateTypeList));
  });
};

export const changeSubmission = () => (dispatch, getState) => {
  const {
    UserRegistrationStore: { userSubmissions },
  } = getState();
  dispatch(userRegistrationStore.actions.setAbleToComplete(true));
  const permissionList = submissionChange(userSubmissions);
  dispatch(userRegistrationStore.actions.setUserPermissionList(permissionList));
};

export const orgGroupChange = event => dispatch => {
  dispatch(userRegistrationStore.actions.setOrganizationGroup(event.value.name));
  getOrg(event.value._id).then(orgOptions => {
    dispatch(userRegistrationStore.actions.setOrganizationOptions(orgOptions));
  });
};

export const searchKeyChange = event => dispatch => {
  dispatch(userRegistrationStore.actions.setSearchKey(event.value));
};

export const appSysChange = event => dispatch => {
  dispatch(userRegistrationStore.actions.setUserAppSys(event.value.name));
};

export const referenceChange = event => dispatch => {
  const {
    target: { name, value },
  } = event;
  dispatch(userRegistrationStore.actions.setReference(value));
};

export const changePermission = (rowData, permission) => (dispatch, getState) => {
  const {
    UserRegistrationStore: { userSubmissions, helperState },
  } = getState();
  const submissions = cloneDeep(userSubmissions);
  const instruction = !rowData[permission];
  submissions[rowData.index][permission] = !rowData[permission];
  rowData[permission] = instruction;
  dispatch(userRegistrationStore.actions.setUserSubmissionList(submissions));
  dispatch(userRegistrationStore.actions.setHelperState(!helperState));
};

export const searchOrganization = () => (dispatch, getState) => {
  const {
    UserRegistrationStore: { searchKey, reference, organizationOptions },
  } = getState();
  const orgOptions = searchOrg(searchKey, reference, organizationOptions);
  dispatch(userRegistrationStore.actions.setOrganizationOptions(orgOptions));
};

export const stepNext = values => dispatch => {
  dispatch(userRegistrationStore.actions.setRegistrationData(values));
  getAppSys().then(appSys => {
    dispatch(userRegistrationStore.actions.setAppSysOptions(appSys));
    getOrgGroup().then(orgGroupOptions => {
      dispatch(userRegistrationStore.actions.setOrganizationGroupOptions(orgGroupOptions));
    });
    dispatch(userRegistrationStore.actions.setActiveStep(1));
  });
};
export const snackbarClose = () => dispatch => {
  dispatch(userRegistrationStore.actions.setIsSnackbarOpen(false));
  dispatch(userRegistrationStore.actions.setSnackbarMessage(''));
};

export const stepBack = () => dispatch => {
  dispatch(userRegistrationStore.actions.setActiveStep(0));
};

export const submit = () => (dispatch, getState) => {
  const {
    UserRegistrationStore: { userSubmissions, registrationData, userAppSys },
  } = getState();
  const userData = cloneDeep(registrationData);
  userData.hashedUsername = hash(userData.username);
  userData.password = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(8), null);
  userData.email = userData.email.toLowerCase();
  delete userData.passwordConfirm;
  userSubmissions.forEach(submission => {
    handleInputSysRole(userData, 'approve', submission, userAppSys);
    handleInputSysRole(userData, 'review', submission, userAppSys);
    handleInputSysRole(userData, 'input', submission, userAppSys);
    handleInputSysRole(userData, 'submit', submission, userAppSys);
    handleInputSysRole(userData, 'view', submission, userAppSys);
    handleInputSysRole(userData, 'viewCognos', submission, userAppSys);
  });
  sendRegistrationData(userData);
};
