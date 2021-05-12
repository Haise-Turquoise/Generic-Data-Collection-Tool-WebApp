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
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    // res.cookie('lang', 'fr');
    i18n.init(req, res);
    res.locals.__ = res.__;
    const currentLocale = i18n.getLocales();
    return next();
  });

  app.use('/', (req, res, next) => {
    console.log()
    if (req.session.roles) {
      const potentialSysRoles = req.user.sysRole;
      console.log("This person can be one of the following roles:");
      console.log(potentialSysRoles);
      console.log();
      
      const generalRole = req.session.roles[0];
      console.log("This person is currently logged in as this general role: " + generalRole);
      console.log();
      
      let loggedInAs = null;
      potentialSysRoles.forEach(sysRole => {
        if (sysRole.role === generalRole) {
          loggedInAs = sysRole.appSys + ' ' + sysRole.role;
        }
      });
      console.log("This person is currently logged in as this sys role: " + loggedInAs);
      console.log();
      
      const requestUrl = req.originalUrl;
      console.log("This person is currently trying to access url: " + requestUrl);
      console.log()

      // Business Admin has access to any Urls
      if (generalRole === "Business Admin") {
        return next()
      } else {
        let allowedUrls = [];
        AppRoleResourceModel.findOne({ 'appSysRoleId.roleName': loggedInAs }).then(appRoleResource => {
          // Check whether requestUrl is in the allowed Url list
          const allowedResources = appRoleResource.toObject().resourceId;
          allowedResources.forEach(Resource => {
            AppResourceModel.findById({ _id: Resource.id }).then(resource => {
              allowedUrls.push(resource.resourcePath);
              if (allowedUrls.length === allowedResources.length) {
                if (allowedUrls.includes(requestUrl)) {
                  console.log("ALLOWED");
                  // next();
                } else {
                  console.log("NOT ALLOWED");
                  return res.send("UNAUTHORIZED ACCESS");
                }
              }
            })
          })
        })
      }
    }
    
    // MAYBE NOT IN USE, BUT DO NOT DELETE
    // VALUABLE SECTION HERE: One way of getting current session/cookie id stored both on the webpage and in the database(in collection: sessions)
    // if (req.headers.cookie) {
    //   const startOfCookieID = req.headers.cookie.indexOf('connect.sid=') + ('connect.sid=').length + 4;
    //   const cookieID = req.headers.cookie.slice(startOfCookieID, startOfCookieID + 32);
    //   console.log(cookieID);
    // }
    next();
  });

  dbUtil.connect();
};
