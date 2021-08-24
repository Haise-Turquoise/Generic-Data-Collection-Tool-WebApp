//@ts-ignore
import i18n from 'i18n';
//@ts-ignore
import cloneDeep from 'clone-deep';
import UserEntity from '../../entities/User';
import BaseRepository from '../repository';
import UserModel from '../../models/User';
import AppError from '../../utils/AppError';
const _ = require('lodash'); 
import {sendPermissionChangeUserVerficationEmail,sendPermissionChangeAdminVerficationEmail} from '../../middlewares/mail/mail'
import User, { UserDoc, UserSysRole } from '../../types/user';
//@ts-ignore
// import Organization from '../../types/organization';
import { ObjectId } from 'mongodb';
interface Organization  {
  name:string,
  authorizedPerson:{
    name:string,
    telephone:string, 
    email:string,
  }
  orgId:string,
  permission:string[],

}
export default class UserRepository extends BaseRepository<User, UserDoc> {
  constructor() {
    super(UserModel);
  }

  async create(user: User) {
    const userCopy = cloneDeep(user);
    return UserModel.create(userCopy);
  }

  async checkAuthenticate(email: string, password: string) {
    return UserModel.findOne({ email })
      .select('+password')
      // TODO test this
      .then(async (user: any) => {
        if (!user || !(await user.checkPassword(password, user.password))) {
          throw new AppError(i18n.__('User.Repository.checkAuthenticate.WrongInput'), 400);
        }
        return new UserEntity(user);
      });
  }

  async findById(_id: string) {
    return UserModel.findById(_id).then((user: UserDoc|null) => {
      if (!user) return undefined;
      return new UserEntity(user);
    });
  }

  async findByUserName(username: string) {
    return UserModel.findOne({ username })
      .then((user: UserDoc|null) => {
      // console.log('user',user)
      // const feedbackUser = new UserEntity(user.toObject());
      // console.log('feedbackUser',feedbackUser)
      if (!user) {
        return {};
        // throw new AppError(`Cannot find user with username ${username}`);
        ;
      }
      return new UserEntity(user);
    });
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email })
      .then((user: UserDoc|null) => {
        if (!user) throw new AppError(`Query failed, User not found with email: ${email}`)
        return new UserEntity(user);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  async updateSysRole(_id: string, sysRole: UserSysRole[]) {
    return UserModel.findOneAndUpdate({ _id }, { sysRole});
  }
  async updateSysRoleFromTempSysRole(_id: string, sysRole: UserSysRole[]) {
    
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
    //@ts-ignore
    return UserModel.findOneAndUpdate({ _id }, { sysRole:sysRole,newPermissionPending:false,tempSysRole:[], newTemplates:[]});
  }

  async activeUser(_id: string) {
    return UserModel.findOneAndUpdate({ _id }, { isActive: true });
  }

  async update(_id: string, user: Partial<User>) {
    return UserModel.findOneAndUpdate({ _id}, { user });
  }

  async modifyUserInfo(_id: string, userData: Partial<User>) {
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
  async modifyUserToBeApproved(_id: string|ObjectId, { toBeApproved }: UserEntity) {
    return UserModel.findOneAndUpdate({ _id: _id }, 
      { 
        toBeApproved: toBeApproved,
      }
    );
  }
  async modifyUserPendingPermissions(_id: ObjectId, { sysRole, isActive, pendingPermissions }: UserEntity) {
    return UserModel.findOneAndUpdate({ _id: _id }, 
      { 
        sysRole: sysRole,
        isActive: isActive,
        pendingPermissions: pendingPermissions,
      }
    );
  }

  async updatePermissionByUserEmail(email: string, permissionData: User, orgList: Organization[]) {
    return UserModel.findOne({email}).then((user: UserDoc|null)=>{
      if (!user) throw new AppError(`Cannot find User with email ${email}`);
      sendPermissionChangeUserVerficationEmail(user.username, user.email);
      const hashedUsername = user.hashedUsername;
      const userId = user._id;
      const username = user.username;
      
      orgList.forEach(orgInfo => {
        sendPermissionChangeAdminVerficationEmail(orgInfo, hashedUsername, userId.toString(), username);
      });
      return user;
    }).then((user: UserDoc)=>{
      const email = user.email;
      const sysRole = permissionData.sysRole;
      const newTemplates = permissionData.newTemplates;
      // return UserModel.findOneAndUpdate({ email }, { sysRole });
      return UserModel.findOneAndUpdate({ email }, { tempSysRole:sysRole,newPermissionPending:true,newTemplates:newTemplates });

    })
  }
}
