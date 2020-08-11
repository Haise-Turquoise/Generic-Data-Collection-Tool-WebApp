import mongoose from 'mongoose';
import Container from 'typedi';
import WorkflowRepository from '../repositories/Workflow';
import WorkflowProcessRepository from '../repositories/WorkflowProcess';

const objectId = mongoose.Types.ObjectId;

// eslint-disable-next-line no-unused-vars
const markVisitableNodes = (startingNode, linkMapSet, visited) => {
  visited.add(startingNode);
  const adjacentNodes = linkMapSet[startingNode];

  if (adjacentNodes) {
    adjacentNodes.forEach(adjacentNode => {
      if (!visited.has(adjacentNode)) markVisitableNodes(adjacentNode, linkMapSet, visited);
    });
  }
};

const getWorkflowProcesses = workflowData => {
  const { workflow, workflowProcessesData, statusData } = workflowData;
  const workflowProcessesMap = {};

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
  constructor() {
    this.workflowRepository = Container.get(WorkflowRepository);
    this.workflowProcessesRepository = Container.get(WorkflowProcessRepository);
  }

  async createWorkflow(workflowData) {
    const workflowProcesses = getWorkflowProcesses(workflowData);

    return this.workflowRepository
      .create(workflowData.workflow)
      .then(() => this.workflowProcessesRepository.createMany(workflowProcesses));
  }

  async findWorkflowById(id) {
    return this.workflowRepository.findById(id).then(async workflow => {
      return this.workflowProcessesRepository
        .find({ workflowId: id })
        .then(workflowProcesses => ({ workflow, workflowProcesses }));
    });
  }

  async findOutwardProcessesPopulated(processId) {
    const workflowProcess = await this.workflowProcessesRepository.findById(processId);

    workflowProcess.to = await this.workflowProcessesRepository.findMany(workflowProcess.to, true);

    return workflowProcess;
  }

  async deleteWorkflow(workflowId) {
    return this.workflowRepository
      .delete(workflowId)
      .then(() => this.workflowProcessesRepository.deleteMany(workflowId));
  }

  async updateWorkflow(id, workflowData) {
    const workflowProcesses = getWorkflowProcesses(workflowData);
    return this.workflowProcessesRepository
      .deleteMany(id)
      .then(() => this.workflowRepository.update(id, workflowData.workflow))
      .then(() => this.workflowProcessesRepository.createMany(workflowProcesses));
  }

  async findWorkflow(workflow) {
    return this.workflowRepository.find(workflow);
  }

  async findProcesses() {
    return this.workflowProcessesRepository.find();
  }
}
