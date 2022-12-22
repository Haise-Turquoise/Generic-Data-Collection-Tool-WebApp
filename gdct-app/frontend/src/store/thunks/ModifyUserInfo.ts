//@ts-ignore
import cloneDeep from 'clone-deep';
import userController from '../../controllers/user';
import usersController from '../../controllers/Users';
import { ModifyUserInfoStore, ModifyUserInfoStoreActions } from '../ModifyUserInfo/store';

import { updateRequestFactory } from './common/REST';
import { Dispatch } from 'redux';
import User, { ToBeApproved, UserOrg, UserProg, UserSysRole, UserTemplate } from '../../types/user';
//@ts-ignore issue with updatePopulated
export const updateUserInfoRequest = updateRequestFactory(ModifyUserInfoStore, userController);

type rowData = ToBeApproved

export const getUserInfoPopulatedRequest = (email: string) => (dispatch: Dispatch) => {
  dispatch(ModifyUserInfoStoreActions.REQUEST(''));

  usersController
    .fetchByEmail(email)
    .then(UserInfo => {
      dispatch(ModifyUserInfoStoreActions.RECEIVE([UserInfo]));
    })
    .catch(error => {
      dispatch(ModifyUserInfoStoreActions.FAIL_REQUEST(error));
    });
};

const handleInputTemplate = (rowData: rowData, template: UserTemplate[]) => {
  const newTemplate = {
    templateTypeId: rowData.submission._id,
    templateCode: rowData.submission.name,
    status: 'approved',
  };
  template.push(newTemplate);
};

const handleInputProgram = (rowData: rowData, program: UserProg[]) => {
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

const handleInputOrg = (rowData: rowData, org: UserOrg[]) => {
  const newOrg = {
    orgId: rowData.organization.id,
    orgName: rowData.organization.name,
    authorizedPerson: rowData.organization.authorizedPerson,
    program: [],
    IsActive: true,
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

const handleInputSysRole = (rowData: rowData, sysRole: UserSysRole[]) => {
  const newSysRole: User["sysRole"][0] = {
    appSys: rowData.appSys,
    role: rowData.permission,
    appSysRoleId: rowData.appSysRoleId,
    org: [],
    isActive: true,
    updatedAt: (new Date()).toString(),
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
export const approvePermission = (rowData: rowData, applierUser: User, user: User, resolve?: (value?:any) => void, reject?: () => void) => (dispatch: Dispatch) => {
  console.log('ROW DATA', rowData)
  dispatch(ModifyUserInfoStoreActions.REQUEST(''));
  const userCopy = cloneDeep(user);
  userCopy.toBeApproved = userCopy.toBeApproved?.filter((ele:any) => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id &&
      ele.createdAt == rowData.createdAt
    );
  });
  const applierUserCopy = cloneDeep(applierUser);
  applierUserCopy.pendingPermissions = applierUserCopy.pendingPermissions?.filter((ele:any) => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id &&
      ele.createdAt == rowData.createdAt
    );
  });
  handleInputSysRole(rowData, applierUserCopy.sysRole);
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

export const rejectPermission = (rowData: rowData, applierUser: User, user: User, resolve?: (value?:any) => void, reject?: () => void) => (dispatch: Dispatch) => {
  dispatch(ModifyUserInfoStoreActions.REQUEST(''));
  const userCopy = cloneDeep(user);
  userCopy.toBeApproved = userCopy.toBeApproved?.filter((ele:any) => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id &&
      ele.createdAt == rowData.createdAt
    );
  });
  const applierUserCopy = cloneDeep(applierUser);
  applierUserCopy.pendingPermissions = applierUserCopy.pendingPermissions?.filter((ele:any) => {
    return !(
      ele.applierEmail == rowData.applierEmail &&
      ele.appSys == rowData.appSys &&
      ele.permission == rowData.permission &&
      ele.organization.id == rowData.organization.id &&
      ele.program._id == rowData.program._id &&
      ele.submission._id == rowData.submission._id &&
      ele.createdAt == rowData.createdAt
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
