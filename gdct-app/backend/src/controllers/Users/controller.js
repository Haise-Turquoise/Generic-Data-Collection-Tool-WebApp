import { Service } from 'typedi';

import { Router } from 'express';
import UserService from '../../services/Users';

const UsersController = Service([UserService], service => {
  const router = Router();
  return (() => {
    router.get('/getUserInfo', (req, res, next) => {
      // Get query from middleware -- auth handler
      service
        .findUser(req.query)
        .then(users => res.json({ users }))
        .catch(next);
    });

    router.get('/fetchByEmail/:email', (req, res, next) => {
      const { email } = req.params;

      service
        .findUserByEmail(email)
        .then(user => res.json( user ))
        .catch(next);
    })

    router.get('/fetchById', (req, res, next) => {
      service
        .findUserById(req.query._id)
        .then(user => res.json( user ))
        .catch(next);
    })

    router.post('', (req, res, next) => {
      service
        .createUser(req.body.user)
        .then(user => res.json({ user }))
        .catch(next);
    });

    router.put('/updateUserInfo/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { user } = req.body;

      service
        .updateUser(_id, user)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/:_id', (req, res, next) => {
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
