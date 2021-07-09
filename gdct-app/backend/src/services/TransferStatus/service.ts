import Container from 'typedi';
import TransferStatusRepository from '../../repositories/TransferStatus'
import startTransfer from '../../mongoToSql'
import TransferStatusModel from '../../models/TransferStatus'

// @Service()
class TemplateTypeService {
  private transferStatusRepository: TransferStatusRepository;
  private currentTimer: null | NodeJS.Timeout;
  constructor() {
    this.transferStatusRepository = Container.get(TransferStatusRepository);
    this.currentTimer = null;
  }

  async startTransferProccess(time: number){
    if (time <= 0) throw new Error("Cannot set transfer to less or equal to 0 minutes")
    const millis = time*1000*60;

    if (this.currentTimer){
      console.log('test 1')
      clearInterval(this.currentTimer);
    }

    console.log('Test point 3') 
    const newTimer = startTransfer(millis);
    this.currentTimer = newTimer;
    console.log('Test point 4')
    return this.transferStatusRepository.updateTimerID(time, true)
    .catch(err=>{
      if (this.currentTimer) {
        clearInterval(this.currentTimer);
      }
      this.currentTimer = null;
    })
  }

  async getTransferStatus(){
    console.log('I ran')
    return this.transferStatusRepository.findTransferStatus();
  }

  async closeCurrentTransferProcess(){
    if (this.currentTimer){
      clearInterval(this.currentTimer);
      // TODO double check this
      return this.transferStatusRepository.updateTimerID(0, false);
    }
    throw new Error('There are no currently running transfer Process')
  }
}

export default TemplateTypeService;