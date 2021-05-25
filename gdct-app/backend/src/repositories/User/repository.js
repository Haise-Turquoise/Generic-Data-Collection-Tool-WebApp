import i18n from 'i18n';
import cloneDeep from 'clone-deep';
import UserEntity from '../../entities/User';
import BaseRepository from '../repository';
import UserModel from '../../models/User';
import AppError from '../../utils/AppError';
const _ = require('lodash'); 
import {sendPermissionChangeUserVerficationEmail,sendPermissionChangeAdminVerficationEmail} from '../../middlewares/mail/mail'
export default class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  async create(user) {
    const userCopy = cloneDeep(user);
    return UserModel.create(userCopy);
  }

  async checkAuthenticate(email, password) {
    return UserModel.findOne({ email })
      .select('+password')
      .then(async user => {
        if (!user || !(await user.checkPassword(password, user.password))) {
          throw new AppError(i18n.__('User.Repository.checkAuthenticate.WrongInput'), 400);
        }
        return new UserEntity(user.toObject());
      });
  }

  async findById(_id) {
    return UserModel.findById(_id).then(user => {
      return new UserEntity(user.toObject());
    });
  }

  async findByUserName(username) {
    return UserModel.findOne({ username })
      .then(user => {
      // console.log('user',user)
      // const feedbackUser = new UserEntity(user.toObject());
      // console.log('feedbackUser',feedbackUser)
      if (!user) {
        return {};
      }
      return new UserEntity(user.toObject());
    });
  }

  async findByEmail(email) {
    return UserModel.findOne({ email })
      .then(user => {
        return new UserEntity(user.toObject());
      })
      .catch(err => {
        console.log(err);
      });
  }

  async updateSysRole(_id, sysRole) {
    return UserModel.findOneAndUpdate({ _id }, { sysRole});
  }
  async updateSysRoleFromTempSysRole(_id, sysRole) {
    
    // walk through the whole sysRole, make sure each pending state for templates is false
    sysRole.forEach((sys)=>{
      sys.org.forEach((orgList)=>{
        orgList.program.forEach((program)=>{
          program.template.forEach((template)=>{
            template.status = 'approved'
          })
        })
      })
    })
    return UserModel.findOneAndUpdate({ _id }, { sysRole:sysRole,newPermissionPending:false,tempSysRole:[], newTemplates:[]});
  }

  async activeUser(_id) {
    return UserModel.findOneAndUpdate({ _id }, { isActive: true });
  }

  async update(_id, user) {
    return UserModel.findOneAndUpdate({ _id}, { user });
  }

  async modifyUserInfo(_id, userData) {
    return UserModel.findOneAndUpdate({ _id: _id }, 
      { title: userData.title, 
        firstName: userData.firstName, 
        lastName: userData.lastName, 
        email: userData.email, 
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        ext: userData.ext,
      }
    );
  }
  async modifyUserToBeApproved(_id, userData) {
    console.log(_id)
    return UserModel.findOneAndUpdate({ _id: _id }, 
      { 
        toBeApproved: userData.toBeApproved,
      }
    );
  }
  async modifyUserPendingPermissions(_id, userData) {
    console.log(_id)
    return UserModel.findOneAndUpdate({ _id: _id }, 
      { 
        sysRole:userData.sysRole,
        pendingPermissions: userData.pendingPermissions,
      }
    );
  }

  async updatePermissionByUserEmail(email,permissionData,orgList) {
    const sysRole = permissionData.sysRole;
    const newTemplates = permissionData.newTemplates
    return UserModel.findOne({email}).then(user=>{
      sendPermissionChangeUserVerficationEmail(user.username, user.email)
      const hashedUsername = user.hashedUsername;
      const userId = user._id;
      const username = user.username;
      
      orgList.forEach(orgInfo => {
        sendPermissionChangeAdminVerficationEmail(orgInfo, hashedUsername, userId, username);
      });
      return user;
    }).then(user=>{
      const email = user.email;
      const sysRole = permissionData.sysRole;
      const newTemplates = permissionData.newTemplates;
      // return UserModel.findOneAndUpdate({ email }, { sysRole });
      return UserModel.findOneAndUpdate({ email }, { tempSysRole:sysRole,newPermissionPending:true,newTemplates:newTemplates });

    })






      

  }
}
