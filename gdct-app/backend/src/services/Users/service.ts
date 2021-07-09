import Container from 'typedi';
import UsersRepository from '../../repositories/Users';
import { UserDoc } from '../../types/user';

// @Service()
export default class UserService {
  private UsersRepository: UsersRepository;

  constructor() {
    this.UsersRepository = Container.get(UsersRepository);
  }

  async createUser(User: UserDoc) {
    return this.UsersRepository.create(User);
  }

  async deleteUser(id: string) {
    return this.UsersRepository.delete(id);
  }

  async updateUser(id: string, User: Partial<UserDoc>) {
    return this.UsersRepository.update(id, User);
  }

  async findUser(User: UserDoc) {
    return this.UsersRepository.find(User);
  }

  async findUserByEmail(email: string) {
    return this.UsersRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    return this.UsersRepository.findById(id);
  }
}
