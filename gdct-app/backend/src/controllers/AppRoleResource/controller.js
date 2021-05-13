import { Service } from 'typedi';
import { Router } from 'express';
import AppRoleResourceService from '../../services/AppRoleResource';

const AppRoleResourceController = Service([AppRoleResourceService], service => {
  const router = Router();
  return (() => {
    router.get('/appRoleResources', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findAppRoleResource({})
        .then(AppRoleResources => res.json({ AppRoleResources }))
        .catch(next);
    });

    router.get('/appRoleResources/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .findById(_id)
        .then(AppRoleResources => res.json( AppRoleResources ))
        .catch(next);
    });

    router.post('/appRoleResources', (req, res, next) => {
      service
        .createAppRoleResource(req.body.AppRoleResource)
        .then(AppRoleResource => res.json({ AppRoleResource }))
        .catch(next);
    });

    router.put('/appRoleResources/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { AppRoleResource } = req.body;
      service
        .updateAppRoleResource(_id, AppRoleResource)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/appRoleResources/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteAppRoleResource(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppRoleResourceController;
