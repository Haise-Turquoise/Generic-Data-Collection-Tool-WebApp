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

    router.get(`/users/verifyUser`, (req, res) => {
      const { approve, _id, hashedUsername, orgId } = req.query;
      service.sendActiveEmail(approve, _id, orgId).then( res.json({ message: 'You have processed the email' }));
    });

    router.get(`/users/activeUser`, (req, res) => {
      const { _id, hashedUsername } = req.query;
      service.activeUser(_id).then( res.json({ message: 'You have activated the account' }));;
    });

    return router;
  })();
});

export default UserController;
