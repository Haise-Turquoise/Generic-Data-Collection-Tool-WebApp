import Container from 'typedi';
import WorkflowProcessEntity from '../../entities/WorkflowProcess/WorkflowProcess';
import BaseRepository from '../repository';
import WorkflowProcessModel from '../../models/WorkflowProcess/WorkflowProcess';
import StatusRepository from '../Status';
import WorkflowProcess, { WorkflowProcessDoc } from '../../types/workflowprocess';
import { FilterQuery } from 'mongoose';
import { ObjectID } from 'mongodb';
import AppError from '../../utils/AppError';

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

export default class WorkflowProcessRepository extends BaseRepository<WorkflowProcess, WorkflowProcessDoc> {
  private statusRepository: StatusRepository;

  constructor() {
    super(WorkflowProcessModel);

    this.statusRepository = Container.get(StatusRepository);
  }

  async delete(id: string) {
    return WorkflowProcessModel.findByIdAndDelete(id)
    .then((workflowProcess: WorkflowProcessDoc|null) => {
      if (!workflowProcess) throw new AppError(`Delete failed, Item not found for WorkflowProcess item with ID: ${id}`);
      return new WorkflowProcessEntity(workflowProcess);
    });
  }

  async create(workflowProcess: WorkflowProcess) {
    return this.statusRepository
      .validate(workflowProcess.statusId)
      .then(() => WorkflowProcessModel.create(workflowProcess))
      .then(workflowProcess => new WorkflowProcessEntity(workflowProcess));
  }

  async createMany(workflowProcesses: WorkflowProcess[]) {
    return this.statusRepository
      .validateMany(workflowProcesses.map(({ statusId }: WorkflowProcess) => statusId))
      .then(() => WorkflowProcessModel.create(workflowProcesses))
      // @ts-ignore
      .then((workflowProcess) => new WorkflowProcessEntity(workflowProcess)
      );
  }

  async update(id: string, workflowProcess: Partial<WorkflowProcess>) {
    return WorkflowProcessModel.findByIdAndUpdate(id, workflowProcess)
    .then((workflowProcess: WorkflowProcessDoc|null) => {
      if (!workflowProcess) throw new AppError(`Update failed for workflowProcess with ID: ${id}`);
      return new WorkflowProcessEntity(workflowProcess);
    });
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
  async find(query: Partial<WorkflowProcess>) {
    const realQuery: FilterQuery<WorkflowProcessDoc> = {};
    let key: keyof WorkflowProcess
    for (key in query) {
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

  async findProcessesByWorkflowIds(workflowIds:string[]){
    return WorkflowProcessModel.find({workflowId:{$in:workflowIds}})
    .populate('statusId')
    .then((workflowProcesses:WorkflowProcessDoc[])=> 
      workflowProcesses.map(workflowProcess => 
        new WorkflowProcessEntity(workflowProcess)
      )
    );
  }

  async findMany(ids: (ObjectID|string)[], isPopulated = false):Promise<WorkflowProcessEntity[]> {
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
