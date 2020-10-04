import SubmissionEntity from '../../entities/Submission/Submission';
import BaseRepository from '../repository';
import SubmissionModel from '../../models/Submission';

export default class SubmissionRepository extends BaseRepository {
  constructor() {
    super(SubmissionModel);
  }

  async delete(id) {
    return SubmissionModel.findByIdAndDelete(id).then(
      submission => new SubmissionEntity(submission.toObject()),
    );
  }

  async create(submission) {
    return SubmissionModel.create(submission).then(
      submission => new SubmissionEntity(submission.toObject()),
    );
  }

  async update(id, submission) {
    return SubmissionModel.findByIdAndUpdate(id, submission).then(
      submission => new SubmissionEntity(submission.toObject()),
    );
  }

  async findByTemplatePackageId(templatePackageId) {
    return SubmissionModel.find({ templatePackageId });
  }

  async findAndSetFalse(id) {
    return SubmissionModel.findOneAndUpdate({ _id: id }, { isLatest: false });
  }

  async find() {
    return SubmissionModel.find({ isLatest: true });
  }

  async findByOrgIdAndProgramId(orgId, programIds) {
    return SubmissionModel.find({ orgId, programId: { $in: programIds }, isLatest: true });
  }
}
