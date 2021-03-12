import { Service } from 'typedi';
import { Router } from 'express';
import AppConfigService from '../../services/AppConfig';
import { authorized } from '../../middlewares/auth/auth';

const AppConfigController = Service([AppConfigService], service => {
  const router = Router();
  return (() => {
    router.get('/appConfigs/searchAllAppConfigs', authorized, (req, res, next) => {console.log ('reach here')
      service
        .findAllAppConfig()
        .then(AppConfigs => res.json({ AppConfigs }))
        .catch(next);
    });

    router.get('/appConfigs/:_id', (req, res, next) => {
      const { _id } =req.params;

      service
        .findAppConfigById(_id)
        .then(AppConfig => res.json({ AppConfig }))
        .catch(next)
    });

    router.post('/appConfigs', authorized, (req, res, next) => {
      service
        .createAppConfig(req.body.AppConfig)
        .then(AppConfig => res.json({ AppConfig }))
        .catch(error => {
          console.error(error);
          throw error;
        })
        .catch(next);
    });

    router.put('/appConfigs/:_id', authorized, (req, res, next) => {
      const { _id } = req.params;
      const { AppConfig } = req.body;

      service
        .updateAppConfig(_id, AppConfig)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/appConfigs/:_id', authorized, (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteAppConfig(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppConfigController;
