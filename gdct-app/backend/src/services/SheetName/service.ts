import Container from 'typedi';
import SheetNameRepository from '../../repositories/SheetName';
import { SheetNameDoc } from '../../types/sheetname';

// @Service()
export default class SheetNameService {
  private sheetNameRepository: SheetNameRepository;
  constructor() {
    this.sheetNameRepository = Container.get(SheetNameRepository);
  }

  async createSheetName(sheetName: SheetNameDoc) {
    return this.sheetNameRepository.create(sheetName);
  }

  async deleteSheetName(id: string) {
    return this.sheetNameRepository.delete(id);
  }

  async updateSheetName(id: string, sheetName: SheetNameDoc) {
    return this.sheetNameRepository.update(id, sheetName);
  }

  async findSheetName(sheetName: SheetNameDoc) {
    return this.sheetNameRepository.find(sheetName.toObject());
  }

  async findById(id: string) {
    return this.sheetNameRepository.findById(id);
  }
}
