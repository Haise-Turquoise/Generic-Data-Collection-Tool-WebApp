import { Service } from 'typedi';
import { Router } from 'express';
import ProgramService from '../../services/Program';
import { authorized } from '../../middlewares/auth/auth';

const ProgramController = Service([ProgramService], service => {
  const router = Router();
  return (() => {
    router.get('/programs/fetchPrograms', authorized, (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findProgram({})
        .then(programs => res.json({ programs }))
        .catch(next);
    });

    router.post('/programs/createProgram', authorized, (req, res, next) => {
      service
        .createProgram(req.body.program)
        .then(program => res.json({ program }))
        .catch(error => {
          console.error(error);
          throw error;
        })
        .catch(next);
    });

    router.put('/programs/updateProgram/:_id', authorized, (req, res, next) => {
      const { _id } = req.params;
      const { program } = req.body;

      service
        .updateProgram(_id, program)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/programs/deleteProgram/:_id', authorized, (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteProgram(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/programs/searchPrograms', (req, res, next) => {
      const { ids } = req.body;

      service
        .findProgramByIds(ids)
        .then(programs => {
          res.json({ programs });
        })
        .catch(next);
    });

    return router;
  })();
});

export default ProgramController;
