import { Service } from 'typedi';
import { Router } from 'express';
import RoleWorkflowStatusService from '../../services/RoleWorkflowStatus';
import RoleWorkflowStatus from '../../types/RoleWorkflowStatus';


// Created by Sheldon on 2021/07/13
// Controller for RoleWorkflowStatus
const RoleWorkflowStatusController = Service([RoleWorkflowStatusService], service=>{
  const router = Router();
  return (()=>{
    router.post('/fetchByRole', (req, res, next)=>{
      const { role } = req.body;
      service
      .findByRole(role)
      .then((data)=>res.json({roleData:data}))
      .catch(next);
    })

    router.get('/findAll', (_req, res, next) => {
      service
        .findAll()
        .then((data) => res.json({roleData: data}))
        .catch(next)
    })

    router.post('/create', (req, res, next) => {
      const { item } = req.body;
      service
        .create(item)
        .then((data) => res.json({ roleData: data }))
        .catch(next)
    })

    router.post('/update', (req, res, next) => {
      const { _id, item }: {_id: string, item: Partial<RoleWorkflowStatus>} = req.body
      
      service
        .update(_id, item)
        .then(() => res.end())
        .catch(next)
    })

    return router
  })();
});

export default RoleWorkflowStatusController;