import { Service } from 'typedi';

import { Router } from 'express';
import UserService from '../../services/Users';

const UsersController = Service([UserService], service => {
  const router = Router();
  return (() => {
    router.post('/fetch', (req, res, next) => {
      const { query } = req.body;

      service
        .findUser(query)
        .then(users => res.json( users ))
        .catch(next);
    });

    router.post('/fetchById', (req, res, next) => {
      const { _id } = req.body;

      service
        .findUserById(_id)
        .then(user => res.json( user ))
        .catch(next);
    });

    router.post('/fetchByEmail', (req, res, next) => {
      const { userEmail } = req.body;

      service
        .findUserByEmail(userEmail)
        .then(user => res.json( user ))
        .catch(next);
    });

    router.post('/create', (req, res, next) => {
      service
        .createUser(req.body.user)
        .then(user => res.json({ user }))
        .catch(next);
    });

    router.put('/update', (req, res, next) => {
      const { user } = req.body;
      const _id = user._id;

      service
        .updateUser(_id, user)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteUser(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default UsersController;
