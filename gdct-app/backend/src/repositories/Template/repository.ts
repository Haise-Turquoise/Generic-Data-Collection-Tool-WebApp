import Container from 'typedi';
import TemplateEntity from '../../entities/Template';
import TemplateModel from '../../models/Template';
import UserRepository from '../User';
import TemplateTypeRepository from '../TemplateType';
import BaseRepository from '../repository';
import WorkflowProcessRepository from '../WorkflowProcess/WorkflowProcess';
import {ObjectId} from 'mongodb';
import { TemplateDoc } from '../../types/template';
import { WorkflowProcessDoc } from '../../types/workflowprocess';
import { FilterQuery } from 'mongoose';

// MongoDB implementation
// @Service()
export default class TemplateRepository extends BaseRepository<TemplateDoc> {
  private userRepository: UserRepository;
  private templateTypeRepository: TemplateTypeRepository;
  private workflowProcessRepository: WorkflowProcessRepository;

  constructor() {
    super(TemplateModel);

    this.userRepository = Container.get(UserRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.workflowProcessRepository = Container.get(WorkflowProcessRepository);
  }

  async create({
    name,
    templateData,
    templateTypeId,
    userCreatorId,
    creationDate,
    expirationDate,
    workflowProcessId,
    googleSheetId,
    updatedBy,
    timestamp,
  }: TemplateDoc) {
    return this.templateTypeRepository
      .validate(templateTypeId)
      .then(() =>
        TemplateModel.create({
          name,
          templateData,
          templateTypeId,
          userCreatorId,
          creationDate,
          expirationDate,
          workflowProcessId,
          googleSheetId,
          updatedBy,
          timestamp,
        }),
      ).then(template => new TemplateEntity(template));
  }

  async update(
    id: string,
    {
      name,
      templateData,
      templateTypeId,
      userCreatorId,
      creationDate,
      expirationDate,
      workflowProcessId,
      updatedBy,
      timestamp,
    }: Partial<TemplateDoc>,
  ) {
    const formattedTemplate: Partial<TemplateDoc> = {
      name,
      templateTypeId,
      userCreatorId,
      creationDate,
      expirationDate,
      workflowProcessId,
      updatedBy,
      timestamp,
    };

    if (templateData) formattedTemplate.templateData = templateData;

    const oldValue = await TemplateModel.findById(id);
    if (oldValue.templateTypeId != formattedTemplate.templateTypeId){
      const templateWorkFlow = await this.templateTypeRepository.findById(formattedTemplate.templateTypeId || '');
      const workFlowItems: WorkflowProcessDoc[] = await this.workflowProcessRepository.find({ workflowId: templateWorkFlow.templateWorkflowId });
      const referencedIds: ObjectId[] = [];
      workFlowItems.forEach(e => {
        e.to.forEach(element =>{
          referencedIds.push(element)
        })
      });
      const itemIds = workFlowItems.map(e=>e._id);
      const diff = itemIds.filter(item=>{
        for (const ids of referencedIds){
          if (item.equals(ids)) return false;
        }
        return true;
      });
      if (diff.length == 0) throw new Error('Workflow head not found.');
      formattedTemplate.workflowProcessId = diff[0];
    }

    return TemplateModel.findByIdAndUpdate(id, formattedTemplate, {new: true}).then(
      (template: TemplateDoc) => { console.log(template); return new TemplateEntity(template)}
    );
  }

  async updateWorkflowProcess(_id: string, workflowProcessId: string) {
    return this.workflowProcessRepository
      .validate(workflowProcessId)
      .then(() => TemplateModel.findByIdAndUpdate(_id, { workflowProcessId }))
      .then(template => new TemplateEntity(template));
  }

  async find(query: TemplateDoc) {
    const realQuery: FilterQuery<TemplateDoc> = {};
    let key: keyof TemplateDoc
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    //console.log(TemplateModel.find(realQuery))
    return TemplateModel.find(realQuery)
      .select('-templateData')
      .then((templates: TemplateDoc[]) => templates.map(template => new TemplateEntity(template)));
  }
  
  async updateTemplate(_id: string, templateData: any[]){
    return TemplateModel.findByIdAndUpdate( _id, { templateData })
  }

  async updateSheetData(_id: string, sheetData: any[]){
    return TemplateModel.findByIdAndUpdate(_id, {$set:{templateData:sheetData}})
  }
  
  async findTemplateIDByTypeID(typeID: string){
    return TemplateModel.find({templateTypeId:new ObjectId(typeID)}, {_id:1})
  }
}