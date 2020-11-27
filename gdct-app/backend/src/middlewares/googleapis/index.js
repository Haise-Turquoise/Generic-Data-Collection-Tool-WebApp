import {google} from 'googleapis'
import fs from 'fs';
import pako from 'pako'
import Container from 'typedi';
import TemplateRepository from '../../repositories/Template';
import SubmissionRepository from '../../repositories/Submission';
import GoogleSheetRepository from '../../repositories/GoogleSheet';

const SCOPES = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/script.projects','https://www.googleapis.com/auth/script.external_request', 'https://www.googleapis.com/auth/spreadsheets.currentonly'];
const TOKEN_PATH = 'token.json';

//Oct 26, 2020
//Function call for creating new google sheet with existing data
export async function createSpreadsheet(templateData, userEmail){
    //Get the authentication key
    const auth = await getAuthorization();

    //The script ID is used to tell google which script to use
    const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
    const script = google.script('v1');

    const dataToSend = templateData;
    // Deflate/Compress the data
    const deflatedData = pako.deflate(JSON.stringify(dataToSend), { to: 'string' })
    // Wrap the data up to send an API request
    const deflatedDataWrapped = {
      auth: auth,
      resource: {
        function: 'createSpreadsheet',
        parameters: [{ data: deflatedData}, userEmail],
      },
      scriptId: scriptId,
    }
    // Make the API request.
    const res = await script.scripts.run(deflatedDataWrapped);
    if (res.data.error){console.log('Script error message: ' + res.data.error.details[0].errorMessage)}
    else { return res.data.response.result }
}

export async function createSheet(templateData, spreadsheetID){
    const auth = await getAuthorization();
    //The script ID is used to tell google which script to use
    const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
    const script = google.script('v1');

    const dataToSend = {
      properties: {title: 'Temporary Spreadsheet'},
      sheets: templateData,
      //namedRanges: templateData.namedRanges,
    }
    // Deflate/Compress the data
    const deflatedData = pako.deflate(JSON.stringify(dataToSend), { to: 'string' })
    // Wrap the data up to send an API request
    const deflatedDataWrapped = {
      auth: auth,
      resource: {
        function: 'createSheet',
        parameters: [{ data: deflatedData }, spreadsheetID],
      },
      scriptId: scriptId,
    }
    // Make the API request.
    const res = await script.scripts.run(deflatedDataWrapped);

    if (res.data.error){console.log('Script error message: ' + res.data.error.details[0].errorMessage)}
    else {console.log("Sheet transfer was successful")}
}

export async function checkLastSaved(openGoogleSheets){
  const auth = await getAuthorization();
  
  //The script ID is used to tell google which script to use
  const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
  const script = google.script('v1');

  const spreadsheetIds = openGoogleSheets.map(googleSheet => googleSheet.googleSheetId);

  const req = {
    auth: auth,
    resource: {
      function: 'checkLastSaved',
      parameters: [{id: spreadsheetIds}],
    },
    scriptId: scriptId,
  }

  // Make the API request.
  const res = await script.scripts.run(req);
  if (res.data.error){console.log('Script error message: ' + res.data.error.details[0].errorMessage)}
  else {return res.data.response.result}
}

// Sends a request to Google to delete a Google Sheet
// googleSheetId: Google Sheet ID to delete
export async function deleteGoogleSheet(googleSheetId, duplicateId, triggerId){
  // Get authorization credentials
  const auth = await getAuthorization();
  
  //The script ID is used to tell google which script to use
  const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
  const script = google.script('v1');
 
  //Request header to send to Google
  const req = {
    auth: auth,
    resource: {
      function: 'deleteGoogleSheet',
      parameters: [googleSheetId, duplicateId, triggerId],
    },
    scriptId: scriptId,
  }

  // Make the API request.
  const res = await script.scripts.run(req);
  if (res.data.error){console.log('Script error message: ' + res.data.error.details[0].errorMessage)}
  else {console.log("Google Sheet Deleted")}
}

