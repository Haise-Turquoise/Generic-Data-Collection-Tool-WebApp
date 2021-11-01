import BaseRepository from '../repository';
import SubmissionStatus, { SubmissionStatusDoc } from '../../types/submissionstatus';
import SubmissionStatusModel from '../../models/SubmissionStatus';

export default class SubmissionStatusRepository extends BaseRepository<SubmissionStatus, SubmissionStatusDoc> {
  constructor() {
    super(SubmissionStatusModel);
  }
}
