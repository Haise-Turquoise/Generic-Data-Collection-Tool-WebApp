import BaseRepository from '../repository';
import SubmissionStatus, { SubmissionStatusDoc } from '../../types/packagestatus';
import SubmissionStatusModel from '../../models/SubmissionStatus';

export default class SubmissionStatusRepository extends BaseRepository<SubmissionStatus, SubmissionStatusDoc> {
  constructor() {
    super(SubmissionStatusModel);
  }
}
