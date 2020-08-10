import passport from 'passport';
import UserModel from '../../models/User/model';

module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    UserModel.findOne({ email: user.email }, function (err, dbUser) {
      const filteredUser = {
        facebook: dbUser.facebook,
        google: dbUser.google,
        fullname: `${dbUser.firstName} ${dbUser.lastName}`,
        email: dbUser.email,
        sysRole: dbUser.sysRole,
      };
      done(err, filteredUser);
    });
  });
  require('./localConfig')();
  require('./autoConfig')();
  require('./facebookConfig')();
  require('./googleConfig')();
};
