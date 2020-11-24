import { Service } from 'typedi';

import { Router } from 'express';
import SheetNameService from '../../services/SheetName';
import MasterValueService from '../../services/MasterValue';
import { returnNormalJson } from '../../utils';

const masterValueService = new MasterValueService();
const SheetNameController = Service([SheetNameService], service => {
  const router = Router();
  return (() => {
    router.get('/sheetNames', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findSheetName({})
        .then(sheetNames => res.json({ sheetNames }))
        .catch(next);
    });

    router.post('/sheetNames', (req, res, next) => {
      service
        .createSheetName(req.body.sheetName)
        .then(sheetName => res.json({ sheetName }))
        .catch(next);
    });

    router.put('/sheetNames/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { sheetName } = req.body;

      service
        .updateSheetName(_id, sheetName)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/sheetNames/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteSheetName(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.get('/', (req, res, next) => {
      const { organization, category, attribute, templateType = '' } = req.query;
      if ((organization || category || attribute) && (!organization || !category || !attribute)) {
        throw new Error('All fields of organization, category and attribute are required');
      }
      masterValueService
        .findMasterValues({
          organization,
          category,
          attribute,
          templateType,
        })
        .then(masterValues => {
          returnNormalJson(res, masterValues);
        })
        .catch(next);
    });

    router.get('/:organization/:category/:attribute', (req, res, next) => {
      const { organization, category, attribute } = req.params;
      const { templateType = '' } = req.query;
      masterValueService
        .findMasterValueByParams({
          organization,
          category,
          attribute,
          templateType,
        })
        .then(masterValues => {
          returnNormalJson(res, masterValues);
        })
        .catch(next);
    });
    return router;
  })();
});

export default SheetNameController;
