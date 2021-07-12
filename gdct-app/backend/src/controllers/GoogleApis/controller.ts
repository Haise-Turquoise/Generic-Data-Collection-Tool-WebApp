// Last Updated: Oct 26,2020
// Used to handle API requests from google

import { Service } from 'typedi';
import { Router } from 'express';
import SpreadsheetApisService from '../../services/GoogleApi';
// Used to handle API requests from google
const SpreadsheetApisController = Service([SpreadsheetApisService], service => {
  const router = Router();
  return (() => {
    // Last Updated: Nov 27, 2020
    // Sends all the attributes and category in the database
    router.post('/getAttributesAndCatagory/', (req, res, next) => {
      service
        .sendAttributeAndCatagory()
        .then(output => { res.send(JSON.stringify(output)) })
        .catch(next);
    });

    router.post('/orgWithMasterValueEntry', (req, res, next)=>{
      service.findOrgWithMasterValueEntries().then(data=>{
        res.send(JSON.stringify({"orgs":data}))
      }).catch(next);
    }); 

    return router;
  })();
});

export default SpreadsheetApisController;