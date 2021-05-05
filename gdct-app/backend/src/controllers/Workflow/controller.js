import { Service } from 'typedi';
import { Router } from 'express';
import WorkflowService from '../../services/Workflow/Workflow';

const WorkflowController = Service([WorkflowService], service => {
  const router = Router();
  return (() => {
    router.get('/workflows/fetch', (req, res, next) => {
      service
        .findWorkflow({})
        .then(workflows => res.json( workflows ))
        .catch(next);
    });

    router.post('/workflows/create', (req, res, next) => {
      service
        .createWorkflow(req.body.workflowData)
        .then(workflow => res.json({ workflow }))
        .catch(next);
    });

    router.put('/workflows/update', (req, res, next) => {
      const { workflowData } = req.body; 
      const _id = workflowData.workflow._id;

      service
        .updateWorkflow(_id, workflowData)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/workflows/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteWorkflow(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/workflows/fetchById', (req, res, next) => {
      const { _id } = req.body;

      service
        .findWorkflowById(_id)
        .then(workflow => res.json({ data: workflow }))
        .catch(next);
    });

    router.post('/workflows/fetchOnlyWorkflowById', (req, res, next) => {
      const { _id } = req.body;

      service
        .findOnlyWorkflowById(_id)
        .then(workflow => res.json(workflow))
        .catch(next);
    })

    router.post('/workflows/fetchProcess', (req, res, next) => {
      const { _id } = req.body;

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
