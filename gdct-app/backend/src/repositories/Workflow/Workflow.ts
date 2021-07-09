import WorkflowEntity from '../../entities/Workflow/Workflow';
import BaseRepository from '../repository';
import WorkflowModel from '../../models/Workflow/Workflow';
import { WorkflowDoc } from '../../types/workflow';
import { FilterQuery } from 'mongoose';

export default class WorkflowRepository extends BaseRepository<WorkflowDoc> {
  constructor() {
    super(WorkflowModel);
  }

  async delete(id: string) {
    return WorkflowModel.findByIdAndDelete(id).then(
      (workflow: WorkflowDoc) => new WorkflowEntity(workflow),
    );
  }

  async create(workflow: WorkflowDoc) {
    return WorkflowModel.create(workflow).then(workflow => new WorkflowEntity(workflow));
  }

  async update(id: string, workflow: WorkflowDoc) {
    const newWorkflow: Partial<WorkflowDoc> = { ...workflow };
    delete workflow._id;
    return WorkflowModel.findByIdAndUpdate(id, workflow).then(
      (workflow: WorkflowDoc) => new WorkflowEntity(workflow),
    );
  }

  async find(query: FilterQuery<WorkflowDoc>) {
    console.log(query)
    const realQuery: FilterQuery<WorkflowDoc> = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return WorkflowModel.find(realQuery).then((workflows: WorkflowDoc[]) =>
      workflows.map(workflow => new WorkflowEntity(workflow)),
    );
  }
}