export async function addEditor(spreadsheetId, userEmail){
    // Get authorization credentials
    const auth = await getAuthorization();
  
    //The script ID is used to tell google which script to use
    const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
    const script = google.script('v1');
   
    //Request header to send to Google
    const req = {
      auth: auth,
      resource: {
        function: 'addEditor',
        parameters: [spreadsheetId, userEmail],
      },
      scriptId: scriptId,
    }
  
    // Make the API request.
    const res = await script.scripts.run(req);
    if (res.data.error){console.log('Script error message: ' + res.data.error.details[0].errorMessage)}
    else {console.log("Editor Added")}
}

export async function retrieveSave(currentId, duplicateId){
  // Get authorization credentials
  const auth = await getAuthorization();

  //The script ID is used to tell google which script to use
  const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
  const script = google.script('v1');
  
  //Request header to send to Google
  const req = {
    auth: auth,
    resource: {
      function: 'retrieveSave',
      parameters: [currentId, duplicateId],
    },
    scriptId: scriptId,
  }

  // Make the API request.
  const res = await script.scripts.run(req);
  if (res.data.error){ console.log('Script error message: ' + res.data.error.details[0].errorMessage) }
  else {
    fs.writeFile('test.json', JSON.stringify(res.data.response.result), (err) => {
      if (err) return console.error(err);
      
     });
     return res.data.response.result;
  }
}

export async function getSpreadsheet(spreadsheetId){
  // Get authorization credentials
  const auth = await getAuthorization();

  //The script ID is used to tell google which script to use
  const scriptId = '1f1_CXedfm_-NCjkVpfXHQsOLh-KuuasefIjIsI38m93hRUXoKkEUVkeV';
  const script = google.script('v1');
  
  //Request header to send to Google
  const req = {
    auth: auth,
    resource: {
      function: 'getSpreadsheet',
      parameters: [spreadsheetId],
    },
    scriptId: scriptId,
  }

  const res = await script.scripts.run(req);
  if (res.data.error){ console.log('Script error message: ' + res.data.error.details[0].errorMessage) }
  else { return res.data.response.result }
}

// Nov 26, 2020
// Save function for Google Sheet
export async function saveGoogleSheetInTemplate(GoogleSheetRepositoryId){
    const googleSheetRepository = Container.get(GoogleSheetRepository);
    const googleSheet = googleSheetRepository.findById(GoogleSheetRepositoryId)
    const templateRepository = Container.get(TemplateRepository);
    const res = await Promise.resolve(retrieveSave(googleSheet.googleSheetId, googleSheet.duplicateId));
    const newSpreadsheet = res;
    const template = await templateRepository.findById(googleSheet.templateId);
    const updatedSpreadsheet = updateTemplate(newSpreadsheet, template.templateData, templateRepository);
    templateRepository.updateTemplate(openGoogleSheets[i].templateId, updatedSpreadsheet);
}

// Nov 26, 2020
// Save function for Google Sheet
export async function saveGoogleSheetInSubmission(GoogleSheetRepositoryId){
  console.log("Point 2")
  const googleSheetRepository = Container.get(GoogleSheetRepository);
  const googleSheet = await googleSheetRepository.findById(GoogleSheetRepositoryId);
  const submissionRepository = Container.get(SubmissionRepository);
  const res = await Promise.resolve(retrieveSave(googleSheet.googleSheetId, googleSheet.duplicateId));
  const newSpreadsheet = res;
  const submission = await submissionRepository.findById(googleSheet.submissionId);
  const updatedSpreadsheet = updateTemplate(newSpreadsheet, submission.workbookData);
  submissionRepository.updateWorkbook(googleSheet.submissionId, updatedSpreadsheet);
  console.log("Point 3")
}

// Oct 26, 2020
//Function that creates an Oauth2 Client for sending API requests to Google
export function getAuthorization() {
  return new Promise(resolve => {
    //Credentials from Google Console Platform
    const client_secret = 'zmoyqOgzwrIRpbKMK_2hXHOQ';
    const client_id = '948970102238-jeavohsmeomil2u4jttei2ejoq7383l2.apps.googleusercontent.com';
    const redirect_uris = 'http://localhost:3003';

    //Create an Oauth2 Client with the credentials
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);
    //Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        //If there are no tokens, create a new one
        if (err) return getNewToken(oAuth2Client);
        //Call the requested function
        oAuth2Client.setCredentials(JSON.parse(token));
        resolve(oAuth2Client);
    });
  })
}

