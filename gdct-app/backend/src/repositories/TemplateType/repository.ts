import Container from 'typedi';
import TemplateTypeEntity from '../../entities/TemplateType';
import BaseRepository from '../repository';
import TemplateTypeModel from '../../models/TemplateType/model';
import ProgramRepository from '../Program';
import {ObjectId} from 'mongodb';
import {FilterQuery } from 'mongoose';
import { TemplateTypeDoc } from '../../types/templatetype';

// @Service()
export default class TemplateTypeRepository extends BaseRepository<TemplateTypeDoc> {
  private programRepository: ProgramRepository
  
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
  }: TemplateTypeDoc) {
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

  async findByProgramIds(programIds: ObjectId[]) {
    return TemplateTypeModel.find({ programIds: { $in: programIds } });
  }

  async update(id: string, templateType: Partial<TemplateTypeDoc>) {
    return this.programRepository
      .validateMany(templateType.programIds || [])
      .then(() => TemplateTypeModel.findByIdAndUpdate(id, templateType))
      .then(templateType => new TemplateTypeEntity(templateType));
  }

  async find(query: TemplateTypeDoc) {
    const realQuery: FilterQuery<TemplateTypeDoc> = {};
  
    let key: keyof TemplateTypeDoc
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return TemplateTypeModel.find(realQuery).then((templateTypes: TemplateTypeDoc[]) =>
      templateTypes.map(templateType => new TemplateTypeEntity(templateType)),
    );
  }

  async findOneByWorkFlowID(workflowID: string){
    const objectID = new ObjectId(workflowID);
    return TemplateTypeModel.findOne({
      $or:[
        {workflowId: objectID},
        //@ts-ignore more troubling queries
        {submissionWorkflowId: objectID},
        //@ts-ignore
        {templateWorkflowId: objectID}
      ]
    }, {_id:1})
  }

  async delete(id: string) {
    return TemplateTypeModel.findByIdAndDelete(id).then(
      (templateType: TemplateTypeDoc) => new TemplateTypeEntity(templateType),
    );
  }
}
