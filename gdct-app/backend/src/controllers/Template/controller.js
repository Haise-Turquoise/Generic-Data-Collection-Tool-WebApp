import { Service } from 'typedi';
import { Router } from 'express';
import TemplateService from '../../services/Template';
import Template from '../../entities/Template';

const TemplateController = Service([TemplateService], service => {
  const router = Router();
  return (() => {
    router.get('/templates/fetchTemplate', (req, res, next) => {

      // Get query from middleware -- auth handler
      service
        .findTemplate(new Template(req.body))
        .then(templates =>
          res.json({
            templates: templates.map(template => ({ ...template, templateData: undefined })),
          }),
        )
        .catch(next);
    });

    router.get('/templates/:_id', (req, res, next) => {
      // Get query from middleware -- auth handler
      service
        .findTemplateById(req.params._id)
        .then(template => res.json({ template }))
        .catch(next);
    });

    router.post('/templates', (req, res, next) => {
      service
        .createTemplate(req.body.template)
        .then(template => res.json({ template }))
        .catch(next);
    });

    router.put('/templates/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { template } = req.body;

      service
        .updateTemplate(_id, template)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/templates/sheetUpdate/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { sheetData } = req.body;

      service
        .updateTemplateSheetData(_id, sheetData)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/templates/:_id/workflowProcess/:workflowProcessId', (req, res, next) => {
      const { _id, workflowProcessId } = req.params;

      service
        .updateTemplateWorkflowProcess(_id, workflowProcessId)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/templates/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteTemplate(_id)
        .then(() => res.end())
        .catch(next);
    });

    // Last Updated: Nov 27, 2020
    // Creates new google sheet and returns its spreadsheetID
    // It was developed to redirect the workflow from an embedded spreadsheet to Google Sheet
    router.get('/templates/openTemplate/:_id', (req, res, next) => {
      service
        .openTemplate(req.params._id, req.user.email)
        .then(spreadsheetID => { res.json({ spreadsheetID }) })
        .catch(next);
    });

    return router;
  })();
});

export default TemplateController;
