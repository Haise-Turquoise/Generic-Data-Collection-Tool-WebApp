import { resolveConfig } from 'prettier';
import cloneDeep from 'clone-deep';
import userController from '../../controllers/user';
import usersController from '../../controllers/Users';
import { ModifyUserInfoStore, ModifyUserInfoStoreActions } from '../ModifyUserInfo/store';

import { updateRequestFactory } from './common/REST';

export const updateUserInfoRequest = updateRequestFactory(ModifyUserInfoStore, userController);

export const getUserInfoPopulatedRequest = email => dispatch => {
  dispatch(ModifyUserInfoStoreActions.REQUEST());

  usersController
    .fetchByEmail(email)
    .then(UserInfo => {
      dispatch(ModifyUserInfoStoreActions.RECEIVE([UserInfo]));
    })
    .catch(error => {
      dispatch(ModifyUserInfoStoreActions.FAIL_REQUEST(error));
    });
};

const handleInputTemplate = (rowData, template) => {
  const newTimestamp = new Date().toLocaleString();
  const newTemplate = {
    templateTypeId: rowData.submission._id,
    templateCode: rowData.submission.name,
    status: 'approved',
    timestamp:newTimestamp,
  };
  console.log(newTemplate)
  template.push(newTemplate);
};

const handleInputProgram = (rowData, program) => {
  const newProgram = {
    programId: rowData.program._id,
    programCode: rowData.program.code,
    template: [],
  };
  if (program.length > 0) {
    let sameProgram = false;
    for (const ele of program) {
      if (ele.programId == rowData.program._id) {
        sameProgram = true;
        handleInputTemplate(rowData, ele.template);
      }
    }
    if (!sameProgram) {
      program.push(newProgram);
      handleInputTemplate(rowData, newProgram.template);
    }
  } else {
    program.push(newProgram);
    handleInputTemplate(rowData, newProgram.template);
  }
};

const handleInputOrg = (rowData, org) => {
  const newOrg = {
    orgId: rowData.organization.id.toString(),
    name: rowData.organization.name,
    authorizedPerson: rowData.organization.authorizedPerson,
    program: [],
  };
  if (org.length > 0) {
    let sameOrg = false;
    for (const ele of org) {
      if (ele.orgId == rowData.organization.id) {
        sameOrg = true;
        handleInputProgram(rowData, ele.program);
      }
    }
    if (!sameOrg) {
      org.push(newOrg);
      handleInputProgram(rowData, newOrg.program);
    }
  } else {
    org.push(newOrg);
    handleInputProgram(rowData, newOrg.program);
  }
};

const handleInputSysRole = (rowData, sysRole) => {
  const newSysRole = {
    appSys: rowData.appSys,
    role: rowData.permission,
    appSysRoleId: rowData.appSysRoleId,
    org: [],
  };
  if (sysRole.length > 0) {
    let sameAppSysAndRole = false;
    for (const ele of sysRole) {
      if (rowData.appSys == ele.appSys && rowData.permission == ele.role) {
        sameAppSysAndRole = true;
        //
        handleInputOrg(rowData, ele.org);
      }
    }
    if (!sameAppSysAndRole) {
      //
      sysRole.push(newSysRole);
      handleInputOrg(rowData, newSysRole.org);
    }
  } else {
    sysRole.push(newSysRole);
    handleInputOrg(rowData, newSysRole.org);
  }
};
export const approvePermission = (rowData, applierUser, user, resolve, reject) => dispatch => {
  dispatch(ModifyUserInfoStoreActions.REQUEST());
  const userCopy = cloneDeep(user);
  userCopy.toBeApproved = userCopy.toBeApproved.filter(ele => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id
    );
  });
  const applierUserCopy = cloneDeep(applierUser);
  applierUserCopy.pendingPermissions = applierUserCopy.pendingPermissions.filter(ele => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id
    );
  });
  handleInputSysRole(rowData, applierUserCopy.sysRole);
  userController.updateToBeApproved(userCopy).then(result => {
    if (resolve) {
      resolve();
    }
  });
  console.log(applierUserCopy)
  userController.updatePendingPermissions(applierUserCopy).then(result => {
    if (resolve) {
      resolve();
    }
  });
  dispatch(ModifyUserInfoStoreActions.RECEIVE([userCopy]));
};

export const rejectPermission = (rowData, applierUser, user, resolve, reject) => dispatch => {
  dispatch(ModifyUserInfoStoreActions.REQUEST());
  const userCopy = cloneDeep(user);
  userCopy.toBeApproved = userCopy.toBeApproved.filter(ele => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id
    );
  });
  const applierUserCopy = cloneDeep(applierUser);
  applierUserCopy.pendingPermissions = applierUserCopy.pendingPermissions.filter(ele => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id
    );
  });
  userController.updateToBeApproved(userCopy).then(result => {
    if (resolve) {
      resolve();
    }
  });
  userController.updatePendingPermissions(applierUserCopy).then(result => {
    if (resolve) {
      resolve();
    }
  });
  dispatch(ModifyUserInfoStoreActions.RECEIVE([userCopy]));
};
