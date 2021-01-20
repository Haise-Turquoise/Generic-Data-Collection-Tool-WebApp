import passport from 'passport';
import Container from 'typedi';
import mongodb from 'mongodb';
import i18n from 'i18n';
import { nextTick } from 'process';
import UserModel from '../../models/User/model';
import { returnNormalJson, returnErrorJson } from '../../utils';
import UserRepository from '../../repositories/User';
import AppRoleResourceRepository from '../../repositories/AppRoleResource';
import AppResourceRepository from '../../repositories/AppResource';
import AppSysRoleModel from '../../models/AppSysRole';
import AppError from '../../utils/AppError';

const { ObjectID } = mongodb;

export default class AuthService {
  constructor() {
    this.UserRepostory = Container.get(UserRepository);
    this.AppRoleResourceRepository = Container.get(AppRoleResourceRepository);
    this.AppResourceRepository = Container.get(AppResourceRepository);
  }

  authenticate(req, res, next) {
    try {
      const { method } = req.params;
      passport.authenticate(method, { scope: 'email' })(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  authenticateCallback(req, res, next) {
    try {
      const { method } = req.params;
      res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_SERVER);
      passport.authenticate(method, {
        successRedirect: process.env.CLIENT_SERVER, // redirect to home page
        failureRedirect: `${process.env.CLIENT_SERVER}/auth/error`, // redirect to error page
      })(req, res, async () => {
        const { email } = req.user;
        const user = await this.UserRepostory.findByEmail(email);
        if (user) {
          req.session.isAdmin = Boolean(user.sysRole.find(e => e.role === 'Business Admin'));
          req.session.resources = [];
          if (!req.session.isAdmin) {
            this.getRoles(user).then(data => {
              req.session.resources = data;
              if (req.user) {
                return next();
              }
              return returnErrorJson(res, 'Bad request');
            });
          } else {
            req.session.resources = [];
            next();
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  logout(req, res, next) {
    try {
      req.logout();
      req.session.user = null;
      req.session.token = null;
      returnNormalJson(res, 'logout successfully');
    } catch (err) {
      next(err);
    }
  }

  profile(req, res, next) {
    try {
      
      if (req.user) {
        returnNormalJson(res, { email: req.user.email });
        // returnErrorJson(res, 'Not authenticated', 401);
      } else {
        
        returnErrorJson(res, 'Not authenticated', 401);
        
        
      }
      // }, 10000)
    } catch (err) {
      next(err);
    }
  }

  createUser(req, res, next) {
    try {
      const {
        body: { email, password, firstName, lastName, username, title, phoneNumber, ext, sysRoles },
      } = req;

      if (!email) {
        return res.status(422).json({
          errors: {
            email: 'is required',
          },
        });
      }

      if (!password) {
        return res.status(422).json({
          errors: {
            password: 'is required',
          },
        });
      }
      const appsysRole = [];

      sysRoles.forEach(role => {
        AppSysRoleModel.findById(role, (err, appsysrole) => {
          appsysRole.push({
            appSys: appsysrole.appSys,
            role: appsysrole.role,
            appSysRoleId: appsysrole._id,
            _id: new ObjectID(),
          });
        });
      });

      setTimeout(() => {
        const finalUser = new UserModel({
          email,
          password,
          firstName,
          lastName,
          username,
          title,
          phoneNumber,
          ext,
          sysRole: appsysRole,
          isActive: true,
        });

        finalUser.setHashedPassword(password);

        return finalUser
          .save()
          .then(user => {
            returnNormalJson(res, { email: user.email });
          })
          .catch(err => res.json({ error: err }));
      }, 1000);
    } catch (err) {
      next(err);
    }
  }

  getArrDataFromSet(set) {
    return Array.from(set).map(e => JSON.parse(e));
  }

  getRoles(user) {
    return new Promise(async (resolve, reject) => {
      const dataSet = new Set();
      for (const sysRole of user.sysRole) {
        const roleResouce = await this.AppRoleResourceRepository.findByAppSysRoleId(
          sysRole.appSysRoleId,
        );
        for (const id of roleResouce.resourceId) {
          const resourcesData = await this.AppResourceRepository.findById(id);
          dataSet.add(JSON.stringify(resourcesData));
        }
      }
      const dataArr = this.getArrDataFromSet(dataSet);
      resolve(dataArr);
    });
  }

  processPassport(req, res, next) {
    try {
      const authService = new AuthService();
      return passport.authenticate('local')(req, res, async () => {
        const { email } = req.user;
        const user = await authService.UserRepostory.findByEmail(email);
        
        req.session.roles = [];
        req.session.isAdmin = false;
        if (user) {
          user.sysRole.forEach(e => {
            req.session.roles.push(e.role);
            if (e.role === 'Business Admin') {
              req.session.isAdmin = true;
            }
          });
          return next();
        }
        console.log('Bad request')
        return returnErrorJson(res, 'Bad request');
      });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }
}
