import { Service } from 'typedi';
import { Router } from 'express';
import AppSysService from '../../services/AppSys';
//import { authorized } from '../../middlewares/auth/auth';

const AppSysController = Service([AppSysService], service => {
  const router = Router();
  return (() => {
    router.get('/appSyses/searchAllAppSyses', (req, res, next) => {
      service
        .findAllAppSys()
        .then(AppSyses => {
          res.json({ AppSyses });
        })
        .catch(next);
    });

    router.get('/appSyses/:_id', (req, res, next) => {
      // Get query from middleware -- auth handler
      const { _id } = req.params
      
      service
        .findAppSys(_id)
        .then(AppSys => res.json({ AppSys }))
        .catch(next);
    });

    router.post('/appSyses', (req, res, next) => {
      service
        .createAppSys(req.body.AppSys)
        .then(AppSys => res.json({ AppSys }))
        .catch(next);
    });

    router.put('/appSyses/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { AppSys } = req.body;

      service
        .updateAppSys(_id, AppSys)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/appSyses/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteAppSys(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppSysController;
