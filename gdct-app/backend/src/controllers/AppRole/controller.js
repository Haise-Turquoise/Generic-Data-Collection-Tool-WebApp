import { Service } from 'typedi';
import { Router } from 'express';
import AppRoleService from '../../services/AppRole';

const AppRoleController = Service([AppRoleService], service => {
  const router = Router();
  return (() => {
    router.get('/appRoles', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findAppRole({})
        .then(AppRoles => res.json({ AppRoles }))
        .catch(next);
    });

    router.post('/appRoles', (req, res, next) => {
      service
        .createAppRole(req.body.AppRole)
        .then(AppRole => res.json({ AppRole }))
        .catch(error => {
          throw error;
        })
        .catch(next);
    });

    router.put('/appRoles/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { AppRole } = req.body;

      service
        .updateAppRole(_id, AppRole)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/appRoles/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteAppRole(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppRoleController;
