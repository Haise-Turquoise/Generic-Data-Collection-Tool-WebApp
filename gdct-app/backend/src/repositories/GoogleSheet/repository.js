// Created on Nov 12, 2020
// The GoogleSheet collection stores the url/spreadsheetId to a Google Sheet file. 
import GoogleSheetModel from '../../models/GoogleSheet';
import BaseRepository from '../repository';

// MongoDB implementation
// @Service()
export default class GoogleSheetRepository extends BaseRepository {
  constructor() {
    super(GoogleSheetModel);
  }

  async create({
    duplicateId, 
    googleSheetId,
    templateId,
    triggerId,
    submissionId,
  }) {
    return GoogleSheetModel.create({
          duplicateId, 
          googleSheetId,
          templateId,
          triggerId,
          submissionId,
        });
  }

  async find(query) {
    return GoogleSheetModel.find(query);
  }
}