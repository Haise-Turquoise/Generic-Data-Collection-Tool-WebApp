import Container from 'typedi';
import RoleSubmissionButtonRepository from '../../repositories/RoleSubmissionButton/repository';
import RoleSubmissionButton, { RoleSubmissionButtonDoc } from '../../types/rolesubmissionbutton'

// Created by Jie on 2021/07/29
// Service for RoleSubmissionButton
export default class RoleSubmissionButtonService{

  roleSubmissionButtonRepository: RoleSubmissionButtonRepository;

  constructor(){
    this.roleSubmissionButtonRepository = Container.get(RoleSubmissionButtonRepository);
  }

  async findByRole(role:string){
    return this.roleSubmissionButtonRepository.findByRole(role);
  }

  async findAll(): Promise<RoleSubmissionButtonDoc[]>{
    return this.roleSubmissionButtonRepository.findAll()
  }

  async create(item: RoleSubmissionButton): Promise<RoleSubmissionButtonDoc> {
    return this.roleSubmissionButtonRepository.create(item);
  }

  async update(_id: string, RoleSubmissionButton: Partial<RoleSubmissionButton>) {
    return this.roleSubmissionButtonRepository.update(_id, RoleSubmissionButton)
  }
}