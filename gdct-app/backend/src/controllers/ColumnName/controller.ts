import { Service } from 'typedi';
import { Router } from 'express';
import ColumnNameService from '../../services/ColumnName';

const ColumnNameController = Service([ColumnNameService], service => {
  const router = Router();
  return (() => {
    router.get('/columnNames/fetch', (req, res, next) => {
      service
        .findColumnName({})
        .then(columnNames => res.json( columnNames ))
        .catch(next);
    });

    router.post('/columnNames/fetchAttribute', (req, res, next) => {
      const { _id } = req.body;

      service
        .findById(_id)
        .then(columnName => res.json( columnName ))
        .catch(next);
    });

    router.post('/columnNames/create', (req, res, next) => {
      service
        .createColumnName(req.body.columnName)
        .then(columnName => res.json({ columnName }))
        .catch(next);
    });

    router.put('/columnNames/update', (req, res, next) => {
      const { columnName } = req.body;
      const _id = columnName._id;

      service
        .updateColumnName(_id, columnName)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/columnNames/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteColumnName(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default ColumnNameController;
