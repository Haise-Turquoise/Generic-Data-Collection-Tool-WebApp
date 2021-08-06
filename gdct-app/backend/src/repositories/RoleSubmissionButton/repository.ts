import BaseRepository from '../repository';
import RoleSubmissionButton from '../../types/rolesubmissionbutton';
import RoleSubmissionButtonModel from '../../models/RoleSubmissionButton';
import {RoleSubmissionButtonDoc} from '../../types/rolesubmissionbutton';

// Created by Sheldon on 2021/07/13
// Repository for RoleSubmissionButton
export default class RoleSubmissionButtonRepository extends BaseRepository<RoleSubmissionButton, RoleSubmissionButtonDoc>{
  constructor(){
    super(RoleSubmissionButtonModel)
  }

  async findByRole(role:string):Promise<RoleSubmissionButton>{
    return RoleSubmissionButtonModel.findOne({role});
  }

  async update(_id: string, RoleSubmissionButton: Partial<RoleSubmissionButton>) {
    return RoleSubmissionButtonModel.findByIdAndUpdate(_id, RoleSubmissionButton)
  }

}