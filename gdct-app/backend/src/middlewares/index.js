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
  cookie: 'lang'
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
      resave: true,
      saveUninitialized: false,
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

  dbUtil.connect();
};
