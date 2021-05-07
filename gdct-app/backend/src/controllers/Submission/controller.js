import { Service } from 'typedi';
import { Router } from 'express';
import SubmissionService from '../../services/Submission';
import { authorized } from '../../middlewares/auth/auth';

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

    router.get('/submissions/findReportingPeriod/:_id', (req, res, next) => {
      // Get query from middleware -- auth handler
      const { _id } = req.params;
      service
        .findReportingPeriod(_id)
        .then(reportingPeriod => {
          res.json({ reportingPeriod });
        })
        .catch(next);
    })

    router.put('/submissions/updateSubmission', authorized, (req, res, next) => {
      // Get query from middleware -- auth handler
      const { submission } = req.body;

      service
        .updateSubmission(submission)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/submissions/updateSubmissionStatus', authorized, (req, res, next) => {
      // Get query from middleware -- auth handler
      const { submission, submissionNote, role, nextProcessId, updatedBy } = req.body;

      service
        .updateStatus(submission, submissionNote, role, nextProcessId, updatedBy)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/submissions/uploadSubmission', authorized, (req, res, next) => {
      const { submission, submissionNote } = req.body;

      service
        .uploadSubmissionWorkbook(submission, submission.workbookData, submissionNote)
        .then(submissions => res.json({ submissions }));
    });

    router.get('/submissions', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findSubmission({}, '', [])
        .then(submissions => res.json({ submissions }))
        .catch(next);
    });

    router.get('/submissions/findSubmission/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .findSubmissionById(_id)
        .then(submission => res.json({ submission }))
        .catch(next);
    });



    router.get('/submissions/findSubmissionByParentId/:parentId', (req, res, next) => {
      const { parentId } = req.params;

      service
        .findSubmissionByParentId(parentId)
        .then(submission => res.json({ submission }))
        .catch(next);
    });

    router.post('/submissions', (req, res, next) => {
      service
        .createSubmission(req.body.submission)
        .then(submission => res.json({ submission }))
        .catch(next);
    });

    router.put('/submissions/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { submission } = req.body;

      service
        .updateSubmission(_id, submission)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/submissions/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteSubmission(_id)
        .then(() => res.end())
        .catch(next);
    });

    // Added on Nov 25, 2020
    // Creates new google sheet and returns its spreadsheetID
    // It was developed to redirect the workflow from an embedded spreadsheet to Google Sheet
    router.get('/submissions/openTemplate/:_id', (req, res, next) => {
      console.log('Here')
      service
        .openTemplate(req.params._id, req.user.email)
        .then(spreadsheetId => { res.json({ spreadsheetId }) })
        .catch(next);
    });

    return router;
  })();
});

export default SubmissionController;
