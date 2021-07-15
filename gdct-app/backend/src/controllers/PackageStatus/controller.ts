import { Service } from 'typedi';
import { Router } from 'express';
import PackageStatusService from '../../services/PackageStatus'

const PackageStatusController = Service([PackageStatusService], service => {
  const router = Router();
  return (() => {
    router.get('/packageStatus', (req, res, next) => {
      service
        .findAll()
        .then(packageStatus => res.json( packageStatus ))
        .catch(next);
    });

    return router;
  })();
});

export default PackageStatusController;
