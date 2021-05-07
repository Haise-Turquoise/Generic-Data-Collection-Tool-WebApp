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
      cookie: { maxAge: 70 * 1000 },
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

  let isAdmin = false;
  app.use('/', (req, res, next) => {
    console.log()
    // Check whether user is admin type
    if (req.session.isAdmin !== undefined) {
      isAdmin = req.session.isAdmin;
      console.log(isAdmin);
    }

    const requestUrl = req.originalUrl;
    console.log(requestUrl);
    if (!isAdmin) {
      // NOTE: these urls are not webpage urls, they are request urls sent by controllers
      // const AdminUrls = AppResources.find(resourcePath) where (isProtected === true)
      
      // Check illegal access
      const AdminUrls = [
        '/admin',
        '/template_manager',
        '/workflow_manager',
        '/COA_manager',
        '/designer/statuses',
        '/org_manager',
        '/programs',
        '/reportingPeriods',
        '/role_manager',
        '/dataResume',
        '/sheetNames',
        '/AuditLog',
        '/masterValue'
      ];
      if (!requestUrl.includes('/admin/user_management/fetchByEmail')) {
        for (let i = 0; i < AdminUrls.length; i++) {
          if (requestUrl.includes(AdminUrls[i])) {
            console.log("SHOULD REDIRECT");
            return res.send("UNAUTHORIZED ACCESS");
          }
        }
      }
      
      // Check Role specific access


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
