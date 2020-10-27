import { Service } from 'typedi';
import { Router } from 'express';
import AppSysRoleService from '../../services/AppSysRole';

const AppSysRoleController = Service([AppSysRoleService], service => {
  const router = Router();
  return (() => {
    router.get('/appSysRoles', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findAppSysRole({})
        .then(AppSysRoles => res.json({ AppSysRoles }))
        .catch(next);
    });

    router.post('/appSysRoles', (req, res, next) => {
      service
        .createAppSysRole(req.body.AppSysRole)
        .then(AppSysRole => res.json({ AppSysRole }))
        .catch(next);
    });

    router.put('/appSysRoles/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { AppSysRole } = req.body;

      service
        .updateAppSysRole(_id, AppSysRole)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/appSysRoles/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteAppSysRole(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppSysRoleController;
