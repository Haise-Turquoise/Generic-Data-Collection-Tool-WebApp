import Container from 'typedi';
import SheetNameRepository from '../../repositories/SheetName';
import MasterValueRepository from '../../repositories/MasterValue';
import { log } from '../../utils/log/winston';

const repository = new MasterValueRepository();

export default class SheetNameService {
  constructor() {
    this.sheetNameRepository = Container.get(SheetNameRepository);
  }

  async createSheetName(sheetName) {
    return this.sheetNameRepository.create(sheetName);
  }

  async deleteSheetName(id) {
    return this.sheetNameRepository.delete(id);
  }

  async updateSheetName(id, sheetName) {
    return this.sheetNameRepository.update(id, sheetName);
  }

  async findSheetName(sheetName) {
    return this.sheetNameRepository.find(sheetName);
  }

  findMasterValues(masterValue) {
    log.info(`action to read masterValue data with ${JSON.stringify(masterValue)}`);
    if (Object.keys(masterValue).length !== 0) {
      return repository.findByOrgColumnAttribute(masterValue);
    }
    return repository.find(masterValue);
  }

  findMasterValueByParams(masterValue) {
    log.info(`action to read masterValue data with ${JSON.stringify(masterValue)}`);
    return repository.findByOrgColumnAttribute(masterValue);
  }
}
