import Container from 'typedi';
import TemplateTypeEntity from '../../entities/TemplateType';
import BaseRepository from '../repository';
import TemplateTypeModel from '../../models/TemplateType/model';
import ProgramRepository from '../Program';
import {ObjectId} from 'mongodb';
import {FilterQuery } from 'mongoose';
import TemplateType, { TemplateTypeDoc } from '../../types/templatetype';
import AppError from '../../utils/AppError';

// @Service()
export default class TemplateTypeRepository extends BaseRepository<TemplateType, TemplateTypeDoc> {
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
    timestamp,
    updatedBy,
  }: TemplateType) {
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
          timestamp,
          updatedBy,
        }),
      )
      .then(templateType => new TemplateTypeEntity(templateType));
  }

  async findByProgramIds(programIds: ObjectId[]) {
    // @ts-ignore
    return TemplateTypeModel.find({ programIds: { $in: programIds } });
  }

  async update(id: string, templateType: Partial<TemplateType>) {
    return this.programRepository
      .validateMany(templateType.programIds || [])
      .then(() => TemplateTypeModel.findByIdAndUpdate(id, templateType))
      .then((templateType:TemplateTypeDoc|null) => {
        if(!templateType) throw new AppError(`Update failed, Item not found for TemplateType item with ID: ${id}`)
        return new TemplateTypeEntity(templateType)
      });
  }

  async find(query: Partial<TemplateType>) {
    const realQuery: FilterQuery<TemplateTypeDoc> = {};
  
    let key: keyof TemplateType
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
    return TemplateTypeModel.findByIdAndDelete(id)
    .then((templateType: TemplateTypeDoc|null) => {
      if(!templateType) throw new AppError(`Delete failed, Item not found for TemplateType item with ID: ${id}`);
      return new TemplateTypeEntity(templateType)
    });
  }
}
