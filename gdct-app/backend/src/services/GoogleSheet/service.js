import Container from 'typedi';
import GoogleSheetRepository from '../../repositories/GoogleSheet';

// @Service()
export default class GoogleSheetService {
  constructor() {
    this.googleSheetRepository = Container.get(GoogleSheetRepository);
  }

  async deleteGoogleSheet(id) {
    return this.googleSheetRepository.delete(id);
  }

  async findAll(){
    return this.googleSheetRepository.findAll();
  }
}