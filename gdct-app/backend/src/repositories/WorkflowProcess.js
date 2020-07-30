import Container from 'typedi';
import WorkflowProcessEntity from '../entities/WorkflowProcess';
import BaseRepository from './repository';
import WorkflowProcessModel from '../models/WorkflowProcess';
import StatusRepository from './Status';

const populateStatusId = {
  path: 'statusId',
  select: 'name',
};

const populateTo = {
  path: 'to',
  populate: {
    path: 'statusId',
  },
};

export default class WorkflowProcessRepository extends BaseRepository {
  constructor() {
    super(WorkflowProcessModel);

    this.statusRepository = Container.get(StatusRepository);
  }

  async delete(id) {
    return WorkflowProcessModel.findByIdAndDelete(id).then(
      workflowProcess => new WorkflowProcessEntity(workflowProcess.toObject()),
    );
  }

  async create(workflowProcess) {
    return this.statusRepository
      .validate(workflowProcess.statusId)
      .then(() => WorkflowProcessModel.create(workflowProcess))
      .then(workflowProcess => new WorkflowProcessEntity(workflowProcess.toObject()));
  }

  async createMany(workflowProcesses) {
    return this.statusRepository
      .validateMany(workflowProcesses.map(({ statusId }) => statusId))
      .then(() => WorkflowProcessModel.create(workflowProcesses))
      .then(workflowProcesses =>
        workflowProcesses.map(
          workflowProcess => new WorkflowProcessEntity(workflowProcess.toObject()),
        ),
      );
  }

  async update(id, workflowProcess) {
    return WorkflowProcessModel.findByIdAndUpdate(id, workflowProcess).then(
      workflowProcess => new WorkflowProcessEntity(workflowProcess.toObject()),
    );
  }

  async deleteMany(workflowId) {
    return WorkflowProcessModel.deleteMany({ workflowId });
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return WorkflowProcessModel.find(realQuery)
      .populate('statusId')
      .then(workflowProcesss =>
        workflowProcesss.map(
          workflowProcess => new WorkflowProcessEntity(workflowProcess.toObject()),
        ),
      );
  }

  async findMany(ids, isPopulated = false) {
    return WorkflowProcessModel.find()
      .populate(isPopulated ? populateTo : '')
      .populate(isPopulated ? populateStatusId : '')
      .where('_id')
      .in(ids)
      .then(workflowProcesss => {
        return workflowProcesss.map(
          workflowProcess => new WorkflowProcessEntity(workflowProcess.toObject()),
        );
      });
  }
}
