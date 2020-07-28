import Container from 'typedi';
import UsersRepository from '../../repositories/Users';

// @Service()
export default class UserService {
  constructor() {
    this.UsersRepository = Container.get(UsersRepository);
  }

  async createUser(User) {
    return this.UsersRepository.create(User);
  }

  async deleteUser(id) {
    return this.UsersRepository.delete(id);
  }

  async updateUser(id, User) {
    return this.UsersRepository.update(id, User);
  }

  async findUser(User) {
    return this.UsersRepository.find(User);
  }
}
