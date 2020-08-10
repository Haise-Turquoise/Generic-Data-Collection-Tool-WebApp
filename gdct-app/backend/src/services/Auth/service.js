import passport from 'passport';
import mongoose from 'mongoose';
import os from 'os';
import Container from 'typedi';
import UserModel from '../../models/User/model';
import { returnNormalJson, returnErrorJson } from '../../utils';
import UserRepository from '../../repositories/User';
import AppRoleResourceRepository from '../../repositories/AppRoleResource';
import AppResourceRepository from '../../repositories/AppResource';

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
    })(req, res);
  }

  logout(req, res) {
    req.logout();
    returnNormalJson(res, 'logout successfully');
  }

  auto(req, res) {
    const temp = mongoose.Types.ObjectId('5efb8b638464c20f646049a6');
    const uname = os.userInfo().username;
    UserModel.find({ AppConfig: temp }, function (err, user1) {
      let found = false;
      user1.forEach(obj => {
        if (obj.username === uname) {
          found = true;
          req.session.user = user1;
          res.send(true);
        }
      });
      if (!found) {
        res.send(false);
      }
    });
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

    const finalUser = new UserModel({
      email,
      password,
      firstName,
      lastName,
      username,
      title,
      phoneNumber,
      ext,
      sysRoles,
    });

    finalUser.setHashedPassword(password);

    return finalUser
      .save()
      .then(user => {
        returnNormalJson(res, { email: user.email });
      })
      .catch(err => res.json({ error: err }));
  }

  getRoles = user => {
    return new Promise(async (resolve, reject) => {
      let data = [];
      for (const sysRole of user.sysRole) {
        const roleResouce = await this.AppRoleResourceRepository.findByAppSysRoleId(sysRole._id);
        for (const id of roleResouce.resourceId) {
          const resourcesData = await this.AppResourceRepository.findById(id);
          data.push(resourcesData);
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
        req.session.isAdmin = Boolean(
          user.sysRole.find(e => {
            // console.log('service-role:', e.role);
            return e.role === 'Business Admin';
          }),
        );
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
          next();
        }
      }
    });
}
