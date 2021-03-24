import Container from 'typedi';
import SheetNameRepository from '../../repositories/SheetName';

// @Service()
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

  async findById(id) {
    return this.sheetNameRepository.findById(id);
  }
}
