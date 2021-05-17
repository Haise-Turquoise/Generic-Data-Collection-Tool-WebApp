import { Service } from 'typedi';
import { Router } from 'express';
import TemplateService from '../../services/Template';
import Template from '../../entities/Template';

const TemplateController = Service([TemplateService], service => {
  const router = Router();
  return (() => {
    router.get('/templates/fetch', (req, res, next) => {
      service
        .findTemplate(new Template(req.body))
        .then(templates =>
          res.json( templates.map(template => ({ ...template, templateData: undefined })) ),
        )
        .catch(next);
    });

    router.post('/templates/fetchTemplate', (req, res, next) => {
      const { _id } = req.body;

      service
        .findTemplateById(_id)
        .then(template => res.json( template ))
        .catch(next);
    });

    router.post('/templates/create', (req, res, next) => {
      service
        .createTemplate(req.body.template)
        .then(template => res.json({ template }))
        .catch(next);
    });

    router.put('/templates/update', (req, res, next) => {
      const { template } = req.body;
      const _id = template._id;

      service
        .updateTemplate(_id, template)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/templates/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteTemplate(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/templates/sheetUpdate', (req, res, next) => {
      const { id, sheetData } = req.body;
      service
        .updateTemplateSheetData(id, sheetData)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/templates/workflowProcess', (req, res, next) => {
      const { _id, workflowProcessId } = req.body;

      service
        .updateTemplateWorkflowProcess(_id, workflowProcessId)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default TemplateController;
