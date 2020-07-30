import { Service } from 'typedi';
import { Router } from 'express';
import OrgService from '../../services/Organization';

const OrgController = Service([OrgService], service => {
  const router = Router();
  return (() => {
    router.get('/organizations/fetchOrganizations', (req, res, next) => {
      service
        .findOrg({})
        .then(Orgs => res.json({ Orgs }))
        .catch(next);
    });

    router.get(`/organizations/searchOrgByOrgGroupId/:orgGroupId`, (req, res) => {
      const { orgGroupId } = req.params;
      service.findOrgByOrgGroupId(orgGroupId).then(organizations => {
        res.json({ organizations });
      });
    });

    router.post('/organizations/createOrganization', (req, res, next) => {
      service
        .createOrg(req.body.Org)
        .then(Org => res.json({ Org }))
        .catch(error => {
          console.error(error);
          throw error;
        })
        .catch(next);
    });

    router.put('/organizations/updateOrganization/:_id', (req, res, next) => {
      const { _id } = req.params;
      service
        .updateOrg(_id, req.body)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/organizations/deleteOrganization/:_id', (req, res, next) => {
      const { _id } = req.params;
      service
        .deleteOrg(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default OrgController;
