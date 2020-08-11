import { Service } from 'typedi';
import { Router } from 'express';
import AppSysService from '../../services/AppSys';
import { authorized } from '../../middlewares/auth/auth';

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

    router.get('/appSyses', authorized, (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findAppSys({})
        .then(AppSyses => res.json({ AppSyses }))
        .catch(next);
    });

    router.post('/appSyses', authorized, (req, res, next) => {
      service
        .createAppSys(req.body.AppSys)
        .then(AppSys => res.json({ AppSys }))
        .catch(error => {
          console.error(error);
          throw error;
        })
        .catch(next);
    });

    router.put('/appSyses/:_id', authorized, (req, res, next) => {
      const { _id } = req.params;
      const { AppSys } = req.body;

      service
        .updateAppSys(_id, AppSys)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/appSyses/:_id', authorized, (req, res, next) => {
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
