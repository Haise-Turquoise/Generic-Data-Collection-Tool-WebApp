import Container from 'typedi';
import UsersRepository from '../../repositories/Users';
import User from '../../types/user';

// @Service()
export default class UserService {
  private UsersRepository: UsersRepository;

  constructor() {
    this.UsersRepository = Container.get(UsersRepository);
  }

  async createUser(User: User) {
    return this.UsersRepository.create(User);
  }

  async deleteUser(id: string) {
    return this.UsersRepository.delete(id);
  }

  async updateUser(id: string, User: Partial<User>) {
    return this.UsersRepository.update(id, User);
  }

  async findUser(User: Partial<User>) {
    return this.UsersRepository.find(User);
  }

  async findUserByEmail(email: string) {
    return this.UsersRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    return this.UsersRepository.findById(id);
  }

  async updatePasswordByUserEmail(email: string, newpassword: string) {
    return this.UsersRepository.updatePasswordByUserEmail(email, newpassword);
  }
}
