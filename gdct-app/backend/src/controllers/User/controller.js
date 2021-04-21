import { Service } from 'typedi';
import { Router } from 'express';
import UserService from '../../services/User';

const UserController = Service([UserService], service => {
  const router = Router();

  return (function () {
    router.post(`/users/registerUser`, (req, res, next) => {
      const { userData } = req.body;
      // console.log(userData)
      service.register(userData).catch(next);
    });
    router.get(`/:username`, (req, res, next) => {
      // console.log('reach backend controller')
      const { username } = req.params;
      // console.log(username)
      // return service.fetchUserByUserName(username)
      service
        .fetchUserByUserName(username)
        .then(user => {
          return res.json({ user });
        })
        .catch(next);
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

    // User Profile Update
    router.put(`/:_id`, (req, res, next) => {
      const { _id } = req.params;
      const { userData } = req.body;
      
      service
        .modifyUserInfo(_id, userData)
        .catch(next);
    });

    return router;
  })();
});

export default UserController;
