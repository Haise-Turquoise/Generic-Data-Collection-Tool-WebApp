// Last Updated: Oct 26,2020
// Used to handle API requests from google

import { Service } from 'typedi';
import { Router } from 'express';
import GoogleApisService from '../../services/GoogleApi';
// Used to handle API requests from google
const GoogleApisController = Service([GoogleApisService], service => {
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

    // Last Updated: Nov 27, 2020
    // Receives update from Google whenever a change is made in a cell. Comes with cell coordinate and value
    // It was developed for proof of concept
    router.post('/updateSpreadsheet/', (req, res, next) => {
      service
        .updateSpreadsheet(req.body)
        .then()
        .catch(next);
    });

    router.post('/orgWithMasterValueEntry', (req, res, next)=>{
      service.findOrgWithMasterValueEntries().then(data=>{
        res.send(JSON.stringify({"orgs":data}))
      }).catch(next);
    });

    router.post('/updatePreview/', (req, res, next) => {
      service
        .updatePreview(req.body.data)
        .then(answer => res.send())
        .catch(next);
    });

    router.post('/getPreview/', (req, res, next) => {
      service
        .getPreview(req.body.data)
        .then(preview => 
          {console.log(preview); res.send({data: preview} )})
        .catch(next);
    });

    router.post('/closeEvent/', (req, res, next) => {
      service
        .save(req.body.id)
        .then(preview => res.send({data: preview} ))
        .catch(next);
    });


    return router;
  })();
});

export default GoogleApisController;