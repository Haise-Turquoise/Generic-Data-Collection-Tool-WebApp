import Container from 'typedi';
import TemplateRepository from '../../repositories/Template';
import TemplateTypeRepository from '../../repositories/TemplateType';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess/WorkflowProcess';
import StatusRepository from '../../repositories/Status';
import { TemplateDoc } from '../../types/template';
import { WorkflowProcessDoc } from '../../types/workflowprocess';
import { ObjectId } from 'mongodb'

// @Service()
export default class TemplateService {
  private templateRepository: TemplateRepository;
  private templateTypeRepository: TemplateTypeRepository;
  private workflowProcessRepository: WorkflowProcessRepository;
  private statusRepository: StatusRepository;
  constructor() {
    this.templateRepository = Container.get(TemplateRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.workflowProcessRepository = Container.get(WorkflowProcessRepository);
    this.statusRepository = Container.get(StatusRepository);
  }

  async createTemplate(template: TemplateDoc) {
    const templateType = await this.templateTypeRepository.findById(template.templateTypeId);

    const workflowProcesses: WorkflowProcessDoc[] = await this.workflowProcessRepository.find({
      workflowId: templateType.templateWorkflowId,
    });

    const nodes: Set<string> = new Set();

    const visitedNodes: Set<string> = new Set();

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
    // const templateProperties = {
    //   properties: {title: template.name}
    // }

    // Compress the template
    // const deflatedTemplate = pako.deflate(JSON.stringify(templateProperties), { to: 'string' })
    // TODO changed logic, double check this
    if (initialNode) {
      template.workflowProcessId = new ObjectId(initialNode);
    }
    // template.templateData = deflatedTemplate;
    template.templateData = [];
    // template.googleSheetId;
    return this.templateRepository.create(template);
  }

  async deleteTemplate(id: string) {
    return this.templateRepository.delete(id);
  }

  async updateTemplate(id: string, template: Partial<TemplateDoc>) {
    return this.templateRepository.update(id, template);
  }
  
  //TODO test changed logic - I think this is what was meant to be written
  async updateTemplateSheetData(id: string, template: TemplateDoc) {
    return this.templateRepository.updateSheetData(id, template.templateData);
  }

  //TODO test this too - same situation
  async updateTemplateWorkflowProcess(id: string, workflowProcess: WorkflowProcessDoc) {
    return this.templateRepository.updateWorkflowProcess(id, workflowProcess._id);
  }

  async findTemplate(template: TemplateDoc) {
    return this.templateRepository.find(template);
  }

  async findTemplateById(id: string) {
    return this.templateRepository.findById(id);
  }
}
