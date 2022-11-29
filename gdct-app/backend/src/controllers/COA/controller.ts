import { Service } from 'typedi';
import { Router } from 'express';
import COAService from '../../services/COA';

const COAController = Service([COAService], service => {
  const router = Router();
  return (() => {
    router.get('/COAs/fetch', (req, res, next) => {
      service
        .findCOA({})
        .then(COAs => res.json(COAs))
        .catch(next);
    });

    router.post(`/COAs/fetchCOAById`, (req, res, next) => {
      const { _id } = req.body;

      service
        .findCOAById(_id)
        .then(COA => res.json({ COA }))
        .catch(next);
    });

    router.post('/COAs/create', (req, res, next) => {
      service
        .createCOA(req.body.COA)
        .then(COA => res.json({ COA }))
        .catch(next);
    });

    router.put('/COAs/update', (req, res, next) => {
      const { COA } = req.body;
      const _id = COA._id;

      service
        .updateCOA(_id, COA)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/COAs/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteCOA(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default COAController;
