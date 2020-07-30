import { Service } from 'typedi';
import { Router } from 'express';
import MenuService from '../../services/Menu';

const MenuController = Service([MenuService], service => {
  const router = Router();
  return (() => {
    router.get('/menus', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findMenu({})
        .then(Menus => res.json({ Menus }))
        .catch(next);
    });

    router.get('/menus/:name', (req, res, next) => {
      // Get query from middleware -- auth handler
      console.log('working');
      service
        .findMenu(req.params.name)
        .then(Menus => res.json({ Menus }))
        .catch(next);
    });

    router.post('/menus', (req, res, next) => {
      service
        .createMenu(req.body.Menu)
        .then(Menu => {
          console.log(Menu);
          res.json({ Menu });
        })
        .catch(error => {
          console.error(error);
          throw error;
        })
        .catch(next);
    });

    router.put('/menus/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { Menu } = req.body;

      service
        .updateMenu(_id, Menu)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/menus/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteMenu(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.get('/menus/searchAllMenus', (req, res, next) => {
      service
        .findAllMenu()
        .then(menus => {
          res.json({ menus });
        })
        .catch(next);
    });

    return router;
  })();
});

export default MenuController;
