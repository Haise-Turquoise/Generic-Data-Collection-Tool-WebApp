import Container from 'typedi';
import TemplateEntity from '../../entities/Template';
import TemplateModel from '../../models/Template';
import UserRepository from '../User';
import TemplateTypeRepository from '../TemplateType';
import BaseRepository from '../repository';
import WorkflowProcessRepository from '../WorkflowProcess/WorkflowProcess';
import {ObjectId} from 'mongodb';

// MongoDB implementation
// @Service()
export default class TemplateRepository extends BaseRepository {
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
  }) {
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
        }),
      ).then(template => new TemplateEntity(template.toObject()));
  }

  async update(
    id,
    {
      name,
      templateData,
      templateTypeId,
      userCreatorId,
      creationDate,
      expirationDate,
      workflowProcessId,
    },
  ) {
    const formattedTemplate = {
      name,
      templateTypeId,
      userCreatorId,
      creationDate,
      expirationDate,
      workflowProcessId,
    };

    if (templateData) formattedTemplate.templateData = templateData;

    return TemplateModel.findByIdAndUpdate(id, formattedTemplate).then(
      template => new TemplateEntity(template.toObject()),
    );
  }

  async updateWorkflowProcess(_id, workflowProcessId) {
    return this.workflowProcessRepository
      .validate(workflowProcessId)
      .then(() => TemplateModel.findByIdAndUpdate(_id, { workflowProcessId }))
      .then(template => new TemplateEntity(template.toObject()));
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    //console.log(TemplateModel.find(realQuery))
    return TemplateModel.find(realQuery)
      .select('-templateData')
      .then(templates => templates.map(template => new TemplateEntity(template.toObject())));
  }

  // Last updated: Nov 16, 2020
  // Called when google sheets in the Google account is created or deleted
  // Updates the googleSheetId with the new Id. 
  async updateGoogleSheetId(_id, googleSheetId) {
    return TemplateModel.findByIdAndUpdate( _id,  { googleSheetId } ).then(
      //template => new TemplateEntity(template.toObject()),
    );
  }
  
  async updateTemplate(_id, templateData){
    return TemplateModel.findByIdAndUpdate( _id, { templateData })
  }

  async updateSheetData(_id, sheetData){
    return TemplateModel.findByIdAndUpdate(_id, {$set:{templateData:sheetData}})
  }
  
  async findTemplateIDByTypeID(typeID){
    return TemplateModel.find({templateTypeId:new ObjectId(typeID)}, {_id:1})
  }
}