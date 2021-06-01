import hash from 'object-hash';
import cloneDeep from 'clone-deep';
import bcrypt from 'bcrypt-nodejs';
import { fromAddress } from 'xlsx-populate/lib/addressConverter';
import organizationController from '../../controllers/organization';
import AppSysController from '../../controllers/AppSys';
import organizationGroupController from '../../controllers/organizationGroup';
import programController from '../../controllers/Program';
import templateTypeController from '../../controllers/templateType';
import userController from '../../controllers/user';
import usersController from '../../controllers/Users';
import userRegistrationStore from '../UserRegistrationStore/store';
import { getUsersRequest } from './users';

import UsersStore from '../UsersStore/store';

// Loading Update Profile Page
export const getUserInfo = () => (dispatch, getState) =>{

  const email = localStorage.getItem('currentUser');
    usersController.fetchByEmail(email).then(users => {
      
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
      }
        userInfo.title = users.title;
        userInfo.username = users.username;
        userInfo.email = users.email;
        userInfo.firstName = users.firstName;
        userInfo.lastName = users.lastName;
        userInfo.phoneNumber = users.phoneNumber;
        // userInfo.password = users.password;
        userInfo.ext = users.ext;
        // userInfo.IsActive = users.IsActive;
        // userInfo.startDate = users.startDate;
        // userInfo.endDate = users.endDate;
        // userInfo.sysRole = users.sysRole;

        dispatch(userRegistrationStore.actions.setRegistrationData(userInfo));
        
          // dispatch(userRegistrationStore.actions.setActiveStep(0));
    });
}
const ModifyPermissionHandleInputTemplate = (templateSet, submission) => {
  const templateType = {
    templateTypeId: '',
    templateCode: '',
    status:undefined,
  };
  let templateSelected = templateSet.find(element => {
    return element.templateTypeId == submission.submission._id;
  });

  if (templateSelected == undefined) {
    templateType.templateCode = submission.submission.name;
    templateType.templateTypeId = submission.submission._id;
    if(submission.submission.status==undefined){
      // templateType.pending = submission.submission.pending;
      templateType.status = 'pending';
    }
    else{
      templateType.status = submission.submission.status;
    }
    templateSelected = templateType;
    templateSet.push(templateSelected);
  }
};
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
    return element.programId === submission.program._id;
  });

  if (programSelected === undefined) {
    program.programCode = submission.program.code;
    program.programId = submission.program._id;
    programSelected = program;
    programSet.push(programSelected);
  }

  handleInputTemplate(programSelected.template, submission);
};


