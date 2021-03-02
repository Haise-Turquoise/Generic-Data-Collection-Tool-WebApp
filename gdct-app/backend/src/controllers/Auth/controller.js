import { Service } from 'typedi';
import { Router } from 'express';
import AuthService from '../../services/Auth';

const AuthController = Service([AuthService], service => {
  const router = Router();
  return (() => {
    router.post('/login', service.processPassport, service.profile);
    router.post('/register', service.createUser);
    router.get('/auth/:method', service.authenticate);
    router.get('/auth/:method/callback', service.authenticateCallback);
    router.get('/profile', service.profile);
    router.get('/logout', service.logout);
    return router;
  })();
});

export default AuthController;
