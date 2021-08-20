import { Service } from 'typedi';
import { Router } from 'express';
import TemplateTypeService from '../../services/TemplateType';

const TemplateTypeController = Service([TemplateTypeService], service => {
  const router = Router();
  return (() => {
    router.get('/templateTypes/fetch', (req, res, next) => {
      service
        .findTemplateType({})
        .then(templateTypes => res.json( templateTypes ))
        .catch(next);
    });

    router.post('/templateTypes/fetchById', (req, res, next) => {
      const { _id } = req.body;
      
      service
        .findById(_id)
        .then(templateType => res.json(templateType))
        .catch(next)
    })

    router.post('/templateTypes/fetchByProgramIds', (req, res, next) => {
      const { programIds } = req.body;

      service
        .findTemplateTypeByProgramIds(programIds)
        .then(templateTypes => {
          res.json({ templateTypes });
        })
        .catch(next);
    });
    
    router.post('/templateTypes/create', (req, res, next) => {
      service
        .createTemplateType(req.body.templateType)
        .then(templateType => res.json({ templateType }))
        .catch(next);
    });

    router.put('/templateTypes/update', (req, res, next) => {
      const { templateType } = req.body;
      const _id = templateType._id;

      service
        .updateTemplateType(_id, templateType)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/templateTypes/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteTemplateType(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default TemplateTypeController;
