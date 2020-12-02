import Container from 'typedi';
import TemplateRepository from '../../../repositories/Template';
import SubmissionRepository from '../../../repositories/Submission';
import GoogleSheetRepository from '../../../repositories/GoogleSheet';
import { retrieveSave } from '../request';

// Nov 26, 2020
// Save function for Google Sheet for template
export async function saveGoogleSheetInTemplate(googleSheet){
    const templateRepository = Container.get(TemplateRepository);
    // Retrieve Google Sheet from Google
    const res = await Promise.resolve(retrieveSave(googleSheet.googleSheetId, googleSheet.duplicateId));
    // Pako should be implemented here
    const newSpreadsheet = res;
    // Retrieve the template currently in the database
    const template = await templateRepository.findById(googleSheet.templateId);
    // Compare the template from the database with the one from Google. Return the updated template. 
    const updatedSpreadsheet = updateTemplate(newSpreadsheet, template.templateData);
    // Push the new changes to templateRepository
    templateRepository.updateTemplate(googleSheet.templateId, updatedSpreadsheet);
    // Remove the pointer to GoogleSheet from the template since the Google sheet will not exist anymore
    templateRepository.updateGoogleSheetId(googleSheet.templateId, undefined);
}

// Nov 26, 2020
// Save function for Google Sheet for submissions
export async function saveGoogleSheetInSubmission(GoogleSheetRepositoryId){
    const googleSheetRepository = Container.get(GoogleSheetRepository);
    const submissionRepository = Container.get(SubmissionRepository);
    // Retrieve GoogleSheet collection from the database
    const googleSheet = await googleSheetRepository.findById(GoogleSheetRepositoryId);
    // Retrieve Google Sheet from Google
    const res = await Promise.resolve(retrieveSave(googleSheet.googleSheetId, googleSheet.duplicateId));
    // Pako should be implemented here
    const newSpreadsheet = res;
    // Retrieve the workbook currently in the database
    const submission = await submissionRepository.findById(googleSheet.submissionId);
    // Compare the workbook from the database with the one from Google. Return the updated workbook. 
    const updatedSpreadsheet = updateTemplate(newSpreadsheet, submission.workbookData);
    // Push the new changes to submissionRepository
    submissionRepository.updateWorkbook(googleSheet.submissionId, updatedSpreadsheet);
    // Remove the pointer to GoogleSheet from the template since the Google sheet will not exist anymore
    submissionRepository.updateGoogleSheetId(googleSheet.templateId, undefined);
}

// This function will compare the template coming in from Google with the template currently in the database. 
// Any changes detected will overwrite the templateData
function updateTemplate(updatedTemplate, templateData){
    // Clean up the updatedTemplate
    delete updatedTemplate.spreadsheetUrl;
    delete updatedTemplate.spreadsheetId;
    if (!updatedTemplate.index){
        // If this is the first time Google Sheet is being copied over to the template, copy the entire spreadsheet
        templateData = updatedTemplate;
    } else {
        // If updatedTemplate.properties was changed, copy it into templateData.properties
        if (updatedTemplate.properties) {
            templateData.properties = updatedTemplate.properties;
        }
        // Iterates through each sheet 
        for (let i = 0; i < updatedTemplate.sheets.length; i++){
            const updateSheet = updatedTemplate.sheets[i];

            // If index is not -1, templateData.sheet.properties was changed and has to be overwrited 
            if (updateSheet.properties.index != -1){
                templateData.sheets[i].properties = updateSheet.properties;
            }
            // If updateSheet.changed is true, then a new sheet was most likely created, duplicated, or moved. Overwrite the entire sheet
            if (updateSheet.changed){
                templateData.sheets[i] = updateSheet.data;
            } else {
                // Checks through rowData
                editRowData(updatedTemplate, templateData, i)
                // For columnMetaData
                editColumnMetadata(updatedTemplate, templateData, i)
                // For rowMetaData
                editRowMetadata(updatedTemplate, templateData, i)
            }
        }
    }
    return templateData;
}

