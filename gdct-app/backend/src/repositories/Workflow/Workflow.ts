import WorkflowEntity from '../../entities/Workflow/Workflow';
import BaseRepository from '../repository';
import WorkflowModel from '../../models/Workflow/Workflow';
import Workflow, { WorkflowDoc } from '../../types/workflow';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';

export default class WorkflowRepository extends BaseRepository<Workflow, WorkflowDoc> {
  constructor() {
    super(WorkflowModel);
  }

  async delete(id: string) {
    return WorkflowModel.findByIdAndDelete(id)
    .then((workflow: WorkflowDoc|null) => {
      if (!workflow) throw new AppError(`Delete failed, Item not found for workflow item with ID: ${id}`)
      return new WorkflowEntity(workflow);
    });
  }

  async create(workflow: Workflow) {
    return WorkflowModel.create(workflow).then(workflow => new WorkflowEntity(workflow));
  }

  async update(id: string, workflow: Partial<Workflow>) {
    const newWorkflow: Partial<WorkflowDoc> = { ...workflow };
    delete workflow._id;
    return WorkflowModel.findByIdAndUpdate(id, workflow)
    .then((workflow: WorkflowDoc|null) => {
      if (!workflow) throw new AppError(`Update failed, Item not found for workflow item with ID: ${id}`)
      return new WorkflowEntity(workflow);
    });
  }

  async find(query: Partial<Workflow>) {
    console.log(query)
    const realQuery: FilterQuery<WorkflowDoc> = {};
    let key: keyof Workflow
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return WorkflowModel.find(realQuery).then((workflows: WorkflowDoc[]) =>
      workflows.map(workflow => new WorkflowEntity(workflow)),
    );
  }
}
