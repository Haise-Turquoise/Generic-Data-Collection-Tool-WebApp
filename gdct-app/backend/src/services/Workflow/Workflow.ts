import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import Container from 'typedi';
import WorkflowRepository from '../../repositories/Workflow/Workflow';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess/WorkflowProcess';
import TemplateTypeRepository from '../../repositories/TemplateType';
import WorkflowProcess from '../../types/workflowprocess';
import Workflow from '../../types/workflow';



const objectId = mongoose.Types.ObjectId;

// eslint-disable-next-line no-unused-vars
// any types since function unused -- should probably be deleted
const markVisitableNodes = (startingNode: any, linkMapSet: any, visited: any) => {
  visited.add(startingNode);
  const adjacentNodes: any = linkMapSet[startingNode];

  if (adjacentNodes) {
    adjacentNodes.forEach((adjacentNode: any) => {
      if (!visited.has(adjacentNode)) markVisitableNodes(adjacentNode, linkMapSet, visited);
    });
  }
};

interface WorkflowData {
  workflow: Omit<Workflow, 'isActive'>;
  workflowProcessesData: {
    id: string,
    statusId: string,
    to: {
      id: string,
      statusId: string,
    }[],
  }[];
  statusData: {
    id: string,
    statusId: string,
    position: WorkflowProcess["position"],
  }[];
}
const getWorkflowProcesses = (workflowData: WorkflowData): WorkflowProcess[] => {
  const { workflow, workflowProcessesData, statusData } = workflowData;
  const workflowProcessesMap: any = {};

  if (statusData.length < 2) throw 'There must be at least two node';
  if (!workflowProcessesData.length) throw 'There must be at least one link';

  workflow._id = workflow._id ? workflow._id : new ObjectId();

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
    workflowProcessesMap[id].to = to.map(({ id }: { id: any }) => workflowProcessesMap[id]._id);
  }

  return Object.values(workflowProcessesMap);
};

// TODO : Validate links - make sure there is only one starting node and connected graph
// @Service()
export default class WorkflowService {
  private workflowRepository: WorkflowRepository
  private workflowProcessesRepository: WorkflowProcessRepository
  private templateTypeRepository: TemplateTypeRepository

  constructor() {
    this.workflowRepository = Container.get(WorkflowRepository);
    this.workflowProcessesRepository = Container.get(WorkflowProcessRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
  }

  async createWorkflow(workflowData: any) {
    const workflowProcesses = getWorkflowProcesses(workflowData);

    return this.workflowRepository
      .create(workflowData.workflow)
      .then(() => this.workflowProcessesRepository.createMany(workflowProcesses));
  }

  async findOnlyWorkflowById(id: string) {
    return this.workflowRepository.find({ _id: new ObjectId(id) });
  }

  async findWorkflowById(id: string) {
    return this.workflowRepository.findById(id).then(async workflow => {
      return this.workflowProcessesRepository
        .find({ workflowId: new ObjectId(id) })
        .then(workflowProcesses => ({ workflow, workflowProcesses }));
    });
  }

  async findOutwardProcessesPopulated(processId: string) {
    // console.log('hi', processId)
    const workflowProcess = await this.workflowProcessesRepository.findById(processId) as any;

    workflowProcess.to = await this.workflowProcessesRepository.findMany(workflowProcess.to, true);

    return workflowProcess;
  }

  async deleteWorkflow(workflowId: string) {
    const templateType = await this.templateTypeRepository.findOneByWorkFlowID(workflowId);
    if (templateType != null) throw new Error("Workflow referenced in template type.");
    return this.workflowRepository
      .delete(workflowId)
      .then(() => this.workflowProcessesRepository.deleteMany(workflowId));
  }

  async updateWorkflow(id: string, workflowData: any) {
    const workflowProcesses = getWorkflowProcesses(workflowData);
    return this.workflowProcessesRepository
      .deleteMany(id)
      .then(() => this.workflowRepository.update(id, workflowData.workflow))
      .then(() => this.workflowProcessesRepository.createMany(workflowProcesses));
  }

  async findWorkflow(workflow: Partial<Workflow>) {
    return this.workflowRepository.find(workflow);
  }

  async findWorkflowProessByStatus(statusId: string){
    return this.workflowProcessesRepository.find({statusId: new ObjectId(statusId)});
  }

  async findWorkflowProessesById(ids: string[]){
    //@ts-ignore
    return this.workflowProcessesRepository.find({_id: {$in: ids.map(id => new ObjectId(id))}});
  }

  async findProcesses() {
    return this.workflowProcessesRepository.find({});
  }

  async findProcessesByWorkflowId(workflowId: string) {
    return this.workflowProcessesRepository.findProcessesByWorkflowId(workflowId);
  }

  async findProcessesByWorkFlowIds(workflowIds:string[]){
    return this.workflowProcessesRepository.findProcessesByWorkflowIds(workflowIds);
  }

  async findNeighbors(workflowId: string, statusIds: string[]) {
    return this.workflowProcessesRepository.findNeighbors(workflowId, statusIds);
  }

  async findPrevious(workflowId: string, statusIds: string[]) {
    return this.workflowProcessesRepository.findPrevious(workflowId, statusIds)
  }
}
