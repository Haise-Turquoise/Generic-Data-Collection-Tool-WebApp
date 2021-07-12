import Container from 'typedi';
import SheetNameRepository from '../../repositories/SheetName';
import SheetName from '../../types/sheetname';

// @Service()
export default class SheetNameService {
  private sheetNameRepository: SheetNameRepository;
  constructor() {
    this.sheetNameRepository = Container.get(SheetNameRepository);
  }

  async createSheetName(sheetName: SheetName) {
    return this.sheetNameRepository.create(sheetName);
  }

  async deleteSheetName(id: string) {
    return this.sheetNameRepository.delete(id);
  }

  async updateSheetName(id: string, sheetName: Partial<SheetName>) {
    return this.sheetNameRepository.update(id, sheetName);
  }

  async findSheetName(sheetName: Partial<SheetName>) {
    return this.sheetNameRepository.find(sheetName);
  }

  async findById(id: string) {
    return this.sheetNameRepository.findById(id);
  }
}
