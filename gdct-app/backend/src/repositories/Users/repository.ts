import Container from 'typedi';
import i18n from 'i18n';
import BaseRepository from '../repository';
import UserModel from '../../models/User';
import TemplateRepository from '../Template';
import UsersEntity from '../../entities/Users';
import AppError from '../../utils/AppError';
import { UserDoc } from '../../types/user';
import { FilterQuery } from 'mongoose';

// @Service()
export default class UsersRepository extends BaseRepository<UserDoc> {
  private templateRepository: TemplateRepository

  constructor() {
    super(UserModel);
    this.templateRepository = Container.get(TemplateRepository);
  }

  async create({ firstName, lastName, isActive }: UserDoc) {
    return UserModel.create({
      firstName,
      lastName,
      isActive,
    }).then(user => new UsersEntity(user));
  }

  async update(id: string, { username, firstName, lastName, email, phoneNumber, isActive, timestamp, updatedBy, }: Partial<UserDoc>) {
    return UserModel.findByIdAndUpdate(id, {
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      isActive,
      timestamp,
      updatedBy,
    }).then((user: UserDoc) => new UserModel(user));
  }

  async find(query: FilterQuery<UserDoc>) {
    const realQuery: FilterQuery<UserDoc> = {};

    for (const key in query) {
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
    return UserModel.findByIdAndDelete(id).then((user: UserDoc) => new UsersEntity(user));
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }
}
