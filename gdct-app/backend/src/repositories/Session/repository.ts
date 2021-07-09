import BaseRepository from '../repository';
import SessionModel from '../../models/Session';
import { SessionDoc } from '../../types/session';

// @Service()
export default class SessionRepository extends BaseRepository<SessionDoc> {
  constructor() {
    super(SessionModel);
  }

  async findById(id: string) {
    return SessionModel.findOne({ _id: id });
  }

  async updateExpiration(id: string, originalMaxAge: number) {
    const currentTime = new Date();
    const newSessionTime = new Date(currentTime.getTime() + (originalMaxAge));
    return SessionModel.findOneAndUpdate({ _id: id }, { expires: newSessionTime});
  }
}
