import { Service } from 'typedi';
import { Router } from 'express';
import RoleSubmissionButtonService from '../../services/RoleSubmissionButton';
import RoleSubmissionButton from '../../types/rolesubmissionbutton';


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

    router.post('/update', (req, res, next)=> {
      const { RoleSubmissionButton }: { RoleSubmissionButton: RoleSubmissionButton } = req.body;
      service
        .update(RoleSubmissionButton._id, RoleSubmissionButton)
        .then(() => res.end())
        .catch(next)
    })

    return router
  })();
});

export default RoleSubmissionButtonController;