import { Service } from 'typedi';
import { Router } from 'express';
import AppResourceService from '../../services/AppResource';

const AppResourceController = Service([AppResourceService], service => {
  const router = Router();
  return (() => {
    router.post('/appResources/fetchAppResource', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(AppResource => res.json( AppResource ))
        .catch(next);
    });

    router.get('/appResources/fetch', (req, res, next) => {
      service
        .findAppResource({})
        .then(AppResources => res.json( AppResources ))
        .catch(next);
    });

    router.post('/appResources/create', (req, res, next) => {
      service
        .createAppResource(req.body.AppResource)
        .then(AppResource => res.json({ AppResource }))
        .catch(next);
    });

    router.post('/appResources/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteAppResource(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/appResources/update', (req, res, next) => {
      const { AppResource } = req.body;
      const _id = AppResource._id;

      service
        .updateAppResource(_id, AppResource)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppResourceController;
