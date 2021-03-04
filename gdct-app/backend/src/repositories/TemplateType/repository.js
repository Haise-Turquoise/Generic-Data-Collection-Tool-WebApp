import Container from 'typedi';
import TemplateTypeEntity from '../../entities/TemplateType';
import BaseRepository from '../repository';
import TemplateTypeModel from '../../models/TemplateType/model';
import ProgramRepository from '../Program';
import {ObjectId} from 'mongodb';

// @Service()
export default class TemplateTypeRepository extends BaseRepository {
  constructor() {
    super(TemplateTypeModel);

    this.programRepository = Container.get(ProgramRepository);
  }

  async create({
    name,
    description,
    templateWorkflowId,
    submissionWorkflowId,
    programIds,
    isApprovable,
    isReviewable,
    isSubmittable,
    isInputtable,
    isViewable,
    isReportable,
    isActive,
  }) {
    return this.programRepository
      .validateMany(programIds)
      .then(() =>
        TemplateTypeModel.create({
          name,
          description,
          templateWorkflowId,
          submissionWorkflowId,
          programIds,

          isApprovable,
          isReviewable,
          isSubmittable,
          isInputtable,
          isViewable,
          isReportable,
          isActive,
        }),
      )
      .then(templateType => new TemplateTypeEntity(templateType));
  }

  async findByProgramIds(programIds) {
    return TemplateTypeModel.find({ programIds: { $in: programIds } });
  }

  async update(id, templateType) {
    return this.programRepository
      .validateMany(templateType.programIds)
      .then(() => TemplateTypeModel.findByIdAndUpdate(id, templateType))
      .then(templateType => new TemplateTypeEntity(templateType.toObject()));
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return TemplateTypeModel.find(realQuery).then(templateTypes =>
      templateTypes.map(templateType => new TemplateTypeEntity(templateType)),
    );
  }

  async findById(id) {
    return TemplateTypeModel.findById(id);
  }

  async findOneByWorkFlowID(workflowID){
    const objectID = new ObjectId(workflowID);
    return TemplateTypeModel.findOne({
      $or:[
        {workflowId: objectID},
        {submissionWorkflowId: objectID},
        {templateWorkflowId: objectID}
      ]
    }, {_id:1})
  }

  async delete(id) {
    return TemplateTypeModel.findByIdAndDelete(id).then(
      templateType => new TemplateTypeEntity(templateType),
    );
  }
}
