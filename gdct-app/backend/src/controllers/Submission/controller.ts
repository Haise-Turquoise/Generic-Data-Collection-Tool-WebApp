import { Service } from 'typedi';
import { Router } from 'express';
import SubmissionService from '../../services/Submission';
import { SubmissionPopulated } from '../../types/submission';
import UserSysRole from '../../types/usersysrole';

const SubmissionController = Service([SubmissionService], service => {
  const router = Router();
  return (() => {
    router.post('/submissions/findSubmissions', (req, res, next) => {
      // Get query from middleware -- auth handler
      const { email } = req.body;
      service
        .findSubmission(email)
        .then(submissions => {
          res.json({ submissions });
        })
        .catch(next);
    });

    router.post('/submissions/createSubmissions', (req, res, next) => {
      const { submissions } = req.body
      service
        .createSubmissions(submissions)
        .then(() => res.json({submissions}))
        .catch(next);

    })

    router.post('/submissions/findQuery', (req, res, next) => {
      const { query } = req.body
      
      service
        .findQuery(query)
        .then(submissions => res.json({ submissions }))
        .catch(next)
    })

    router.post('/submissions/findByRole', async (req, res, next) => {
      const { roles }: {roles:UserSysRole[]} = req.body

      const submissions = await service.findByRole(roles)
      res.json({ submissions })
    })

    router.post('/submissions/uploadSubmission', (req, res, next) => {
      const { submission, submissionNote } = req.body;

      service
        .uploadSubmissionWorkbook(submission, submission.workbookData, submissionNote)
        .then(submissions => res.json({ submissions }));
    });
    
    router.put('/submissions/updateSubmission', (req, res, next) => {
      // Get query from middleware -- auth handler
      const { submission } = req.body;

      service
        .updateSubmission(submission)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/submissions/updateSubmissionStatus', (req, res, next) => {
      // Get query from middleware -- auth handler
      const { submission, submissionNote, role, nextProcessId, updatedBy, statusChangedFlag } = req.body;

      service
        .updateStatus(submission, submissionNote, role, nextProcessId, updatedBy, statusChangedFlag)
        .then((data) => res.json({updatedSubmission:data}))
        .catch(next);
    });

    router.get('/submissions', (req, res, next) => {
      service
        .findSubmission({})
        .then(submissions => res.json({ submissions }))
        .catch(next);
    });

    router.post('/submissions/findSubmission', (req, res, next) => {
      const { _id } = req.body;

      service
        .findSubmissionById(_id)
        .then(submission => res.json({ submission }))
        .catch(next);
    });
    
    router.post('/findReportingPeriod', (req, res, next) => {
    const { _id } = req.body;
    
    service
    .findReportingPeriod(_id)
    .then(reportingPeriod => res.json({ reportingPeriod }))
    .catch(next);
    });
    
    router.post('/submissions/findSubmissionByParentId', (req, res, next) => {
      const { parentId } = req.body;

      service
        .findSubmissionByParentId(parentId)
        .then(submission => res.json({ submission }))
        .catch(next);
    });

    router.post('/submissions/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteSubmission(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default SubmissionController;