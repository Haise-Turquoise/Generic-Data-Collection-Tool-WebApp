import Container from 'typedi';
import WorkflowProcessEntity from '../../entities/WorkflowProcess/WorkflowProcess';
import BaseRepository from '../repository';
import WorkflowProcessModel from '../../models/WorkflowProcess/WorkflowProcess';
import StatusRepository from '../Status';
import { WorkflowProcessDoc } from '../../types/workflowprocess';
import { FilterQuery } from 'mongoose';

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

export default class WorkflowProcessRepository extends BaseRepository<WorkflowProcessDoc> {
  private statusRepository: StatusRepository;

  constructor() {
    super(WorkflowProcessModel);

    this.statusRepository = Container.get(StatusRepository);
  }

  async delete(id: string) {
    return WorkflowProcessModel.findByIdAndDelete(id).then(
      (workflowProcess: WorkflowProcessDoc) => new WorkflowProcessEntity(workflowProcess),
    );
  }

  async create(workflowProcess: WorkflowProcessDoc) {
    return this.statusRepository
      .validate(workflowProcess.statusId)
      .then(() => WorkflowProcessModel.create(workflowProcess))
      .then(workflowProcess => new WorkflowProcessEntity(workflowProcess));
  }

  async createMany(workflowProcesses: WorkflowProcessDoc[]) {
    return this.statusRepository
      .validateMany(workflowProcesses.map(({ statusId }: WorkflowProcessDoc) => statusId))
      .then(() => WorkflowProcessModel.create(workflowProcesses))
      .then(workflowProcess => new WorkflowProcessEntity(workflowProcess)
      );
  }

  async update(id: string, workflowProcess: WorkflowProcessDoc) {
    return WorkflowProcessModel.findByIdAndUpdate(id, workflowProcess).then(
      (workflowProcess: WorkflowProcessDoc) => new WorkflowProcessEntity(workflowProcess),
    );
  }

  async deleteMany(workflowId: string) {
    return WorkflowProcessModel.deleteMany({ workflowId });
  }
  async findProcessesByWorkflowId(workflowId: string) {
    // console.log(workflowId)
    // return WorkflowModel.find()
    return WorkflowProcessModel.find({'workflowId':workflowId}).then((workflowProcesses: WorkflowProcessDoc[]) =>
      workflowProcesses.map((workflowProcess) => new WorkflowProcessEntity(workflowProcess)),
    );
  }
  async find(query: FilterQuery<WorkflowProcessDoc>) {
    const realQuery: FilterQuery<WorkflowProcessDoc> = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return WorkflowProcessModel.find(realQuery)
      .populate('statusId')
      .then((workflowProcesses: WorkflowProcessDoc[]) =>
        workflowProcesses.map(
          workflowProcess => new WorkflowProcessEntity(workflowProcess),
        ),
      );
  }

  async findMany(ids: string, isPopulated = false) {
    return WorkflowProcessModel.find()
      .populate(isPopulated ? populateTo : '')
      .populate(isPopulated ? populateStatusId : '')
      .where('_id')
      .in(ids)
      .then((workflowProcesses: WorkflowProcessDoc[]) => {
        return workflowProcesses.map(
          workflowProcess => new WorkflowProcessEntity(workflowProcess),
        );
      });
  }
}
