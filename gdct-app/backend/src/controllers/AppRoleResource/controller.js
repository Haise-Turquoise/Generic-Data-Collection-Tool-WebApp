import { Service } from 'typedi';
import { Router } from 'express';
import AppRoleResourceService from '../../services/AppRoleResource';

const AppRoleResourceController = Service([AppRoleResourceService], service => {
  const router = Router();
  return (() => {
    router.get('/appRoleResources/fetch', (req, res, next) => {
      service
        .findAppRoleResource({})
        .then(AppRoleResources => res.json( AppRoleResources ))
        .catch(next);
    });

    router.post('/appRoleResources/fetchAppRoleResource', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(AppRoleResources => res.json( AppRoleResources ))
        .catch(next);
    });

    router.post('/appRoleResources/create', (req, res, next) => {
      service
        .createAppRoleResource(req.body.AppRoleResource)
        .then(AppRoleResource => res.json({ AppRoleResource }))
        .catch(next);
    });

    router.put('/appRoleResources/update', (req, res, next) => {
      const { AppRoleResource } = req.body;
      const _id = AppRoleResource._id;

      service
        .updateAppRoleResource(_id, AppRoleResource)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/appRoleResources/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteAppRoleResource(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppRoleResourceController;
