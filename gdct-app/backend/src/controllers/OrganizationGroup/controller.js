import { Service } from 'typedi';
import { Router } from 'express';
import OrgGroupService from '../../services/OrganizationGroup';

const OrgGroupController = Service([OrgGroupService], service => {
  const router = Router();
  return (() => {
    router.get('/orgGroups/searchOrganizationGroup', (req, res, next) => {
      service
        .findAllOrgGroup()
        .then(orgGroups => {
          res.json({ orgGroups });
        })
        .catch(next);
    });

    return router;
  })();
});

export default OrgGroupController;
