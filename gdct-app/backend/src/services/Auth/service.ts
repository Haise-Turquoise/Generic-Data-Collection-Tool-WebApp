import passport from 'passport';
import Container from 'typedi';
import mongodb, { ObjectId, ObjectID } from 'mongodb';
import UserModel from '../../models/User/model';
import { returnNormalJson, returnErrorJson } from '../../utils';
import UserRepository from '../../repositories/User';
import AppRoleResourceRepository from '../../repositories/AppRoleResource';
import AppResourceRepository from '../../repositories/AppResource';
import AppSysRoleModel from '../../models/AppSysRole';
import { Request, Response, NextFunction } from 'express'
import User from '../../types/user';
import { CallbackError } from 'mongoose';
import { AppSysRoleDoc } from '../../types/appsysrole';
import UserEntity from '../../entities/User';

export default class AuthService {
  private UserRepository: UserRepository;
  private AppRoleResourceRepository: AppRoleResourceRepository;
  private AppResourceRepository: AppResourceRepository;

  constructor() {
    this.UserRepository = Container.get(UserRepository);
    this.AppRoleResourceRepository = Container.get(AppRoleResourceRepository);
    this.AppResourceRepository = Container.get(AppResourceRepository);
  }

  authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const { method } = req.params;
      passport.authenticate(method, { scope: 'email' })(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  authenticateCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { method } = req.params;
      console.log(method)
      
      // res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_SERVER);
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // res.header("Access-Control-Allow-Origin", req.header('Origin'));
      // res.header("Access-Control-Allow-Credentials", true);
      // res.header(
      // "Access-Control-Allow-Headers",
      // "Origin, X-Requested-With, Content-Type, Accept"
      // );
      // res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

      passport.authenticate(method, {
        successRedirect: process.env.CLIENT_SERVER, // redirect to home page
        failureRedirect: `${process.env.CLIENT_SERVER}/auth/error`, // redirect to error page
      })(req, res, async () => {
        //@ts-ignore
        console.log('HEADERS', res.headers)
        const { email } = (req.user as User);
        const user: UserEntity| void = await this.UserRepository.findByEmail(email);
        if (user) {
          //@ts-ignore 
          req.session.isAdmin = Boolean(user.sysRole.find(e => e.role === 'Business Admin'));
          //@ts-ignore
          req.session.resources = [];
          //@ts-ignore
          if (!req.session.isAdmin) {
            this.getRoles(user).then(data => {
              //@ts-ignore
              req.session.resources = data;
              if (req.user) {
                return next();
              }
              return returnErrorJson(res, 'Bad request');
            });
          } else {
            //@ts-ignore
            req.session.resources = [];
            next();
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  logout(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const email = req.session.user
      // If anyone knows what req.logout does, please contact David Yang
      req.logout();
      //@ts-ignore
      req.session.destroy(() => {});
      //For Audit Log
      const authService = new AuthService();
      authService.UserRepository.findByEmail(email).then(data => { returnNormalJson(res, data) })
    } catch (err) {
      next(err);
    }
  }

  profile(req: Request, res: Response, next: NextFunction) {
    
    try {
      if (req.body.email) {
        const authService = new AuthService();
        //@ts-ignore
        authService.UserRepository.findByEmail(req.body.email)
          .then(data => {
            // @ts-ignore
              data.sessionID = req.sessionID;
              returnNormalJson(res, data);
          })
      } else {
        returnErrorJson(res, 'Not authenticated', 401);
      }
    } catch (err) {
      next(err);
    }
  }

  createUser(req: Request, res: Response, next: NextFunction) {
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
      const appsysRole: {appSys: string, role: string, appSysRoleId: ObjectId, _id: ObjectId}[] = [];

      sysRoles.forEach((role: User["sysRole"]) => {
        AppSysRoleModel.findById(role, (_err: CallbackError, appsysrole: AppSysRoleDoc) => {
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

        // @ts-ignore
        finalUser.setHashedPassword(password);

        return finalUser
          .save()
          .then(user => {
            // @ts-ignore
            returnNormalJson(res, { email: user.email });
          })
          .catch(err => res.json({ error: err }));
      }, 1000);
    } catch (err) {
      next(err);
    }
  }

  // getting from JSON string
  getArrDataFromSet(set: Set<string>) {
    return Array.from(set).map(e => JSON.parse(e));
  }

  getRoles(user: UserEntity) {
    return new Promise(async (resolve, reject) => {
      const dataSet = new Set<string>();
      for (const sysRole of user.sysRole) {
        const roleResouce = await this.AppRoleResourceRepository.findByAppSysRoleId(
          sysRole.appSysRoleId,
        );
        for (const id of roleResouce.resourceId) {
          // @ts-ignore
          const resourcesData = await this.AppResourceRepository.findById(id);
          dataSet.add(JSON.stringify(resourcesData));
        }
      }
      const dataArr = this.getArrDataFromSet(dataSet);
      resolve(dataArr);
    });
  }

  processPassport(req: Request, res: Response, next: NextFunction) {
    try {
      const authService = new AuthService();
      return passport.authenticate('local')(req, res, async () => {
        const { email } = (req.user as User);
        const user = await authService.UserRepository.findByEmail(email);

        //@ts-ignore
        req.session.isAdmin = false;
        if (user) {
          const selectedRole = req.body.selectedRole || user.sysRole[0].role;
          //@ts-ignore
          req.session.role = selectedRole;
          //@ts-ignore
          req.session.isAdmin = (selectedRole === 'Business Admin');
          
          return next();
        }
        return returnErrorJson(res, 'Bad request');
      });
    } catch (err) {
      next(err);
    }
  }
}
