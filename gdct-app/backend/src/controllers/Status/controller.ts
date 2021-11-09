import { Service } from 'typedi';
import { Router } from 'express';
import StatusService from '../../services/Status';

const StatusController = Service([StatusService], service => {
  const router = Router();

  return (() => {
    router.get('/statuses/fetch', (req, res, next) => {
      service
        .findStatus({})
        .then(statuses => res.json( statuses ))
        .catch(next);
    });

    router.post('/statuses/fetchStatus', (req, res, next) => {
      const { _id } = req.body;
      
      service
        .findStatusById(_id)
        .then(status => res.json({ status }))
        .catch(next);
    });

    router.post('/statuses/fetchByName', (req, res, next) => {
      const { name } = req.body;

      service
        .findStatus({ name })
        .then(status => res.json({status}))
        .catch(next);
    })

    router.post('/statuses/create', (req, res, next) => {
      service
        .createStatus(req.body.status)
        .then(status => res.json({ status }))
        .catch(next);
    });

    router.put('/statuses/update', (req, res, next) => {
      const { status } = req.body;
      const _id = status._id;

      service
        .updateStatus(_id, status)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/statuses/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteStatus(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/statuses/findStatusByID', (req, res, next) => {
      const { _id } = req.body;

      service
        .findByID(_id)
        .then(data => res.json(data))
        .catch(next);
    });

    return router;
  })();
});

export default StatusController;
