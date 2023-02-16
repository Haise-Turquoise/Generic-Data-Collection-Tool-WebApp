import { Service } from 'typedi';
import { Router } from 'express';
import TransferStatusService from '../../services/TransferStatus'

const TransferStatusController = Service([TransferStatusService], service => {
  const router = Router();
  return (() => {
    router.post('/startService', (req, res, next) => {
      const { time } = req.body;

      service
        .startTransferProccess(time)
        .then(() => res.end())
        .catch(next);
    });

    router.get('/stopService', (req, res, next) => {
      service
        .closeCurrentTransferProcess()
        .then(() => res.end())
        .catch(next);
    });

    router.get('/getServiceStatus', (req, res, next) => {
      service
        .getTransferStatus()
        .then(status => res.json({status}))
        .catch(next);
    });

    return router;
  })();
});

export default TransferStatusController;
