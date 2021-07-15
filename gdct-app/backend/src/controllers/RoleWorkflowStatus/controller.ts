import { Service } from 'typedi';
import { Router } from 'express';
import RoleWorkflowStatusService from '../../services/RoleWorkflowStatus';


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

    return router
  })();
});

export default RoleWorkflowStatusController;