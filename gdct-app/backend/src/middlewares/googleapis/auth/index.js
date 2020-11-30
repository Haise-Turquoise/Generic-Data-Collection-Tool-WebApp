import { google } from 'googleapis'
import fs from 'fs'

const SCOPES = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/script.projects','https://www.googleapis.com/auth/script.external_request', 'https://www.googleapis.com/auth/spreadsheets.currentonly'];
const TOKEN_PATH = 'token.json';

// Oct 26, 2020
// Function that creates an Oauth2 Client for sending API requests to Google
export default function getAuthorization() {
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
  
// Oct 26, 2020
// Function for creating a new token if one does not already exist.
// Once this function runs, it will provide a URL on the terminal which you must go to obtain a code.
// After obtaining the code, you must paste the code at ./code.json within 30 second for the program to obtain a token
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