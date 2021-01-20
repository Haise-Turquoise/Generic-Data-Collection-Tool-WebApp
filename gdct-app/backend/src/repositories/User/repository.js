import i18n from 'i18n';
import UserEntity from '../../entities/User';
import BaseRepository from '../repository';
import UserModel from '../../models/User';
import AppError from '../../utils/AppError';
import cloneDeep from 'clone-deep';

import { copyFile } from 'fs';
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
    console.log('inside usermodel', username)
    return UserModel.findOne({username}).then(user => {
      console.log('user',user)
      // const feedbackUser = new UserEntity(user.toObject());
      // console.log('feedbackUser',feedbackUser)
      if(! user) {return {}}
      return new UserEntity(user.toObject());
    });
  }

  async findByEmail(email) {
    
    return UserModel.findOne({ email }).then(user => {
      // console.log(user)
      
      return new UserEntity(user.toObject());
    }).catch(err=>{console.log(err)});
  }

  async updateSysRole(_id, sysRole) {
    return UserModel.findOneAndUpdate({ _id }, { sysRole });
  }

  async activeUser(_id) {
    return UserModel.findOneAndUpdate({ _id }, { isActive: true });
  }

  async update(_id, user) {
    return UserModel.findOneAndUpdate({ _id }, { user });
  }
}
