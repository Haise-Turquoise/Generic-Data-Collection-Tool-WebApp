import { Service } from 'typedi';

import { Router } from 'express';
import MasterValueService from '../../services/MasterValue';

const MasterValueController = Service([MasterValueService], service => {
  const router = Router();
  return (() => {
    router.get('/masterValue', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findMasterValue({})
        .then(masterValueTable => res.json({ masterValueTable }))
        .catch(next);
    });

    router.post('/masterValue', (req, res, next) => {
      console.log('reach backend controller create')
      service
        .createMasterValue(req.body.masterValue)
        .then(masterValue => res.json({ masterValue }))
        .catch(next);
    });


    router.post('/masterValue/addDocument', (req, res, next) => {
      console.log('reach backend controller addDocument')
      console.log(req.body)
      service
        .addDocument(req.body.masterValue)
        .then(masterValue => res.json({ masterValue }))
        .catch(next);
    });

    router.put('/masterValue/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { masterValue } = req.body;

      service
        .updateMasterValue(_id, masterValue)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/masterValue/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteMasterValue(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default MasterValueController;
