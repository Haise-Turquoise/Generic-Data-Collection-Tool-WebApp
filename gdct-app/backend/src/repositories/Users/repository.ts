import Container from 'typedi';
//@ts-ignore
import i18n from 'i18n';
import BaseRepository from '../repository';
import UserModel from '../../models/User';
import TemplateRepository from '../Template';
import UsersEntity from '../../entities/Users';
import AppError from '../../utils/AppError';
import User, { UserDoc } from '../../types/user';
import { FilterQuery } from 'mongoose';

// @Service()
export default class UsersRepository extends BaseRepository<User, UserDoc> {
  private templateRepository: TemplateRepository

  constructor() {
    super(UserModel);
    this.templateRepository = Container.get(TemplateRepository);
  }

  async create({ firstName, lastName, isActive }: User) {
    return UserModel.create({
      firstName,
      lastName,
      isActive,
    }).then(user => new UsersEntity(user));
  }

  async update(id: string, { username, firstName, lastName, email, phoneNumber, isActive, updatedAt, updatedBy, sysRole, }: Partial<User>) {
    return UserModel.findByIdAndUpdate(id, {
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      isActive,
      updatedAt,
      updatedBy,
    }).then((user: UserDoc|null) => {
      if (!user) throw new AppError(`Cannot update the user with id:${id}, id not found`)
      return new UserModel(user);
    });
  }

  async find(query: Partial<User>) {
    const realQuery: FilterQuery<UserDoc> = {};
    let key: keyof User
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    // make search params case insensitive and use similar to sql LIKE with regex
    // TODO come back to this query
    //@ts-ignore
    realQuery.lastName ? (realQuery.lastName = { $regex: realQuery.lastName, $options: 'i' }) : '';
    realQuery.firstName
    //@ts-ignore
      ? (realQuery.firstName = { $regex: realQuery.firstName, $options: 'i' })
      : '';
    //@ts-ignore
    realQuery.username ? (realQuery.username = { $regex: realQuery.username, $options: 'i' }) : '';
    realQuery['sysRole.org.orgName']
      ? (realQuery['sysRole.org.orgName'] = {
          $regex: realQuery['sysRole.org.orgName'],
          $options: 'i',
        })
      : '';

    return UserModel.find(realQuery).then((users: UserDoc[]) => users.map(user => new UsersEntity(user)));
  }

  findOne(id: string) {
    const message = `${i18n.__('MethodNotImplemented')} ${{ id }}`;

    throw new AppError(message, 400);
  }

  async delete(id: string) {
    return UserModel.findByIdAndDelete(id)
    .then((user: UserDoc|null) => {
      if (!user) throw new AppError(`Delete failed, Item not found for Users item with ID: ${id}`)
      return new UsersEntity(user)
    });
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async updatePasswordByUserEmail(email: string, newpassword: string) {
    return UserModel.findOne({email}).then((user: UserDoc|null)=>{
      if (!user) throw new AppError(`Cannot find User with email ${email}`);
      return UserModel.findOneAndUpdate({ email }, { password: newpassword });
    })
  }
}
