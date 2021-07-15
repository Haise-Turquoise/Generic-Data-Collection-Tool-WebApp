import Container from 'typedi';
import RoleWorkflowStatusRepository from '../../repositories/RoleWorkflowStatus/repository';
import RoleWorkflowStatus from '../../types/RoleWorkflowStatus'

// Created by Sheldon on 2021/07/13
// Service for RoleWorkflowStatus
export default class RoleWorkflowStatusService{

  roleWorkflowStatusRepository: RoleWorkflowStatusRepository;

  constructor(){
    this.roleWorkflowStatusRepository = Container.get(RoleWorkflowStatusRepository);
  }

  async findByRole(role:string):Promise<RoleWorkflowStatus>{
    return this.roleWorkflowStatusRepository.findByRole(role);
  }
}