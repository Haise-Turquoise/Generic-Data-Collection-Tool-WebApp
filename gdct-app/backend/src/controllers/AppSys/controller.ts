import { Service } from 'typedi';
import { Router } from 'express';
import AppSysService from '../../services/AppSys';

const AppSysController = Service([AppSysService], service => {
  const router = Router();
  return (() => {
    router.get('/appSyses/searchAllAppSyses', (req, res, next) => {
      service
        .findAllAppSys()
        .then(AppSyses => res.json( AppSyses ))
        .catch(next);
    });

    router.post('/appSyses/fetchAppSys', (req, res, next) => {
      const { _id } = req.body;
      
      service
        .findAppSys(_id)
        .then(AppSys => res.json({ AppSys }))
        .catch(next);
    });

    router.post('/appSyses/create', (req, res, next) => {
      service
        .createAppSys(req.body.AppSys)
        .then(AppSys => res.json({ AppSys }))
        .catch(next);
    });

    router.post('/appSyses/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteAppSys(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/appSyses/update', (req, res, next) => {
      const { AppSys } = req.body;
      const _id = AppSys._id;

      service
        .updateAppSys(_id, AppSys)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppSysController;
