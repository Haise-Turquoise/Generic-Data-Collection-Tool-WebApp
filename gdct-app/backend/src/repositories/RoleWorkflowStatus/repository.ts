import BaseRepository from '../repository';
import RoleWorkflowStatus from '../../types/RoleWorkflowStatus';
import RoleWorkflowStatusModel from '../../models/RoleWorkflowStatus';
import {RoleWorkflowStatusDoc} from '../../types/RoleWorkflowStatus';

// Created by Sheldon on 2021/07/13
// Repository for RoleWorkflowStatus
export default class RoleWorkflowStatusRepository extends BaseRepository<RoleWorkflowStatus, RoleWorkflowStatusDoc>{
  constructor(){
    super(RoleWorkflowStatusModel)
  }

  async findByRole(role:string){
    return RoleWorkflowStatusModel.findOne({role});
  }

  async create(item: RoleWorkflowStatus): Promise<RoleWorkflowStatusDoc> {
    return await RoleWorkflowStatusModel.create(item);
  }

  async update(_id: string, item: Partial<RoleWorkflowStatus>) {
    return RoleWorkflowStatusModel.findByIdAndUpdate(_id, item);
  }

}