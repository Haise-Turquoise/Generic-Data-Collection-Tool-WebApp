import WorkflowEntity from '../../entities/Workflow/Workflow';
import BaseRepository from '../repository';
import WorkflowModel from '../../models/Workflow/Workflow';

export default class WorkflowRepository extends BaseRepository {
  constructor() {
    super(WorkflowModel);
  }

  async delete(id) {
    return WorkflowModel.findByIdAndDelete(id).then(
      workflow => new WorkflowEntity(workflow.toObject()),
    );
  }

  async create(workflow) {
    return WorkflowModel.create(workflow).then(workflow => new WorkflowEntity(workflow.toObject()));
  }

  async update(id, workflow) {
    workflow = { ...workflow };
    delete workflow._id;
    return WorkflowModel.findByIdAndUpdate(id, workflow).then(
      workflow => new WorkflowEntity(workflow.toObject()),
    );
  }

  async find(query) {
    console.log(query)
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return WorkflowModel.find(realQuery).then(workflows =>
      workflows.map(workflow => new WorkflowEntity(workflow.toObject())),
    );
  }
}
