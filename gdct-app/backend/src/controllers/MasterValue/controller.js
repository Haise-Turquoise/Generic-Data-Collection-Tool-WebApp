import { Service } from 'typedi';
import { Router } from 'express';
import MasterValueService from '../../services/MasterValue';

const MasterValueController = Service([MasterValueService], service => {
  const router = Router();
  return (() => {
    router.get('/masterValue/fetch', (req, res, next) => {
      service
        .findMasterValue({})
        .then(masterValueTable => res.json({ masterValueTable }))
        .catch(next);
    });

    router.post('/masterValue/create', (req, res, next) => {
      service
        .createMasterValue(req.body.masterValue)
        .then(masterValue => res.json({ masterValue }))
        .catch(next);
    });

    router.put('/masterValue/update', (req, res, next) => {
      const { masterValue } = req.body;
      const _id = masterValue._id;

      service
        .updateMasterValue(_id, masterValue)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/masterValue/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteMasterValue(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/masterValue/addDocument', (req, res, next) => {
      service
        .addDocument(req.body.masterValue)
        .then(masterValue => res.json({ masterValue }))
        .catch(next);
    });

    return router;
  })();
});

export default MasterValueController;
