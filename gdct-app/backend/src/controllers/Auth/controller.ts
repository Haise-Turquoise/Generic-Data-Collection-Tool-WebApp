import { Service } from 'typedi';
import { Router } from 'express';
import AuthService from '../../services/Auth';

const AuthController = Service([AuthService], service => {
  const router = Router();
  return (() => {
    router.post('/login', (req, res, next) => {console.log('===req===',req.body);return service.processPassport(req, res, next)}, service.profile);
    router.post('/register', service.createUser);
    router.get('/profile', (req, res, next) => {console.log('===req profile===',req.body); next()},service.profile);
    router.get('/logout', service.logout);
    return router;
  })();
});

export default AuthController;
