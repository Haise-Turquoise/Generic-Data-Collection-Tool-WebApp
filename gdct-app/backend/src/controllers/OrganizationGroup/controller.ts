import { Service } from 'typedi';
import { Router } from 'express';
import OrganizationGroupService from '../../services/OrganizationGroup';

const OrgGroupController = Service([OrganizationGroupService], service => {
  const router = Router();
  return (() => {
    router.get('/organization/group/fetch', (req, res, next) => {
      service
        .findOrgGroup({})
        .then(orgGroups => res.json( orgGroups ))
        .catch(next);
    });
    router.post('/organization/group/create', (req, res, next) => {
      service
        .createOrgGroup(req.body.organizationgroup)
        .then(organizationgroup => res.json({ organizationgroup }))
        .catch(next);
    });

    router.put('/organization/group/update', (req, res, next) => {
      const orgGroup = req.body.organizationgroup;
      const _id = orgGroup._id;
      service
        .updateOrgGroup(_id, orgGroup)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/organization/group/delete', (req, res, next) => {
      const _id = req.body._id;
      service
        .deleteOrgGroup(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/organization/group/searchOrgGroups', (req, res, next) => {
      const { ids } = req.body;

      service
        .findOrgGroupByIds(ids)
        .then(orgGroups => res.json( orgGroups ))
        .catch(next)
    });

    router.post('/organization/group/searchOrganizationGroup', (req, res, next) => {
      const { _id } = req.body;

      service
        .findOrgGroupById(_id)
        .then(orgGroup => res.json( orgGroup ))
        .catch(next)
    });
    return router;
  })();
});
 
export default OrgGroupController;
