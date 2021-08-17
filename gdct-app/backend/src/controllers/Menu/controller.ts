import { Service } from 'typedi';
import { Router } from 'express';
import MenuService from '../../services/Menu';

const MenuController = Service([MenuService], service => {
  const router = Router();
  return (() => {

    router.post('/Menus', (req, res, next) => {
      service
        // @ts-ignore
        .getAuthroizedMenus(req.body.role)
        .then(res => {
          res.sort((a, b) => a.orderId - b.orderId);
          return res;
        })
        .then(Menus => res.json({ Menus }))
        .catch(next);
    });

    return router;
  })();
});

export default MenuController;
