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

    // Last Updated: Dec 07, 2020
    router.post('/recordPreview/', (req, res, next) => {
      service
        .recordPreview(req.body)
        .then()
        .catch(next);
    });

    // Last Updated: Dec 07, 2020
    router.post('/deletePreview/', (req, res, next) => {
      service
        .recordPreview(req.body)
        .then()
        .catch(next);
    });


    return router;
  })();
});

export default GoogleApisController;