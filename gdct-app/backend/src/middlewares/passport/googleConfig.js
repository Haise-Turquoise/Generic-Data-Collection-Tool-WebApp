import passportGoogle from 'passport-google-oauth';
import passport from 'passport';
import UserModel from '../../models/User/model';
import configAuth from './auth';

const GoogleStrategy = passportGoogle.OAuth2Strategy;

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.google.clientID,
        clientSecret: configAuth.google.clientSecret,
        callbackURL: configAuth.google.callbackURL,
        passReqToCallback: true,
      },
      function (req, token, refreshToken, profile, done) {
        process.nextTick(function () {
          UserModel.findOne({ email: profile.emails[0].value.toLowerCase() }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              if (!user.google.token) {
                user.google.id = profile.id;
                user.google.token = token;
                user.save(function (err) {
                  if (err) {
                    return done(err);
                  }
                  user.generateAuthToken(user);
                  req.session.user = user;
                  req.session.token = token;
                  return done(null, user);
                });
              } else {
                user.generateAuthToken(user);
                req.session.user = user;
                req.session.token = token;
                return done(null, user);
              }
            } else {
              done(null);
            }
          });
        });
      },
    ),
  );
};