//Oct 26, 2020
//Function for creating a new token if one does not already exist.
//Once this function runs, it will provide a URL on the terminal which you must go to obtain a code.
//After obtaining the code, you must paste the code at ./code.json within 30 second for the program to obtain a token
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  setTimeout(function(){
    fs.readFile('C:/Node/git_GDCS/GDCT-3/GDCT/gdct-app/backend/src/middlewares/googleapis/code.json', (err, content) => {
      content = JSON.parse(content);
      const {code} = content;
      console.log(code)
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        });
    });        
  },30000)
}

function updateTemplate(updatedTemplate, templateData){
    delete updatedTemplate.spreadsheetUrl;
    delete updatedTemplate.spreadsheetId;
    // If index is -1, the JSON object is not the entire spreadsheet
    if (!updatedTemplate.index){
        templateData = updatedTemplate;
        } else {
        // If updatedTemplate.properties is present, copy it into templateData.properties
        if (updatedTemplate.properties) {
            templateData.properties = updatedTemplate.properties;
        }
        // Iterates through each sheet 
        for (let i = 0; i < updatedTemplate.sheets.length; i++){
            const updateSheet = updatedTemplate.sheets[i];
            // If index is not -1, templateData.sheet.properties has changed 
            if (updateSheet.changed){
            templateData.sheets[i] = updateSheet.data;
            } else {
                if (updateSheet.properties.index != -1){
                templateData.sheets[i].properties = updateSheet.properties;
                }
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

function editRowData(updatedTemplate, templateData, i){
    const rowData = updatedTemplate.sheets[i].data[0].rowData;
    for (let j = 0; j < rowData.length; j++){
        // If index is -1, then entire rowData has to be changed
        if (rowData[j].index === -1){
        templateData.sheets[i].data[0].rowData = rowData[j].data;
        } else {
        const coord1 = rowData[j].index;
        const coord2 = rowData[j].index2;
        const data = rowData[j].data;

        if (coord2){
            while (!templateData.sheets[i].data[0].rowData[coord1]){
            templateData.sheets[i].data[0].rowData.push({})
            }
            if (!templateData.sheets[i].data[0].rowData[coord1].values){
            templateData.sheets[i].data[0].rowData[coord1] = {
                values: [],
            }
            }
            while (!templateData.sheets[i].data[0].rowData[coord1].values[coord2]){
            templateData.sheets[i].data[0].rowData[coord1].values.push({})
            }
            templateData.sheets[i].data[0].rowData[coord1].values[coord2] = data;
        } else {
            while (!templateData.sheets[i].data[0].rowData[coord1]){
            templateData.sheets[i].data[0].rowData.push({})
            }
            templateData.sheets[i].data[0].rowData[coord1] = data;
        }
        }
    }
}
function editColumnMetadata(updatedTemplate, templateData, i){
for (let j = 0; j < updatedTemplate.sheets[i].data[0].columnMetadata.length; j++){
    if (updatedTemplate.sheets[i].data[0].columnMetadata[j].index === -1){
    templateData.sheets[i].data[0].columnMetadata = updatedTemplate.sheets[i].data[0].columnMetadata[j].data;
    } else {
    const coord1 = updatedTemplate.sheets[i].data[0].columnMetadata[j].index;
    const data = updatedTemplate.sheets[i].data[0].columnMetadata[j].data;
    templateData.sheets[i].data[0].columnMetadata[coord1] = data;
    }
}
}
function editRowMetadata(updatedTemplate, templateData, i){
for (let j = 0; j < updatedTemplate.sheets[i].data[0].rowMetadata.length; j++){
    if (updatedTemplate.sheets[i].data[0].rowMetadata[j].index === -1){
    templateData.sheets[i].data[0].rowMetadata = updatedTemplate.sheets[i].data[0].columnMetadata[j].data;
    } else {
    const coord1 = updatedTemplate.sheets[i].data[0].rowMetadata[j].index;
    const data = updatedTemplate.sheets[i].data[0].rowMetadata[j].data;
    templateData.sheets[i].data[0].rowMetadata[coord1] = data;
    }
}
}