// Last Updated: Nov 17, 2020
// Polls every certain period of time to delete Google Sheets

import Container from 'typedi';
import GoogleSheetRepository from './repositories/GoogleSheet';
import TemplateRepository from './repositories/Template';
import {checkLastSaved, deleteGoogleSheet, saveGoogleSheetInTemplate} from './middlewares/googleapis'
import pako from 'pako'

const pollingTime = 3600000;
export default function polling(){
    setInterval(checkForOpenGoogleSheet, pollingTime);
} 

async function checkForOpenGoogleSheet(){
    const date = new Date();
    const currentSec = Math.floor((date.getTime()));

    const googleSheetRepository = Container.get(GoogleSheetRepository);
    const templateRepository = Container.get(TemplateRepository);
    // Retrieve all existing Google Sheet IDs from the database
    const openGoogleSheets = await googleSheetRepository.findAllSheet();
    // Retrieve the last edited time for each Google Sheet
    const lastSavedTime = await Promise.resolve(checkLastSaved(openGoogleSheets));
    const dates = lastSavedTime.map(date => new Date(date));
    const lastSavedSec = dates.map(date => Math.floor((date.getTime())));

    // For each Google Sheet, if it has been more than an hour since it was edited, delete the sheet
    for (let i = 0; i < lastSavedSec.length; i++){
        if (currentSec - lastSavedSec[i] >= pollingTime){
            console.log("Point A", openGoogleSheets[i])
            await Promise.resolve(saveGoogleSheetInTemplate(openGoogleSheets[i]));
            deleteGoogleSheet(openGoogleSheets[i].googleSheetId, openGoogleSheets[i].duplicateId, openGoogleSheets[i].triggerId);
            if (openGoogleSheets[i].duplicateId){
                deleteGoogleSheet(openGoogleSheets[i].duplicateId);
            }
            templateRepository.updateGoogleSheetId(openGoogleSheets[i].templateId, undefined);
            googleSheetRepository.delete(openGoogleSheets[i]._id);
        }
    }

}