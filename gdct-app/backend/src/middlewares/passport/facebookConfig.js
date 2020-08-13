import passportFacebook from 'passport-facebook';
import passport from 'passport';
import UserModel from '../../models/User/model';
import configAuth from './auth';

const FacebookStrategy = passportFacebook.Strategy;

module.exports = () => {
  const fbStrategy = configAuth.facebook;
  fbStrategy.passReqToCallback = true;
  passport.use(
    new FacebookStrategy(fbStrategy, function (req, token, refreshToken, profile, done) {
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
    }),
  );
};
