// Last Updated: Nov 27, 2020
// Polls every certain period of time to delete Google Sheets

import Container from 'typedi';
import GoogleSheetRepository from './repositories/GoogleSheet';
import { saveGoogleSheetInTemplate, saveGoogleSheetInSubmission } from './middlewares/googleapis/save'
import { checkLastSaved, deleteGoogleSheet } from './middlewares/googleapis/request'
// The frequency at which the server should check for open Google Sheets
const pollingTime = 3600000;
export default function polling(){
    setInterval(checkForOpenGoogleSheet, pollingTime);
} 

// The GoogleSheet collection monitors active spreadsheets present in the Google Account. This function save the Google Sheets back 
// into the database and delete the sheets present on Google
async function checkForOpenGoogleSheet(){
    const googleSheetRepository = Container.get(GoogleSheetRepository);

    // Current time in miliseconds
    const date = new Date();
    const currentSec = Math.floor((date.getTime()));

    // Retrieve all existing Google Sheet IDs from the database
    const openGoogleSheets = await googleSheetRepository.findAllSheet();

    // CheckLastSaved will send a request to Google to find out the last time a certain Google Sheet was saved.
    const lastSavedTime = await Promise.resolve(checkLastSaved(openGoogleSheets));
    const dates = lastSavedTime.map(date => new Date(date));
    const lastSavedSec = dates.map(date => Math.floor((date.getTime())));

    // For each Google Sheet, if it has been more than the polling time since it was edited, delete the sheet
    for (let i = 0; i < lastSavedSec.length; i++){
        if (currentSec - lastSavedSec[i] >= pollingTime){
            // Checks if the spreadsheet is for the submission or template collection
            if (openGoogleSheets[i].templateId){
                // Save template
                await Promise.resolve(saveGoogleSheetInTemplate(openGoogleSheets[i]));
            } else if (openGoogleSheets[i].submissionId){
                // Save submission. 
                await Promise.resolve(saveGoogleSheetInSubmission(openGoogleSheets[i]._id))
            }
            // Send a request to Google to delete the Google Sheets.
            deleteGoogleSheet(openGoogleSheets[i].googleSheetId, openGoogleSheets[i].triggerId, openGoogleSheets[i].duplicateId);
            // Delete the GoogleSheet Collection object
            googleSheetRepository.delete(openGoogleSheets[i]._id);
        }
    }
}