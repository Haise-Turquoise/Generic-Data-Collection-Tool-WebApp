import { Service } from 'typedi';
import { Router } from 'express';
import AuthService from '../../services/Auth';
// import auth from '../../middlewares/passport/passportAuth';
import auth from '../../middlewares/auth';
import { authorized } from '../../middlewares/auth/auth';

const AuthController = Service([AuthService], service => {
  const router = Router();
  return (() => {
    router.get('/logout', service.logout);
    router.get('/auth/:method', service.authenticate);
    router.get('/auth/:method/callback', service.authenticateCallback);
    
    // POST new user route (optional, everyone has access)
    router.post('/register', service.createUser);

    // POST login route (optional, everyone has access)
    router.post('/login', service.processPassport, service.profile);
    router.get('/profile', service.profile);
    return router;
  })();
});

export default AuthController;
