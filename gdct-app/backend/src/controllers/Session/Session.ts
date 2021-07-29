import { Service } from 'typedi';
import { Router } from 'express';
import SessionService from '../../services/Session';

const SessionController = Service([SessionService], service => {
  const router = Router();
  return (() => {
    router.post('/fetchById', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(session => res.json(session))
        .catch(next);
    });

    router.put('/updateExpiration', (req, res, next) => {
      const { _id } = req.body;

      service
      //@ts-ignore
        .updateExpiration(_id, req.session.cookie.originalMaxAge)
        .then(session => res.json(session))
        .catch(next);
    })
    return router;
  })();
});

export default SessionController;
