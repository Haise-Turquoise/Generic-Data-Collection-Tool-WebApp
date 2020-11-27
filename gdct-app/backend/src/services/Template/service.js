import Container from 'typedi';
import TemplateRepository from '../../repositories/Template';
import TemplateTypeRepository from '../../repositories/TemplateType';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess';
import GoogleSheetRepository from '../../repositories/GoogleSheet';
import { createSheet, createSpreadsheet, addEditor} from '../../middlewares/googleapis'

// @Service()
export default class TemplateService {
  constructor() {
    this.templateRepository = Container.get(TemplateRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.workflowProcessRepository = Container.get(WorkflowProcessRepository);
    this.googleSheetRepository = Container.get(GoogleSheetRepository);
  }

  async createTemplate(template) {
    const templateType = await this.templateTypeRepository.findById(template.templateTypeId);

    const workflowProcesses = await this.workflowProcessRepository.find({
      workflowId: templateType.templateWorkflowId,
    });

    const nodes = new Set();

    const visitedNodes = new Set();

    workflowProcesses.forEach(({ _id, to }) => {
      nodes.add(_id.toString());
      to.forEach(outNodeIds => {
        visitedNodes.add(outNodeIds.toString());
        nodes.add(outNodeIds.toString());
      });
    });

    let initialNode = null;

    nodes.forEach(node => {
      if (!visitedNodes.has(node)) {
        initialNode = node;
      }
    });

    template.workflowProcessId = initialNode;
    template.templateData.properties = {title: template.name};
    template.googleSheetId;
    return this.templateRepository.create(template);
  }

  async deleteTemplate(id) {
    return this.templateRepository.delete(id);
  }

  async updateTemplate(id, template) {
    return this.templateRepository.update(id, template);
  }

  async updateTemplateWorkflowProcess(id, workflowProcess) {
    return this.templateRepository.updateWorkflowProcess(id, workflowProcess);
  }

  async findTemplate(template) {
    return this.templateRepository.find(template);
  }

  async findTemplateById(id) {
    return this.templateRepository.findById(id);
  }
  // Updated on Nov 16
  // Opens template at Google Sheet
  // templateId is the objectId of the template on the database.
  // userEmail: Email of the user that will be given access to Google Sheet. 
  async openTemplate(templateId, userEmail){
    console.log("Point 1")
    // Temporary email
    userEmail = 'test34973737@gmail.com';
    //Retrieves template JSON from database
    console.log("Point 2")
    const template = await this.templateRepository.findById(templateId); 
    //Runs if there is already an existing google sheet 
    console.log("Point 3")
    if (template.googleSheetId){
      const res = await this.googleSheetRepository.findById(template.googleSheetId);
      await Promise.resolve(addEditor(res.googleSheetId, userEmail));
      return res.googleSheetId;
    }
    console.log("Point 4")

    // //First batch of data to send to Google
    // const firstSheetToSend = {
    //   properties: template.templateData.properties,
    //   sheets: '',
    // }

    // // If this is a brand new template that has never opened before, tempate.templateData.sheets will be empty and the if statement will not run
    // // If this is template that has opened before, then an existing sheet will have to be attached.
    // if (template.templateData.sheets){
    //   firstSheetToSend.sheets = template.templateData.sheets[0];
    // }

    // Sends in the data from google sheet API and retrieves spreadsheetID
    let res = await Promise.resolve(createSpreadsheet(template.templateData, userEmail)); 
    const { userSpreadsheetId, duplicateSpreadsheetId, triggerId } = res;
    // Store Google Sheet Model to the database
    const googleSheetModel = {
      templateId: templateId,
      googleSheetId: userSpreadsheetId,
      duplicateId: duplicateSpreadsheetId,
      triggerId: triggerId,
    }
    res = await this.googleSheetRepository.create(googleSheetModel);
    // Update googleSheetId on templateModel
    this.templateRepository.updateGoogleSheetId(templateId, res._id);
    // createSheet(template.templateData.sheets, spreadsheetId);   
    return userSpreadsheetId;
  }
}
