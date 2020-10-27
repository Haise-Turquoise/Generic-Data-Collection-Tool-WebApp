import { Service } from 'typedi';
import { Router } from 'express';
import i18n from 'i18n';
import MenuService from '../../services/Menu';
import AppError from '../../utils/AppError';

const MenuController = Service([MenuService], service => {
  const router = Router();
  return (() => {
    router.get('/menus', (req, res, next) => {
      service
        .getAuthroizedMenus(req.session.roles)
        .then(res => {
          // throw new AppError(i18n.__('Menu.Controller.getMenus.error'));
          res.sort((a, b) => a.orderId - b.orderId);
          return res;
        })
        .then(Menus => {
          res.json({ Menus });
        })
        .catch(next);
      // }
    });

    router.get('/menus/:role', (req, res, next) => {
      service
        .getAuthroizedMenus([req.params.role])
        .then(Menus => {
          res.json({ Menus });
        })
        .catch(next);
      // }
    });

    router.get('/menus/:name', (req, res, next) => {
      service
        .findMenu(req.params.name)
        .then(Menus => res.json({ Menus }))
        .catch(next);
    });

    router.post('/menus', (req, res, next) => {
      service
        .createMenu(req.body.Menu)
        .then(Menu => {
          res.json({ Menu });
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
