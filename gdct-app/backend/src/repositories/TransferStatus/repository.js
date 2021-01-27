import TransferStatusModel from '../../models/TransferStatus';
import BaseRepository from '../repository';
export default class TransferStatusRepository extends BaseRepository {
  constructor() {
    super(TransferStatusModel);
  }

  async findTransferStatus(){
    return TransferStatusModel.findOne({name:"mongoToSql"});
  }

  async updateTimerID(time, state){
    return TransferStatusModel.updateOne({name:"mongoToSql"}, {$set:{isActive:state, interval:time}})
  }
  
}