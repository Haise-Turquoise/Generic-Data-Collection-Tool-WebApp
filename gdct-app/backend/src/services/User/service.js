import Container, { Service } from 'typedi';
import UserRepository from '../../repositories/User';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import {
  sendUserVerficationEmail,
  sendAdminVerficationEmail,
  sendUserActiveEmail,
  sendUserRejectEmail,
} from '../../loaders/mail/mail';
import ErrorGDCT from '../../utils/errorGDCT';

// @Service()
export default class UserService {
  constructor() {
    this.UserRepository = Container.get(UserRepository);
    this.AppSysRoleReposiotry = Container.get(AppSysRoleRepository);
  }

  register(registerData) {
    // JS User object
    console.log(registerData);
    this.UserRepository.create(registerData).then(registerRecord => {
      sendUserVerficationEmail(registerData);
      const { hashedUsername } = registerRecord;
      const { username } = registerRecord;
      const userId = registerRecord._id;
      const orgList = [];
      registerData.sysRole.forEach(sysRole => {
        sysRole.org.forEach(org => {
          let orgInfo = orgList.find(function (element) {
            return element.orgId == org.orgId;
          });
          if (orgInfo == undefined) {
            const orgData = {
              authorizedPerson: org.authorizedPerson,
              name: org.name,
              orgId: org.orgId,
              permission: [],
            };
            orgInfo = orgData;
            orgList.push(orgInfo);
          }
          org.program.forEach(program => {
            program.template.forEach(template => {
              orgInfo.permission.push({
                template: template.templateCode,
                role: sysRole.role,
              });
            });
          });
        });
      });

      orgList.forEach(orgInfo => {
        sendAdminVerficationEmail(orgInfo, hashedUsername, userId, username);
      });
    });
  }

  login(username) {
    this.UserRepository.findActiveUserByUsername(username);
  }

  logout() {}

  sendActiveEmail(approve, _id, orgId) {
    let checkActive = true;

    this.UserRepository.findById(_id).then(user => {
      if (approve == 'true') {
        user.sysRole.forEach(sysRole => {
          sysRole.org.forEach(org => {
            if (org.orgId == orgId) org.IsActive = true;
            checkActive = checkActive && org.IsActive;
          });
        });
        if (checkActive) {
          sendUserActiveEmail(user);
        }
        this.UserRepository.updateSysRole(_id, user.sysRole).then(model => {
          console.log(model.sysRole[0].org);
        });
        return 'You have approved the user. The user will active the account by email.';
      }
      sendUserRejectEmail(user);
      return 'You have rejected the user. The user will be notified by email.';
    });
  }

  activeUser(_id) {
    this.UserRepository.findById({ _id }).then(model => {
      console.log(model);
    });
    this.UserRepository.activeUser({ _id }).then(model => {
      console.log(model);
      return 'The account active';
    });
  }

  changePassword() {}

  async findById(id) {
    return this.UserRepository.findById(id);
  }
}
