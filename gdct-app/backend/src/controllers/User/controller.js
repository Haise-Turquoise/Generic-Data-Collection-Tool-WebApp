import { Service } from 'typedi';
import { Router } from 'express';
import UserService from '../../services/User';

const UserController = Service([UserService], service => {
  const router = Router();

  return (function () {
    router.post(`/users/registerUser`, (req, res, next) => {
      const { userData } = req.body;
      service.register(userData).catch(next);
    });

    router.get(`/users/verifyUser`, (req, res, next) => {
      const { approve, _id, hashedUsername, orgId } = req.query;
      service
        .sendActiveEmail(approve, _id, orgId)
        .then(res.json({ message: 'You have processed the email' }))
        .catch(next);
    });

    router.get(`/users/activeUser`, (req, res, next) => {
      const { _id, hashedUsername } = req.query;
      service
        .activeUser(_id)
        .then(res.json({ message: 'You have activated the account' }))
        .catch(next);
    });

    return router;
  })();
});

export default UserController;
