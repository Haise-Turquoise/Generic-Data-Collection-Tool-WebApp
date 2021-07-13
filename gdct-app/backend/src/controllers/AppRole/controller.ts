import { Service } from 'typedi';
import { Router } from 'express';
import AppRoleService from '../../services/AppRole';

const AppRoleController = Service([AppRoleService], service => {
  const router = Router();
  return (() => {
    router.get('/appRoles/fetch', (req, res, next) => {
      service
        .findAppRole({})
        .then(AppRoles => res.json( AppRoles ))
        .catch(next);
    });

    router.post('/appRoles/fetchAppRole', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(AppRoles => res.json( AppRoles ))
        .catch(next);
    });

    router.post('/appRoles/create', (req, res, next) => {
      service
        .createAppRole(req.body.AppRole)
        .then(AppRole => res.json({ AppRole }))
        .catch(next);
    });

    router.post('/appRoles/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteAppRole(_id)
        .then(() => res.end())
        .catch(next);
    });

    //update function
    router.put('/appRoles/update', (req, res, next) => {
      const { AppRole } = req.body;
      const _id = AppRole._id;

      service
        .updateAppRole(_id, AppRole)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppRoleController;
