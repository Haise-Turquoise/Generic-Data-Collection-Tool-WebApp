import { Service } from 'typedi';
import { Router } from 'express';
import DataResumeService from '../../services/DataResume';

const DataResumeController = Service([DataResumeService], service => {
  const router = Router();
  return (() => {
    router.get('/dataResume/fetch', (req, res, next) => {
      service
        .findDataResume({})
        .then(dataResume => res.json({ dataResume }))
        .catch(next);
    });

    router.post('/dataResume/create', (req, res, next) => {
      service
        .createDataResume(req.body.dataResume)
        .then(dataResume => res.json({ dataResume }))
        .catch(next);
    });

    router.put('/dataResume/update', (req, res, next) => {
      const { dataResume } = req.body;

      service
        .updateDataResume(dataResume)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/dataResume/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteDataResume(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default DataResumeController;
