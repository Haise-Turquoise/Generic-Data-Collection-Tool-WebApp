import passport from 'passport';
import UserModel from '../../models/User/model';
import { UserDoc } from '../../types/user';

module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user: UserDoc, done) {
    UserModel.findOne({ email: user.email }, function (err: Error, dbUser: UserDoc) {
      const filteredUser = {
        fullname: `${dbUser.firstName} ${dbUser.lastName}`,
        email: dbUser.email,
        sysRole: dbUser.sysRole,
      };
      done(err, filteredUser);
    });
  });
  require('./localConfig')();
};
