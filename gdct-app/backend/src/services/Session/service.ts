import Container from 'typedi';
import SessionRepository from '../../repositories/Session';

// @Service()
export default class SheetNameService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = Container.get(SessionRepository);
  }

  async findById(id: string) {
    return this.sessionRepository.findById(id);
  }

  async updateExpiration(id: string, originalMaxAge: number) {
    return this.sessionRepository.updateExpiration(id, originalMaxAge);
  }
}
