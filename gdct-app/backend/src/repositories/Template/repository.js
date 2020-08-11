import Container from 'typedi';
import TemplateEntity from '../../entities/Template';
import TemplateModel from '../../models/Template';
import UserRepository from '../User';
import TemplateTypeRepository from '../TemplateType';
import BaseRepository from '../repository';
import WorkflowProcessRepository from '../WorkflowProcess';

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
        }),
      )
      .then(template => new TemplateEntity(template.toObject()));
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

    return TemplateModel.find(realQuery)
      .select('-templateData')
      .then(templates => templates.map(template => new TemplateEntity(template.toObject())));
  }
}
