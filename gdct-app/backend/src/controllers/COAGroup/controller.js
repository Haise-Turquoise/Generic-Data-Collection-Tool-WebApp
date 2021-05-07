import { Service } from 'typedi';
import { Router } from 'express';
import COAGroupService from '../../services/COAGroup';

const COAGroupController = Service([COAGroupService], service => {
  const router = Router();
  return (() => {
    router.get('/COAGroups/fetch', (req, res, next) => {
      service
        .findCOAGroup({})
        .then(COAGroups => res.json( COAGroups ))
        .catch(next);
    });

    router.post('/COAGroups/fetchCOAGroup', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(COAGroups => res.json( COAGroups ))
        .catch(next);
    });

    router.post('/COAGroups/create', (req, res, next) => {
      service
        .createCOAGroup(req.body.COAGroup)
        .then(COAGroup => res.json({ COAGroup }))
        .catch(next);
    });

    router.put('/COAGroups/update', (req, res, next) => {
      const { COAGroup } = req.body;
      const _id = COAGroup._id;

      service
        .updateCOAGroup(_id, COAGroup)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/COAGroups/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteCOAGroup(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default COAGroupController;
