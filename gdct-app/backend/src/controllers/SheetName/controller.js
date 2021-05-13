import { Service } from 'typedi';
import { Router } from 'express';
import SheetNameService from '../../services/SheetName';

const SheetNameController = Service([SheetNameService], service => {
  const router = Router();
  return (() => {
    router.get('/sheetNames/fetch', (req, res, next) => {
      service
        .findSheetName({})
        .then(sheetNames => res.json( sheetNames ))
        .catch(next);
    });

    router.post('/sheetNames/fetchById', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(sheetName => res.json( sheetName ))
        .catch(next);
    })

    router.post('/sheetNames/create', (req, res, next) => {
      service
        .createSheetName(req.body.sheetName)
        .then(sheetName => res.json({ sheetName }))
        .catch(next);
    });

    router.put('/sheetNames/update', (req, res, next) => {
      const { sheetName } = req.body;
      const _id = sheetName._id;

      service
        .updateSheetName(_id, sheetName)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/sheetNames/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteSheetName(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default SheetNameController;
