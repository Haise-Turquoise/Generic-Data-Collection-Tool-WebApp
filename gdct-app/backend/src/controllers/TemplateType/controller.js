import { Service } from 'typedi';
import { Router } from 'express';
import TemplateTypeService from '../../services/TemplateType';
import { authorized } from '../../middlewares/auth/auth';

const TemplateTypeController = Service([TemplateTypeService], service => {
  const router = Router();
  return (() => {
    router.get('/templateTypes/fetchTemplateType', authorized, (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findTemplateType({})
        .then(templateTypes => res.json({ templateTypes }))
        .catch(next);
    });

    router.post('/templateTypes/createTemplateType', authorized, (req, res, next) => {
      service
        .createTemplateType(req.body.templateType)
        .then(templateType => res.json({ templateType }))
        .catch(next);
    });

    router.put('/templateTypes/updateTemplateType/:_id', authorized, (req, res, next) => {
      const { _id } = req.params;
      const { templateType } = req.body;

      service
        .updateTemplateType(_id, templateType)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/templateTypes/deleteTemplateType/:_id', authorized, (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteTemplateType(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/templateTypes/searchTemplateTypeByProgramIds', (req, res, next) => {
      const { programIds } = req.body;

      service
        .findTemplateTypeByProgramIds(programIds)
        .then(templateTypes => {
          res.json({ templateTypes });
        })
        .catch(next);
    });

    return router;
  })();
});

export default TemplateTypeController;
