import { Service } from 'typedi';
import { Router } from 'express';
import COAGroupService from '../../services/COAGroup';

const COAGroupController = Service([COAGroupService], service => {
  const router = Router();
  return (() => {
    router.get('/COAGroups', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findCOAGroup({})
        .then(COAGroups => res.json({ COAGroups }))
        .catch(next);
    });

    router.post('/COAGroups', (req, res, next) => {
      service
        .createCOAGroup(req.body.COAGroup)
        .then(COAGroup => res.json({ COAGroup }))
        .catch(error => {
          throw error;
        })
        .catch(next);
    });

    router.put('/COAGroups/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { COAGroup } = req.body;

      service
        .updateCOAGroup(_id, COAGroup)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/COAGroups/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteCOAGroup(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default COAGroupController;
