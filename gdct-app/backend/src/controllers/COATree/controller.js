import { Service } from 'typedi';
import { Router } from 'express';
import COATreeService from '../../services/COATree';
import COATreeEntity from '../../entities/COATree';

const COATreeController = Service([COATreeService], service => {
  const router = Router();
  return (() => {
    router.get('/COATrees', (req, res, next) => {
      // Get query from middleware -- auth

      service
        .findCOATree(new COATreeEntity(req.body))
        .then(COATrees =>
          res.json({ COATrees: COATrees.map(COATree => ({ ...COATree, COATreeData: undefined })) }),
        )
        .catch(next);
    });

    router.get('/COATrees/sheetName/:_id', (req, res, next) => {
      // Get query from middleware -- auth
      const { _id: sheetNameId } = req.params;
      // console.log('backend controller works');
      service
        .findCOATree(new COATreeEntity({ sheetNameId }))
        .then(COATrees =>
          res.json({ COATrees: COATrees.map(COATree => ({ ...COATree, COATreeData: undefined })) }),
        )
        .catch(next);
    });

    router.get('/COATrees/:_id', (req, res, next) => {
      // Get query from middleware -- auth handler
      const sheetNameId = req.params._id;

      service
        .findCOATree(new COATreeEntity({ sheetNameId }))
        .then(([COATree]) => res.json({ COATree }))
        .catch(next);
    });

    router.post('/COATrees', (req, res, next) => {
      service
        .createCOATree(req.body.COATree)
        .then(COATree => res.json({ COATree }))
        .catch(next);
    });

    router.put('/COATrees/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { COATree } = req.body;

      service
        .updateCOATree(_id, COATree)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/COATrees/sheetName/:_id', (req, res, next) => {
      const { _id: sheetNameId } = req.params;
      const { COATrees } = req.body;
      // console.log(COATrees)

      service
        .updateSheetCOATrees(sheetNameId, COATrees)
        .then(() => res.end())
        .catch(error => console.error(error))
        .catch(next);
    });

    router.delete('/COATrees/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteCOATree(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default COATreeController;
