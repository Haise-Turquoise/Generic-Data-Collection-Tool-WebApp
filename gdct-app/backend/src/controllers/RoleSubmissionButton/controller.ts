import { Service } from 'typedi';
import { Router } from 'express';
import RoleSubmissionButtonService from '../../services/RoleSubmissionButton';


// Created by Jie on 2021/07/29
// Controller for RoleSubmissionButton
const RoleSubmissionButtonController = Service([RoleSubmissionButtonService], service=>{
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

export default RoleSubmissionButtonController;