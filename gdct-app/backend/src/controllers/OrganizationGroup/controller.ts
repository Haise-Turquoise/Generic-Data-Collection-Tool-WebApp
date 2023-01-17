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
      console.log(req.body.orgGroup + ' ling 15 ............');
      service
        .createOrgGroup(req.body.orgGroup)
        .then(orgGroup => res.json({ orgGroup }))
        .catch(next);
    });

    router.put('/organization/group/update', (req, res, next) => {
      const { orgGroup } = req.body;
      console.log(orgGroup);
      const _id = orgGroup._id;

      service
        .updateOrgGroup(_id, orgGroup)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/organization/group/delete', (req, res, next) => {
      const { _id } = req.body;
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

    router.post('/organization/group/searchOrgGroup', (req, res, next) => {
      const { _id } = req.body;

      service
        .findOrgGroupByIdSingleString(_id)
        .then(orgGroup => res.json( orgGroup ))
        .catch(next)
    });

    router.post(`/organization/group/getOrganizationGroupName`, (req, res, next) => {
      const { id } = req.body;
      service
        .findOrgGroupById(id)
        .then(orgGroup => res.json({ orgGroup }))
        .catch(next);
    });

    router.get('/organization/group/searchAllOrganizationGroup', (req, res, next) => {
      service
        .findAllOrgGroup()
        .then(orgGroups => res.json({ orgGroups }))
        .catch(next);
    });
    

    router.get('/organization/group/getOrganizationGroupIdByOrgName', (req, res, next) => {
      const { orgName  } = req.body;
      service
        .findAllOrgGroup()
        .then(orgGroupArray => res.json({ orgGroupArray }))
        .catch(next);
    });

    return router;
  })();
});
 
export default OrgGroupController;
