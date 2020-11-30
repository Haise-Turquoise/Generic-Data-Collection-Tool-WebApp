import { google } from 'googleapis'
import pako from 'pako'
import getAuthorization from '../auth'

// Last Updated: Nov 27, 2020
// Function call for creating new google sheet with existing data
export async function createSpreadsheet(templateData, userEmail){
  // Deflate/Compress the data
  const deflatedData = pako.deflate(JSON.stringify(templateData), { to: 'string' })
  const res = await Promise.resolve(requestCall('createSpreadsheet', [{ data: deflatedData}, userEmail]));
  return res;
}

// Last Updated: Nov 27, 2020
// Originally, createSpreadsheet was meant to send only the first sheet and createSheet was meant to send the rest of the sheet
// in batches. Currently, createSpreadsheet is used to send all the spreadsheet data at once, so createSheet is not being used.
export async function createSheet(templateData, spreadsheetID){
  const dataToSend = {
    properties: {title: 'Temporary Spreadsheet'},
    sheets: templateData,
    //namedRanges: templateData.namedRanges,
  }
  // Deflate/Compress the data
  const deflatedData = pako.deflate(JSON.stringify(dataToSend), { to: 'string' })
  requestCall('createSheet', [{ data: deflatedData }, spreadsheetID]);
}

// Last Updated: Nov 27, 2020
// This function is used to retrieve the last time a Google Sheet was saved
export async function checkLastSaved(openGoogleSheets){
  const spreadsheetIds = openGoogleSheets.map(googleSheet => googleSheet.googleSheetId);
  const res = await Promise.resolve(requestCall('checkLastSaved', [{id: spreadsheetIds}]));
  return res;
}

// Last Updated: Nov 27, 2020
// Sends a request to Google to delete a Google Sheet
// @googleSheetId: Id of the spreadsheet user is editing
// @triggerId: Each spreadsheet is assigned a trigger to detect changes in cell value
// @duplicateId: A copy of a spreadsheet hidden from users that is used to check for changes that are made
export async function deleteGoogleSheet(googleSheetId, triggerId, duplicateId){
  requestCall('deleteGoogleSheet', [googleSheetId, duplicateId, triggerId]);
}

// Last Updated: Nov 27, 2020
// If a Google Sheet is already present for a certain spreadsheet, then instead of creating a new one, redirects the user
// to the existing Google Sheet by giving them access permission
export async function addEditor(spreadsheetId, userEmail){
  requestCall('addEditor', [spreadsheetId, userEmail]);
}

// Last Updated: Nov 27, 2020
// Retrieves all the changes made to the Google Sheet to update the database
export async function retrieveSave(currentId, duplicateId){
  const res = await Promise.resolve(await requestCall('retrieveSave', [currentId, duplicateId]));
  return res;
}

// Last Updated: Nov 27, 2020
// Retrieves a Google Sheet in JSON format
// It was only used for testing purposes to import Google Sheet into the database
export async function getSpreadsheet(spreadsheetId){
  const res = await Promise.resolve(requestCall('getSpreadsheet', [spreadsheetId]));
  return res;
}

// Last Updated: Nov 27, 2020
// Sends requests to Google.
// @functionName: The name of the function to activate on Appscript
// @paramters: parameters to give the function on Appscript
async function requestCall(functionName, parameters){
  // Get authorization credentials
  const auth = await getAuthorization();

  //The script ID is used to tell google which script to use
  const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
  const script = google.script('v1');
  
  //Request header to send to Google
  const req = {
    auth: auth,
    resource: {
      function: functionName,
      parameters: parameters,
    },
    scriptId: scriptId,
  }

  // Make the API request.
  const res = await script.scripts.run(req);
  // Show error message if there are errors
  if (res.data.error){
    console.log('Script error message: ' + res.data.error.details[0].errorMessage);
  } else { 
    return res.data.response.result ;
  }
}






