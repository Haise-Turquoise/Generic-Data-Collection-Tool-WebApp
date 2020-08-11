import UserEntity from '../../entities/User';
import BaseRepository from '../repository';
import UserModel from '../../models/User';
import ErrorGDCT from '../../utils/errorGDCT';

export default class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  async create(user) {
    return UserModel.create(user);
  }

  async checkAuthenticate(email, password) {
    return UserModel.findOne({ email })
      .select('+password')
      .then(async user => {
        if (!user || !(await user.checkPassword(password, user.password))) {
          throw new ErrorGDCT('Incorrect email or password', 400);
        }
        return new UserEntity(user.toObject());
      });
  }

  async findById(_id) {
    return UserModel.findById(_id).then(user => {
      return new UserEntity(user.toObject());
    });
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email }).then(user => {
      return new UserEntity(user.toObject());
    });
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
