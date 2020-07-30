import { Service } from 'typedi';
import { Router } from 'express';
import MenuItemService from '../../services/MenuItem';

const MenuItemController = Service([MenuItemService], service => {
  const router = Router();
  return (() => {
    router.get('/menuitems', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findMenuItem({})
        .then(MenuItems => res.json({ MenuItems }))
        .catch(next);
    });

    router.post('/menuitems', (req, res, next) => {
      service
        .createMenuItem(req.body.MenuItem)
        .then(MenuItem => res.json({ MenuItem }))
        .catch(error => {
          console.error(error);
          throw error;
        })
        .catch(next);
    });

    router.put('/menuitems/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { MenuItem } = req.body;

      service
        .updateMenuItem(_id, MenuItem)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/menuitems/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteMenuItem(_id)
        .then(() => res.end())
        .catch(next);
    });

    router.get('/menuitems/searchAllMenuitems', (req, res, next) => {
      service
        .findAllMenuItem()
        .then(menuitems => {
          res.json({ menuitems });
        })
        .catch(next);
    });

    return router;
  })();
});

export default MenuItemController;