const ModifyPermissionHandleInputProgram = (programSet, submission) => {
  const program = {
    programId: '',
    programCode: '',
    template: [],
  };
  let programSelected = programSet.find(function (element) {
    return element.programId === submission.program._id;
  });

  if (programSelected === undefined) {
    program.programCode = submission.program.code;
    program.programId = submission.program._id;
    programSelected = program;
    programSet.push(programSelected);
  }

  ModifyPermissionHandleInputTemplate(programSelected.template, submission);
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

const ModifyPermissionHandleInputOrg = (organization, submission) => {
  const org = {
    orgId: '',
    program: [],
  };

  let organizationSelected = organization.find(function (element) {
    return element.orgId === submission.organization.id;
  });
  if (organizationSelected === undefined) {
    if(submission.organization.IsActive == undefined){
      org.IsActive = false;
    }
    else{
      org.IsActive = submission.organization.IsActive;
    }
    
    org.orgId = submission.organization.id;
    org.name = submission.organization.name;
    org.authorizedPerson = submission.organization.authorizedPerson;
    organizationSelected = org;

    organization.push(organizationSelected);
  }
  if(submission.organization.IsActive == undefined){
    organizationSelected.IsActive = false;
  }
  ModifyPermissionHandleInputProgram(organizationSelected.program, submission);
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
const updatePermissionData = (email,permissionData) => {
  
  return userController.updatePermissionByUserEmail(email,permissionData).then((result=>{Promise.resolve(result)})).catch(error => console.error(error));
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
        status:submission.submission.status==undefined?'pending':submission.submission.status,
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
      return element.role == permission && element.appSys == userAppSys;
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


const ModifyPermissionHandleInputSysRole = (data, permission, submission, userAppSys) => {
  const sysRole = {
    appSys: '',
    role: '',
    org: [],
  };

  if (submission[permission]) {
    let sysRoleSelected = data.sysRole.find(element => {
      return element.role == permission && element.appSys == userAppSys;
    });
    if (sysRoleSelected == undefined) {
      sysRoleSelected = sysRole;
      sysRoleSelected.role = permission;
      sysRoleSelected.appSys = userAppSys;
      data.sysRole.push(sysRoleSelected);
    }
    ModifyPermissionHandleInputOrg(sysRoleSelected.org, submission);
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
// export const programChange = selectedPrograms => dispatch => {
//   const userPrograms = [];
//   selectedPrograms.forEach(program => {
//     userPrograms.push(program.information);
//   });
//   dispatch(userRegistrationStore.actions.setUserPrograms(userPrograms));

//   getTemplateType(userPrograms).then(templateTypeList => {
//     dispatch(userRegistrationStore.actions.setUserSubmissionList(templateTypeList));
//   });
// };
export const programChange = selectedPrograms => (dispatch, getState) => {
  const {
    UserRegistrationStore: { userPrograms },
  } = getState()
  let userProgramsCopy = cloneDeep(userPrograms)
  
  const newUserPrograms = [];
  selectedPrograms.forEach(program => {
    newUserPrograms.push(program.information);
  });
  
  if(userProgramsCopy.length > 0){
    // programs differentiate by _id and organization differentiate by id.
    userProgramsCopy = userProgramsCopy.filter((userProgram=>userProgram._id != newUserPrograms[0]._id || userProgram.org.id !=  newUserPrograms[0].org.id))
  }
  userProgramsCopy.push(newUserPrograms[0])
  dispatch(userRegistrationStore.actions.setUserPrograms(userProgramsCopy));

  getTemplateType(userProgramsCopy).then(templateTypeList => {
    dispatch(userRegistrationStore.actions.setUserSubmissionList(templateTypeList));
  });
};

export const changeSubmissionInModifyPermission = () => (dispatch, getState) => {
  const {
    UserRegistrationStore: { userSubmissions },
  } = getState();
  dispatch(userRegistrationStore.actions.setAbleToComplete(true));
  const permissionList = submissionChange(userSubmissions);
  const {
    UserRegistrationStore: { userPermissions },
  } = getState();
  const userPermissionsCopy = cloneDeep(userPermissions);
  permissionList.forEach(permission=>{
    userPermissionsCopy.push(permission)
  })
  

  dispatch(userRegistrationStore.actions.setUserPermissionList(userPermissionsCopy));
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







export const loadModifyPermissionPage =  ()=> async (dispatch,getState)=>{
  //get the current user email
  const email = localStorage.getItem('currentUser');
  //get the current user info from database
  // let userSubmissionsL = []
  
  const {
    UserRegistrationStore: { tempUserSubmissions },
  } = getState()
  
  const user = await usersController.fetchByEmail(email);
  //
   
  if(user.sysRole && tempUserSubmissions.length == 0){
      let UserSysRole = []
      // if there is no pending templates in the database
      if(user.tempSysRole.length == 0||user.tempSysRole==undefined){
        UserSysRole = user.sysRole
      }
      // there exist some pending templates
      else{
        UserSysRole = user.tempSysRole
      }

      for (const sysRole of UserSysRole){
        let userSubmission = {
          organization:null,
          program:null,
          submission:null,
          approve:false,
          review:false,
          submit:false,
          input:false,
          view:false,
          viewCognos:false,
          approveAvailable:true,
          reviewAvailable:true,
          submitAvailable:true,
          inputAvailable:true,
          viewAvailable:true,
          viewCognosAvailable:true,
          appSys:null,
          
  
          }
          // assign appSys for each userSubmission
          userSubmission.appSys = sysRole.appSys;
          // set each boolean represent of role for each userSubmission
          if(sysRole.role == 'Submitter'){
                  
                  userSubmission.submit = true;
            }
          else if(sysRole.role == 'Submission Approver'){
                  
                  userSubmission.approve = true;
            }
          else if(sysRole.role == 'Reviewer'){
                  userSubmission.review = true;
            }
          else if(sysRole.role == 'Inputter'){
                  userSubmission.input = true;
            }
          else if(sysRole.role == 'Viewer'){
                  userSubmission.view = true;
            }
          else if(sysRole.role == 'Reporter'){
                  userSubmission.viewCognos = true;
        }
        // loop over each organization
        for (const org of sysRole.org){
          // fetch the organization info
          const orgInfo = await organizationController.fetchById(org.orgId)
          userSubmission.organization = {
            name:orgInfo.name,
            id:orgInfo.id,
            authorizedPerson:orgInfo.authorizedPerson,
            IsActive : org.IsActive,   
          }
          // loop over each program
          for (const program of org.program){
            // fetch additional program info
            const programInfo = await programController.fetchById(program.programId)
            userSubmission.program =  {
            name:programInfo.name,
            code:programInfo.code,
            _id:programInfo._id,
            }
            // loop over each template
            for (const template of program.template){
              userSubmission.submission = {
                name: template.templateCode,
                _id: template.templateTypeId,
                status:template.status,
                }
              let userSubmissionCopy = cloneDeep(userSubmission)
                          // get specific template information 
              const templateTypeInfo = await templateTypeController.fetchById(template.templateTypeId)
                          
              userSubmissionCopy.approveAvailable = templateTypeInfo.isApprovable;
              userSubmissionCopy.reviewAvailable = templateTypeInfo.isReviewable;
              userSubmissionCopy.submitAvailable = templateTypeInfo.isSubmittable;
              userSubmissionCopy.inputAvailable = templateTypeInfo.isInputtable;
              userSubmissionCopy.viewAvailable = templateTypeInfo.isViewable;
              userSubmissionCopy.viewCognosAvailable = templateTypeInfo.isReportable;
                          
                          
              const {
                UserRegistrationStore: { tempUserSubmissions },
              } = getState();
              const userSubmissionsCopy = cloneDeep(tempUserSubmissions)
              userSubmissionCopy.index = userSubmissionsCopy.length
                          
              userSubmissionsCopy.push(userSubmissionCopy)
              dispatch(userRegistrationStore.actions.setTempUserSubmissionList(userSubmissionsCopy))
          
              const permissionList = submissionChange(userSubmissionsCopy);
              dispatch(userRegistrationStore.actions.setUserPermissionList(permissionList));
            }
            
          }
        }
      }
  }

  const {
    UserRegistrationStore: { userPermissions },
  } = getState();
  const userPermissionsCopy = cloneDeep(userPermissions);
  for(const pendingPermission of user.pendingPermissions){
    userPermissionsCopy.push(pendingPermission)
  }
  dispatch(userRegistrationStore.actions.setUserPermissionList(userPermissionsCopy));

  getAppSys().then(appSys => {
    dispatch(userRegistrationStore.actions.setAppSysOptions(appSys));
    getOrgGroup().then(orgGroupOptions => {
      dispatch(userRegistrationStore.actions.setOrganizationGroupOptions(orgGroupOptions));
    });
    dispatch(userRegistrationStore.actions.setActiveStep(1));
  });

};


export const stepNext = values => (dispatch, getState) => {
  dispatch(userRegistrationStore.actions.setRegistrationData(values));




  getAppSys().then(appSys => {
    dispatch(userRegistrationStore.actions.setAppSysOptions(appSys));
    getOrgGroup().then(orgGroupOptions => {
      dispatch(userRegistrationStore.actions.setOrganizationGroupOptions(orgGroupOptions));
    });
    // const {
    //   UsersStore: { response },
    // } = getState();
    // const users = response.Values;
    // let duplicate = false;
    // users.forEach(user => {
    //   if (user.username == values.username) {
    //     duplicate = true;
    //   }
    // });
    // if (duplicate) {
    //   alert('The username has already existed');
    // }
    // if (!duplicate) {
    //   dispatch(userRegistrationStore.actions.setActiveStep(1));
    // }
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

// Profile Update Button
export const stepUpdate = values => (dispatch, getState) => {
  dispatch(userRegistrationStore.actions.setRegistrationData(values));

  const {
    UserRegistrationStore: { registrationData },
  } = getState();
  const userData = cloneDeep(registrationData);
  

  // const sendRegistrationData = registerData => {
    return userController.modifyUserInfo(userData).then((res) =>{
      
    }).catch(error => console.error(error));
  // };

    // const {
    //   UsersStore: { response },
    // } = getState();
    // const users = response.Values;
    // let duplicate = false;
    // users.forEach(user => {
    //   if (user.username == values.username) {
    //     console.log('find duplicate');
    //     duplicate = true;
    //   }
    // });
    // if (duplicate) {
    //   alert('The username has already existed');
    // }
    // if (!duplicate) {
    //   dispatch(userRegistrationStore.actions.setActiveStep(0));
    // }
    dispatch(userRegistrationStore.actions.setActiveStep(0));
};

export const submit = () => (dispatch, getState) => {
  const {
    UserRegistrationStore: { userSubmissions, registrationData, userAppSys },
  } = getState();
  const userData = cloneDeep(registrationData);
  userData.phoneNumber = userData.phoneNumber.replace('-', '');
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
  userData.newTemplates = submissionChange(userSubmissions);
  userData.newTemplates.forEach(newTemplate=>{newTemplate.appSys = userAppSys, newTemplate.applierEmail = userData.email})
  console.log(userData)
  sendRegistrationData(userData);
};




export const updatePermission = () =>(dispatch, getState)=>{
  const {
    UserRegistrationStore: { userSubmissions, registrationData, userAppSys,tempUserSubmissions },
  } = getState();
  const userData = cloneDeep(registrationData);


  tempUserSubmissions.forEach(tempSubmission=>{
    ModifyPermissionHandleInputSysRole(userData, 'approve', tempSubmission, tempSubmission.appSys);
    ModifyPermissionHandleInputSysRole(userData, 'review', tempSubmission, tempSubmission.appSys);
    ModifyPermissionHandleInputSysRole(userData, 'input', tempSubmission, tempSubmission.appSys);
    ModifyPermissionHandleInputSysRole(userData, 'submit', tempSubmission, tempSubmission.appSys);
    ModifyPermissionHandleInputSysRole(userData, 'view', tempSubmission, tempSubmission.appSys);
    ModifyPermissionHandleInputSysRole(userData, 'viewCognos', tempSubmission, tempSubmission.appSys);
  })
  userSubmissions.forEach(submission => {
    ModifyPermissionHandleInputSysRole(userData, 'approve', submission, userAppSys);
    ModifyPermissionHandleInputSysRole(userData, 'review', submission, userAppSys);
    ModifyPermissionHandleInputSysRole(userData, 'input', submission, userAppSys);
    ModifyPermissionHandleInputSysRole(userData, 'submit', submission, userAppSys);
    ModifyPermissionHandleInputSysRole(userData, 'view', submission, userAppSys);
    ModifyPermissionHandleInputSysRole(userData, 'viewCognos', submission, userAppSys);
  });
  const email = localStorage.getItem('currentUser');

  userData.newTemplates = submissionChange(userSubmissions);
  userData.newTemplates.forEach(newTemplate=>{newTemplate.appSys = userAppSys, newTemplate.applierEmail = email})
  console.log(userData)
  updatePermissionData(email,userData);
}

