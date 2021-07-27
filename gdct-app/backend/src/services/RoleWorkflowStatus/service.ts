import Container from 'typedi';
import RoleWorkflowStatusRepository from '../../repositories/RoleWorkflowStatus/repository';
import { RoleWorkflowStatusDoc } from '../../types/RoleWorkflowStatus'

// Created by Sheldon on 2021/07/13
// Service for RoleWorkflowStatus
export default class RoleWorkflowStatusService{

  roleWorkflowStatusRepository: RoleWorkflowStatusRepository;

  constructor(){
    this.roleWorkflowStatusRepository = Container.get(RoleWorkflowStatusRepository);
  }

  async findByRole(role:string):Promise<RoleWorkflowStatusDoc[]>{
    return this.roleWorkflowStatusRepository.findByRole(role);
  }
}