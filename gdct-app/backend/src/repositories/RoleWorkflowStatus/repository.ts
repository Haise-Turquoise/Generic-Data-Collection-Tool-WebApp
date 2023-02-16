import BaseRepository from '../repository';
import RoleWorkflowStatus from '../../types/RoleWorkflowStatus';
import RoleWorkflowStatusModel from '../../models/RoleWorkflowStatus';
import {RoleWorkflowStatusDoc} from '../../types/RoleWorkflowStatus';
import {dateStringTranslate} from '../../utils/misc';

// Created by Sheldon on 2021/07/13
// Repository for RoleWorkflowStatus
export default class RoleWorkflowStatusRepository extends BaseRepository<RoleWorkflowStatus, RoleWorkflowStatusDoc>{
  constructor(){
    super(RoleWorkflowStatusModel)
  }

  async findByRole(role:string){
    return RoleWorkflowStatusModel.findOne({role});
  }

  async findByRoles(roles: string[]) {
    return RoleWorkflowStatusModel.find({ role: {$in: roles} })
  }

  async create(item: RoleWorkflowStatus): Promise<RoleWorkflowStatusDoc> {
    item.modifiedOn = dateStringTranslate(new Date(item.modifiedOn ))
    return await RoleWorkflowStatusModel.create(item);
  }

  async update(_id: string, item: Partial<RoleWorkflowStatus>) {
    if(item.modifiedOn){item.modifiedOn = dateStringTranslate(new Date(item.modifiedOn ))}
    return RoleWorkflowStatusModel.findByIdAndUpdate(_id, item);
  }

}