import Container from 'typedi';
import TemplateRepository from '../../repositories/Template';
import TemplateTypeRepository from '../../repositories/TemplateType';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess';

// @Service()
export default class TemplateService {
  constructor() {
    this.templateRepository = Container.get(TemplateRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.workflowProcessRepository = Container.get(WorkflowProcessRepository);
  }

  async createTemplate(template) {
    const templateType = await this.templateTypeRepository.findById(template.templateTypeId);

    const workflowProcesses = await this.workflowProcessRepository.find({
      workflowId: templateType.templateWorkflowId,
    });

    const nodes = new Set();

    const visitedNodes = new Set();

    workflowProcesses.forEach(({ _id, to }) => {
      nodes.add(_id.toString());
      to.forEach(outNodeIds => {
        visitedNodes.add(outNodeIds.toString());
        nodes.add(outNodeIds.toString());
      });
    });

    let initialNode = null;

    nodes.forEach(node => {
      if (!visitedNodes.has(node)) {
        initialNode = node;
      }
    });

    template.workflowProcessId = initialNode;

    return this.templateRepository.create(template);
  }

  async deleteTemplate(id) {
    return this.templateRepository.delete(id);
  }

  async updateTemplate(id, template) {
    return this.templateRepository.update(id, template);
  }

  async updateTemplateWorkflowProcess(id, workflowProcess) {
    return this.templateRepository.updateWorkflowProcess(id, workflowProcess);
  }

  async findTemplate(template) {
    return this.templateRepository.find(template);
  }

  async findTemplateById(id) {
    return this.templateRepository.findById(id);
  }
}
