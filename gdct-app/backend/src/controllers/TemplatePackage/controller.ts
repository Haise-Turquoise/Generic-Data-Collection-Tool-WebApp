import { Service } from 'typedi';
import { Router } from 'express';
import TemplatePackageService from '../../services/TemplatePackage';
import TemplatePackage from '../../entities/TemplatePackage';

const TemplatePackageController = Service([TemplatePackageService], service => {
  const router = Router();
  return (() => {
    router.get('/templatePackages/fetch', (req, res, next) => {
      service
        .findTemplatePackage(req.body)
        .then(templatePackages =>
          res.json(
            templatePackages.map((templatePackage: TemplatePackage) => ({
              ...templatePackage,
              templatePackageData: undefined,
            })),
          ),
        )
        .catch(next);
    });

    router.post('/templatePackages/fetchTemplatePackage', (req, res, next) => {
      const { _id }: TemplatePackage = req.body;

      service
        .findTemplatePackage({ _id })
        .then(([templatePackage]) => res.json(templatePackage))
        .catch(next);
    });

    router.post('/templatePackages/create', (req, res, next) => {
      service
        .createTemplatePackage(req.body.templatePackage)
        .then(templatePackage => res.json({ templatePackage }))
        .catch(next);
    });

    router.put('/templatePackages/update', (req, res, next) => {
      const { templatePackage } = req.body;
      const _id = templatePackage._id;

      service
        .updateTemplatePackage(_id, templatePackage)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/templatePackages/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteTemplatePackage(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/templatePackages/fetchPopulated', (req, res, next) => {
      const { _id } = req.body;

      service
        .findTemplatePackage({ _id }, true)
        .then(([templatePackage]) => res.json( templatePackage ))
        .catch(next);
    });

    router.post('/templatePackages/queryPopulated', (req, res, next) => {
      const { query } = req.body

      service
        .findTemplatePackage(query, true)
        .then((templatePackages) => res.json( templatePackages ))
        .catch(next)
    })

    router.put('/templatePackages/updatePopulated', (req, res, next) => {
      const { templatePackage } = req.body;
      const _id = templatePackage._id;

      service
        .updateTemplatePackage(_id, templatePackage, true)
        .then(templatePackage => res.json({ templatePackage }))
        .catch(error => console.error(error))
        .catch(next);
    });

    return router;
  })();
});

export default TemplatePackageController;
