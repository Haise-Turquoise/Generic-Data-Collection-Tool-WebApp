import { Service } from 'typedi';

import { Router } from 'express';
import UserService from '../../services/Users';

const UsersController = Service([UserService], service => {
  const router = Router();
  return (() => {
    router.get('/users/getUserInfo', (req, res, next) => {
      // Get query from middleware -- auth handler
      console.log(req.query);
      service
        .findUser(req.query)
        // .findUser(req.params)
        .then(users => res.json({ users }))
        .catch(next);
    });

    router.post('/users', (req, res, next) => {
      service
        .createUser(req.body.user)
        .then(user => res.json({ user }))
        .catch(next);
    });

    router.put('/users/updateUserInfo/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { user } = req.body;

      service
        .updateUser(_id, user)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/users/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteUser(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default UsersController;
