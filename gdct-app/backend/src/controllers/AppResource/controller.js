import { Service } from 'typedi';
import { Router } from 'express';
import AppResourceService from '../../services/AppResource';

const AppResourceController = Service([AppResourceService], service => {
  const router = Router();
  return (() => {
    router.get('/appResources', (req, res, next) => {
      service
        .findAppResource({})
        .then(AppResources => res.json({ AppResources }))
        .catch(next);
    });

    router.post('/appResources', (req, res, next) => {
      service
        .createAppResource(req.body.AppResource)
        .then(AppResource => res.json({ AppResource }))
        .catch(next);
    });

    router.put('/appResources/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { AppResource } = req.body;

      service
        .updateAppResource(_id, AppResource)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/appResources/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteAppResource(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppResourceController;