// The rowData stores the value, font and styles of each cell. This function will check if there has been any changes in any cell.
function editRowData(updatedTemplate, templateData, i){
    const rowData = updatedTemplate.sheets[i].data[0].rowData;
    for (let j = 0; j < rowData.length; j++){
        // If index is -1, a new sheet was most likely created. Copy the entire rowData onto the database
        if (rowData[j].index === -1){
            templateData.sheets[i].data[0].rowData = rowData[j].data;
        } else {
            // Index: position of row
            // Index2: position of column
            // Data: value to insert
            const { index, index2, data } = rowData[j];

            // This loop will run if index2 is defined. 
            if (index2 >= 0){
            // Runs if the rowData in the database is too small. Increases the size of the array
                while (!templateData.sheets[i].data[0].rowData[index]){
                    templateData.sheets[i].data[0].rowData.push({})
                }
                // This is the rowData where the value will be inputted. Add extra information into the array if it is empty
                if (!templateData.sheets[i].data[0].rowData[index].values){
                    templateData.sheets[i].data[0].rowData[index] = {
                    values: [],
                    } 
                }
                // Runs if the rowData[index].values in the database is too small. Increases the size of the array
                while (!templateData.sheets[i].data[0].rowData[index].values[index2]){
                    templateData.sheets[i].data[0].rowData[index].values.push({})
                }
                // Insert the data into the correction position
                templateData.sheets[i].data[0].rowData[index].values[index2] = data;
            } else {
                // This loop will run if the index2 is not defined. 
                while (!templateData.sheets[i].data[0].rowData[index]){
                    templateData.sheets[i].data[0].rowData.push({})
                }
                // Insert the data into the correction position. The entire row will be copied into the database
                templateData.sheets[i].data[0].rowData[index] = data;
            } 
        }
    }
}
// The columnMetaData stores the row cell size. This function will check if there has been any changes in column cell sizes.
function editColumnMetadata(updatedTemplate, templateData, i){
    const updatedColumn = updatedTemplate.sheets[i].data[0].columnMetadata;
    for (let j = 0; j < updatedColumn.length; j++){
        if (updatedColumn[j].index === -1){
            // If the index is -1, a new sheet was most likely created. Copy the entire columnMetaData onto the database
            templateData.sheets[i].data[0].columnMetadata = updatedColumn[j].data;
        } else {
            // Index: position of the column
            // Data: value to insert
            const { index, data } = updatedColumn[j];
            // Runs if the columnMetaData in the database is too small. Increases the size of the array
            while (templateData.sheets[i].data[0].columnMetadata.length <= index) {
                templateData.sheets[i].data[0].columnMetadata.push({})
            }
            // Insert the value into the correct index
            templateData.sheets[i].data[0].columnMetadata[index] = data;
        }
    }
}
// The rowMetaData stores the row cell size. This function will check if there has been any changes in row cell sizes.
function editRowMetadata(updatedTemplate, templateData, i){
    const updatedRow = updatedTemplate.sheets[i].data[0].rowMetadata;
    for (let j = 0; j < updatedRow.length; j++){
        if (updatedRow[j].index === -1){
            // If the index is -1, a new sheet was most likely created. Copy the entire rowMetaData onto the database
            templateData.sheets[i].data[0].rowMetadata = updatedRow[j].data;
        } else {
            // Index: position of the row
            // Data: value to insert
            const { index, data}  = updatedRow[j];
            // Runs if the rowMetaData in the database is too small. Increases the size of the array
            while (templateData.sheets[i].data[0].rowMetadata.length <= index) {
                templateData.sheets[i].data[0].rowMetadata.push({})
            }
            // Insert the value into the correct index
            templateData.sheets[i].data[0].rowMetadata[index] = data;
        }
    }
}