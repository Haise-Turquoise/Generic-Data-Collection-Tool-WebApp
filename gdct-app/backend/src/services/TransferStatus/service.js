import Container from 'typedi';
import TransferStatusRepository from '../../repositories/TransferStatus'
import transfer from '../../mongoToSql'

// @Service()
export default class TemplateTypeService {
  constructor() {
    this.transferStatusRepository = Container.get(TransferStatusRepository);
  }

  async startTransferProccess(time){
    const millis = time*1000*60;
    const timerObject = this.transferStatusRepository.findTransferStatus();
    console.log('Test point 1')

    if (timerObject.currentActiveProcess){

      clearInterval(timerObject.currentActiveProcess);
      const newTimer = setInterval(transfer(), millis);

      return this.transferStatusRepository.updateTimerID(newTimer).catch(err=>{
        clearInterval(newTimer);
        throw new Error(err)
      })
    }
    const newTimer = setInterval(transfer(), millis);
    return this.transferStatusRepository.updateTimerID(newTimer).catch(err=>{
      clearInterval(newTimer);
      throw new Error(err)
    })
    
  }

  async getTransferStatus(){
    console.log('I ran')
    const res = await this.transferStatusRepository.findTransferStatus();
    return res;
  }

  async closeCurrentTransferProcess(){
    const record = this.transferStatusRepository.findTransferStatus()
    if (record.currentActiveProcess){
      clearInterval(record.currentActiveProcess);
      return this.transferStatusRepository.updateTimerID(null);
    }
    throw new Error('There are no currently running transfer Process')
  }
}