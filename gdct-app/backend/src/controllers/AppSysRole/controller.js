import { Service } from 'typedi';
import { Router } from 'express';
import AppSysRoleService from '../../services/AppSysRole';

const AppSysRoleController = Service([AppSysRoleService], service => {
  const router = Router();
  return (() => {
    router.get('/appSysRoles/fetch', (req, res, next) => {
      service
        .findAppSysRole({})
        .then(AppSysRoles => res.json( AppSysRoles ))
        .catch(next);
    });

    router.post('/appSysRoles/fetchAppSysRole', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(AppSysRoles => res.json( AppSysRoles ))
        .catch(next);
    });

    router.post('/appSysRoles/create', (req, res, next) => {
      service
        .createAppSysRole(req.body.AppSysRole)
        .then(AppSysRole => res.json({ AppSysRole }))
        .catch(next);
    });

    router.put('/appSysRoles/update', (req, res, next) => {
      const { AppSysRole } = req.body;
      const _id = AppSysRole._id;

      service
        .updateAppSysRole(_id, AppSysRole)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/appSysRoles/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteAppSysRole(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppSysRoleController;
