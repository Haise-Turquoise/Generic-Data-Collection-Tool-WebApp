import { Service } from 'typedi';
import { Router } from 'express';
import AuthService from '../../services/Auth';
import auth from '../../middlewares/passport/passportAuth';

const AuthController = Service([AuthService], service => {
  const router = Router();
  return (() => {
    router.get('/logout', service.logout);
    router.get('/auth/:method', service.authenticate);
    router.get('/auth/:method/callback', service.authenticateCallback);
    router.get('/windows_auto_login', service.auto);
    // POST new user route (optional, everyone has access)
    router.post('/register', auth.optional, service.createUser);

    // POST login route (optional, everyone has access)
    router.post('/login', auth.optional, service.processLogin);
    router.get('/profile', service.profile);
    return router;
  })();
});

export default AuthController;
