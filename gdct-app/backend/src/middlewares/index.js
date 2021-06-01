import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import mongoStore from 'connect-mongo';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import i18n from 'i18n';
import path from 'path';
import { dbUtil } from './db';
import customLogger from '../utils/log/customLogger';
import AppRoleResourceModel from '../models/AppRoleResource';
import AppResourceModel from '../models/AppResource';
import UserModel from '../models/User';

i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, '../configs/locales'),
  defaultLocale: 'en',
  cookie: 'lang',
});

export const middlewares = app => {
  // @ts-ignore
  require('./passport')();
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true }));
  app.use(cors({ credentials: true, origin: process.env.CLIENT_SERVER }));
  app.use(compression());
  app.use(customLogger);

  const CookieStore = mongoStore(session);
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      // saveUninitialized can only be false in here!
      saveUninitialized: false,
      rolling: true,
      cookie: { maxAge: 30 * 60 * 1000 },
      store: new CookieStore({ mongooseConnection: mongoose.connection }),
    }),
  );
  
  let allowedUrls = [];
  let isLoggedIn = false;
  app.use('/', async (req, res, next) => {
    const requestUrl = req.originalUrl;
    
    // During the logging in process, fetch all allowed requestUrls for this user
    if (!isLoggedIn && requestUrl === '/login' && req.body.selectedRole !== undefined) {
      // Fetching
      const user = await UserModel.findOne({ email: req.body.email });
      let loggedInSysRole = user.sysRole.find(sysRole => sysRole.role === req.body.selectedRole);
      // *** Set the role to be the first available role for this user as the default role 
      // *** because autofill feature would make the user role empty
      if (!loggedInSysRole) loggedInSysRole = user.sysRole[0];

      const loggedInAs = loggedInSysRole.appSys + ' ' + loggedInSysRole.role;
      const allowedRoleResource = await AppRoleResourceModel.findOne({ 'appSysRoleId.roleName': loggedInAs });
      const allowedResources = allowedRoleResource.toObject().resourceId;
      const promise = allowedResources.map(async allowedResource => {
        const resource = await AppResourceModel.findById({ _id: allowedResource.id });
        if (resource === null) {
          console.log("Resource: " + allowedResource.resourceName + " not found due to a mismatch of id/name!");
        } else{
          return resource.resourcePath;
        }
      })
      Promise.all(promise).then(result => allowedUrls = result);
      // The user is logged in
      isLoggedIn = true;
    };

    // Check whether a logged in user is allowed to access requestUrls
    if (isLoggedIn && requestUrl !== '/login') {
      if (allowedUrls.includes(requestUrl)) {
        // console.log("ALLOWED");
      } else {
        console.log("NOT ALLOWED");
        return res.send("UNAUTHORIZED ACCESS");
      }
    };

    // Clear all stored data for completing logout
    if (isLoggedIn && requestUrl === '/logout') { allowedUrls = []; isLoggedIn = false };
    
    // MAYBE NOT IN USE, BUT DO NOT DELETE
    // VALUABLE SECTION HERE: One way of getting current session/cookie id stored both on the webpage and in the database(in collection: sessions)
    // if (req.headers.cookie) {
    //   const startOfCookieID = req.headers.cookie.indexOf('connect.sid=') + ('connect.sid=').length + 4;
    //   const cookieID = req.headers.cookie.slice(startOfCookieID, startOfCookieID + 32);
    //   console.log(cookieID);
    // }
    next();
  });
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    // res.cookie('lang', 'fr');
    i18n.init(req, res);
    res.locals.__ = res.__;
    const currentLocale = i18n.getLocales();
    return next();
  });

  dbUtil.connect();
};
