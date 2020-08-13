import passport from 'passport';
import Container from 'typedi';
import UserModel from '../../models/User/model';
import { returnNormalJson, returnErrorJson } from '../../utils';
import UserRepository from '../../repositories/User';
import AppRoleResourceRepository from '../../repositories/AppRoleResource';
import AppResourceRepository from '../../repositories/AppResource';
import AppSysRoleModel from '../../models/AppSysRole';
import mongodb from 'mongodb'
var ObjectID = mongodb.ObjectID

export default class AuthService {
  constructor() {
    this.UserRepostory = Container.get(UserRepository);
    this.AppRoleResourceRepository = Container.get(AppRoleResourceRepository);
    this.AppResourceRepository = Container.get(AppResourceRepository);
  }

  authenticate(req, res, next) {
    const { method } = req.params;
    passport.authenticate(method, { scope: 'email' })(req, res, next);
  }

  authenticateCallback(req, res) {
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
    });;
  }

  logout(req, res) {
    req.logout();
    req.session.user = null;
    req.session.token = null;
    returnNormalJson(res, 'logout successfully');
  }

  profile(req, res) {
    try {
      if (req.user) {
        returnNormalJson(res, { email: req.user.email });
      } else {
        returnErrorJson(res, 'Not authenticated', 401);
      }
    } catch (err) {
      throw err;
    }
  }

  createUser(req, res) {
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
    var appsysRole = []

    sysRoles.forEach(role => {
      AppSysRoleModel.findById(role, (err, appsysrole) => {
        appsysRole.push({
          appSys: appsysrole.appSys,
          role: appsysrole.role,
          appSysRoleId: appsysrole._id,
          _id: new ObjectID()
        })
      })
    })

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

    }, 1000)

  }

  getRoles = user => {
    return new Promise(async (resolve, reject) => {
      let data = [];
      for (const sysRole of user.sysRole) {
        if (sysRole.role !== 'Business Admin') {
          const roleResouce = await this.AppRoleResourceRepository.findByAppSysRoleId(sysRole.appSysRoleId);
          //const roleResouce = await this.AppRoleResourceRepository.findByAppSysRoleId(sysRole._id);
          for (const id of roleResouce.resourceId) {
            const resourcesData = await this.AppResourceRepository.findById(id);
            data.push(resourcesData);
          }
        }
        resolve(data);
      }
    });
  };

  processPassport = (req, res, next) =>
    passport.authenticate('local')(req, res, async () => {
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
}
