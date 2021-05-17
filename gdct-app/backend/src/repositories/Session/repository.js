import BaseRepository from '../repository';
import SessionModel from '../../models/Session';

// @Service()
export default class SessionRepository extends BaseRepository {
  constructor() {
    super(SessionModel);
  }

  async findById(id) {
    return SessionModel.findOne({ _id: id });
  }

  async updateExpiration(id, originalMaxAge) {
    const currentTime = new Date();
    const newSessionTime = new Date(currentTime.getTime() + (originalMaxAge));
    return SessionModel.findOneAndUpdate({ _id: id }, { expires: newSessionTime});
  }
}
