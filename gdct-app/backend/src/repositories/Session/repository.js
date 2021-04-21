import BaseRepository from '../repository';
import SessionModel from '../../models/Session';

// @Service()
export default class SessionRepository extends BaseRepository {
  constructor() {
    super(SessionModel);
  }

  async findByExpirationTime(expirationTimeLowerBound, expirationTimeUpperBound) {
    return SessionModel.find({ expires: {'$gte': expirationTimeLowerBound, '$lte': expirationTimeUpperBound} });
  }

  async findById(id) {
    return SessionModel.findOne({ _id: id });
  }

  async updateExpiration(id, originalMaxAge) {
    const currentTime = new Date();
    const newSessionTime = new Date(currentTime.getTime() + (originalMaxAge));
    console.log(originalMaxAge + newSessionTime);
    return SessionModel.findOneAndUpdate({ _id: id }, { expires: newSessionTime});
  }
}
