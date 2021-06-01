import { Service } from 'typedi';
import { Router } from 'express';
import AppConfigService from '../../services/AppConfig';

const AppConfigController = Service([AppConfigService], service => {
  const router = Router();
  return (() => {
    router.post('/appConfigs/fetchAppConfig', (req, res, next) => {
      const { _id } = req.body;

      service
        .findAppConfigById(_id)
        .then(AppConfig => res.json({ AppConfig }))
        .catch(next)
    });

    router.post('/appConfigs/fetchSessionCheckingPeriod', (req, res, next) => {
      service
        .findSessionCheckingPeriod()
        .then(SessionCheckingPeriod => res.json( SessionCheckingPeriod ))
        .catch(next)
    });

    router.get('/appConfigs/searchAllAppConfigs', (req, res, next) => {
      service
        .findAllAppConfig()
        .then(AppConfigs => res.json( AppConfigs ))
        .catch(next);
    });

    router.get('/appConfigs/validationThreshold', (req, res, next) => {
      service
        .findValidationThreshold()
        .then(thershold => res.json( thershold ))
        .catch(next);
    });

    router.get('/appConfigs/attributeRow', (req, res, next) => {
      service
        .findAttributeRow()
        .then(thershold => res.json( thershold ))
        .catch(next);
    });

    router.post('/appConfigs/create', (req, res, next) => {
      service
        .createAppConfig(req.body.AppConfig)
        .then(AppConfig => res.json({ AppConfig }))
        .catch(next);
    });

    router.post('/appConfigs/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteAppConfig(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/appConfigs/update', (req, res, next) => {
      const _id = req.body._id;
      const AppConfig = req.body.AppConfig;

      service
        .updateAppConfig(_id, AppConfig)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AppConfigController;
