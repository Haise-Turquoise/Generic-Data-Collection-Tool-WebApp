import Container from 'typedi';
import BaseRepository from '../repository';
import UserModel from '../../models/User';
import TemplateRepository from '../Template';
import UserEntity from '../../entities/Users';

// @Service()
export default class UsersRepository extends BaseRepository {
  constructor() {
    super(UserModel);
    this.templateRepository = Container.get(TemplateRepository);
  }

  async create({ firstName, lastName, isActive }) {
    return UserModel.create({
      firstName,
      lastName,
      isActive,
    }).then(user => new UserEntity(user));
  }

  async update(id, { username, firstName, lastName, email, phoneNumber, isActive }) {
    return UserModel.findByIdAndUpdate(id, {
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      isActive,
    }).then(user => new UserModel(user.toObject()));
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    // make search params case insensitive and use similar to sql LIKE with regex
    realQuery.lastName ? (realQuery.lastName = { $regex: realQuery.lastName, $options: 'i' }) : '';
    realQuery.firstName
      ? (realQuery.firstName = { $regex: realQuery.firstName, $options: 'i' })
      : '';
    realQuery.username ? (realQuery.username = { $regex: realQuery.username, $options: 'i' }) : '';
    realQuery['sysRole.org.orgName']
      ? (realQuery['sysRole.org.orgName'] = {
          $regex: realQuery['sysRole.org.orgName'],
          $options: 'i',
        })
      : '';

    // console.log("realQuery: " + JSON.stringify(realQuery));

    return UserModel.find(realQuery).then(users => users.map(user => new UserEntity(user)));
  }

  findOne(id) {
    throw new Error(`Method not implemented.${id}`);
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id).then(user => new UserEntity(user));
  }
}
