import { Service } from 'typedi';
import { Router } from 'express';
import MenuService from '../../services/Menu';

const MenuController = Service([MenuService], service => {
  const router = Router();
  return (() => {

    router.get('/Menus', (req, res, next) => {
      console.log('==================req session========================\n', req.session)
      console.log('==================req ========================\n', req)
      service
        // @ts-ignore
        .getAuthroizedMenus(req.session.role)
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
