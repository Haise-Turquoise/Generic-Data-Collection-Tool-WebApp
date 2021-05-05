import { Service } from 'typedi';
import { Router } from 'express';
import SessionService from '../../services/Session';

const SessionController = Service([SessionService], service => {
  const router = Router();
  return (() => {
    router.get('/fetch', (req, res, next) => {
      // @ts-ignore
      const expirationTime = new Date(req.session.cookie.expires);
      // console.log(moment(expirationTime));
      const expirationTimeLowerBound = new Date(expirationTime.getTime() - 3000);
      // console.log(moment(expirationTimeLowerBound));
      const expirationTimeUpperBound = new Date(expirationTime.getTime() + 3000);
      // console.log(moment(expirationTimeUpperBound));
      service
        .findByExpirationTime(expirationTimeLowerBound, expirationTimeUpperBound)
        .then(sessions => res.json(sessions))
        .catch(next);
    });

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
        .updateExpiration(_id, req.session.cookie.originalMaxAge)
        .then(session => res.json(session))
        .catch(next);
    })
    return router;
  })();
});

export default SessionController;
