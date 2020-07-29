import { Service } from 'typedi';
import { Router } from 'express';
import SheetNameService from '../../services/SheetName';

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

    return router;
  })();
});

export default SheetNameController;
