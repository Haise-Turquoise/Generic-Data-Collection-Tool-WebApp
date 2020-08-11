import { Service } from 'typedi';
import { Router } from 'express';
import WorkflowService from '../services/Workflow';

const WorkflowController = Service([WorkflowService], service => {
  const router = Router();
  return (() => {
    router.get('/workflows', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findWorkflow({})
        .then(workflows => res.json({ data: workflows }))
        .catch(next);
    });

    router.get('/workflows/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .findWorkflowById(_id)
        .then(workflow => res.json({ data: workflow }))
        .catch(next);
    });

    router.post('/workflows', (req, res, next) => {
      service
        .createWorkflow(req.body.data)
        .then(workflow => res.json({ workflow }))
        .catch(next);
    });

    router.put('/workflows/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .updateWorkflow(_id, req.body.data)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/workflows/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteWorkflow(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.get('/workflows/workflowProcessId/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .findOutwardProcessesPopulated(_id)
        .then(workflowProcess => res.json({ data: workflowProcess }))
        .catch(next);
    });

    router.get('/workflows/workflowProcesses/fetchWorkflowProcesses', (req, res, next) => {
      service
        .findProcesses()
        .then(workflowProcess => res.json({ data: workflowProcess }))
        .catch(next);
    });

    return router;
  })();
});

export default WorkflowController;
