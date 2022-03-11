import Container from 'typedi';
import TransferStatusRepository from '../../repositories/TransferStatus'
import startTransfer from '../../mongoToSql'

// Singlton service
class TransferStatusService {
  private transferStatusRepository: TransferStatusRepository;
  private static currentTimer: null | NodeJS.Timeout = null;
  constructor() {
    this.transferStatusRepository = Container.get(TransferStatusRepository);
  }

  static getCurrentTimer(){
    return this.currentTimer;
  }

  static setCurrentTimer(newTimerObject:NodeJS.Timeout){
    if (this.currentTimer){
      clearInterval(this.currentTimer);
    }
    this.currentTimer = newTimerObject;
  }

  static clearCurrentTimer(){
    if (this.currentTimer){
      clearInterval(this.currentTimer);
      this.currentTimer = null;
    }
  }


  async startTransferProccess(time: number){
    if (time <= 1) throw new Error("Cannot set transfer to less or equal to 1 minutes")
    const minutes = time*1000*60;

    const newTimer = startTransfer(minutes);
    TransferStatusService.setCurrentTimer(newTimer);
    return this.transferStatusRepository.updateTimerID(time, true)
    .catch(err=>{
     TransferStatusService.clearCurrentTimer();
    })
  }

  async getTransferStatus(){
    return this.transferStatusRepository.findTransferStatus();
  }

  async closeCurrentTransferProcess(){
    if (TransferStatusService.getCurrentTimer()){
      TransferStatusService.clearCurrentTimer();
      // TODO double check this
      return this.transferStatusRepository.updateTimerID(0, false);
    }
    throw new Error('There are no currently running transfer Process')
  }
}

export default TransferStatusService;