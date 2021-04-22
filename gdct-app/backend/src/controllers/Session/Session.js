import { Service } from 'typedi';
import { Router } from 'express';
import SessionService from '../../services/Session';

const SessionController = Service([SessionService], service => {
  const router = Router();
  return (() => {
    router.get('', (req, res, next) => {
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

    router.get('/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .findById(_id)
        .then(session => res.json(session))
        .catch(next);
    });

    router.put('/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .updateExpiration(_id, req.session.cookie.originalMaxAge)
        .then(session => res.json(session))
        .catch(next);
    })
    router.get('touch', (req, res, next) => {
      console.log(req.session);
      console.log('touch command has been sent')
    });
    return router;
  })();
});

export default SessionController;
