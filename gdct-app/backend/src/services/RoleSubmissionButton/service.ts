import Container from 'typedi';
import RoleSubmissionButtonRepository from '../../repositories/RoleSubmissionButton/repository';
import RoleSubmissionButton from '../../types/rolesubmissionbutton'

// Created by Jie on 2021/07/29
// Service for RoleSubmissionButton
export default class RoleSubmissionButtonService{

  roleSubmissionButtonRepository: RoleSubmissionButtonRepository;

  constructor(){
    this.roleSubmissionButtonRepository = Container.get(RoleSubmissionButtonRepository);
  }

  async findByRole(role:string):Promise<RoleSubmissionButton[]>{
    return this.roleSubmissionButtonRepository.findByRole(role);
  }
}