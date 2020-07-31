import { Service } from 'typedi';
import { Router } from 'express';
import UserService from '../../services/User';

const UserController = Service([UserService], service => {
  const router = Router();

  return (function () {
    router.post(`/users/registerUser`, req => {
      const { userData } = req.body;
      service.register(userData);
    });

    router.get(`/users/verifyUser`, req => {
      const { approve, _id, hashedUsername, orgId } = req.query;
      service.sendActiveEmail(approve, _id, orgId);
    });

    router.get(`/users/activeUser`, req => {
      const { _id, hashedUsername } = req.query;
      service.activeUser(_id);
    });

    return router;
  })();
});

export default UserController;
