import { Service } from 'typedi';
import { Router } from 'express';
import AttributeConfigService from '../../services/AttributeConfig';

const AttributeConfigController = Service([AttributeConfigService], service => {
  const router = Router();
  return (() => {
    router.post('/AttributeConfigs/fetchAttributeConfig', (req, res, next) => {
      const { _id } = req.body;

      service
        .findAttributeConfigById(_id)
        .then(AttributeConfig => res.json({ AttributeConfig }))
        .catch(next)
    });

    router.get('/AttributeConfigs/searchAllAttributeConfigs', (req, res, next) => {
        console.log("Request");
      service
        .findAllAttributeConfig()
        .then(AttributeConfigs => res.json( AttributeConfigs ))
        .catch(next);
    });

    router.post('/AttributeConfigs/create', (req, res, next) => {
      service
        .createAttributeConfig(req.body.AttributeConfig)
        .then(AttributeConfig => res.json({ AttributeConfig }))
        .catch(next);
    });

    router.post('/AttributeConfigs/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteAttributeConfig(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/AttributeConfigs/update', (req, res, next) => {
      const _id = req.body._id;
      const AttributeConfig = req.body.AttributeConfig;

      service
        .updateAttributeConfig(_id, AttributeConfig)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default AttributeConfigController;
