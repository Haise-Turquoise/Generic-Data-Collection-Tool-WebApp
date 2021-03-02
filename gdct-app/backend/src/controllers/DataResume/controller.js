import { Service } from 'typedi';
import { Router } from 'express';
import DataResumeService from '../../services/DataResume';

const DataResumeController = Service([DataResumeService], service => {
  const router = Router();
  return (() => {
    router.get('/dataResume', (req, res, next) => {
      // Get query from middleware -- auth handler
      console.log('reach backend dataResume get')
      service
        .findDataResume({})
        .then(dataResume => res.json({ dataResume }))
        .catch(next);
    });

    router.post('/dataResume', (req, res, next) => {
      service
        .createDataResume(req.body.dataResume)
        .then(dataResume => res.json({ dataResume }))
        .catch(next);
    });

    router.put('/dataResume/', (req, res, next) => {
    //   const { _id } = req.params;
      
      const { dataResume } = req.body;
      console.log(dataResume)
      service
        .updateDataResume(dataResume)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/dataResume/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteDataResume(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default DataResumeController;