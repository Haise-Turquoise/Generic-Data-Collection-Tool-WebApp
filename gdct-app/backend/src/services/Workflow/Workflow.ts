import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import Container from 'typedi';
import WorkflowRepository from '../../repositories/Workflow/Workflow';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess/WorkflowProcess';
import TemplateTypeRepository from '../../repositories/TemplateType';


import User ,{UserDoc} from '../../types/user'
import Program, {ProgramDoc} from '../../types/program';
import TemplatePackage from '../../types/templatepackage';
import Submission from '../../types/submission';
import SubmissionNote from '../../types/submissionnote';
import SubmissionPeriod from '../../types/submissionperiod';
import Status from '../../types/status';
import WorkflowProcess from '../../types/workflowprocess';
import TemplateType from '../../types/templatetype';
import Template from '../../types/template';
import Workflow, { WorkflowDoc } from '../../types/workflow';

const objectId = mongoose.Types.ObjectId;

// eslint-disable-next-line no-unused-vars
// const markVisitableNodes = (startingNode, linkMapSet, visited) => {
//   visited.add(startingNode);
//   const adjacentNodes = linkMapSet[startingNode];

//   if (adjacentNodes) {
//     adjacentNodes.forEach(adjacentNode => {
//       if (!visited.has(adjacentNode)) markVisitableNodes(adjacentNode, linkMapSet, visited);
//     });
//   }
// };

interface WorkflowData {
  workflow:Workflow,
  workflowProcessesData:{id:string, to:any[]}[],
  statusData:{id:string,statusId:string, position:any}[],
}


const getWorkflowProcesses = (workflowData:WorkflowData) => {
  const { workflow, workflowProcessesData, statusData } = workflowData;
  const workflowProcessesMap:any = {};

  if (statusData.length < 2) throw 'There must be at least two node';
  if (!workflowProcessesData.length) throw 'There must be at least one link';

  workflow._id = workflow._id ? workflow._id : objectId();

  // Create a workflow process for each node
  for (const item of statusData) {
    const { id, statusId, position } = item;

    workflowProcessesMap[id] = {
      _id: objectId(),
      workflowId: workflow._id,
      statusId,
      to: [],
      position,
    };
  }

  // Link the workflow processes
  for (const item of workflowProcessesData) {
    const { id, to } = item;
    workflowProcessesMap[id].to = to.map(({ id }) => workflowProcessesMap[id]._id);
  }

  return Object.values(workflowProcessesMap);
};

// TODO : Validate links - make sure there is only one starting node and connected graph
// @Service()
export default class WorkflowService {
  private workflowRepository : WorkflowRepository;
  private workflowProcessesRepository : WorkflowProcessRepository;
  private templateTypeRepository : TemplateTypeRepository;
  constructor() {
    this.workflowRepository = Container.get(WorkflowRepository);
    this.workflowProcessesRepository = Container.get(WorkflowProcessRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
  }

  async createWorkflow(workflowData:WorkflowData) {
    const workflowProcesses:any = getWorkflowProcesses(workflowData);

    return this.workflowRepository
      .create(workflowData.workflow)
      .then(() => this.workflowProcessesRepository.createMany(workflowProcesses));
  }

  async findOnlyWorkflowById(id:ObjectId|undefined) {
    return this.workflowRepository.find({ _id: id });
  }

  async findWorkflowById(id:any) {
    return this.workflowRepository.findById(id).then(async workflow => {
      return this.workflowProcessesRepository
        .find({ workflowId: id })
        .then(workflowProcesses => ({ workflow, workflowProcesses }));
    });
  }

  async findOutwardProcessesPopulated(processId:string) {
    // console.log('hi', processId)
    const workflowProcess = await this.workflowProcessesRepository.findById(processId);

    workflowProcess.to = await this.workflowProcessesRepository.findMany(workflowProcess.to, true);

    return workflowProcess;
  }

  async deleteWorkflow(workflowId:string) {
    const templateType = await this.templateTypeRepository.findOneByWorkFlowID(workflowId);
    if (templateType != null) throw new Error("Workflow referenced in template type.");
    return this.workflowRepository
      .delete(workflowId)
      .then(() => this.workflowProcessesRepository.deleteMany(workflowId));
  }

  async updateWorkflow(id:string, workflowData:WorkflowData) {
    const workflowProcesses:any = getWorkflowProcesses(workflowData);
    return this.workflowProcessesRepository
      .deleteMany(id)
      .then(() => this.workflowRepository.update(id, workflowData.workflow))
      .then(() => this.workflowProcessesRepository.createMany(workflowProcesses));
  }

  async findWorkflow(workflow:Workflow) {
    return this.workflowRepository.find(workflow);
  }

  async findWorkflowProessByStatus(statusId:string){
    return this.workflowProcessesRepository.find({statusId:objectId(statusId)});
  }

  async findWorkflowProessesById(ids:string[]){
    //@ts-ignore
    return this.workflowProcessesRepository.find({_id: {$in:ids}});
  }

  async findProcesses() {
    //@ts-ignore
    return this.workflowProcessesRepository.find();
  }

  async findProcessesByWorkflowId(workflowId:string) {
    return this.workflowProcessesRepository.findProcessesByWorkflowId(workflowId);
  }
}
