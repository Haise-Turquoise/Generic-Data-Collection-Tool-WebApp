// Last Updated: Oct 26,2020
// Used to handle API requests from google

import { Service } from 'typedi';
import { Router } from 'express';
import GoogleApisService from '../../services/GoogleApi';
import fs from 'fs'


const GoogleApisController = Service([GoogleApisService], service => {
  const router = Router();
  return (() => {
     router.get('/getAttributesAndCatagory/', (req, res, next) => {
      service
        .sendAttributeAndCatagory()
        .then(output => {
          res.send(JSON.stringify(output));
        })
        .catch(next);
     });

     router.post('/updateSpreadsheet/', (req, res, next) => {
      service
        .updateSpreadsheet(req.body)
        .then()
        .catch(next);
     });

    return router;
  })();
});

export default GoogleApisController;