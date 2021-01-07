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

  // Created on Nov 26, 2020
  // Updates
  async updateGoogleSheetId(_id, googleSheetId) {
    return SubmissionModel.findByIdAndUpdate( _id,  { googleSheetId } );
  }
  // Created on Nov 27, 2020
  // Updates submission with new workkbook
  async updateWorkbook(_id, workbookData){
    return SubmissionModel.findByIdAndUpdate( _id, { workbookData })
  }

  async findOneByTemplateIDs(templateIDs) {
    return SubmissionModel.findOne({ templateId:{$in:templateIDs}}, {_id:1});
  }
}
