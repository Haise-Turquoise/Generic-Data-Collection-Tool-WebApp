import BaseRepository from '../repository';
import RoleSubmissionButton from '../../types/rolesubmissionbutton';
import RoleSubmissionButtonModel from '../../models/RoleSubmissionButton';
import {RoleSubmissionButtonDoc} from '../../types/rolesubmissionbutton';

// Created by Jie on 2021/07/13
// Repository for RoleSubmissionButton
export default class RoleSubmissionButtonRepository extends BaseRepository<RoleSubmissionButton, RoleSubmissionButtonDoc>{
  constructor(){
    super(RoleSubmissionButtonModel)
  }

  async findByRole(role:string){
    return RoleSubmissionButtonModel.findOne({role});
  }
  
  async create(item: RoleSubmissionButton): Promise<RoleSubmissionButtonDoc> {
    return await RoleSubmissionButtonModel.create(item);
  }

  async update(_id: string, RoleSubmissionButton: Partial<RoleSubmissionButton>) {
    return RoleSubmissionButtonModel.findByIdAndUpdate(_id, RoleSubmissionButton)
  }

}