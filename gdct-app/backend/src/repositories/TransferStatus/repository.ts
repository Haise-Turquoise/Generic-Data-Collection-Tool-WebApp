import TransferStatusModel from '../../models/TransferStatus';
import BaseRepository from '../repository';
import TransferStatus, { TransferStatusDoc } from '../../types/transferstatus';

export default class TransferStatusRepository extends BaseRepository<TransferStatus, TransferStatusDoc> {
  constructor() {
    super(TransferStatusModel);
  }

  async findTransferStatus(){
    return TransferStatusModel.findOne({name:"mongoToSql"});
  }

  async updateTimerID(time: number, state: boolean){
    return TransferStatusModel.updateOne({name:"mongoToSql"}, {$set:{isActive:state, interval:time}})
  }
  
}