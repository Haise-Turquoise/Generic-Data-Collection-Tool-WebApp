import { Service } from 'typedi';
import { Router } from 'express';
import ProgramService from '../../services/Program';

const ProgramController = Service([ProgramService], service => {
  const router = Router();
  return (() => {
    router.get('/programs/fetch', (req, res, next) => {
      service
        .findProgram({})
        .then(programs => res.json( programs ))
        .catch(next);
    });

    router.post('/programs/create', (req, res, next) => {
      service
        .createProgram(req.body.program)
        .then(program => res.json({ program }))
        .catch(next);
    });

    router.put('/programs/update', (req, res, next) => {
      const { program } = req.body;
      const _id = program._id;

      service
        .updateProgram(_id, program)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/programs/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteProgram(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/programs/searchPrograms', (req, res, next) => {
      const { ids } = req.body;

      service
        .findProgramByIds(ids)
        .then(programs => res.json({ programs }))
        .catch(next)
    });

    router.post('/programs/searchProgram', (req, res, next) => {
      const { _id } = req.body;

      service
        .findProgramById(_id)
        .then(program => res.json({ program }))
        .catch(next)
    });

    return router;
  })();
});

export default ProgramController;
