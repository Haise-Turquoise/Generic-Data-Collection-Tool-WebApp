import { Service } from 'typedi';
import { Router } from 'express';
import OrgService from '../../services/Organization';

const OrgController = Service([OrgService], service => {
  const router = Router();
  return (() => {
    router.get('/organizations/fetch', (req, res, next) => {
      const { query } = req.body
      
      service
        .findOrg(query)
        .then(Orgs => res.json( Orgs ))
        .catch(next);
    });

    router.post('/organizations/create', (req, res, next) => {
      service
        .createOrg(req.body.Org)
        .then(Org => res.json({ Org }))
        .catch(next);
    });

    router.put('/organizations/update', (req, res, next) => {
      const { Org } = req.body;
      const _id = Org._id;

      service
        .updateOrg(_id, req.body)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/organizations/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteOrg(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/organizations/fetchByOrgGroupId', (req, res) => {
      const { orgGroupId } = req.body;

      service
        .findOrgByOrgGroupId(orgGroupId)
        .then(organizations => res.json({ organizations }))
    });

    router.post('/organizations/fetchById', (req, res) => {
      const { Id } = req.body;
      
      service
        .findOrgById(Id)
        .then(organization => res.json(organization));
    });

    return router;
  })();
});

export default OrgController;
