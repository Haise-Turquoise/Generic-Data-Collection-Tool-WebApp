import { Service } from 'typedi';
import { Router } from 'express';
import UnitOfMeasurementService from '../../services/UnitOfMeasurement';

const UnitOfMeasurementController = Service([UnitOfMeasurementService], service => {
  const router = Router();

  return (function () {
    // Get All Audit Logs
    router.get('/fetchAllUnits', (req, res, next) => {
      service
        .findAllUnits()
        .then(units => res.json(units))
        .catch(next)
    })
    
    // Create one Audit Log
    router.post('/createUnit', (req, res, next) => {
      const { unit } = req.body;
      console.log('what is', unit)
      service
        .createUnit(unit)
        .then(unit => res.json(unit))
        .catch(next)
    });

    router.patch('/updateUnit', (req, res, next) => {
      const { unit } = req.body
      
      service
        .updateUnit(unit)
        .then(unit => res.status(200).json({unit}))
        .catch(next)
    })

    router.post('/fetchByUnit', (req, res, next) => {
      const { unit } = req.body;
      
      service
        .findByUnit(unit)
        .then(unit => res.json(unit))
        .catch(next)
    })

    router.post('/delete', (req, res, next) => {
      const { id } = req.body

      service
        .delete(id)
        .then(() => res.json({message: "success"}))
        .catch(next)
    })

    return router;
  })();
});
  
export default UnitOfMeasurementController;
