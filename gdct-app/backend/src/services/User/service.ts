import Container, { Service } from 'typedi';
import UserRepository from '../../repositories/User';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import User,{UserDoc} from '../../types/user';
//@ts-ignore
import cloneDeep from 'clone-deep';
import {
  sendUserVerficationEmail,
  sendPermissionChangeUserVerficationEmail,
  sendAdminVerficationEmail,
  sendUserActiveEmail,
  sendUserRejectEmail,
} from '../../middlewares/mail/mail';
import { AppSysRoleDoc } from '../../types/appsysrole';
import { ParsedQs } from 'qs';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import AppError from '../../utils/AppError';
import UserEntity from '../../entities/User';

type queryParam = string | string[] | ParsedQs | ParsedQs[] | undefined

// @Service()
export default class UserService {
  private UserRepository: UserRepository
  private AppSysRoleRepository: AppSysRoleRepository

  constructor() {
    this.UserRepository = Container.get(UserRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async register(registerData: User) {
    // JS User object

    const promiseQuery: Promise<any>[] = [];
    registerData.sysRole.forEach(sysRole => {
      // eslint-disable-next-line default-case
      switch (sysRole.role) {
        case 'approve': {
          sysRole.role = 'Submission Approver';
          break;
        }
        case 'review': {
          sysRole.role = 'Reviewer';
          break;
        }
        case 'input': {
          sysRole.role = 'Inputter';
          break;
        }
        case 'view': {
          sysRole.role = 'Viewer';
          break;
        }
        case 'submit': {
          sysRole.role = 'Submitter';
          break;
        }
        case 'viewCognos': {
          sysRole.role = 'Reporter';
          break;
        }
        default:
          break;
      }
      promiseQuery.push(
        this.AppSysRoleRepository.findAndCreateAppSysRole(sysRole.appSys, sysRole.role).then(
          (appSysRole: AppSysRoleDoc) => {
            sysRole.appSysRoleId = appSysRole._id;
            sysRole._id = appSysRole._id;
          },
        ),
      );
    });
    // reset sysRole to empty
    registerData.sysRole = [];
    await Promise.all(promiseQuery);
    await this.UserRepository.create(registerData);

    const newTemplates = registerData.newTemplates;
    for (const template of newTemplates) {
      const appSysRole = await this.AppSysRoleRepository.findAndCreateAppSysRole(template.appSys, template.permission)
      template.appSysRoleId = appSysRole._id;
      const orgApproverName = template.organization.authorizedPerson.name;
      const orgApprover = await this.fetchUserByUserName(orgApproverName);
      const orgApproverCopy = cloneDeep(orgApprover)
      orgApproverCopy.toBeApproved.push(template)
      await this.UserRepository.modifyUserToBeApproved(orgApproverCopy._id, orgApproverCopy)



      const userInfo = await this.UserRepository.findByEmail(registerData.email)
      if (!userInfo) throw new AppError(`Cannot find user Info with data ${registerData.email}`)
      const userInfoCopy = cloneDeep(userInfo)
      userInfoCopy.pendingPermissions.push(template)
      await this.UserRepository.modifyUserPendingPermissions(userInfo._id,userInfoCopy)
    }



    // this.UserRepository.create(registerData).then(registerRecord => {
    //   sendUserVerficationEmail(registerData);
    //   const { hashedUsername } = registerRecord;
    //   const { username } = registerRecord;
    //   const userId = registerRecord._id;
    //   const orgList = [];
    //   registerData.sysRole.forEach(sysRole => {
    //     sysRole.org.forEach(org => {
    //       let orgInfo = orgList.find(function (element) {
    //         return element.orgId == org.orgId;
    //       });
    //       if (orgInfo == undefined) {
    //         const orgData = {
    //           authorizedPerson: org.authorizedPerson,
    //           name: org.name,
    //           orgId: org.orgId,
    //           permission: [],
    //         };
    //         orgInfo = orgData;
    //         orgList.push(orgInfo);
    //       }
    //       org.program.forEach(program => {
    //         program.template.forEach(template => {
    //           orgInfo.permission.push({
    //             template: template.templateCode,
    //             role: sysRole.role,
    //           });
    //         });
    //       });
    //     });
    //   });

    //   orgList.forEach(orgInfo => {
    //     sendAdminVerficationEmail(orgInfo, hashedUsername, userId, username);
    //   });
    // });
  }

  async sendActiveEmail(approve: queryParam, _id: queryParam, orgId: queryParam) {
    let checkActive = true;
    this.UserRepository.findById(_id?.toString() || '').then(user => {
      if (!user) throw new AppError(`User not found for user id ${_id}`);
      if (approve == 'true') {
        user.sysRole.forEach((sysRole: User["sysRole"][0]) => {
          sysRole.org.forEach(org => {
            if (org.orgId == orgId) org.IsActive = true;
            checkActive = checkActive && org.IsActive;
          });
        });
        if (checkActive) {
          sendUserActiveEmail(user);
        }
        //@ts-ignore
        this.UserRepository.updateSysRole(_id?.toString() || '', user.sysRole);
        return 'You have approved the user. The user will active the account by email.';
      }
      sendUserRejectEmail(user);
      return 'You have rejected the user. The user will be notified by email.';
    });
  }



  async sendUserPermissionActiveEmail(approve: queryParam, _id: queryParam, orgId: queryParam) {
    // need to finish the logic, replace appSys with tempAppSys, clean the tempAppSys, newTemplates. Set the newPermissionPending to false
    let checkActive = true;
    this.UserRepository.findById(_id?.toString() || '').then(user => {
      if (!user) throw new AppError(`Cannot find user by ID ${_id}.`);
      
      if (approve == 'true') {
        // user.sysRole.forEach(sysRole => {
        //   sysRole.org.forEach(org => {
        //     if (org.orgId == orgId) org.IsActive = true;
        //     checkActive = checkActive && org.IsActive;
        //   });
        // });
        if (checkActive) {
          sendUserActiveEmail(user);
        }
        
        this.UserRepository.updateSysRoleFromTempSysRole(_id?.toString() || '', user.tempSysRole);
        return 'You have approved the user. The user will active the account by email.';
      }
      sendUserRejectEmail(user);
      return 'You have rejected the user. The user will be notified by email.';
    });
  }

  //TODO test this too
  async activeUser(_id: queryParam) {
    this.UserRepository.findById(_id?.toString() || '').then(model => {
      console.log(model);
    });
    this.UserRepository.activeUser(_id?.toString() || '').then(model => {
      return 'The account active';
    });
  }

  changePassword() {}

  async findById(id: string) {
    return this.UserRepository.findById(id);
  }

  async modifyUserInfo(_id: string, userData: User) {
    return this.UserRepository.modifyUserInfo(_id, userData);
  }

  async modifyUserToBeApproved(_id: string, userData: User) {
    return this.UserRepository.modifyUserToBeApproved(_id, userData);
  }

  async modifyUserPendingPermissions(_id: ObjectId, userData: User) {
    return this.UserRepository.modifyUserPendingPermissions(_id, userData);
  }

  async fetchUserByUserName(username: string) {
    return this.UserRepository.findByUserName(username);
  }

  //TODO not sure what permissionData is here
  async deleteUserPermission(email: string, permissionData: any) {
    const userCopy: UserEntity|void = await this.UserRepository.findByEmail(email)
    if (!userCopy) {
      return null
    }
    // see what data and roles are present
    const foundRole= userCopy.sysRole
      .find(role => role.role === permissionData.role)
    const foundOrg = foundRole?.org
      .find(org => org.orgId === permissionData.orgId)
    const foundProg = foundOrg?.program
      .find(prog => prog.programCode === permissionData.programCode)
    const foundTemplate = foundProg?.template
      .find(template => template.templateCode === permissionData.templateCode)

    if (
      !foundRole ||
      !foundOrg ||
      !foundProg ||
      !foundTemplate
    ) {
      console.log('ERROR OCCURED -- mismatch data in user service')
      return userCopy
    }

    const roleIndex = userCopy.sysRole.indexOf(foundRole)
    const orgIndex = foundRole.org.indexOf(foundOrg)
    const progIndex = foundOrg.program.indexOf(foundProg)
    const templateIndex = foundProg.template.indexOf(foundTemplate)

    // delete as much as possible
    if (userCopy.sysRole[roleIndex].org[orgIndex].program[progIndex].template.length > 1) {
      userCopy.sysRole[roleIndex].org[orgIndex].program[progIndex].template.splice(templateIndex, 1)
    } else if (userCopy.sysRole[roleIndex].org[orgIndex].program.length > 1) {
      userCopy.sysRole[roleIndex].org[orgIndex].program.splice(progIndex, 1)
    } else if (userCopy.sysRole[roleIndex].org.length > 1) {
      userCopy.sysRole[roleIndex].org.splice(orgIndex, 1)
    } else {
      userCopy.sysRole.splice(roleIndex, 1)
    }

    if (userCopy.sysRole.length < 1) {
      userCopy.isActive = false;
    }

    await this.UserRepository.modifyUserPendingPermissions(userCopy._id, userCopy)
    return userCopy
  }

  async updatePermissionByUserEmail(email: string,permissionData: User){
    
    let registerData = permissionData;
    // console.log(registerData)
    const promiseQuery: Promise<any>[] = [];
    registerData.sysRole.forEach((sysRole) => {
 
      switch (sysRole.role) {
        case 'approve': {
          sysRole.role = 'Submission Approver';
          break;
        }
        case 'review': {
          sysRole.role = 'Reviewer';
          break;
        }
        case 'input': {
          sysRole.role = 'Inputter';
          break;
        }
        case 'view': {
          sysRole.role = 'Viewer';
          break;
        }
        case 'submit': {
          sysRole.role = 'Submitter';
          break;
        }
        case 'viewCognos': {
          sysRole.role = 'Reporter';
          break;
        }
        default:
          break;
      }
      promiseQuery.push(
        this.AppSysRoleRepository.findAndCreateAppSysRole(sysRole.appSys, sysRole.role).then(
          appSysRole => {
            sysRole.appSysRoleId = appSysRole._id;
            sysRole._id = appSysRole._id;
          },
        ),
      );
    });
    await Promise.all(promiseQuery);
    const newTemplates = permissionData.newTemplates;
    for (const template of newTemplates) {
      const appSysRole = await this.AppSysRoleRepository.findAndCreateAppSysRole(template.appSys, template.permission)
      template.appSysRoleId = appSysRole._id;
      const orgApproverName = template.organization.authorizedPerson.name;
      const orgApprover = await this.fetchUserByUserName(orgApproverName);
      const orgApproverCopy = cloneDeep(orgApprover)
      orgApproverCopy.toBeApproved.push(template)
      await this.UserRepository.modifyUserToBeApproved(orgApproverCopy._id, orgApproverCopy)



      const userInfo = await this.UserRepository.findByEmail(email)
      if (!userInfo) throw new AppError(`User not found with email ${email}`);
      const userInfoCopy = cloneDeep(userInfo)
      userInfoCopy.pendingPermissions.push(template)
      await this.UserRepository.modifyUserPendingPermissions(userInfo._id,userInfoCopy)
      // prepare for sending email
      // let orgInfo = orgList.find(function(element){
      //   return element.orgId == template.organization.id;
      // })
      // if(orgInfo == undefined){
      //   const orgData = {
      //     authorizedPerson:template.organization.authorizedPerson,
      //     name:template.organization.name,
      //     orgId:template.organization.id,
      //     permission:[],
      //   }
      //   orgInfo = orgData;
      //   orgList.push(orgInfo);
      //   orgInfo.permission.push({
      //     template: template.submission.name,
      //     role: template.permission,
      //     programName:template.program.name,
      //     programCode:template.program.code,
      //   })
      // }
    }
    // return this.UserRepository.updatePermissionByUserEmail(email.email,permissionData.permissionData,orgList)
  }
}
