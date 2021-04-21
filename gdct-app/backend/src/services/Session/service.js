import Container from 'typedi';
import SessionRepository from '../../repositories/Session';

// @Service()
export default class SheetNameService {
  constructor() {
    this.sessionRepository = Container.get(SessionRepository);
  }

  async findByExpirationTime(expirationTimeLowerBound, expirationTimeUpperBound) {
    return this.sessionRepository.findByExpirationTime(expirationTimeLowerBound, expirationTimeUpperBound);
  }

  async findById(id) {
    return this.sessionRepository.findById(id);
  }

  async updateExpiration(id, originalMaxAge) {
    return this.sessionRepository.updateExpiration(id, originalMaxAge);
  }
}
