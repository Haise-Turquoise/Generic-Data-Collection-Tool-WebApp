import { Service } from 'typedi';
import { Router } from 'express';
import COATreeService from '../../services/COATree';
import COATreeEntity from '../../entities/COATree';
import { CategoryTreeDoc } from '../../types/categorytree';
import { Schema } from 'mongoose'

const COATreeController = Service([COATreeService], service => {
  const router = Router();
  return (() => {
    // SUSPECT: NOT IN USE
    // router.post('/COATrees/fetchCOATree', (req, res, next) => {
    //   const { sheetNameId } = req.body;

    //   console.log(sheetNameId);
    //   service
    //     .findCOATree(new COATreeEntity({ sheetNameId }))
    //     .then(([COATree]) => res.json({ COATree }))
    //     .catch(next);
    // });

    router.post('/COATrees/sheetName/fetchBySheetName', (req, res, next) => {
      const { sheetNameId } = req.body;

      service
        // @ts-ignore
        .findCOATree(new COATreeEntity({ sheetNameId }))
        .then((COATrees: CategoryTreeDoc[]) =>
          res.json({ COATrees: COATrees.map(COATree => ({ ...COATree, COATreeData: undefined })) }),
        )
        .catch(next);
    });

    router.post('/COATrees/sheetName/fetchBySheetNames', (req, res, next) => {
      const { sheetNameIds }: { sheetNameIds: string[] } = req.body;
      const allTreePromises: Promise<CategoryTreeDoc>[] = []
      sheetNameIds.forEach(sheetNameId => {
        // TODO is this working? SUPER weird..
        allTreePromises.push(service.findCOATree({ sheetNameId: new Schema.Types.ObjectId(sheetNameId) }))
      })
      Promise.all(allTreePromises)
        .then(COATrees => {
          // need to spread out trees before returning
          const spreadTrees: CategoryTreeDoc[] = []
          // TODO test this to see how to proceed
          //@ts-ignore
          COATrees.forEach(tree => spreadTrees.push(...tree))
          res.json({ COATrees: spreadTrees })
        })
        .catch(next)
    })

    router.get('/COATrees/fetch', (req, res, next) => {
      service
        .findCOATree(new COATreeEntity(req.body))
        .then((COATrees: CategoryTreeDoc[]) =>
          res.json({ COATrees: COATrees.map(COATree => ({ ...COATree, COATreeData: undefined })) }),
        )
        .catch(next);
    });

    router.post('/COATrees/create', (req, res, next) => {
      service
        .createCOATree(req.body.COATree)
        .then(COATree => res.json({ COATree }))
        .catch(next);
    });

    router.put('/COATrees/update', (req, res, next) => {
      const { COATree } = req.body;
      const _id = COATree._id;

      service
        .updateCOATree(_id, COATree)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/COATrees/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteCOATree(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.put('/COATrees/sheetName/updateBySheetName', (req, res, next) => {
      const { sheetNameId, COATrees } = req.body;

      service
        .updateSheetCOATrees(sheetNameId, COATrees)
        .then(() => res.end())
        .catch(error => console.error(error))
        .catch(next);
    });

    return router;
  })();
});

export default COATreeController;
