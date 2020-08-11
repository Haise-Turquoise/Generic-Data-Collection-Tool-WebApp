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
          UserModel.findOne({ email: profile.emails[0].value.toLowerCase() })
            .then(user => {
              if (!user) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
              }
              req.session.user = user.email;
              return done(null, { email: user.email });
            })
            .catch(done);
        });
      },
    ),
  );
};
